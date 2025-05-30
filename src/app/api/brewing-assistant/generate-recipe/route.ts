import { NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';

import { BrewingAssistantFormData } from '@/types/brewingAssistant';
import { ManualBrewer } from '@/types/manualBrewing';
import { Grinder } from '@/types/grinder';

export async function POST(request: Request) {
  try {
    const formData: BrewingAssistantFormData & {
      brewer: ManualBrewer;
      grinder: Grinder;
    } = await request.json();
    const ai = new GoogleGenAI({
      apiKey: process.env.GOOGLE_IA_API_KEY,
    });

    if (!formData.brewer || !formData.grinder) {
      return NextResponse.json(
        { error: 'Brewer or grinder not found' },
        { status: 404 }
      );
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `Generate a coffee brewing recipe for:
            - Brewing method: ${formData.brewer.name} (${formData.brewer.brewMethod})
            - Coffee amount: ${formData.coffeeAmount}g
            - Water amount: ${formData.waterAmount}ml
            - Bean: ${formData.beanName}
            - Roast profile: ${formData.roastProfile}
            - Grinder: ${formData.grinder.name}.
            You should always return time in seconds. You can also bring details about grind size and water temperature for the initial step of the recipe.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              description: {
                type: Type.STRING,
              },
              time: {
                type: Type.NUMBER,
              },
              isPouring: {
                type: Type.BOOLEAN,
              },
              isStirring: {
                type: Type.BOOLEAN,
              },
              waterAmount: {
                type: Type.NUMBER,
              },
            },
            propertyOrdering: [
              'description',
              'time',
              'isPouring',
              'isStirring',
              'waterAmount',
            ],
          },
        },
      },
    });

    // Parse AI response and create recipe
    const aiSuggestion = response.text || 'No AI suggestions available';

    return NextResponse.json(aiSuggestion);
  } catch (error) {
    console.error('Error generating recipe with AI:', error);
    return NextResponse.json(
      { error: 'Failed to generate recipe' },
      { status: 500 }
    );
  }
}

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
            You must return details of how to pour if is center, spiral, circular, time in seconds, grind size in microns and water temperature.
            Each step should also contain information if isPouring, isStirring, isWaiting and waterAmount.`,
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
              pourType: {
                type: Type.STRING,
              },
              time: {
                type: Type.NUMBER,
              },
              grindSize: {
                type: Type.NUMBER,
              },
              waterTemperature: {
                type: Type.NUMBER,
              },
              waterAmount: {
                type: Type.NUMBER,
              },
              isPouring: {
                type: Type.BOOLEAN,
              },
              isStirring: {
                type: Type.BOOLEAN,
              },
              isWaiting: {
                type: Type.BOOLEAN,
              },
            },
            propertyOrdering: [
              'description',
              'pourType',
              'time',
              'grindSize',
              'waterTemperature',
              'waterAmount',
              'isPouring',
              'isStirring',
              'isWaiting',
            ],
          },
        },
      },
    });

    // Parse AI response and create recipe
    const aiSuggestion = response.text || 'No AI suggestions available';

    return NextResponse.json(JSON.parse(aiSuggestion));
  } catch (error) {
    console.error('Error generating recipe with AI:', error);
    return NextResponse.json(
      { error: 'Failed to generate recipe' },
      { status: 500 }
    );
  }
}

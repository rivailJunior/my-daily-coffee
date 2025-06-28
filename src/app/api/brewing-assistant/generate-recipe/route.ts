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
      contents: `
      You are a coffee brewing expert. Generate a coffee brewing recipe for:
            - Brewing method: ${formData.brewer.name} (${formData.brewer.brewMethod})
            - Coffee amount: ${formData.coffeeAmount}g
            - Water amount: ${formData.waterAmount}ml
            - Bean: ${formData.beanName}
            - Roast profile: ${formData.roastProfile}
            - Grinder: ${formData.grinder.name}.
            - Grind size: ${formData?.grindSize}. 
            - Water temperature: ${formData?.waterTemperature}°C.
            You should return a JSON array of objects with the following properties:
            - description: string
            - pourType: string
            - time: number
            - grindSize: number
            - waterTemperature: number
            - waterAmount: number
            - isPouring: boolean
            - isStirring: boolean
            - isWaiting: boolean
            For description it should contain information of how to pour the water into the brewer.
            For pourType it should contain information of how to pour the water into the brewer.
            For time it should contain information of how long to pour the water into the brewer.
            For grindSize it should contain information of the grind size in microns.
            For waterTemperature it should contain information of the water temperature in Celsius.
            For waterAmount it should contain information of the water amount in ml.
            For isPouring it should contain information of if the step is pouring.
            For isStirring it should contain information of if the step is stirring.
            For isWaiting it should contain information of if the step is waiting.
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

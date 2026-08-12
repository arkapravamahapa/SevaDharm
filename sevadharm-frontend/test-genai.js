import { GoogleGenAI, Type } from '@google/genai';

async function main() {
  try {
    const ai = new GoogleGenAI({ apiKey: 'AQ.Ab8RN6Jc8DL4uqP8D1bMiyOBHWvPu5H3SVruS94lN1rBtCBICw' });
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: ['Hello, are you there?'],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isMedical: { type: Type.BOOLEAN },
            responseText: { type: Type.STRING }
          },
          required: ['isMedical', 'responseText']
        }
      }
    });
    console.log("Success:", response.text);
  } catch (err) {
    console.error("Error:", err);
  }
}

main();

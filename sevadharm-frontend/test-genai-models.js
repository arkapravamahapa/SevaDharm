import { GoogleGenAI } from '@google/genai';

async function main() {
  try {
    const ai = new GoogleGenAI({ apiKey: 'AQ.Ab8RN6Jc8DL4uqP8D1bMiyOBHWvPu5H3SVruS94lN1rBtCBICw' });
    const response = await ai.models.list();
    for await (const model of response) {
      console.log(model.name);
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

main();

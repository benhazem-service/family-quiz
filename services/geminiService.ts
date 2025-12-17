
import { GoogleGenAI } from "@google/genai";

// Fix: Initializing GoogleGenAI with the named apiKey parameter as per the library guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateRiddle = async () => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "أعطني لغزاً عربياً قصيراً وممتعاً للعائلة مع الحل. أريد الإجابة بصيغة JSON: { \"riddle\": \"...\", \"answer\": \"...\" }",
      config: {
        responseMimeType: "application/json"
      }
    });
    
    // Fix: Accessing .text property directly instead of calling it as a method
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error calling Gemini:", error);
    return { riddle: "ما هو الشيء الذي يكتب ولا يقرأ؟", answer: "القلم" };
  }
};

export const getAICommentary = async (playerNames: string[]) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `نحن في مسابقة عائلية، واللاعبون هم: ${playerNames.join(', ')}. أعطني جملة تشجيعية مضحكة ومختصرة جداً بالعامية.`,
    });
    // Fix: Accessing .text property directly
    return response.text;
  } catch (error) {
    return "هيا يا أبطال، المنافسة تشتعل!";
  }
};

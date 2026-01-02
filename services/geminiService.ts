
import { GoogleGenAI } from "@google/genai";
import { ChatMessage, Product } from "../types";

// Fix: Use process.env.API_KEY directly in the constructor as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getChatResponse(history: ChatMessage[], products: Product[]): Promise<string> {
  try {
    const productsContext = products.map(p => `- ${p.name}: ৳${p.price} (${p.category})`).join('\n');
    const systemPrompt = `You are "Ak Assistant", a friendly AI shopping assistant for "Ak Shop".
    Our available products are:
    ${productsContext}
    
    Guidelines:
    - Be helpful, polite, and enthusiastic.
    - Recommend products based on user needs.
    - If asked about shipping, say "We offer free worldwide shipping on orders over ৳5000."
    - Keep responses concise but informative.
    - Use Markdown for formatting. Use BDT currency symbol ৳ for prices.`;

    const lastMessage = history[history.length - 1].text;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: lastMessage,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    // Fix: Access the .text property directly (not a method call)
    return response.text || "I'm sorry, I couldn't process that. How can I help you today?";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm having a little trouble connecting to my brain right now. Please try again later!";
  }
}

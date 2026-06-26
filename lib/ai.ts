import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

const MENU_CONTEXT = `
Peppery House Menu:
HOT COFFEE: Espresso, Cappuccino, Latte, Flat White, Americano, Mocha

COLD COFFEE: Cold Brew, Iced Latte, Frappe, Caramel Macchiato (Iced), Vietnamese Iced Coffee, Nitro Cold Brew

SNACKS: Bruschetta, Cheese Toast, Veg Sandwich, Chicken Sandwich, Nachos, French Fries

DESSERTS: Chocolate Lava Cake, Tiramisu, Cheesecake, Brownie, Panna Cotta, Waffles

Price range: ₹200 to ₹400 per item.
`;

async function callGemini(prompt: string): Promise<string> {
  if (!genAI) {
    console.error("Gemini API Error: GEMINI_API_KEY is not set.");
    return "Please set the GEMINI_API_KEY in your environment variables to enable AI recommendations.";
  }
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    const result = await model.generateContent(prompt);       // this line is retuning the output
    return result.response.text();                            // this line is also retuning the output
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, couldn't get a recommendation right now.";
  }
}

export async function getMoodRecommendation(energy: string, taste: string, temp: string): Promise<string> {
  return callGemini(
    `You are the AI barista at Peppery House café. Based on the customer's mood, recommend ONE drink from the menu.\n${MENU_CONTEXT}\nCustomer mood: Energy level: ${energy}, Taste preference: ${taste}, Temperature preference: ${temp}.\nRespond with ONLY the name of the drink in bold, followed by a short, simple, and punchy 1-sentence reason why.`
  );
}

export async function getAIBaristaRecommendation(context: string): Promise<string> {
  return callGemini(
    `You are the AI Barista at Peppery House café. The customer described their situation: "${context}"\n${MENU_CONTEXT}\nRecommend ONLY 1 coffee and 1 food item. Start with their names in bold, followed by a single short, punchy sentence explaining why it fits.`
  );
}

export async function getCoffeePairing(drink: string): Promise<string> {
  return callGemini(
    `You are the pairing expert at Peppery House café. The customer chose: ${drink}.\n${MENU_CONTEXT}\nRespond with ONLY 2 food items in bold. Under each, write exactly one short, simple sentence explaining the pairing.`
  );
}

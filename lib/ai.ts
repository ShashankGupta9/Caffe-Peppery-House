import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

import { supabase } from "./supabase";

async function getMenuContext(): Promise<string> {
  const { data, error } = await supabase.from('menu_items').select('category, name, is_available');
  if (error || !data) {
    return "Peppery House Menu (Default):\nCoffee, Espresso, Snacks, Desserts.";
  }
  
  const categories: Record<string, string[]> = {};
  data.forEach((item) => {
    if (!categories[item.category]) categories[item.category] = [];
    if (item.is_available) {
      categories[item.category].push(item.name);
    }
  });

  let context = "Peppery House Menu (Only available items):\n";
  for (const [cat, items] of Object.entries(categories)) {
    context += `${cat.toUpperCase()}: ${items.join(", ")}\n`;
  }
  context += "\nPrice range: ₹200 to ₹400 per item.\n";
  return context;
}

async function callGemini(prompt: string): Promise<string> {
  if (!genAI) {
    console.error("Gemini API Error: GEMINI_API_KEY is not set.");
    return "Please set the GEMINI_API_KEY in your environment variables to enable AI recommendations.";
  }
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);       // this line is retuning the output
    return result.response.text();                            // this line is also retuning the output
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, couldn't get a recommendation right now.";
  }
}

export async function getMoodRecommendation(energy: string, taste: string, temp: string): Promise<string> {
  const menuContext = await getMenuContext();
  return callGemini(
    `You are the AI barista at Peppery House café. Based on the customer's mood, recommend ONE drink from the menu.\n${menuContext}\nCustomer mood: Energy level: ${energy}, Taste preference: ${taste}, Temperature preference: ${temp}.\nRespond with ONLY the name of the drink in bold, followed by a short, simple, and punchy 1-sentence reason why.`
  );
}

export async function getAIBaristaRecommendation(context: string): Promise<string> {
  const menuContext = await getMenuContext();
  return callGemini(
    `You are the AI Barista at Peppery House café. The customer described their situation: "${context}"\n${menuContext}\nRecommend ONLY 1 coffee and 1 food item. Start with their names in bold, followed by a single short, punchy sentence explaining why it fits.`
  );
}

export async function getCoffeePairing(drink: string): Promise<string> {
  const menuContext = await getMenuContext();
  return callGemini(
    `You are the pairing expert at Peppery House café. The customer chose: ${drink}.\n${menuContext}\nRespond with ONLY 2 food items in bold. Under each, write exactly one short, simple sentence explaining the pairing.`
  );
}

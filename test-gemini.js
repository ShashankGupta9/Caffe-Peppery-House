const { GoogleGenerativeAI } = require("@google/generative-ai");

async function run() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.log("No API key");
    return;
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Hello!");
    console.log(result.response.text());
  } catch (error) {
    console.error(error);
  }
}
run();

//Bazooka
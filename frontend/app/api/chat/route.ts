import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        {
          role: "system",
          content: `
You are FinAI. Respond with 3–5 short points only.
Each point must be on its own new line.
Use numbering like "1.", "2.", "3." — no hyphens.
No markdown, no pipes, no symbols, no paragraphs.
Keep responses crisp and actionable. 
          `
        },
        { role: "user", content: message }
      ],
      temperature: 0.5,
      max_tokens: 300
    });

    const aiResponse = completion.choices[0]?.message?.content || "No response";

    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error("Groq API Error:", error);
    return NextResponse.json({ response: "Error contacting AI service." });
  }
}

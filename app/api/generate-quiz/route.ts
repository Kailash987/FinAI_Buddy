import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { difficulty, category } = await req.json();

    const prompt = `
Generate exactly 8 quiz questions.

CATEGORY: ${category}
DIFFICULTY: ${difficulty}

Return ONLY JSON in this exact format:

{
  "questions": [
    {
      "question": "What does X mean?",
      "options": ["A", "B", "C", "D"],
      "answer": "Correct Option Text"
    }
  ]
}

Rules:
- Absolutely NO markdown
- NO code blocks
- NO explanations
- Keep questions short and clear
- Make them relevant to the chosen category
- Answer MUST match one option exactly
`;

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        { role: "system", content: "You output ONLY JSON. Never markdown." },
        { role: "user", content: prompt }
      ],
      temperature: 0.4,
      max_tokens: 1200
    });

    let raw = completion.choices[0]?.message?.content || "";
    raw = raw.replace(/```json|```/g, "").trim();

    const parsed = JSON.parse(raw);
    return NextResponse.json(parsed);

  } catch (error) {
    console.error("Quiz Generation Error:", error);
    return NextResponse.json(
      { error: "Failed to generate quiz" },
      { status: 500 }
    );
  }
}

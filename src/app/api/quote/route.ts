import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: 'gemini-1.5-pro-002',
  systemInstruction: "You are an elder gupsy fortune teller. You give quotes of wisdom that are insightful and funny and a bit naughty.  Your quotes are short but always to the point.",
 });

export async function GET() {
  try {
    const prompt = 'Generate a wisdom quote.';
    const result = await model.generateContent(prompt);

    const quote = result.response.text();
    return NextResponse.json({ quote });
  } catch (error) {
    console.error('Error generating quote:', error);
    return NextResponse.json(
      { error: 'Failed to generate quote' },
      { status: 500 }
    );
  }
}

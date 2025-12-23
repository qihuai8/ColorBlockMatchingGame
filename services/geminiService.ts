
import { GoogleGenAI } from "@google/genai";
import { BlockData } from "../types";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export async function getGameHint(board: BlockData[][], score: number, targetScore: number): Promise<string> {
  try {
    const boardSummary = board.map(row => row.map(b => b.color).join(',')).join('\n');
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        I am playing a color block matching game. The goal is to pop groups of adjacent same-colored blocks. 
        Current Score: ${score}
        Target for next level: ${targetScore}
        
        The board is a 10x10 grid. Here is a simplified representation (rows top to bottom):
        ${boardSummary}
        
        Provide a very short, encouraging tactical tip (under 30 words) to help me reach the target. 
        Suggest which color I should focus on or a strategy like "clearing the bottom first".
      `,
      config: {
        temperature: 0.7,
        maxOutputTokens: 100,
      }
    });

    return response.text || "Keep popping those blocks! Try to build larger groups for more points.";
  } catch (error) {
    console.error("Gemini Hint Error:", error);
    return "Focus on clearing the bottom rows to create more movement!";
  }
}

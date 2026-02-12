"use server";

import { aiGitExplainer, type AIGitExplainerInput } from "@/ai/flows/ai-git-explainer";

export async function getGitExplanation(input: AIGitExplainerInput) {
  try {
    const result = await aiGitExplainer(input);
    return { success: true, explanation: result.explanation };
  } catch (error) {
    console.error("AI explanation failed:", error);
    return { success: false, error: "Failed to get explanation from AI." };
  }
}

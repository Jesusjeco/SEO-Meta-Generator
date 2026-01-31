import { GoogleGenAI, Tool } from "@google/genai";
import { AnalysisInputs, SeoResponse } from "../types";

const getRootUrl = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    return `${urlObj.protocol}//${urlObj.hostname}`;
  } catch (e) {
    return null;
  }
};

const generatePrompt = (inputs: AnalysisInputs): string => {
  const url = inputs.url?.trim();
  let rootUrl = '';
  let urlInstructions = '';

  if (url) {
    rootUrl = getRootUrl(url) || '';
    urlInstructions = `
1. **Target URL:** ${url}
   - **ACTION REQUIRED:** Use Google Search to browse and analyze the content of this specific page.
   ${rootUrl && rootUrl !== url.replace(/\/$/, '') ? `- **ACTION REQUIRED:** Also use Google Search to browse the root domain (${rootUrl}) to understand the overall website context, brand voice, and authority.` : '- **Context:** This URL appears to be the homepage.'}
    `;
  }

  return `
You are an elite SEO Specialist and Content Strategist. Your task is to analyze web content and generate high-performing Meta Titles and Meta Descriptions.

### OBJECTIVE
Generate two distinct sets of meta tags (Title and Description) based on the provided inputs.

### INPUT DATA TO ANALYZE
${urlInstructions}

2. **Target Page Content (Text Input):** 
${inputs.targetPageContent || "Not provided (Rely on URL analysis if available)."}

3. **Marketing Focus:** 
${inputs.marketingFocus || "Not provided (Focus on High CTR / Persuasive)."}

### STRICT CONSTRAINTS
* **Meta Title:** Maximum **60 characters** (including spaces). Must be punchy and keyword-rich.
* **Meta Description:** Maximum **155 characters** (including spaces). Must include a call to action and encourage click-throughs.
* **Language:** Output in the same language as the provided content.

### GENERATION LOGIC
1.  **Analyze Context:** 
    *   If a **Target URL** is provided, PRIORITIZE the information gathered from Google Search for that URL.
    *   If a **Root URL** is derived, use information from the homepage to establish brand consistency.
    *   Combine this with any manual text inputs provided.
2.  **Option 1 (Campaign/Marketing Focus):**
    *   If a marketing focus is provided, prioritize that angle (e.g., "Sales," "Trust," "Urgency").
    *   If no focus is provided, treat this as a "High CTR / Persuasive" variant.
3.  **Option 2 (SEO Best Practices):**
    *   Focus on primary keywords found in the content.
    *   Prioritize clarity and search intent matching.

### OUTPUT FORMAT
You must return the result in raw JSON format only, with no markdown formatting. Use the following structure:

{
  "option_1": {
    "type": "Marketing/Campaign Focused",
    "meta_title": "Insert Title Here",
    "meta_title_length": 0,
    "meta_description": "Insert Description Here",
    "meta_description_length": 0
  },
  "option_2": {
    "type": "SEO Best Practices",
    "meta_title": "Insert Title Here",
    "meta_title_length": 0,
    "meta_description": "Insert Description Here",
    "meta_description_length": 0
  }
}`;
};

export const generateMetaTags = async (inputs: AnalysisInputs): Promise<SeoResponse> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const hasUrl = inputs.url && inputs.url.trim().length > 0;
    
    // Configure tools: Enable Google Search only if a URL is provided
    const tools: Tool[] = [];
    if (hasUrl) {
      tools.push({ googleSearch: {} });
    }

    // Using gemini-3-flash-preview as recommended for text tasks and search grounding
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: generatePrompt(inputs),
      config: {
        responseMimeType: 'application/json',
        tools: tools, 
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response received from Gemini.");
    }

    // Clean up potentially wrapped JSON (though responseMimeType usually handles this)
    const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const result: SeoResponse = JSON.parse(jsonString);
    
    return result;

  } catch (error) {
    console.error("Error generating meta tags:", error);
    throw error;
  }
};
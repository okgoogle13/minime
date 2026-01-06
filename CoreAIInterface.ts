
import { GoogleGenAI, Type } from "@google/genai";
import type { 
  JobAnalysis, 
  IntelligencePackage, 
  UserProfile, 
  Job 
} from "./DocumentIntelligence";

/**
 * CORE AI INTERFACE
 * 
 * Pure functions for interacting with Gemini.
 * These functions assume process.env.API_KEY is available.
 */

// --- SCHEMAS (Internal AI definitions) ---

const JobAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    jobTitle: { type: Type.STRING },
    companyName: { type: Type.STRING },
    keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
    minimumRequirements: { type: Type.ARRAY, items: { type: Type.STRING } },
    keyResponsibilitiesAndKpis: { type: Type.ARRAY, items: { type: Type.STRING } },
    valuedOutcomes: { type: Type.ARRAY, items: { type: Type.STRING } },
    roleSpecificHardSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
    companyNicheAndValues: { type: Type.ARRAY, items: { type: Type.STRING } },
    desirableAttributes: { type: Type.ARRAY, items: { type: Type.STRING } }
  },
  required: ['jobTitle', 'companyName', 'keywords', 'minimumRequirements', 'keyResponsibilitiesAndKpis', 'valuedOutcomes', 'roleSpecificHardSkills']
};

/**
 * ANALYZE: Extracts intelligence from raw Job Description text.
 */
export const analyzeJobDescription = async (text: string): Promise<JobAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze this Job Description: "${text}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: JobAnalysisSchema,
    }
  });

  return JSON.parse(response.text) as JobAnalysis;
};

/**
 * SEARCH: Finds relevant jobs based on a query.
 */
export const searchJobs = async (query: string): Promise<Job[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Find 5 current job postings for: "${query}"`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            jobTitle: { type: Type.STRING },
            companyName: { type: Type.STRING },
            location: { type: Type.STRING },
            jobDescription: { type: Type.STRING },
          },
          required: ["jobTitle", "companyName", "location", "jobDescription"]
        }
      },
    },
  });

  return JSON.parse(response.text) as Job[];
};

/**
 * GENERATE: The core engine. Tailors a resume and performs a full audit.
 */
export const generateIntelligencePackage = async (
  profile: UserProfile, 
  analysis: JobAnalysis,
  expertPersonaMarkdown: string // Content of ExpertResumeAuditor.md
): Promise<IntelligencePackage> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Persona and Rules:
    ${expertPersonaMarkdown}

    Action:
    Generate a tailored resume and full audit for the following profile against the job analysis.

    User Profile:
    ${JSON.stringify(profile)}

    Target Job Analysis:
    ${JSON.stringify(analysis)}
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      thinkingConfig: { thinkingBudget: 32768 },
      responseMimeType: "application/json"
      // Note: We omit complex recursive responseSchema for gemini-3-pro-preview 
      // when using thinkingBudget to prevent schema complexity failures. 
      // Pro-level reasoning handles the JSON structure reliably via prompt.
    }
  });

  if (!response.text) throw new Error("AI failed to generate response.");
  return JSON.parse(response.text) as IntelligencePackage;
};

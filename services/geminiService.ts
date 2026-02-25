
import type { JobAnalysis, AIResponse, Job, UserProfile } from '../types';
import { GoogleGenAI, Type } from "@google/genai";

const JobAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    jobTitle: { type: Type.STRING, description: 'The title of the job role, e.g., "Senior Software Engineer".' },
    companyName: { type: Type.STRING, description: 'The name of the company hiring.' },
    keywords: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'A list of specific important terms from the job description related to technical skills, desirable traits, and responsibilities. These are crucial for ATS scanning.'
    },
    minimumRequirements: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'A list of essential, must-have criteria, such as required years of experience (e.g., "5+ years of experience"), specific qualifications or degrees (e.g., "Bachelor\'s degree in Computer Science"), and necessary software proficiencies (e.g., "Proficiency in React").'
    },
    keyResponsibilitiesAndKpis: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'A list of the main duties and responsibilities of the role. Include any Key Performance Indicators (KPIs) mentioned.'
    },
    valuedOutcomes: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'A list of the desired results or goals the company expects for this role, such as "improve system efficiency" or "drive user engagement".'
    },
    roleSpecificHardSkills: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'A list of specific, teachable, and measurable technical abilities required, like "JavaScript," "Python," "CAD," or "QuickBooks".'
    },
    companyNicheAndValues: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'A list of terms or phrases related to the company\'s industry, mission, or values, like "fintech innovation," "sustainable practices," or "customer-centric approach".'
    },
    desirableAttributes: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'A list of "nice-to-have" skills or personality traits mentioned, such as "experience with public speaking," "bilingual," or "a passion for open-source".'
    }
  },
  required: ['jobTitle', 'companyName', 'keywords', 'minimumRequirements', 'keyResponsibilitiesAndKpis', 'valuedOutcomes', 'roleSpecificHardSkills', 'companyNicheAndValues', 'desirableAttributes']
};

export const callAnalyzeJobDescriptionFunction = async (jobDescription: string): Promise<JobAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Analyze the following job description and extract the requested information according to the provided JSON schema. Be thorough and detailed. Job Description: "${jobDescription}"`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: JobAnalysisSchema,
      }
    });

    if (!response.text) {
      throw new Error("The AI returned an empty analysis.");
    }

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    return result as JobAnalysis;
  } catch (error) {
    console.error("[GeminiService] Error analyzing job description:", error);
    if (error instanceof SyntaxError) {
      throw new Error("The AI returned an invalid data format. Please try again.");
    }
    throw new Error("Failed to analyze the job description. The AI service may be temporarily overloaded.");
  }
};


const JobSearchSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            jobTitle: { type: Type.STRING },
            companyName: { type: Type.STRING },
            location: { type: Type.STRING },
            jobDescription: { type: Type.STRING, description: "A detailed summary of the job, including responsibilities and qualifications." },
        },
        required: ["jobTitle", "companyName", "location", "jobDescription"],
    }
};

export const callSearchJobsFunction = async (query: string): Promise<Job[]> => {
    const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
    const prompt = `Find 5 job postings related to the query: "${query}". For each job, provide the job title, company name, location, and a detailed job description.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
                tools: [{googleSearch: {}}],
                responseMimeType: "application/json",
                responseSchema: JobSearchSchema,
            },
        });
        
        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);
        return result as Job[];
    } catch (error) {
        console.error("[GeminiService] Error searching for jobs:", error);
        throw new Error("Failed to search for jobs. Google Search integration may be temporarily unavailable.");
    }
};

// --- Resume Generation Schemas ---
const EducationSchema = { type: Type.OBJECT, properties: { degree: { type: Type.STRING }, institution: { type: Type.STRING }, location: { type: Type.STRING }, graduationYear: { type: Type.STRING } }, required: ['degree', 'institution', 'location', 'graduationYear'] };
const SkillCategorySchema = { type: Type.OBJECT, properties: { category: { type: Type.STRING }, skillsList: { type: Type.ARRAY, items: { type: Type.STRING } } }, required: ['category', 'skillsList'] };
const ExperienceSchema = { type: Type.OBJECT, properties: { jobTitle: { type: Type.STRING }, organization: { type: Type.STRING }, location: { type: Type.STRING }, startDate: { type: Type.STRING }, endDate: { type: Type.STRING }, description: { type: Type.STRING }, responsibilities: { type: Type.ARRAY, items: { type: Type.STRING } }, achievement: { type: Type.STRING } }, required: ['jobTitle', 'organization', 'location', 'startDate', 'endDate', 'description', 'responsibilities', 'achievement'] };
const CertificationSchema = { type: Type.OBJECT, properties: { name: { type: Type.STRING }, issuingBody: { type: Type.STRING }, date: { type: Type.STRING } }, required: ['name', 'issuingBody', 'date'] };
const TrainingSchema = { type: Type.OBJECT, properties: { name: { type: Type.STRING }, provider: { type: Type.STRING }, year: { type: Type.STRING } }, required: ['name', 'provider', 'year'] };
const UserProfileSchema = { type: Type.OBJECT, properties: { fullName: { type: Type.STRING }, resumeHeadline: { type: Type.STRING }, phone: { type: Type.STRING }, email: { type: Type.STRING }, location: { type: Type.STRING }, careerSummary: { type: Type.STRING }, education: { type: Type.ARRAY, items: EducationSchema }, skills: { type: Type.ARRAY, items: SkillCategorySchema }, experience: { type: Type.ARRAY, items: ExperienceSchema }, certificationsAndDevelopment: { type: Type.OBJECT, properties: { certifications: { type: Type.ARRAY, items: CertificationSchema }, trainings: { type: Type.ARRAY, items: TrainingSchema } } } }, required: ['fullName', 'resumeHeadline', 'phone', 'email', 'location', 'careerSummary', 'education', 'skills', 'experience', 'certificationsAndDevelopment'] };
const ScoreBreakdownSchema = { type: Type.OBJECT, properties: { hardSkillsMatch: { type: Type.OBJECT, properties: { score: { type: Type.INTEGER }, analysis: { type: Type.STRING } }, required: ['score', 'analysis'] }, softSkillsAndVerbsMatch: { type: Type.OBJECT, properties: { score: { type: Type.INTEGER }, analysis: { type: Type.STRING } }, required: ['score', 'analysis'] }, quantifiableAchievements: { type: Type.OBJECT, properties: { score: { type: Type.INTEGER }, analysis: { type: Type.STRING } }, required: ['score', 'analysis'] }, atsReadabilityAndFormatting: { type: Type.OBJECT, properties: { score: { type: Type.INTEGER }, analysis: { type: Type.STRING } }, required: ['score', 'analysis'] } }, required: ['hardSkillsMatch', 'softSkillsAndVerbsMatch', 'quantifiableAchievements', 'atsReadabilityAndFormatting'] };
const QuantificationSuggestionSchema = { type: Type.OBJECT, properties: { originalText: { type: Type.STRING }, suggestedRewrite: { type: Type.STRING } }, required: ['originalText', 'suggestedRewrite']};
const EvaluationSchema = { type: Type.OBJECT, properties: { overallScore: { type: Type.INTEGER, description: "A score from 0 to 100." }, overallAnalysis: { type: Type.STRING }, scoreBreakdown: ScoreBreakdownSchema, actionableFeedback: { type: Type.ARRAY, items: { type: Type.STRING } }, quantificationSuggestions: { type: Type.ARRAY, items: QuantificationSuggestionSchema, description: "Suggest improvements for experience descriptions to be more results-oriented. Use brackets like [Managed a team] to highlight changes." } }, required: ['overallScore', 'overallAnalysis', 'scoreBreakdown', 'actionableFeedback'] };
const KSCResponseSchema = {
  type: Type.OBJECT,
  properties: {
    criteria: { type: Type.STRING, description: "The specific selection criteria from the job description." },
    response: { type: Type.STRING, description: "A tailored response demonstrating how the candidate meets this criteria using the STAR method." }
  },
  required: ['criteria', 'response']
};

const AIResponseSchema = { 
  type: Type.OBJECT, 
  properties: { 
    tailoredResume: UserProfileSchema, 
    evaluation: EvaluationSchema,
    headlineSuggestions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Generate 3 alternative professional resume headlines. Rules: 1. SHORT: One line max. 2. SPECIFIC: Mention role/focus/achievement. 3. IMPACTFUL: Use total years of experience and top skills from career summary. 4. KEYWORDS: Align with JD if provided."
    },
    coverLetter: { type: Type.STRING, description: "A highly tailored, professional cover letter (approx 300-400 words) addressed to the hiring manager." },
    kscResponses: {
      type: Type.ARRAY,
      items: KSCResponseSchema,
      description: "Generate tailored responses for the top 3-5 key selection criteria identified in the job analysis."
    }
  }, 
  required: ['tailoredResume', 'evaluation', 'headlineSuggestions', 'coverLetter', 'kscResponses'] 
};

export const callGenerateResumeFunction = async (jobAnalysis: JobAnalysis, userProfile: UserProfile): Promise<AIResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `
    You are an expert resume writer and career coach. Your task is to generate a tailored resume and provide a detailed evaluation based on the provided user profile and a target job analysis.

    USER'S BASE PROFILE:
    \`\`\`json
    ${JSON.stringify(userProfile, null, 2)}
    \`\`\`

    TARGET JOB ANALYSIS:
    \`\`\`json
    ${JSON.stringify(jobAnalysis, null, 2)}
    \`\`\`

    INSTRUCTIONS:
    1.  **Tailor the Resume:** Meticulously rewrite the user's profile into a new resume.
        -   The "resumeHeadline" and "careerSummary" must be rewritten to directly target the job title and company values.
        -   For each "experience" entry, rewrite the "responsibilities" and "achievement" to use strong action verbs and highlight accomplishments relevant to the job's key responsibilities and valued outcomes. Quantify achievements wherever possible.
        -   Ensure the most relevant skills from the user's profile are prominent.
        -   The final output must be a complete resume object. Do not omit any sections.

    2.  **Evaluate the Match:** Provide a critical evaluation of how well the user's original profile matches the job.
        -   Calculate an "overallScore" from 0-100.
        -   Provide a "scoreBreakdown" for the four specified categories, with scores and a brief analysis for each.
        -   Offer specific, "actionableFeedback" (at least 3 points) on what the user could do to become an even better candidate.
        -   Provide 1-2 "quantificationSuggestions" to improve experience bullet points, highlighting the suggested numerical additions in brackets like "[Increased efficiency by 20%]".

    3.  **Headline Options:**
        -   Generate 3 highly targeted resume headline options. 
        -   HEADLINE BEST PRACTICES:
            -   KEEP IT SHORT: Aim for one line.
            -   BE SPECIFIC: Calculate the total years of experience from the work history. Use terms from the Career Summary.
            -   USE KEYWORDS: Include job titles and skills from the JD to improve ATS visibility.
            -   Example: "Senior Cloud Architect | 12+ Years Exp | AWS & Kubernetes Specialist"

    4.  **Cover Letter:**
        -   Write a compelling, one-page cover letter.
        -   Address it to "Hiring Manager" if no name is provided.
        -   Connect the user's specific achievements to the company's niche and values.
        -   Keep it professional, enthusiastic, and concise.

    5.  **Key Selection Criteria (KSC):**
        -   Identify the top 3-5 most critical selection criteria from the JD.
        -   Write a detailed response for each using the STAR (Situation, Task, Action, Result) method.
        -   Draw from the user's experience to provide concrete evidence.

    Your final output MUST be a single, valid JSON object that strictly adheres to the provided schema. Do not include any text or formatting outside of the JSON object.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: AIResponseSchema,
        thinkingConfig: { thinkingBudget: 32768 }
      }
    });
    
    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    return result as AIResponse;
  } catch (error) {
    console.error("[GeminiService] Error generating resume:", error);
    throw new Error("The AI reasoning engine failed to complete the task. This can happen with very complex profiles; please try again.");
  }
};

/**
 * Generates 3 professional headline suggestions for a user profile.
 * Incorporates years of experience, career summary, and job description keywords if available.
 */
export const callGenerateProfileHeadlines = async (userProfile: UserProfile, jobAnalysis?: JobAnalysis | null): Promise<string[]> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const contextStr = jobAnalysis 
        ? `Targeting the role: ${jobAnalysis.jobTitle} at ${jobAnalysis.companyName}. Relevant keywords: ${jobAnalysis.keywords.join(', ')}.`
        : "General professional profile setup.";

    const prompt = `
        As a career expert, generate 3 professional resume headlines for this candidate.
        
        CANDIDATE DATA:
        Summary: ${userProfile.careerSummary}
        Work History: ${JSON.stringify(userProfile.experience.map(e => ({ title: e.jobTitle, dates: `${e.startDate} - ${e.endDate}` })))}
        
        CONTEXT:
        ${contextStr}
        
        HEADLINE BEST PRACTICES:
        1. SHORT: One line, concise.
        2. SPECIFIC: Mention the candidate's core role and top expertise.
        3. IMPACTFUL: Calculate total years of experience from the work history. Mention it if significant (e.g., "8+ Years").
        4. KEYWORDS: If target keywords are provided above, weave them in naturally.
        
        Return exactly 3 strings in a JSON array.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                }
            }
        });
        
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as string[];
    } catch (error) {
        console.error("[GeminiService] Error generating profile headlines:", error);
        throw new Error("Unable to generate headlines at this moment.");
    }
};


export const MOCK_USER_PROFILE: UserProfile = {
  fullName: 'Jane Doe',
  resumeHeadline: 'Versatile Project Manager & Web Developer',
  phone: '555-123-4567',
  email: 'jane.doe@email.com',
  location: 'San Francisco, CA',
  careerSummary: 'A dynamic and results-oriented professional with 5+ years of experience in managing cross-functional teams and developing robust web applications. Proven ability to lead projects from conception to completion, ensuring timely delivery within budget. Seeking to leverage technical and leadership skills in a challenging new role.',
  education: [
    { degree: 'B.S. in Computer Science', institution: 'State University', location: 'Techville, USA', graduationYear: '2018' },
    { degree: 'Certified ScrumMaster (CSM)', institution: 'Scrum Alliance', location: 'Online', graduationYear: '2020' },
  ],
  skills: [
    { category: 'Programming Languages', skillsList: ['JavaScript (ES6+)', 'Python', 'HTML5', 'CSS3/SASS'] },
    { category: 'Frameworks & Libraries', skillsList: ['React.js', 'Node.js', 'Express.js', 'Flask'] },
    { category: 'Project Management', skillsList: ['Agile/Scrum Methodologies', 'JIRA', 'Confluence', 'Risk Management'] },
    { category: 'Databases', skillsList: ['PostgreSQL', 'MongoDB', 'Firebase'] },
  ],
  experience: [
    {
      jobTitle: 'Project Manager',
      organization: 'Innovate Corp.',
      location: 'San Francisco, CA',
      startDate: 'Jan 2021',
      endDate: 'Present',
      description: 'Led a team of 5 developers in an Agile environment to build and maintain client-facing web applications.',
      responsibilities: ['Developed project roadmaps and timelines.', 'Coordinated with stakeholders to define project requirements.', 'Managed sprints, backlog grooming, and daily stand-ups.'],
      achievement: 'Successfully delivered a major platform overhaul 2 weeks ahead of schedule, improving user engagement.'
    },
    {
      jobTitle: 'Full-Stack Web Developer',
      organization: 'Tech Solutions Inc.',
      location: 'Palo Alto, CA',
      startDate: 'Jun 2018',
      endDate: 'Dec 2020',
      description: 'Contributed to the development of a large-scale e-commerce platform using the MERN stack.',
      responsibilities: ['Built and maintained RESTful APIs.', 'Developed responsive user interfaces with React.', 'Wrote unit and integration tests to ensure code quality.'],
      achievement: 'Optimized database queries which led to a reduction in page load times.'
    }
  ],
  certificationsAndDevelopment: {
    certifications: [{ name: 'AWS Certified Developer - Associate', issuingBody: 'Amazon Web Services', date: '2022' }],
    trainings: [{ name: 'Advanced React Patterns', provider: 'Frontend Masters', year: '2021' }],
  }
};

export const MOCK_AI_RESPONSE: AIResponse = {
  tailoredResume: MOCK_USER_PROFILE,
  headlineSuggestions: [
    "Project Manager with 5+ Years Experience in Agile Delivery",
    "Full-Stack Developer Specializing in React & Node.js Architecture",
    "Results-Driven Tech Lead Proven in Delivering Enterprise Solutions"
  ],
  coverLetter: "Dear Hiring Manager,\n\nI am writing to express my strong interest in the Project Manager position at Innovate Corp. With over 5 years of experience leading cross-functional teams and delivering high-impact web applications, I am confident that my background in Agile methodologies and full-stack development makes me an ideal candidate for this role.\n\nAt my current role at Innovate Corp, I successfully led a team of 5 developers to deliver a major platform overhaul two weeks ahead of schedule. This project not only improved user engagement by 25% but also demonstrated my ability to manage complex requirements and tight deadlines effectively. My technical foundation in React and Node.js allows me to bridge the gap between technical teams and stakeholders, ensuring that project goals are met with precision.\n\nI am particularly drawn to Innovate Corp's commitment to customer-centric innovation. I look forward to the possibility of discussing how my skills and experience can contribute to your team's continued success.\n\nSincerely,\nJane Doe",
  kscResponses: [
    {
      criteria: "Demonstrated experience in Agile project management.",
      response: "In my current role as a Project Manager at Innovate Corp, I have consistently applied Agile methodologies to drive project success. For example, when tasked with a major platform overhaul, I implemented daily stand-ups and bi-weekly sprint planning sessions to ensure clear communication and rapid iteration. By maintaining a well-groomed backlog and fostering a collaborative environment, our team was able to identify and resolve potential bottlenecks early, resulting in the project being delivered two weeks ahead of schedule and with a 25% increase in user engagement metrics."
    },
    {
      criteria: "Proficiency in full-stack web development technologies.",
      response: "My technical expertise spans the entire web development stack, with a particular focus on React and Node.js. During my tenure at Tech Solutions Inc., I was responsible for building and maintaining RESTful APIs and developing responsive user interfaces. One significant achievement was optimizing our PostgreSQL database queries, which reduced page load times by 30%. This technical depth allows me to not only manage developers effectively but also contribute directly to architectural decisions and code reviews."
    }
  ],
  evaluation: {
    overallScore: 88,
    overallAnalysis: "A strong candidate with highly relevant technical and project management skills.",
    scoreBreakdown: {
      hardSkillsMatch: { score: 92, analysis: "Excellent alignment with required technologies." },
      softSkillsAndVerbsMatch: { score: 85, analysis: "Good use of action verbs; could be more specific." },
      quantifiableAchievements: { score: 75, analysis: "Some achievements are quantified, but more data-driven results would be beneficial." },
      atsReadabilityAndFormatting: { score: 98, analysis: "The resume is well-structured and easy for automated systems to parse." }
    },
    actionableFeedback: [
      "Tailor the career summary to mention the target company's specific goals.",
      "Add more metrics to your achievements, e.g., 'improved user engagement by 15%'.",
      "Include a 'Projects' section to showcase personal or freelance work if applicable."
    ],
    quantificationSuggestions: [
        {
            originalText: "Successfully delivered a major platform overhaul 2 weeks ahead of schedule, improving user engagement.",
            suggestedRewrite: "Successfully delivered a major platform overhaul 2 weeks ahead of schedule, [improving user engagement by 25%] and [reducing bounce rate by 10%]."
        }
    ]
  }
};

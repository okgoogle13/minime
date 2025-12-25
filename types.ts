
// Fix: Added full content for types.ts to define shared interfaces.
export interface JobAnalysis {
  jobTitle: string;
  companyName: string;
  keywords: string[];
  minimumRequirements: string[];
  keyResponsibilitiesAndKpis: string[];
  valuedOutcomes: string[];
  roleSpecificHardSkills: string[];
  companyNicheAndValues: string[];
  desirableAttributes: string[];
}

export interface Job {
  jobTitle: string;
  companyName: string;
  location: string;
  jobDescription: string;
}

// Fix: Exported all interfaces to allow them to be imported for explicit type annotations in other files.
export interface Education {
  degree: string;
  institution: string;
  location: string;
  graduationYear: string;
}

export interface SkillCategory {
  category: string;
  skillsList: string[];
}

export interface Experience {
  jobTitle: string;
  organization: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  responsibilities: string[];
  achievement: string;
}

export interface Certification {
  name: string;
  issuingBody: string;
  date: string;
}

export interface Training {
  name: string;
  provider: string;
  year: string;
}

export interface CertificationsAndDevelopment {
  certifications: Certification[];
  trainings: Training[];
}

export interface UserProfile {
  fullName: string;
  resumeHeadline: string;
  phone: string;
  email: string;
  location: string;
  careerSummary: string;
  education: Education[];
  skills: SkillCategory[];
  experience: Experience[];
  certificationsAndDevelopment: CertificationsAndDevelopment;
}

export interface ScoreBreakdown {
  hardSkillsMatch: {
    score: number;
    analysis: string;
  };
  softSkillsAndVerbsMatch: {
    score: number;
    analysis: string;
  };
  quantifiableAchievements: {
    score: number;
    analysis: string;
  };
  atsReadabilityAndFormatting: {
    score: number;
    analysis: string;
  };
}

export interface QuantificationSuggestion {
  originalText: string;
  suggestedRewrite: string;
}

export interface Evaluation {
  overallScore: number;
  overallAnalysis: string;
  scoreBreakdown: ScoreBreakdown;
  actionableFeedback: string[];
  quantificationSuggestions?: QuantificationSuggestion[];
}

export interface AIResponse {
  tailoredResume: UserProfile;
  evaluation: Evaluation;
  headlineSuggestions: string[];
}

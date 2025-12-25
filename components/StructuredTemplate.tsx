import React from 'react';
// Fix: Import `SkillCategory` to be used for explicit type annotation, resolving type inference errors.
import type { UserProfile, SkillCategory } from '../types';

interface TemplateProps {
  resumeData: UserProfile;
}

// Helper to chunk the skills array into pairs for the two-column layout
// Fix: Changed to a standard function declaration to resolve JSX syntax ambiguity with generics, which was causing type inference to fail.
function chunkArray<T>(arr: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );
}

const StructuredTemplate: React.FC<TemplateProps> = ({ resumeData }) => {
  const {
    fullName,
    resumeHeadline,
    phone,
    email,
    location,
    careerSummary,
    education,
    skills,
    experience,
    certificationsAndDevelopment,
  } = resumeData;

  const skillPairs = chunkArray(skills, 2);

  const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h2 className="text-sm font-bold uppercase tracking-widest text-gray-700 border-b-2 border-gray-300 pb-1 mb-3">{children}</h2>
  );

  return (
    <div className="p-8 bg-white font-serif text-gray-800 text-sm leading-relaxed">
      {/* Header */}
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold text-black">{fullName}</h1>
        <p className="text-md font-semibold text-gray-700 mt-1">{resumeHeadline}</p>
        <p className="text-xs text-gray-600 mt-2">
          Telephone: {phone} | Email: {email} | Address: {location}
        </p>
      </header>

      <main className="space-y-4">
        {/* Career Summary */}
        <section>
          <SectionTitle>Career Summary</SectionTitle>
          <p>{careerSummary}</p>
        </section>

        {/* Education */}
        <section>
          <SectionTitle>Education</SectionTitle>
          <div className="space-y-2">
            {education.map((edu, index) => (
              <div key={index}>
                <p className="font-bold">{edu.degree}</p>
                <p>{edu.institution} | {edu.location} | {edu.graduationYear}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section>
          <SectionTitle>Skills</SectionTitle>
          {skillPairs.map((pair, pIndex) => (
            <div key={pIndex} className="grid grid-cols-2 gap-x-8 mb-2">
              {/* Fix: Explicitly type 'category' as 'SkillCategory' to resolve property access errors on what was an 'unknown' type. */}
              {pair.map((category: SkillCategory, cIndex) => (
                <div key={cIndex}>
                  <h3 className="font-bold mb-1">{category.category}</h3>
                  <ul className="list-disc list-inside">
                    {category.skillsList.map((skill, sIndex) => (
                      <li key={sIndex}>{skill}</li>
                    ))}
                  </ul>
                </div>
              ))}
              {/* Fill empty col if pair has only one item */}
              {pair.length === 1 && <div></div>}
            </div>
          ))}
        </section>

        {/* Professional Experience */}
        <section>
          <SectionTitle>Professional Experience</SectionTitle>
          <div className="space-y-4">
            {experience.map((job, index) => (
              <div key={index}>
                <h3 className="text-md font-bold">{job.jobTitle}</h3>
                <p className="text-xs font-semibold text-gray-600">
                  {job.organization} | {job.location} | {job.startDate} – {job.endDate}
                </p>
                <p className="text-xs italic my-1">{job.description}</p>
                <h4 className="font-bold mt-1">Key Responsibilities:</h4>
                <ul className="list-disc list-inside">
                  {job.responsibilities.map((resp, rIndex) => (
                    <li key={rIndex}>{resp}</li>
                  ))}
                </ul>
                <p className="mt-1">
                  <span className="font-bold">Key Achievement:</span> {job.achievement}
                </p>
              </div>
            ))}
          </div>
        </section>
        
        {/* Certifications & Development */}
        {(certificationsAndDevelopment.certifications.length > 0 || certificationsAndDevelopment.trainings.length > 0) && (
          <section>
            <SectionTitle>Certifications & Professional Development</SectionTitle>
            <div className="space-y-1">
              {certificationsAndDevelopment.certifications.map((cert, index) => (
                <p key={`cert-${index}`}>{cert.name} | {cert.issuingBody} | {cert.date}</p>
              ))}
              {certificationsAndDevelopment.trainings.map((train, index) => (
                <p key={`train-${index}`}>{train.name} | {train.provider} | {train.year}</p>
              ))}
            </div>
          </section>
        )}

      </main>
    </div>
  );
};

export default StructuredTemplate;
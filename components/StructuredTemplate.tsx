import React from 'react';
import type { UserProfile, SkillCategory } from '../types';

interface TemplateProps {
  resumeData: UserProfile;
  documentType?: 'resume' | 'coverLetter' | 'ksc';
  coverLetter?: string;
  kscResponses?: { criteria: string; response: string }[];
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );
}

const StructuredTemplate: React.FC<TemplateProps> = ({ resumeData, documentType = 'resume', coverLetter, kscResponses }) => {
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

  const renderContent = () => {
    switch (documentType) {
      case 'coverLetter':
        return (
          <section className="fade-in">
            <SectionTitle>Cover Letter</SectionTitle>
            <div className="whitespace-pre-wrap leading-relaxed text-gray-800">
              {coverLetter || "No cover letter content generated."}
            </div>
          </section>
        );
      case 'ksc':
        return (
          <section className="fade-in space-y-6">
            <SectionTitle>Key Selection Criteria Responses</SectionTitle>
            {kscResponses && kscResponses.length > 0 ? (
              kscResponses.map((ksc, idx) => (
                <div key={idx} className="space-y-2">
                  <h3 className="text-md font-bold text-gray-900">{ksc.criteria}</h3>
                  <div className="text-gray-800 leading-relaxed">{ksc.response}</div>
                </div>
              ))
            ) : (
              <p>No KSC responses generated.</p>
            )}
          </section>
        );
      default:
        return (
          <div className="space-y-4 fade-in">
            <section>
              <SectionTitle>Career Summary</SectionTitle>
              <p>{careerSummary}</p>
            </section>

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

            <section>
              <SectionTitle>Skills</SectionTitle>
              {skillPairs.map((pair, pIndex) => (
                <div key={pIndex} className="grid grid-cols-2 gap-x-8 mb-2">
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
                  {pair.length === 1 && <div></div>}
                </div>
              ))}
            </section>

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
          </div>
        );
    }
  };

  return (
    <div className="p-8 bg-white font-serif text-gray-800 text-sm leading-relaxed">
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold text-black">{fullName}</h1>
        <p className="text-md font-semibold text-gray-700 mt-1">{resumeHeadline}</p>
        <p className="text-xs text-gray-600 mt-2">
          Telephone: {phone} | Email: {email} | Address: {location}
        </p>
      </header>

      <main className="space-y-4">
        {renderContent()}
      </main>
    </div>
  );
};

export default StructuredTemplate;

import React from 'react';
import type { UserProfile } from '../types';

interface SidebarTemplateProps {
  resumeData: UserProfile;
  documentType?: 'resume' | 'coverLetter' | 'ksc';
  coverLetter?: string;
  kscResponses?: { criteria: string; response: string }[];
}

const SidebarTemplate: React.FC<SidebarTemplateProps> = ({ resumeData, documentType = 'resume', coverLetter, kscResponses }) => {
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

  const SectionTitle = ({ children, light = false }: { children: React.ReactNode, light?: boolean }) => (
    <h2 className={`text-xs font-bold uppercase tracking-widest pb-1 mb-3 border-b-2 ${light ? 'text-slate-100 border-slate-500' : 'text-slate-800 border-slate-200'}`}>
      {children}
    </h2>
  );

  const renderMainContent = () => {
    switch (documentType) {
      case 'coverLetter':
        return (
          <section className="fade-in">
            <SectionTitle>Cover Letter</SectionTitle>
            <div className="text-slate-600 whitespace-pre-wrap leading-relaxed">
              {coverLetter || "No cover letter content generated."}
            </div>
          </section>
        );
      case 'ksc':
        return (
          <section className="fade-in space-y-8">
            <SectionTitle>Key Selection Criteria Responses</SectionTitle>
            {kscResponses && kscResponses.length > 0 ? (
              kscResponses.map((ksc, idx) => (
                <div key={idx} className="space-y-3">
                  <h3 className="text-base font-bold text-slate-900">{ksc.criteria}</h3>
                  <div className="text-slate-600 leading-relaxed">{ksc.response}</div>
                </div>
              ))
            ) : (
              <p className="text-slate-600">No KSC responses generated.</p>
            )}
          </section>
        );
      default:
        return (
          <div className="space-y-8 fade-in">
            <section>
              <SectionTitle>Profile Summary</SectionTitle>
              <p className="text-slate-600 italic leading-relaxed">{careerSummary}</p>
            </section>

            <section>
              <SectionTitle>Experience</SectionTitle>
              <div className="space-y-6">
                {experience.map((job, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-base font-bold text-slate-900">{job.jobTitle}</h3>
                      <span className="text-xs font-bold text-slate-400">{job.startDate} — {job.endDate}</span>
                    </div>
                    <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">{job.organization} | {job.location}</p>
                    <ul className="list-disc list-outside ml-4 space-y-1.5 text-slate-600 text-[13px]">
                      {job.responsibilities.map((res, ri) => (
                        <li key={ri}>{res}</li>
                      ))}
                    </ul>
                    {job.achievement && (
                      <div className="mt-2 pl-3 border-l-2 border-slate-200">
                        <p className="text-[13px] text-slate-700 font-semibold"><span className="text-slate-400 mr-1">Achievement:</span> {job.achievement}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {(certificationsAndDevelopment.certifications.length > 0 || certificationsAndDevelopment.trainings.length > 0) && (
              <section>
                <SectionTitle>Certifications & Training</SectionTitle>
                <ul className="grid grid-cols-1 gap-2 text-slate-600 text-xs">
                  {certificationsAndDevelopment.certifications.map((c, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="font-bold text-slate-800">• {c.name}</span>
                      <span className="text-slate-400">({c.issuingBody}, {c.date})</span>
                    </li>
                  ))}
                  {certificationsAndDevelopment.trainings.map((t, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="font-bold text-slate-800">• {t.name}</span>
                      <span className="text-slate-400">({t.provider}, {t.year})</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        );
    }
  };

  return (
    <div className="flex bg-white min-h-[1000px] font-sans text-sm leading-relaxed text-slate-800">
      {/* Sidebar - 1/3 width */}
      <aside className="w-1/3 bg-slate-800 text-slate-200 p-8 flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-black text-white leading-tight mb-1">{fullName}</h1>
          <p className="text-slate-400 font-medium">{resumeHeadline}</p>
        </div>

        <section>
          <SectionTitle light>Contact</SectionTitle>
          <ul className="space-y-2 text-xs">
            <li className="flex flex-col">
              <span className="font-bold text-slate-400 uppercase text-[10px]">Phone</span>
              <span>{phone}</span>
            </li>
            <li className="flex flex-col">
              <span className="font-bold text-slate-400 uppercase text-[10px]">Email</span>
              <span className="break-all">{email}</span>
            </li>
            <li className="flex flex-col">
              <span className="font-bold text-slate-400 uppercase text-[10px]">Location</span>
              <span>{location}</span>
            </li>
          </ul>
        </section>

        <section>
          <SectionTitle light>Skills</SectionTitle>
          <div className="space-y-4">
            {skills.map((cat, i) => (
              <div key={i}>
                <h3 className="font-bold text-white text-xs mb-1">{cat.category}</h3>
                <div className="flex flex-wrap gap-1">
                  {cat.skillsList.map((skill, si) => (
                    <span key={si} className="bg-slate-700 px-2 py-0.5 rounded text-[10px]">{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <SectionTitle light>Education</SectionTitle>
          <div className="space-y-4">
            {education.map((edu, i) => (
              <div key={i}>
                <p className="font-bold text-white text-xs">{edu.degree}</p>
                <p className="text-slate-400 text-[11px]">{edu.institution}</p>
                <p className="text-slate-500 text-[10px]">{edu.graduationYear}</p>
              </div>
            ))}
          </div>
        </section>
      </aside>

      {/* Main Content - 2/3 width */}
      <main className="w-2/3 p-10 flex flex-col gap-8 bg-white">
        {renderMainContent()}
      </main>
    </div>
  );
};

export default SidebarTemplate;

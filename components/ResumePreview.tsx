
import React from 'react';
import type { UserProfile } from '../types';
import StructuredTemplate from './StructuredTemplate';
import SidebarTemplate from './SidebarTemplate';

export type Theme = 'modern' | 'classic' | 'creative' | 'metropolis' | 'chronicle' | 'matrix' | 'executive' | 'structured' | 'quantum' | 'garamond' | 'vibrant' | 'sidebar';
export type DocumentType = 'resume' | 'coverLetter' | 'ksc';

interface ResumePreviewProps {
  resumeData: UserProfile;
  theme: Theme;
  documentType?: DocumentType;
  coverLetter?: string;
  kscResponses?: { criteria: string; response: string }[];
}

const themes = {
  modern: {
    container: 'font-sans',
    headerGradient: 'bg-gradient-to-r from-yellow-100 via-pink-200 to-purple-200 opacity-50',
    mainHeading: 'text-slate-900 font-extrabold',
    subHeading: 'text-purple-700 font-semibold',
    contactInfo: 'text-slate-600',
    sectionTitle: 'text-xl font-bold tracking-wider uppercase text-slate-800 border-b-2 border-slate-200',
    bodyText: 'text-slate-700',
    skillTag: 'bg-purple-100 text-purple-800',
    jobTitle: 'text-lg font-bold text-slate-900',
    jobMeta: 'text-slate-600 font-medium',
    highlight: 'font-semibold text-slate-800',
    headerBg: '',
    headerText: '',
    timelineBorder: '',
    timelineDot: '',
    skillTableHead: '',
  },
  classic: {
    container: 'font-serif',
    headerGradient: '',
    mainHeading: 'text-black font-bold',
    subHeading: 'text-gray-700 font-normal italic',
    contactInfo: 'text-gray-600',
    sectionTitle: 'text-lg font-bold tracking-normal normal-case text-black border-b-2 border-black',
    bodyText: 'text-gray-800',
    skillTag: 'bg-gray-200 text-gray-800',
    jobTitle: 'text-lg font-bold text-black',
    jobMeta: 'text-gray-700 font-medium',
    highlight: 'font-bold text-black',
    headerBg: '',
    headerText: '',
    timelineBorder: '',
    timelineDot: '',
    skillTableHead: '',
  },
  creative: {
    container: 'font-sans',
    headerGradient: 'bg-gradient-to-r from-cyan-100 to-blue-200 opacity-60',
    mainHeading: 'font-sans text-slate-800 font-black',
    subHeading: 'text-teal-600 font-semibold',
    contactInfo: 'text-slate-600',
    sectionTitle: 'text-lg font-sans font-bold uppercase tracking-wider text-teal-700 border-b-2 border-teal-200',
    bodyText: 'text-slate-700',
    skillTag: 'bg-teal-100 text-teal-800',
    jobTitle: 'text-lg font-bold text-slate-900',
    jobMeta: 'text-slate-600 font-medium',
    highlight: 'font-semibold text-teal-800',
    headerBg: '',
    headerText: '',
    timelineBorder: '',
    timelineDot: '',
    skillTableHead: '',
  },
  metropolis: {
      container: 'font-sans',
      headerBg: 'bg-slate-800',
      headerText: 'text-white',
      mainHeading: 'font-sans text-white font-black',
      subHeading: 'text-teal-400 font-semibold',
      contactInfo: 'text-slate-300',
      sectionTitle: 'text-xl font-sans font-bold uppercase tracking-wider text-slate-800 border-b-2 border-slate-200',
      bodyText: 'text-slate-700',
      jobTitle: 'text-lg font-bold text-slate-900',
      jobMeta: 'text-slate-600 font-medium',
      highlight: 'font-semibold text-teal-800',
      headerGradient: '',
      skillTag: 'bg-slate-200 text-slate-800',
      timelineBorder: '',
      timelineDot: '',
      skillTableHead: '',
  },
  chronicle: {
    container: 'font-serif',
    headerGradient: '',
    mainHeading: 'text-black font-bold',
    subHeading: 'text-red-900 font-normal',
    contactInfo: 'text-gray-600',
    sectionTitle: 'text-xl font-bold tracking-normal text-black border-b-2 border-gray-300',
    bodyText: 'text-gray-800',
    skillTag: 'bg-red-100 text-red-900',
    jobTitle: 'text-lg font-bold text-black',
    jobMeta: 'text-gray-700 font-medium',
    highlight: 'font-bold text-red-900',
    timelineBorder: 'border-red-900',
    timelineDot: 'bg-red-900',
    headerBg: '',
    headerText: '',
    skillTableHead: '',
  },
  matrix: {
    container: 'font-sans',
    headerGradient: 'bg-blue-100 opacity-70',
    mainHeading: 'text-slate-900 font-extrabold',
    subHeading: 'text-blue-700 font-semibold',
    contactInfo: 'text-slate-600',
    sectionTitle: 'text-xl font-bold tracking-wider uppercase text-slate-800 border-b-2 border-slate-200',
    bodyText: 'text-slate-700',
    jobTitle: 'text-lg font-bold text-slate-900',
    jobMeta: 'text-slate-600 font-medium',
    highlight: 'font-semibold text-blue-800',
    skillTableHead: 'bg-slate-100 text-slate-800 font-semibold',
    skillTag: '',
    headerBg: '',
    headerText: '',
    timelineBorder: '',
    timelineDot: '',
  },
  executive: {
    container: 'font-sans',
    headerGradient: '',
    mainHeading: 'text-slate-900 font-bold',
    subHeading: 'text-slate-600 font-medium',
    contactInfo: 'text-slate-600',
    sectionTitle: 'text-sm font-bold uppercase tracking-widest text-blue-900 border-b-2 border-slate-300',
    bodyText: 'text-slate-700',
    skillTag: 'border border-slate-300 text-slate-700',
    jobTitle: 'text-lg font-semibold text-slate-800',
    jobMeta: 'text-slate-600 font-medium',
    highlight: 'font-semibold text-blue-900',
    headerBg: '',
    headerText: '',
    timelineBorder: '',
    timelineDot: '',
    skillTableHead: 'bg-slate-100 text-slate-800 font-semibold',
  },
  quantum: {
    container: 'font-sans bg-gray-900 text-gray-200',
    headerGradient: '',
    mainHeading: 'text-white font-bold',
    subHeading: 'text-cyan-300 font-semibold',
    contactInfo: 'text-gray-400',
    sectionTitle: 'text-sm font-bold uppercase tracking-widest text-cyan-400 border-b-2 border-gray-700',
    bodyText: 'text-gray-300',
    skillTag: 'bg-gray-700 text-cyan-300 font-mono',
    jobTitle: 'text-lg font-semibold text-white',
    jobMeta: 'text-gray-400 font-medium',
    highlight: 'font-semibold text-cyan-300',
    headerBg: 'bg-gray-800 border-b border-gray-700',
    headerText: 'text-white',
    timelineBorder: '',
    timelineDot: '',
    skillTableHead: '',
  },
  garamond: {
    container: 'font-serif',
    headerGradient: '',
    mainHeading: 'text-center text-black font-bold',
    subHeading: 'text-center text-gray-700 font-normal',
    contactInfo: 'text-center text-gray-600',
    sectionTitle: 'text-lg font-normal tracking-normal normal-case text-black border-b border-black text-center',
    bodyText: 'text-gray-800',
    skillTag: 'bg-gray-200 text-gray-800',
    jobTitle: 'text-lg font-bold text-black',
    jobMeta: 'text-gray-700 font-normal italic',
    highlight: 'font-bold text-black',
    headerBg: '',
    headerText: '',
    timelineBorder: '',
    timelineDot: '',
    skillTableHead: '',
  },
  vibrant: {
    container: 'font-sans',
    headerGradient: 'bg-gradient-to-r from-orange-400 to-pink-500',
    mainHeading: 'text-white font-black',
    subHeading: 'text-white font-semibold opacity-90',
    contactInfo: 'text-white opacity-80',
    sectionTitle: 'text-xl font-bold tracking-tight text-slate-800',
    bodyText: 'text-slate-700',
    skillTag: 'bg-pink-100 text-pink-800',
    jobTitle: 'text-lg font-bold text-pink-600',
    jobMeta: 'text-slate-600 font-medium',
    highlight: 'font-semibold text-pink-700',
    headerBg: '',
    headerText: 'text-white',
    timelineBorder: '',
    timelineDot: '',
    skillTableHead: '',
  },
  structured: {
    container: 'font-serif',
    headerGradient: '',
    mainHeading: 'text-black',
    subHeading: 'text-gray-700',
    contactInfo: 'text-gray-600',
    sectionTitle: 'border-b-2 border-gray-300',
    bodyText: 'text-gray-800',
    skillTag: 'bg-gray-200 text-gray-800',
    jobTitle: 'text-black',
    jobMeta: 'text-gray-600',
    highlight: 'font-bold',
    headerBg: '',
    headerText: '',
    timelineBorder: '',
    timelineDot: '',
    skillTableHead: '',
  },
  sidebar: {
    container: '',
    headerGradient: '',
    mainHeading: '',
    subHeading: '',
    contactInfo: '',
    sectionTitle: '',
    bodyText: '',
    skillTag: '',
    jobTitle: '',
    jobMeta: '',
    highlight: '',
    headerBg: '',
    headerText: '',
    timelineBorder: '',
    timelineDot: '',
    skillTableHead: '',
  }
};

const ResumePreview: React.FC<ResumePreviewProps> = ({ resumeData, theme, documentType = 'resume', coverLetter, kscResponses }) => {
  if (theme === 'structured') {
    return (
      <div id="resume-preview" className="bg-white shadow-xl rounded-lg overflow-hidden">
        <StructuredTemplate resumeData={resumeData} documentType={documentType} coverLetter={coverLetter} kscResponses={kscResponses} />
      </div>
    );
  }

  if (theme === 'sidebar') {
    return (
      <div id="resume-preview" className="bg-white shadow-xl rounded-lg overflow-hidden">
        <SidebarTemplate resumeData={resumeData} documentType={documentType} coverLetter={coverLetter} kscResponses={kscResponses} />
      </div>
    );
  }
  
  const { 
    fullName, resumeHeadline, phone, email, location, careerSummary,
    education, skills, experience, certificationsAndDevelopment 
  } = resumeData;

  const currentTheme = themes[theme];
  
  const headerSection = (
    <div className={`p-10 relative ${currentTheme.headerBg}`}>
        <div className={`absolute top-0 left-0 right-0 h-full ${currentTheme.headerGradient}`}></div>
        <div className="relative">
            <h1 className={`text-4xl tracking-tight ${currentTheme.mainHeading}`}>{fullName}</h1>
            <p className={`text-lg mt-1 ${currentTheme.subHeading}`}>{resumeHeadline}</p>
            <p className={`text-sm mt-2 ${currentTheme.contactInfo}`}>
                Telephone: {phone} | Email: {email} | Address: {location}
            </p>
        </div>
    </div>
  );

  const renderContent = () => {
    switch (documentType) {
      case 'coverLetter':
        return (
          <section className="fade-in">
            <h2 className={`${currentTheme.sectionTitle} pb-2 mb-6`}>Cover Letter</h2>
            <div className={`${currentTheme.bodyText} whitespace-pre-wrap leading-relaxed`}>
              {coverLetter || "No cover letter content generated."}
            </div>
          </section>
        );
      case 'ksc':
        return (
          <section className="fade-in space-y-8">
            <h2 className={`${currentTheme.sectionTitle} pb-2 mb-6`}>Key Selection Criteria Responses</h2>
            {kscResponses && kscResponses.length > 0 ? (
              kscResponses.map((ksc, idx) => (
                <div key={idx} className="space-y-3">
                  <h3 className={`text-lg font-bold ${currentTheme.highlight}`}>{ksc.criteria}</h3>
                  <div className={`${currentTheme.bodyText} leading-relaxed`}>{ksc.response}</div>
                </div>
              ))
            ) : (
              <p className={currentTheme.bodyText}>No KSC responses generated.</p>
            )}
          </section>
        );
      default:
        return (
          <div className="space-y-8 fade-in">
            <hr/>
            <section>
              <h2 className={`${currentTheme.sectionTitle} pb-2 mb-4`}>Professional Summary</h2>
              <p className={currentTheme.bodyText}>{careerSummary}</p>
            </section>

            <section>
              <h2 className={`${currentTheme.sectionTitle} pb-2 mb-4`}>Education</h2>
              <div className="space-y-3">
                {education.map((edu, index) => (
                  <div key={index}>
                    <p className={`font-bold ${currentTheme.bodyText}`}>{edu.degree}</p>
                    <p className={currentTheme.jobMeta}>{edu.institution} | {edu.location} | {edu.graduationYear}</p>
                  </div>
                ))}
              </div>
                { (certificationsAndDevelopment.certifications.length > 0 || certificationsAndDevelopment.trainings.length > 0) &&
                    <div className="mt-4">
                        <h3 className={`font-semibold text-sm ${currentTheme.highlight}`}>Certifications & Development</h3>
                        <ul className={`list-disc list-inside space-y-1 mt-2 text-sm ${currentTheme.bodyText}`}>
                            {certificationsAndDevelopment.certifications.map((cert, index) => (
                                <li key={`cert-${index}`}>{cert.name}, {cert.issuingBody} ({cert.date})</li>
                            ))}
                            {certificationsAndDevelopment.trainings.map((train, index) => (
                                <li key={`train-${index}`}>{train.name}, {train.provider} ({train.year})</li>
                            ))}
                        </ul>
                    </div>
                }
            </section>
            
            <section>
              <h2 className={`${currentTheme.sectionTitle} pb-2 mb-4`}>Skills</h2>
              {theme === 'matrix' ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                   {skills.map((skillCat, index) => (
                     <div key={index} className="border border-slate-200 rounded-lg overflow-hidden">
                        <h3 className={`p-2 font-bold ${currentTheme.skillTableHead}`}>{skillCat.category}</h3>
                        <ul className="p-3 text-sm space-y-1">
                          {skillCat.skillsList.map((skill, sIndex) => <li key={sIndex} className={currentTheme.bodyText}>{skill}</li>)}
                        </ul>
                     </div>
                   ))}
                 </div>
              ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                {skills.map((skillCat, index) => (
                  <div key={index}>
                    <h3 className={`font-bold ${currentTheme.bodyText} mb-3`}>{skillCat.category}</h3>
                    <div className="flex flex-wrap gap-2">
                      {skillCat.skillsList.map((skill, sIndex) => (
                         <span 
                          key={sIndex} 
                          className={`${currentTheme.skillTag} text-sm font-medium px-3 py-1 rounded-full whitespace-nowrap`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              )}
            </section>

            <hr/>
            <section>
              <h2 className={`${currentTheme.sectionTitle} pb-2 mb-4`}>Work Experience</h2>
              <div className={`space-y-8 ${theme === 'chronicle' ? `relative border-l-2 pl-8 ${currentTheme.timelineBorder}` : ''}`}>
                {experience.map((job, index) => (
                  <div key={index} className="relative">
                     {theme === 'chronicle' && (
                      <div className={`absolute -left-[40px] top-1 h-4 w-4 rounded-full border-4 border-white ${currentTheme.timelineDot}`}></div>
                    )}
                    <h3 className={currentTheme.jobTitle}>{job.jobTitle}</h3>
                    <p className={currentTheme.jobMeta}>{job.organization} | {job.location} | {job.startDate} - {job.endDate}</p>
                    <p className="text-sm text-slate-500 italic my-2">{job.description}</p>
                    <h4 className={`${currentTheme.highlight} mt-3 mb-1`}>Key Responsibilities:</h4>
                    <ul className={`list-disc list-inside space-y-1 ${currentTheme.bodyText}`}>
                      {job.responsibilities.map((resp, rIndex) => <li key={rIndex}>{resp}</li>)}
                    </ul>
                     <p className="mt-3"><span className={currentTheme.highlight}>Key Achievement:</span> <span className={currentTheme.bodyText}>{job.achievement}</span></p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        );
    }
  };

  return (
    <div id="resume-preview" className={`bg-white shadow-xl rounded-lg overflow-hidden ${currentTheme.container}`}>
      {headerSection}
      <div className="px-10 pb-10">
        {renderContent()}
      </div>
    </div>
  );
};

export default ResumePreview;

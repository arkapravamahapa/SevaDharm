import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck, FileText, ArrowLeft, Printer, Search,
  AlertTriangle, CheckCircle2, Lock, Scale, Mail, Phone,
  MapPin, HelpCircle, ExternalLink, Calendar, ChevronRight
} from 'lucide-react';
import logoImg from '@/assets/logo.png';

interface LegalPageProps {
  initialTab?: 'privacy' | 'terms';
  onBack: () => void;
  onNavigateTab?: (tab: 'privacy' | 'terms') => void;
}

export default function LegalPage({
  initialTab = 'privacy',
  onBack,
  onNavigateTab
}: LegalPageProps) {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSectionId, setActiveSectionId] = useState<string>('');

  useEffect(() => {
    setActiveTab(initialTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [initialTab]);

  const handleTabChange = (tab: 'privacy' | 'terms') => {
    setActiveTab(tab);
    setSearchQuery('');
    if (onNavigateTab) {
      onNavigateTab(tab);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrint = () => {
    window.print();
  };

  const scrollToSection = (id: string) => {
    setActiveSectionId(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#F8F9FA] min-h-screen flex flex-col text-neutral-800">
      {/* Top Header */}
      <header className="bg-white border-b border-neutral-200/80 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors cursor-pointer"
              title="Return to Home"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div
              onClick={onBack}
              className="flex items-center gap-3 cursor-pointer select-none"
            >
              <img src={logoImg} alt="SevaDharam" className="h-8 w-auto object-contain" />
              <div>
                <span className="font-bold text-sm tracking-tight text-neutral-900 uppercase block leading-none">
                  SevaDharam
                </span>
                <span className="text-[9px] font-mono font-semibold uppercase text-brand tracking-wider">
                  Legal & Compliance Center
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Tab switch buttons */}
            <div className="flex items-center bg-neutral-100 p-1 rounded-xl border border-neutral-200/60">
              <button
                onClick={() => handleTabChange('privacy')}
                className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'privacy'
                    ? 'bg-white text-brand shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Privacy Policy</span>
                <span className="sm:hidden">Privacy</span>
              </button>
              <button
                onClick={() => handleTabChange('terms')}
                className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'terms'
                    ? 'bg-white text-brand shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Terms & Conditions</span>
                <span className="sm:hidden">Terms</span>
              </button>
            </div>

            <button
              onClick={handlePrint}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-xs font-semibold text-neutral-600 transition-colors cursor-pointer"
              title="Print Document"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="bg-gradient-to-b from-white to-[#F4EAE0]/30 border-b border-neutral-200/60 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-soft text-brand text-xs font-bold tracking-wide">
                {activeTab === 'privacy' ? (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Data Protection & Privacy Framework</span>
                  </>
                ) : (
                  <>
                    <Scale className="w-3.5 h-3.5" />
                    <span>Platform User Agreement & Refund Policy</span>
                  </>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
                {activeTab === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions'}
              </h1>
              <p className="text-sm text-neutral-600 max-w-2xl leading-relaxed">
                {activeTab === 'privacy'
                  ? 'Learn how SevaDharam collects, protects, processes, and safeguards your health data and personal information in compliance with applicable Indian data protection laws.'
                  : 'Review the terms, rules, telemedicine obligations, cancellation guidelines, and refund policies governing your access to and use of the SevaDharam platform.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="bg-white/80 border border-neutral-200 rounded-xl px-4 py-2.5 flex items-center gap-3 text-xs text-neutral-600 shadow-2xs">
                <Calendar className="w-4 h-4 text-brand shrink-0" />
                <div>
                  <div className="font-semibold text-neutral-900">Effective & Last Updated</div>
                  <div className="text-[11px] text-neutral-500">September 2026</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container with Sidebar + Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sticky Sidebar (TOC + Search) */}
          <aside className="lg:col-span-4 xl:col-span-3 space-y-6 lg:sticky lg:top-24">
            {/* Search filter */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-2xs">
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block mb-2">
                Search Sections
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. Refund, Doctor, Consent..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-neutral-50 hover:bg-neutral-100/70 focus:bg-white border border-neutral-200 focus:border-brand rounded-xl text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Quick Links Table of Contents */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-2xs max-h-[calc(100vh-280px)] overflow-y-auto">
              <h3 className="text-xs font-bold text-neutral-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-brand" />
                <span>Table of Contents</span>
              </h3>
              <nav className="space-y-1">
                {activeTab === 'privacy' ? (
                  <>
                    {[
                      { id: 'sec-p-1', label: '1. Who We Are' },
                      { id: 'sec-p-2', label: '2. Information We Collect' },
                      { id: 'sec-p-3', label: '3. How We Collect Information' },
                      { id: 'sec-p-4', label: '4. Purposes for Processing' },
                      { id: 'sec-p-5', label: '5. Consent' },
                      { id: 'sec-p-6', label: '6. Healthcare Information' },
                      { id: 'sec-p-7', label: '7. Sharing & Disclosure' },
                      { id: 'sec-p-8', label: '8. Data Security' },
                      { id: 'sec-p-9', label: '9. Data Retention' },
                      { id: 'sec-p-10', label: '10. Your Rights' },
                      { id: 'sec-p-11', label: "11. Children's Data" },
                      { id: 'sec-p-12', label: '12. Cookies & Tracking' },
                      { id: 'sec-p-13', label: '13. Third-Party Links' },
                      { id: 'sec-p-14', label: '14. Communications' },
                      { id: 'sec-p-15', label: '15. Data Transfers' },
                      { id: 'sec-p-16', label: '16. Security Incidents' },
                      { id: 'sec-p-17', label: '17. Medical Disclaimer' },
                      { id: 'sec-p-18', label: '18. Policy Changes' },
                      { id: 'sec-p-19', label: '19. Contact & Grievance' },
                      { id: 'sec-p-20', label: '20. Governing Law' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className={`w-full text-left text-xs py-1.5 px-2.5 rounded-lg transition-all flex items-center justify-between cursor-pointer ${
                          activeSectionId === item.id
                            ? 'bg-brand/10 text-brand font-bold'
                            : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                        }`}
                      >
                        <span className="truncate">{item.label}</span>
                        <ChevronRight className="w-3 h-3 opacity-40 shrink-0" />
                      </button>
                    ))}
                  </>
                ) : (
                  <>
                    {[
                      { id: 'sec-t-1', label: '1. About SevaDharam' },
                      { id: 'sec-t-2', label: '2. Eligibility' },
                      { id: 'sec-t-3', label: '3. Account Registration' },
                      { id: 'sec-t-4', label: '4. Healthcare Services' },
                      { id: 'sec-t-5', label: '5. Telemedicine' },
                      { id: 'sec-t-6', label: '6. Medical Disclaimer' },
                      { id: 'sec-t-7', label: '7. AI & Automated Features' },
                      { id: 'sec-t-8', label: '8. Professional Information' },
                      { id: 'sec-t-9', label: '9. User Health Info' },
                      { id: 'sec-t-10', label: '10. Appointments' },
                      { id: 'sec-t-11', label: '11. Payments' },
                      { id: 'sec-t-12', label: '12. Refunds & Doctor Non-Consult' },
                      { id: 'sec-t-13', label: '13. General Refund Policy' },
                      { id: 'sec-t-14', label: '14. User Responsibilities' },
                      { id: 'sec-t-15', label: '15. User Content' },
                      { id: 'sec-t-16', label: '16. Intellectual Property' },
                      { id: 'sec-t-17', label: '17. Third-Party Services' },
                      { id: 'sec-t-18', label: '18. Platform Availability' },
                      { id: 'sec-t-19', label: '19. No Healthcare Guarantee' },
                      { id: 'sec-t-20', label: '20. Privacy Reference' },
                      { id: 'sec-t-21', label: '21. Communications' },
                      { id: 'sec-t-22', label: '22. Suspension & Termination' },
                      { id: 'sec-t-23', label: '23. Complaints & Grievances' },
                      { id: 'sec-t-24', label: '24. Platform Changes' },
                      { id: 'sec-t-25', label: '25. Terms Updates' },
                      { id: 'sec-t-26', label: '26. Indemnification' },
                      { id: 'sec-t-27', label: '27. Limitation of Liability' },
                      { id: 'sec-t-28', label: '28. Force Majeure' },
                      { id: 'sec-t-29', label: '29. Governing Law' },
                      { id: 'sec-t-30', label: '30. Severability' },
                      { id: 'sec-t-31', label: '31. Entire Agreement' },
                      { id: 'sec-t-32', label: '32. Contact Information' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className={`w-full text-left text-xs py-1.5 px-2.5 rounded-lg transition-all flex items-center justify-between cursor-pointer ${
                          activeSectionId === item.id
                            ? 'bg-brand/10 text-brand font-bold'
                            : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                        }`}
                      >
                        <span className="truncate">{item.label}</span>
                        <ChevronRight className="w-3 h-3 opacity-40 shrink-0" />
                      </button>
                    ))}
                  </>
                )}
              </nav>
            </div>

            {/* Quick Contact Grievance Box */}
            <div className="bg-gradient-to-br from-neutral-900 to-[#162E46] text-white p-5 rounded-2xl shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-brand">
                <HelpCircle className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  Grievance Redressal
                </span>
              </div>
              <p className="text-[11px] text-neutral-300 leading-relaxed">
                Have a privacy inquiry or unresolved service grievance? Reach our official desk:
              </p>
              <div className="pt-2 border-t border-white/10 space-y-1.5 text-xs">
                <a
                  href="mailto:grievance@sevadharam.in"
                  className="flex items-center gap-2 text-neutral-200 hover:text-brand transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-brand shrink-0" />
                  <span className="truncate">grievance@sevadharam.in</span>
                </a>
                <a
                  href="mailto:privacy@sevadharam.in"
                  className="flex items-center gap-2 text-neutral-200 hover:text-brand transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-brand shrink-0" />
                  <span className="truncate">privacy@sevadharam.in</span>
                </a>
              </div>
            </div>
          </aside>

          {/* Document Content Area */}
          <main className="lg:col-span-8 xl:col-span-9 bg-white border border-neutral-200/90 rounded-3xl p-6 sm:p-10 shadow-xs space-y-10">
            {activeTab === 'privacy' ? (
              /* PRIVACY POLICY CONTENT */
              <div className="prose prose-neutral max-w-none text-neutral-700 space-y-8">
                {/* Intro statement */}
                <div className="p-5 rounded-2xl bg-[#FDF4EC] border border-[#FCE8D8] text-neutral-800 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-xs text-brand uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Clinical Data & User Privacy Commitment</span>
                  </div>
                  <p className="text-xs leading-relaxed text-neutral-700">
                    <strong>SevaDharam</strong> ("SevaDharam", "we", "us", or "our") operates the website{' '}
                    <a href="https://www.sevadharam.in" target="_blank" rel="noreferrer" className="text-brand font-medium underline">
                      www.sevadharam.in
                    </a>{' '}
                    and related digital healthcare services, platforms, applications, and services (collectively, the "Platform").
                  </p>
                  <p className="text-xs leading-relaxed text-neutral-700">
                    This Privacy Policy explains how we collect, use, store, disclose, protect, and otherwise process personal data when you access or use the Platform. By using the Platform, you acknowledge that you have read this Privacy Policy. Where consent is required by applicable law, we will obtain your consent before processing your personal data for the relevant purpose.
                  </p>
                </div>

                {/* Section 1 */}
                <section id="sec-p-1" className="space-y-3 pt-4 border-t border-neutral-100">
                  <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center text-xs font-mono">1</span>
                    Who We Are
                  </h2>
                  <p className="text-xs leading-relaxed">
                    SevaDharam is a digital healthcare platform intended to facilitate access to healthcare-related services and information.
                  </p>
                  <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-neutral-400 block text-[10px] uppercase font-bold">Legal Entity Name</span>
                      <span className="font-semibold text-neutral-800">SevaDharam Healthtech Private Limited</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 block text-[10px] uppercase font-bold">Official Website</span>
                      <a href="https://www.sevadharam.in/" target="_blank" rel="noreferrer" className="text-brand font-semibold underline">
                        https://www.sevadharam.in/
                      </a>
                    </div>
                    <div>
                      <span className="text-neutral-400 block text-[10px] uppercase font-bold">Privacy Contact</span>
                      <span className="font-semibold text-neutral-800">privacy@sevadharam.in</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 block text-[10px] uppercase font-bold">Grievance Contact</span>
                      <span className="font-semibold text-neutral-800">grievance@sevadharam.in</span>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    For the purposes of applicable Indian data-protection law, the entity responsible for determining the purposes and means of processing your personal data will be identified as the relevant Data Fiduciary / Data Controller, as applicable.
                  </p>
                </section>

                {/* Section 2 */}
                <section id="sec-p-2" className="space-y-4 pt-4 border-t border-neutral-100">
                  <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center text-xs font-mono">2</span>
                    Information We Collect
                  </h2>
                  <p className="text-xs leading-relaxed">
                    Depending on the services you use, we may collect the following categories of information:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 bg-white border border-neutral-200 rounded-xl space-y-2">
                      <h3 className="font-bold text-neutral-900 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-brand" />
                        2.1 Account & Identification
                      </h3>
                      <ul className="list-disc list-inside space-y-1 text-neutral-600 pl-1">
                        <li>Full name</li>
                        <li>Mobile number & Email address</li>
                        <li>Date of birth or age & Gender</li>
                        <li>Address or location details</li>
                        <li>Account credentials & OTP logs</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-white border border-neutral-200 rounded-xl space-y-2">
                      <h3 className="font-bold text-neutral-900 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-brand" />
                        2.2 Health & Medical Information
                      </h3>
                      <ul className="list-disc list-inside space-y-1 text-neutral-600 pl-1">
                        <li>Symptoms & health concerns</li>
                        <li>Medical history & existing conditions</li>
                        <li>Allergies & current/previous medications</li>
                        <li>Prescriptions & diagnostic/imaging reports</li>
                        <li>Consultation notes & uploaded files</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-white border border-neutral-200 rounded-xl space-y-2">
                      <h3 className="font-bold text-neutral-900 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-brand" />
                        2.3 Transaction & Payment Details
                      </h3>
                      <ul className="list-disc list-inside space-y-1 text-neutral-600 pl-1">
                        <li>Transaction amounts & timestamps</li>
                        <li>Payment status & booking IDs</li>
                        <li>Limited tokenized payment data</li>
                        <li>(No complete card numbers stored)</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-white border border-neutral-200 rounded-xl space-y-2">
                      <h3 className="font-bold text-neutral-900 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-brand" />
                        2.4 Technical & Communications
                      </h3>
                      <ul className="list-disc list-inside space-y-1 text-neutral-600 pl-1">
                        <li>IP addresses & browser/device types</li>
                        <li>Operating system & login timestamps</li>
                        <li>Diagnostic and security telemetry</li>
                        <li>Support chats, tickets, and emails</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Section 3 & 4 */}
                <section id="sec-p-3" className="space-y-3 pt-4 border-t border-neutral-100">
                  <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center text-xs font-mono">3</span>
                    How We Collect Information
                  </h2>
                  <ul className="list-disc list-inside space-y-1.5 text-xs text-neutral-700 pl-1">
                    <li>Directly from you when you create an account;</li>
                    <li>When you submit health or medical information;</li>
                    <li>When you book or use a healthcare service;</li>
                    <li>When you communicate with our support or practitioners;</li>
                    <li>From healthcare professionals involved in providing services through the Platform;</li>
                    <li>From payment and technology service providers;</li>
                    <li>Automatically through your use of the Platform and security logs.</li>
                  </ul>
                </section>

                <section id="sec-p-4" className="space-y-3 pt-4 border-t border-neutral-100">
                  <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center text-xs font-mono">4</span>
                    Purposes for Processing Personal Data
                  </h2>
                  <p className="text-xs leading-relaxed">
                    We process personal data for legitimate purposes including:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {[
                      'Creating and managing your user account',
                      'Providing requested healthcare-related services',
                      'Facilitating doctor-patient telemedicine & communication',
                      'Scheduling and managing appointments & alarms',
                      'Maintaining digital consultation & health records',
                      'Processing secure payments and eligible refunds',
                      'Providing customer and technical support',
                      'Verifying identity and preventing fraud or misuse',
                      'Complying with statutory medical & regulatory requirements',
                      'Enhancing platform performance, security, and stability'
                    ].map((item, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-200/70 flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand shrink-0" />
                        <span className="text-neutral-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Section 5, 6, 7 */}
                <section id="sec-p-5" className="space-y-3 pt-4 border-t border-neutral-100">
                  <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center text-xs font-mono">5</span>
                    Consent & Withdrawal
                  </h2>
                  <p className="text-xs leading-relaxed">
                    Where consent is the applicable legal basis for processing, we will seek consent in an appropriate manner before processing your personal data. You may withdraw your consent through the mechanisms made available by SevaDharam. Withdrawal of consent may affect our ability to provide certain services that depend on that information, but will not affect the lawfulness of processing carried out prior to withdrawal.
                  </p>
                </section>

                <section id="sec-p-6" className="space-y-3 pt-4 border-t border-neutral-100">
                  <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center text-xs font-mono">6</span>
                    Healthcare Information
                  </h2>
                  <p className="text-xs leading-relaxed">
                    Healthcare information is sensitive and critical. Health records may be made available to authorised healthcare professionals or service providers involved in delivering your requested care. You should ensure the medical information provided is accurate and complete. SevaDharam will not intentionally use your health information for a purpose materially different from what was communicated, except where permitted or required by law.
                  </p>
                </section>

                <section id="sec-p-7" className="space-y-3 pt-4 border-t border-neutral-100">
                  <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center text-xs font-mono">7</span>
                    Sharing and Disclosure of Personal Data
                  </h2>
                  <p className="text-xs leading-relaxed">
                    We disclose or share personal data only where reasonably necessary:
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 text-xs text-neutral-700 pl-1">
                    <li><strong>Healthcare professionals & clinics:</strong> Sharing consultation data with practitioners delivering your care.</li>
                    <li><strong>Technology & service providers:</strong> Cloud hosting, encrypted databases, SMS/OTP gateways, WhatsApp notifications, payment processors, and customer support infrastructure.</li>
                    <li><strong>Legal and regulatory authorities:</strong> When compelled by valid court orders, subpoenas, or statutory mandates.</li>
                    <li><strong>Business transactions:</strong> In event of mergers, reorganizations, or asset sales subject to strict confidentiality.</li>
                  </ul>
                  <div className="p-3 bg-neutral-900 text-white rounded-xl text-xs flex items-center gap-2 font-medium">
                    <Lock className="w-4 h-4 text-brand shrink-0" />
                    <span>We do NOT sell personal or health information to third parties for commercial or advertising use.</span>
                  </div>
                </section>

                {/* Section 8 & 9 */}
                <section id="sec-p-8" className="space-y-3 pt-4 border-t border-neutral-100">
                  <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center text-xs font-mono">8</span>
                    Data Security
                  </h2>
                  <p className="text-xs leading-relaxed">
                    We implement industry-grade technical and organizational safeguards including 256-bit encryption in transit, encrypted storage, role-based access control, periodic vulnerability assessments, automated backup recovery, and rigorous administrative controls.
                  </p>
                </section>

                <section id="sec-p-9" className="space-y-3 pt-4 border-t border-neutral-100">
                  <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center text-xs font-mono">9</span>
                    Data Retention
                  </h2>
                  <p className="text-xs leading-relaxed">
                    Personal data is retained only for as long as reasonably required to fulfill the purposes of collection, comply with statutory medical record retention obligations, resolve disputes, and enforce agreements. When no longer required, data is securely erased or anonymized.
                  </p>
                </section>

                {/* Section 10 through 16 */}
                <section id="sec-p-10" className="space-y-3 pt-4 border-t border-neutral-100">
                  <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center text-xs font-mono">10</span>
                    Your Legal Rights
                  </h2>
                  <p className="text-xs leading-relaxed">
                    Subject to applicable Indian data protection laws, you may:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-xs text-neutral-700 pl-1">
                    <li>Request access to or summaries of personal data processed;</li>
                    <li>Request correction of inaccurate or incomplete records;</li>
                    <li>Request deletion or erasure where permitted by law;</li>
                    <li>Withdraw consent previously provided;</li>
                    <li>Lodge a grievance with our designated Grievance Officer.</li>
                  </ul>
                  <p className="text-xs text-neutral-500">
                    To exercise any rights, email our team at <span className="font-semibold text-neutral-800">privacy@sevadharam.in</span>.
                  </p>
                </section>

                <section id="sec-p-11" className="space-y-3 pt-4 border-t border-neutral-100">
                  <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center text-xs font-mono">11</span>
                    Children's Personal Data
                  </h2>
                  <p className="text-xs leading-relaxed">
                    Where services involve individuals under 18 years of age, we implement safeguards including parental or lawful guardian consent. We do not knowingly collect children's personal data for unlawful purposes.
                  </p>
                </section>

                <section id="sec-p-12" className="space-y-3 pt-4 border-t border-neutral-100">
                  <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center text-xs font-mono">12</span>
                    Cookies & Tracking Technologies
                  </h2>
                  <p className="text-xs leading-relaxed">
                    We use essential and functional cookies to maintain secure sessions, remember preferences, and analyze anonymized platform usage. You can configure browser settings to limit cookie placement.
                  </p>
                </section>

                <section id="sec-p-13" className="space-y-3 pt-4 border-t border-neutral-100">
                  <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center text-xs font-mono">13</span>
                    Third-Party Links & Services
                  </h2>
                  <p className="text-xs leading-relaxed">
                    The Platform may contain links to external healthcare providers, payment gateways, or third-party platforms. Those services operate under independent privacy policies, and SevaDharam is not responsible for their independent practices.
                  </p>
                </section>

                <section id="sec-p-14" className="space-y-3 pt-4 border-t border-neutral-100">
                  <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center text-xs font-mono">14</span>
                    Communications & Notifications
                  </h2>
                  <p className="text-xs leading-relaxed">
                    We send essential transactional notifications (OTP codes, appointment confirmations, consultation links, emergency notices). Promotional messages require separate opt-in consent and provide instant opt-out links.
                  </p>
                </section>

                <section id="sec-p-15" className="space-y-3 pt-4 border-t border-neutral-100">
                  <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center text-xs font-mono">15</span>
                    Cross-Border Data Transfers
                  </h2>
                  <p className="text-xs leading-relaxed">
                    Where personal data is stored or processed via cloud vendors outside India, we ensure compliance with prescribed cross-border transfer requirements under applicable Indian data protection laws.
                  </p>
                </section>

                <section id="sec-p-16" className="space-y-3 pt-4 border-t border-neutral-100">
                  <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center text-xs font-mono">16</span>
                    Data Breach & Security Incidents
                  </h2>
                  <p className="text-xs leading-relaxed">
                    In the event of a suspected personal data breach, our incident response protocol investigates, mitigates, and reports the event to impacted users and regulatory authorities in accordance with legal timelines.
                  </p>
                </section>

                {/* Section 17: Disclaimer Callout */}
                <section id="sec-p-17" className="space-y-3 pt-4 border-t border-neutral-100">
                  <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center text-xs font-mono">17</span>
                    Healthcare & Medical Disclaimer
                  </h2>
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-xs">
                      <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                      <span>IMPORTANT CLINICAL NOTICE</span>
                    </div>
                    <p className="text-xs leading-relaxed">
                      SevaDharam is a technology platform and <strong>NOT a substitute for emergency medical care</strong>. Automated tools and informational displays do not constitute definitive medical diagnosis. If you are experiencing a medical emergency, immediately contact emergency services or visit the nearest hospital.
                    </p>
                  </div>
                </section>

                {/* Section 18, 19, 20 */}
                <section id="sec-p-18" className="space-y-3 pt-4 border-t border-neutral-100">
                  <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center text-xs font-mono">18</span>
                    Changes to This Privacy Policy
                  </h2>
                  <p className="text-xs leading-relaxed">
                    We may periodically revise this Privacy Policy. Material amendments will be highlighted on the Platform with updated revision timestamps.
                  </p>
                </section>

                <section id="sec-p-19" className="space-y-3 pt-4 border-t border-neutral-100">
                  <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center text-xs font-mono">19</span>
                    Contact and Grievance Redressal
                  </h2>
                  <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-5 space-y-3 text-xs">
                    <div className="font-bold text-neutral-900 uppercase tracking-wide">SevaDharam Privacy Office</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-neutral-700">
                      <div>
                        <span className="text-neutral-400 block text-[10px] uppercase font-bold">Privacy Desk</span>
                        <span className="font-semibold text-neutral-900">privacy@sevadharam.in</span>
                      </div>
                      <div>
                        <span className="text-neutral-400 block text-[10px] uppercase font-bold">Grievance Officer</span>
                        <span className="font-semibold text-neutral-900">grievance@sevadharam.in</span>
                      </div>
                      <div>
                        <span className="text-neutral-400 block text-[10px] uppercase font-bold">Support Line</span>
                        <span className="font-semibold text-neutral-900">+91 (0) 800-SEVADHARAM</span>
                      </div>
                      <div>
                        <span className="text-neutral-400 block text-[10px] uppercase font-bold">Headquarters</span>
                        <span className="font-semibold text-neutral-900">Bengaluru / New Delhi, India</span>
                      </div>
                    </div>
                  </div>
                </section>

                <section id="sec-p-20" className="space-y-3 pt-4 border-t border-neutral-100">
                  <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center text-xs font-mono">20</span>
                    Governing Law
                  </h2>
                  <p className="text-xs leading-relaxed">
                    This Privacy Policy is governed by and construed in accordance with the laws of India, subject to mandatory consumer and data protection rights available to individuals.
                  </p>
                </section>
              </div>
            ) : (
              /* TERMS & CONDITIONS CONTENT */
              <div className="prose prose-neutral max-w-none text-neutral-700 space-y-8">
                {/* Intro statement */}
                <div className="p-5 rounded-2xl bg-[#FDF4EC] border border-[#FCE8D8] text-neutral-800 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-xs text-brand uppercase tracking-wider">
                    <Scale className="w-4 h-4" />
                    <span>User Agreement & Platform Terms</span>
                  </div>
                  <p className="text-xs leading-relaxed text-neutral-700">
                    Welcome to <strong>SevaDharam</strong> ("SevaDharam", "we", "us", or "our"). These Terms & Conditions ("Terms") govern your access to and use of the SevaDharam website, applications, digital healthcare services, and related features (the "Platform").
                  </p>
                  <p className="text-xs leading-relaxed text-neutral-700">
                    By accessing, registering for, or using the Platform, you agree to be bound by these Terms. If you do not agree with these Terms, please do not use the Platform.
                  </p>
                </div>

                {/* Section 1, 2, 3 */}
                <section id="sec-t-1" className="space-y-3 pt-4 border-t border-neutral-100">
                  <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center text-xs font-mono">1</span>
                    About SevaDharam
                  </h2>
                  <p className="text-xs leading-relaxed">
                    SevaDharam is a technology-enabled healthcare platform intended to facilitate access to healthcare-related information, services, healthcare professionals, and digital triage tools. Service availability may vary by location and specialist availability.
                  </p>
                </section>

                <section id="sec-t-2" className="space-y-3 pt-4 border-t border-neutral-100">
                  <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center text-xs font-mono">2</span>
                    Eligibility
                  </h2>
                  <p className="text-xs leading-relaxed">
                    You may use the Platform only if you are legally capable of entering into a binding agreement. If acting on behalf of a dependent or child, you represent that you possess lawful authority or guardianship to consent on their behalf.
                  </p>
                </section>

                <section id="sec-t-3" className="space-y-3 pt-4 border-t border-neutral-100">
                  <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center text-xs font-mono">3</span>
                    Account Registration & Security
                  </h2>
                  <p className="text-xs leading-relaxed">
                    You agree to provide accurate registration details, safeguard credentials/OTPs, not impersonate others, and immediately notify us of suspected unauthorized access.
                  </p>
                </section>

                {/* Section 4, 5, 6, 7 */}
                <section id="sec-t-4" className="space-y-3 pt-4 border-t border-neutral-100">
                  <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center text-xs font-mono">4</span>
                    Healthcare Services
                  </h2>
                  <p className="text-xs leading-relaxed">
                    Consultations are provided by registered, qualified healthcare professionals who exercise independent clinical judgment. SevaDharam provides the enabling technology, scheduling, and communication platform.
                  </p>
                </section>

                <section id="sec-t-5" className="space-y-3 pt-4 border-t border-neutral-100">
                  <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center text-xs font-mono">5</span>
                    Telemedicine Guidelines
                  </h2>
                  <p className="text-xs leading-relaxed">
                    Telemedicine consultations comply with Indian Telemedicine Practice Guidelines. Telemedicine has inherent clinical limitations; a doctor may determine that an in-person physical exam or emergency admission is necessary.
                  </p>
                </section>

                <section id="sec-t-6" className="space-y-3 pt-4 border-t border-neutral-100">
                  <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center text-xs font-mono">6</span>
                    Medical Disclaimer
                  </h2>
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-1.5 text-xs">
                    <p className="font-bold">⚠️ DO NOT USE FOR MEDICAL EMERGENCIES</p>
                    <p>
                      Educational information, algorithms, and general health content do not constitute a definitive medical diagnosis. For life-threatening emergencies, call national emergency services or visit the nearest hospital emergency room.
                    </p>
                  </div>
                </section>

                <section id="sec-t-7" className="space-y-3 pt-4 border-t border-neutral-100">
                  <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center text-xs font-mono">7</span>
                    Artificial Intelligence & Automated Features
                  </h2>
                  <p className="text-xs leading-relaxed">
                    AI-assisted triage and automated symptom assessments are informational tools intended to support clinical workflows. They must not be relied upon as the sole basis for critical medical decisions.
                  </p>
                </section>

                {/* Section 8, 9, 10, 11 */}
                <section id="sec-t-8" className="space-y-3 pt-4 border-t border-neutral-100">
                  <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center text-xs font-mono">8</span>
                    Healthcare Professional Information
                  </h2>
                  <p className="text-xs leading-relaxed">
                    We verify qualifications and registration numbers of participating healthcare professionals. However, individual schedules and emergency availability remain dynamic.
                  </p>
                </section>

                <section id="sec-t-9" className="space-y-3 pt-4 border-t border-neutral-100">
                  <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center text-xs font-mono">9</span>
                    User Health Information
                  </h2>
                  <p className="text-xs leading-relaxed">
                    You agree to provide true, current, and comprehensive health details to ensure clinical accuracy. Your data is handled in strict accordance with our Privacy Policy.
                  </p>
                </section>

                <section id="sec-t-10" className="space-y-3 pt-4 border-t border-neutral-100">
                  <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center text-xs font-mono">10</span>
                    Appointments & Consultations
                  </h2>
                  <p className="text-xs leading-relaxed">
                    Appointments are subject to doctor confirmation. Users are expected to join the video/audio line punctually with an active connection.
                  </p>
                </section>

                <section id="sec-t-11" className="space-y-3 pt-4 border-t border-neutral-100">
                  <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center text-xs font-mono">11</span>
                    Payments
                  </h2>
                  <p className="text-xs leading-relaxed">
                    All consultation and service fees are displayed upfront inclusive of applicable taxes. Payments are securely processed via RBI-compliant payment gateways.
                  </p>
                </section>

                {/* Section 12: DETAILED REFUND AND CANCELLATION CLAUSE WITH TABLE */}
                <section id="sec-t-12" className="space-y-5 pt-4 border-t-2 border-brand/30">
                  <div className="bg-[#FDF4EC] border border-[#FCE8D8] rounded-2xl p-5 space-y-4">
                    <div className="flex items-center gap-2 text-brand">
                      <Scale className="w-5 h-5" />
                      <h2 className="text-base sm:text-lg font-extrabold text-neutral-900">
                        12. Appointments, Doctor Non-Consultation, Rescheduling and Refunds
                      </h2>
                    </div>

                    <div className="space-y-3 text-xs text-neutral-700">
                      <div>
                        <h3 className="font-bold text-neutral-900 mb-1">12.1 Appointment Booking</h3>
                        <p>
                          When you book a consultation through SevaDharam, the consultation is scheduled for the date and time displayed at booking, subject to doctor availability and participation.
                        </p>
                      </div>

                      <div>
                        <h3 className="font-bold text-neutral-900 mb-1">12.2 Doctor Does Not Conduct Consultation</h3>
                        <p>
                          If the doctor is unable to conduct the consultation after confirmation, SevaDharam will attempt to arrange a rescheduled session <strong>within 7 calendar days</strong> from the original date. Rescheduling is subject to mutual availability.
                        </p>
                      </div>

                      <div>
                        <h3 className="font-bold text-neutral-900 mb-1">12.3 Refund Where Doctor Does Not Consult</h3>
                        <p>
                          If the doctor does not conduct the consultation and it is not rescheduled to your satisfaction, the patient will receive a <strong>100% full refund</strong>. Refunds are initiated <strong>within 15 calendar days</strong> from the original scheduled date.
                        </p>
                      </div>

                      {/* Refund Schedule Table */}
                      <div className="space-y-2 pt-2">
                        <h3 className="font-bold text-neutral-900">12.4 Patient-Initiated Cancellation Schedule</h3>
                        <div className="overflow-x-auto rounded-xl border border-neutral-300/80 bg-white">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-neutral-100 text-neutral-700 font-bold border-b border-neutral-200">
                              <tr>
                                <th className="p-3">Cancellation Time Prior to Appointment</th>
                                <th className="p-3 text-right">Eligible Refund Percentage</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                              <tr className="hover:bg-emerald-50/50">
                                <td className="p-3 font-medium text-neutral-800">
                                  <strong>7 days or more</strong> before scheduled consultation
                                </td>
                                <td className="p-3 text-right font-extrabold text-emerald-700">
                                  100% Refund
                                </td>
                              </tr>
                              <tr className="hover:bg-amber-50/50">
                                <td className="p-3 font-medium text-neutral-800">
                                  <strong>Less than 7 days but at least 72 hours</strong> before consultation
                                </td>
                                <td className="p-3 text-right font-extrabold text-amber-700">
                                  75% Refund
                                </td>
                              </tr>
                              <tr className="hover:bg-rose-50/50">
                                <td className="p-3 font-medium text-neutral-800">
                                  <strong>Less than 72 hours</strong> before scheduled consultation
                                </td>
                                <td className="p-3 text-right font-extrabold text-rose-700">
                                  No Refund (0%)
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <p className="text-[11px] text-neutral-500 italic">
                          * Cancellation timing is calculated relative to the exact scheduled consultation start time.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                        <div className="p-3 bg-white rounded-xl border border-neutral-200">
                          <h4 className="font-bold text-neutral-900 mb-0.5">12.5 Rescheduled Appointments</h4>
                          <p className="text-[11px] text-neutral-600">
                            Rescheduled sessions depend on doctor availability. Confirmation from the patient is required.
                          </p>
                        </div>
                        <div className="p-3 bg-white rounded-xl border border-neutral-200">
                          <h4 className="font-bold text-neutral-900 mb-0.5">12.6 Patient No-Show</h4>
                          <p className="text-[11px] text-neutral-600">
                            Failure to attend the scheduled call without prior notice is treated as a cancellation under 72h (no refund).
                          </p>
                        </div>
                        <div className="p-3 bg-white rounded-xl border border-neutral-200">
                          <h4 className="font-bold text-neutral-900 mb-0.5">12.7 Technical Failures</h4>
                          <p className="text-[11px] text-neutral-600">
                            If technical outages prevent session completion, we attempt rescheduling or issue a full refund.
                          </p>
                        </div>
                        <div className="p-3 bg-white rounded-xl border border-neutral-200">
                          <h4 className="font-bold text-neutral-900 mb-0.5">12.8 Refund Processing</h4>
                          <p className="text-[11px] text-neutral-600">
                            Refunds are credited to the original payment method (banking timeline: 5-7 business days).
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 13 through 21 */}
                <section id="sec-t-13" className="space-y-3 pt-4 border-t border-neutral-100">
                  <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center text-xs font-mono">13</span>
                    General Refund Policy
                  </h2>
                  <p className="text-xs leading-relaxed">
                    Except where specific terms apply, refunds are administered strictly in accordance with the cancellation policy shown during checkout. Mandatory consumer rights under Indian law remain intact.
                  </p>
                </section>

                <section id="sec-t-14" className="space-y-3 pt-4 border-t border-neutral-100">
                  <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center text-xs font-mono">14</span>
                    User Responsibilities & Acceptable Use
                  </h2>
                  <p className="text-xs leading-relaxed">
                    Users agree not to provide false health records, harass practitioners, upload malicious code, reverse-engineer platform tools, or scrape protected healthcare directories.
                  </p>
                </section>

                <section id="sec-t-15" className="space-y-3 pt-4 border-t border-neutral-100">
                  <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center text-xs font-mono">15</span>
                    User-Provided Content & Clinical Uploads
                  </h2>
                  <p className="text-xs leading-relaxed">
                    You retain ownership of documents uploaded. You grant SevaDharam the limited technical license to store, encrypt, and render reports solely to facilitate care delivery.
                  </p>
                </section>

                <section id="sec-t-16" className="space-y-3 pt-4 border-t border-neutral-100">
                  <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center text-xs font-mono">16</span>
                    Intellectual Property
                  </h2>
                  <p className="text-xs leading-relaxed">
                    The SevaDharam name, logo, software, algorithms, UI design, database schemas, and proprietary triage content are protected under copyright and trademark laws.
                  </p>
                </section>

                <section id="sec-t-17" className="space-y-3 pt-4 border-t border-neutral-100">
                  <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center text-xs font-mono">17</span>
                    Third-Party Services
                  </h2>
                  <p className="text-xs leading-relaxed">
                    Third-party payment gateways, SMS providers, and external pharmacy networks operate under independent terms and service level agreements.
                  </p>
                </section>

                <section id="sec-t-18" className="space-y-3 pt-4 border-t border-neutral-100">
                  <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center text-xs font-mono">18</span>
                    Platform Availability & Maintenance
                  </h2>
                  <p className="text-xs leading-relaxed">
                    While we maintain high service availability, platform access may experience scheduled maintenance or network interruptions without prior notice.
                  </p>
                </section>

                <section id="sec-t-19" className="space-y-3 pt-4 border-t border-neutral-100">
                  <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center text-xs font-mono">19</span>
                    No Guarantee of Healthcare Outcome
                  </h2>
                  <p className="text-xs leading-relaxed">
                    Healthcare responses vary between patients. SevaDharam does not guarantee specific clinical or therapeutic outcomes from consultations.
                  </p>
                </section>

                <section id="sec-t-20" className="space-y-3 pt-4 border-t border-neutral-100">
                  <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center text-xs font-mono">20</span>
                    Privacy Policy Incorporation
                  </h2>
                  <p className="text-xs leading-relaxed">
                    Your platform usage is concurrently governed by our{' '}
                    <button
                      onClick={() => handleTabChange('privacy')}
                      className="text-brand font-bold underline cursor-pointer"
                    >
                      Privacy Policy
                    </button>
                    , which is incorporated by reference into these Terms.
                  </p>
                </section>

                <section id="sec-t-21" className="space-y-3 pt-4 border-t border-neutral-100">
                  <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center text-xs font-mono">21</span>
                    Communications & Service Alerts
                  </h2>
                  <p className="text-xs leading-relaxed">
                    By registering, you consent to receive critical appointment notifications, prescription alerts, and security OTPs via SMS, WhatsApp, or email.
                  </p>
                </section>

                {/* Section 22 through 32 */}
                <section id="sec-t-22" className="space-y-3 pt-4 border-t border-neutral-100">
                  <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center text-xs font-mono">22</span>
                    Suspension & Termination
                  </h2>
                  <p className="text-xs leading-relaxed">
                    We reserve the right to suspend or restrict accounts for material breach, fraudulent payment activity, or safety threats to practitioners.
                  </p>
                </section>

                <section id="sec-t-23" className="space-y-3 pt-4 border-t border-neutral-100">
                  <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center text-xs font-mono">23</span>
                    Complaints & Grievances
                  </h2>
                  <p className="text-xs leading-relaxed">
                    Submit inquiries or complaints to our grievance officer at <span className="font-semibold text-neutral-900">grievance@sevadharam.in</span> for resolution within statutory timelines.
                  </p>
                </section>

                <section id="sec-t-24" className="space-y-3 pt-4 border-t border-neutral-100">
                  <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center text-xs font-mono">24</span>
                    Changes to the Platform
                  </h2>
                  <p className="text-xs leading-relaxed">
                    SevaDharam continuously upgrades its digital tools and may add, modify, or sunset features with reasonable notice.
                  </p>
                </section>

                <section id="sec-t-25" className="space-y-3 pt-4 border-t border-neutral-100">
                  <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center text-xs font-mono">25</span>
                    Changes to These Terms
                  </h2>
                  <p className="text-xs leading-relaxed">
                    Updated terms are posted with revised "Last Updated" timestamps. Continued use constitutes acceptance of revised terms.
                  </p>
                </section>

                <section id="sec-t-26" className="space-y-3 pt-4 border-t border-neutral-100">
                  <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center text-xs font-mono">26</span>
                    Indemnification
                  </h2>
                  <p className="text-xs leading-relaxed">
                    To the extent permitted by law, users agree to indemnify SevaDharam against claims arising from unlawful platform misuse or infringement of third-party rights.
                  </p>
                </section>

                <section id="sec-t-27" className="space-y-3 pt-4 border-t border-neutral-100">
                  <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center text-xs font-mono">27</span>
                    Limitation of Liability
                  </h2>
                  <p className="text-xs leading-relaxed">
                    To the maximum extent permitted by Indian law, SevaDharam will not be liable for indirect or consequential damages. Statutory consumer protections remain unaffected.
                  </p>
                </section>

                <section id="sec-t-28" className="space-y-3 pt-4 border-t border-neutral-100">
                  <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center text-xs font-mono">28</span>
                    Force Majeure
                  </h2>
                  <p className="text-xs leading-relaxed">
                    We are not liable for service interruptions caused by acts of God, infrastructure outages, telecommunications breakdowns, or regulatory actions beyond reasonable control.
                  </p>
                </section>

                <section id="sec-t-29" className="space-y-3 pt-4 border-t border-neutral-100">
                  <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center text-xs font-mono">29</span>
                    Governing Law and Jurisdiction
                  </h2>
                  <p className="text-xs leading-relaxed">
                    These Terms are governed by the laws of India. Disputes are subject to the exclusive jurisdiction of the competent courts having jurisdiction over SevaDharam's registered office.
                  </p>
                </section>

                <section id="sec-t-30" className="space-y-3 pt-4 border-t border-neutral-100">
                  <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center text-xs font-mono">30</span>
                    Severability & Entire Agreement
                  </h2>
                  <p className="text-xs leading-relaxed">
                    If any clause is held invalid, the remainder continues in full force. These Terms and the Privacy Policy constitute the entire agreement between the user and SevaDharam.
                  </p>
                </section>

                <section id="sec-t-32" className="space-y-3 pt-4 border-t border-neutral-100">
                  <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center text-xs font-mono">31</span>
                    Contact Information
                  </h2>
                  <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-5 space-y-2 text-xs">
                    <div className="font-bold text-neutral-900">SevaDharam Legal & Support Services</div>
                    <p className="text-neutral-600">Email: <span className="font-medium text-neutral-900">legal@sevadharam.in</span> | <span className="font-medium text-neutral-900">support@sevadharam.in</span></p>
                    <p className="text-neutral-600">Website: <a href="https://www.sevadharam.in/" target="_blank" rel="noreferrer" className="text-brand underline font-medium">https://www.sevadharam.in/</a></p>
                  </div>
                </section>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Footer Navigation */}
      <footer className="bg-neutral-900 text-white py-10 px-4 sm:px-6 lg:px-8 mt-12 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-neutral-400">
          <div className="flex items-center gap-3">
            <img src={logoImg} alt="SevaDharam" className="h-6 w-auto object-contain brightness-200" />
            <span>© 2026 SevaDharam Clinical Care Platform. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => handleTabChange('privacy')}
              className={`hover:text-white transition-colors cursor-pointer ${
                activeTab === 'privacy' ? 'text-brand font-bold underline' : ''
              }`}
            >
              Privacy Policy
            </button>
            <button
              onClick={() => handleTabChange('terms')}
              className={`hover:text-white transition-colors cursor-pointer ${
                activeTab === 'terms' ? 'text-brand font-bold underline' : ''
              }`}
            >
              Terms & Conditions
            </button>
            <button
              onClick={onBack}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Back to Home
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

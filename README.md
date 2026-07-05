
🎯
OFFCAMPUSCAREER
Business Requirements Document (BRD)
Unified Career Platform — Web Application (Frontend, Backend, API, Database) with Integrated AI Modules
An initiative of SHAMIIT (Shami Innovation and Technologies LLP), Noida, U.P.
Tagline: Learn Together · Work Together · Grow Together
Document Version: 1.0
Prepared For: Product, Engineering, QA & AI Development Teams
Status: Draft for Development Kickoff
 
Document Control
Version History
Version	Date	Author	Description
0.1	Draft	Product/BA Team	Initial draft compiled from existing site (offcampuscareer.com) design, portals, and TIP brochure
1.0	Current	Product/BA Team	Complete BRD covering all modules, portals, database, API and AI feature requirements for full rebuild/redevelopment

Purpose of this Document
This Business Requirements Document (BRD) defines the complete functional and non-functional requirements for redeveloping and extending the Offcampuscareer platform into a production-grade web application. It captures requirements for the public marketing website, all six platform modules (OCC TIP, OCC Mentor, OCC Jobs, OCC Exams, OCC Corporate, OCC Community), four portals (Student, Admin, Corporate, Mentor), payments/checkout, and a set of AI-powered capabilities (AI Mock Interviews, AI Test Series, AI Study Plans, AI Resume Builder, AI ATS) that are to be embedded across every relevant module. This document is intended to guide frontend, backend, API, database, DevOps, QA, and AI/ML engineering teams through design and implementation.
Reference Materials Used
●	Existing website pages: index, about, contact, placement, careers, corporate, corporate-portal, community, exams, training, mentor, mentor-portal, student, admin, checkout
●	Student Onboarding / TIP Brochure (Training, Internship, Placement program collateral)
●	Existing information architecture, navigation, and UI component patterns (cards, modals, portals, dashboards)
 
Table of Contents
●	1. Executive Summary
●	2. Project Background & Objectives
●	3. Scope (In Scope / Out of Scope)
●	4. Stakeholders
●	5. User Roles & Personas
●	6. Business Requirements by Module (Public Site, TIP, Mentor, Jobs, Exams, Corporate, Community, Portals, Checkout)
●	7. AI Capabilities — AI Mock Interview, AI Test Series, AI Study Plan, AI Resume Builder, AI ATS & Supporting AI Utilities
●	8. Consolidated Functional Requirements (Traceability Table)
●	9. Non-Functional Requirements
●	10. System Architecture Overview
●	11. Recommended Technology Stack
●	12. Database Design — Core Entities
●	13. API Design — Endpoint Groups
●	14. Third-Party Integrations
●	15. Assumptions & Constraints
●	16. Risks & Mitigation
●	17. Success Metrics / KPIs
●	18. Project Phases & High-Level Timeline
●	19. Sign-off / Approval
●	20. Appendix — Glossary
 
1. Executive Summary
Offcampuscareer (OC2) is a Pan-India career development ecosystem, positioned as an initiative of SHAMIIT LLP, whose mission is 'Turning Learners into Earners.' The platform currently spans six functional pillars — Training/Internship/Placement (TIP), Mentorship, Jobs, Competitive Exam Preparation, Corporate Partnerships, and Community — supported by dedicated portals for Students, Administrators, Corporate partners, and Mentors.
This BRD scopes the ground-up (or migration) engineering effort to rebuild Offcampuscareer as a scalable, secure, API-driven web application with a modern frontend, a robust backend/services layer, a normalized relational database, and a dedicated AI services layer. AI is treated as a first-class citizen of the platform rather than a bolt-on: every module gains AI-assisted capabilities, and five headline AI products are specified in detail — AI Mock Interviews, AI Test Series (built from previous years' exam papers), AI Study Plans, AI Resume Builder/Optimizer, and AI ATS (resume screening & candidate–job matching).
1.1 Key Business Goals
●	Consolidate learning, mentorship, jobs, exam prep, corporate hiring, and community into one authenticated, role-based platform.
●	Increase learner-to-hire conversion by embedding AI-guided personalization (study plans, resume optimization, interview practice) throughout the learner journey.
●	Give corporate and college partners a self-service portal with AI-assisted candidate screening (ATS) to reduce time-to-hire.
●	Enable data-driven decision-making for the Admin team via unified dashboards, analytics, and reporting.
●	Build the platform on an API-first architecture so that the same backend can serve web, and future mobile apps.
2. Project Background & Objectives
2.1 Background
Offcampuscareer currently operates six branded modules under one umbrella (OCC TIP, OCC Mentor, OCC Jobs, OCC Exams, OCC Corporate, OCC Community) and four secure portals (Student, Admin, Corporate, Mentor). The existing implementation demonstrates the intended information architecture, workflows, and UI/UX patterns (course catalogues, job boards, mentor booking, exam resource hub, corporate hiring tools, community forum, checkout/payment flow, and admin CMS/analytics). This BRD formalizes those workflows into structured requirements and extends them with production-grade backend, database, API, security and AI capabilities.
2.2 Business Objectives
#	Objective	Success Indicator
1	Unify all modules under one account/identity system (SSO across Student, Mentor, Corporate, Admin)	Single sign-on adoption; reduction in duplicate accounts
2	Digitize and automate the TIP (Training-Internship-Placement) lifecycle end-to-end	% of students completing full TIP journey to placement
3	Enable AI-assisted learning, interview prep and job matching	AI feature adoption rate; improvement in interview/placement success
4	Provide corporates with self-service hiring & AI-powered ATS	Reduction in average time-to-shortlist
5	Scale exam-prep vertical (JEE/NEET/UPSC/GATE/CAT/SSC) with AI test series from PYQs	Mock test attempts per user; score improvement trend
6	Improve platform reliability, security and auditability for production use	Uptime SLA, security audit pass rate
3. Scope
3.1 In Scope
●	Public marketing website: Home, About, Contact, Placement, Careers/Jobs listing, Corporate landing, Community, Exams hub, Training/course catalogue, Mentor directory, Checkout.
●	Authentication & Authorization for four roles: Student, Mentor, Corporate (Employer), Admin — with role-based access control (RBAC).
●	Student Portal: dashboard, enrolled courses & progress, job applications, mentorship sessions, exam prep, community feed, certificates, profile.
●	Admin Portal: dashboard/analytics, student management, course/curriculum management, class scheduling, assignments & grading, payments, job postings, contact-message inbox.
●	Corporate Portal: dashboard, job posting & management, ATS/applicant pipeline, campus drive scheduling, partner-college directory, company profile.
●	Mentor Portal: dashboard, course authoring & publishing, 1:1 session management, student roster, earnings & payouts, reviews, public profile.
●	Checkout & Payments: course selection, student details capture, multi-method payment (UPI/Card/Net-Banking), discount codes, receipts, enrollment provisioning.
●	Notifications: in-app, email, and (optionally) WhatsApp/SMS for classes, applications, payments, bookings.
●	AI Modules embedded across the platform: AI Mock Interview, AI Test Series (PYQ-based), AI Study Plan Generator, AI Resume Builder, AI ATS/resume screening, AI Chat/Doubt-Assistant, AI content recommendations.
●	Reporting & analytics dashboards for Admin and Corporate users.
●	REST/GraphQL API layer, relational database, caching layer, file/media storage, background job processing.
3.2 Out of Scope (Phase 1)
●	Native mobile applications (iOS/Android) — API will be built mobile-ready but native app development is a subsequent phase.
●	Multi-language/vernacular UI localization (English/Hindi mix retained as-is; full i18n framework recommended for future phase).
●	Payroll/HRMS functionality for corporate partners beyond hiring workflow.
●	Physical/offline classroom hardware integration (biometric attendance, etc.).
●	Blockchain-based certificate verification (may be evaluated in a later phase).
 
4. Stakeholders
Stakeholder	Role	Interest
SHAMIIT LLP Leadership	Sponsor / Business Owner	Overall ROI, brand positioning, revenue growth
Students / Aspirants	End User	Learning outcomes, job placement, exam success
Mentors	Content/Service Provider	Course monetization, session bookings, reputation
Corporate Partners	Hiring Client	Quality talent pipeline, fast & low-cost hiring
Partner Colleges	Institutional Client	Placement rate, training access for students
Admin / Ops Team	Internal User	Operational control, reporting, content management
Product & Engineering Team	Build Team	Clear, testable requirements and architecture
AI/ML Team	Build Team	Data availability, model requirements, evaluation criteria
5. User Roles & Personas
Role	Description & Primary Needs
Guest / Visitor	Unauthenticated user browsing public pages (Home, About, Training catalogue, Jobs, Exams, Corporate, Community, Contact). Needs fast content discovery and low-friction sign-up/checkout.
Student	Registered learner. Enrolls in courses, tracks progress, applies to jobs, books mentor sessions, uses exam-prep resources, participates in community, uses AI Resume/Interview/Study-Plan tools.
Mentor	Verified individual (industry professional, IITian, IAS officer, topper, etc.) who authors/publishes courses, hosts 1:1 sessions, and earns revenue share.
Corporate / Employer	Company or organization representative who posts jobs, screens applicants via ATS, and schedules campus drives with partner colleges.
College / University Partner	Institution collaborating for training, placement drives and mentorship access (managed primarily via Admin/Corporate portal records).
Admin / Super Admin	Internal operations user managing students, courses, classes, assignments, payments, jobs, contacts, and platform-wide configuration and analytics.
6. Business Requirements by Module
Each module below documents its purpose, primary user journeys, and business requirements observed from the current platform design, to be re-implemented on the new architecture (Section 10 onward) with AI enhancements layered in per Section 7.
6.1 Public Marketing Website
Pages: Home, About Us, Contact, Placement, Careers (Jobs listing preview), Corporate landing, Community landing, Exams hub, Training catalogue, Mentor directory, Checkout.
●	Responsive, theme-able (dark/light) marketing site with SEO metadata (title, description, OG tags) on every page.
●	Home page must present platform statistics (learners, mentors, hiring partners, placement rate), the six-module showcase, featured courses, featured mentors, featured jobs, testimonials, and partner-company ticker.
●	About page must present mission/vision, company values, leadership team, and a company timeline/milestones.
●	Contact page must include a validated lead-capture form (name, email, phone, subject, message) that persists to a Contacts/Leads table and triggers an admin notification, plus an FAQ accordion and embedded map.
●	Placement page must show placement statistics, dual value-proposition tracks (Colleges / Companies), process steps for each, and success-story cards.
●	All lead-capture and enrollment CTAs must route to Checkout or role-appropriate login/registration flows.
6.2 OCC TIP — Training, Internship & Placement
Core learning module offering structured courses (Job Bootcamp, AI Training, Web Development, Guaranteed Job Program, etc.).
●	Course catalogue with filter by category (Career, AI/ML, Web Dev, etc.), level, and price; search and comparison table for flagship programs.
●	Course detail view: curriculum/module list, instructor, rating, enrolled count, price, and an 'Enroll' CTA to Checkout.
●	Enrollment automatically provisions a Student record (if new) and an Enrollment record with progress tracking against course modules.
●	Guaranteed Job Program requires a distinct refund-policy workflow (100% refund if not placed within 3 months of completion, subject to attendance/assignment criteria) tracked administratively.
●	Live + recorded class delivery: scheduled classes with date/time/instructor/meeting-link, visible to enrolled students and manageable by Admin/Mentor.
●	Assignments: creation by Admin/Mentor per course, submission by students, grading workflow, and visibility of grade/feedback to student.
●	Certificate issuance automatically triggered at 100% module completion; verifiable certificate with unique code, learner name, course, date, and signatory.
6.3 OCC Mentor
Marketplace connecting learners with verified mentors for 1:1 sessions and mentor-authored courses.
●	Mentor directory with search, domain filter, and price filter; mentor card shows rating, sessions completed, students taught, response time, and price/session.
●	Session booking flow captures learner name, email, topic/goal, and preferred time slot, and creates a bookable session request routed to the mentor.
●	Any user can apply to become a Mentor via an application/eligibility flow; approved mentors receive portal access (Section 6.11).
●	Mentor profile page (public) with bio, specialties, LinkedIn, and shareable booking link.
6.4 OCC Jobs
Job board for internships, full-time roles, and freelance gigs sourced from Corporate partners and Admin.
●	Job search & filter by keyword, location, type (Job/Internship/Freelance), domain, work mode, experience level; sort by recency or salary.
●	Job detail view with description, required skills, perks, selection process steps, company info, and live applicant count.
●	Application flow captures name, email, phone, college/organization, resume link, and cover letter; supports both logged-in students (pre-filled) and guest applicants.
●	Every application is automatically scored by the AI ATS engine (Section 7.5) and a match/fit score plus explanation is attached to the application record.
●	Application status pipeline: Under Review → Shortlisted → Interview → Offered/Rejected, visible to both student (My Applications) and employer (ATS pipeline).
6.5 OCC Exams
Free and premium competitive-exam preparation hub covering JEE, NEET, UPSC, GATE, CAT, SSC and similar exams.
●	Exam category catalogue with description, difficulty, subjects/syllabus, conducting body, frequency, seats, aspirant count, and linked mentors.
●	Free resource library: study notes, video lectures, mock tests, and study plans — all accessible without login for basic tier, gated for premium tier.
●	Exam detail view aggregates syllabus, key stats, resources, and recommended mentors for that exam.
●	Success-story/testimonial carousel segmented by exam.
●	This module is the primary consumer of the AI Test Series (Section 7.2) and AI Study Plan (Section 7.3) engines.
6.6 OCC Corporate
B2B module for companies and colleges/universities to partner with the platform.
●	Company-facing value proposition: free job posting, talent search, campus drives, AI-powered ATS, hiring analytics, and custom training co-creation.
●	College-facing value proposition: on-campus training subsidy, exclusive job fairs, placement coordination, and mentorship access.
●	Partnership request form (organization name/type, contact person, designation, email, phone, interest checkboxes, message) persisted as a lead and routed to Admin/Sales follow-up.
●	Partner-college directory display (name, type, location, collaboration type, partner-since date) and hiring-partner directory (company, industry, active jobs, students placed).
●	'Post a Job' quick-action available to authenticated corporate users, feeding directly into OCC Jobs.
6.7 OCC Community
Peer discussion forum for students and aspirants.
●	Categorized posts: Success Story, Study Help, Question, Resource, Career Advice; category sidebar filter and free-text search.
●	Post creation form (author, category, title, content, tags) with moderation-ready status field for Admin review if required.
●	Engagement actions: like, comment count, view count; pinned-posts support for featured/admin-highlighted content.
●	Study Groups directory with member counts and a join action (join workflow to be fully implemented in backend, e.g., a group-membership table).
●	Sort by Most Recent / Most Liked / Most Viewed.
6.8 Student Portal
Authenticated dashboard for enrolled learners.
●	Overview: welcome banner, KPIs (courses enrolled, jobs applied, certificates earned, average course progress), upcoming classes, job recommendations, notification center.
●	My Courses: enrolled course cards with progress bar, completed/total modules, assignment submission counts, and a course-player experience (video/module list with completion checkboxes) that drives progress % and auto-issues certificates at 100%.
●	Jobs & Applications: applied-jobs tracker with live pipeline status, and personalized job recommendations.
●	Mentorship: booked-session tracker (mentor, topic, date/time, status, join link) and featured-mentor discovery.
●	Exam Prep: quick access to exam categories, AI Test Series, and AI Study Plans relevant to the student's chosen goal exam(s).
●	Community: preview feed with deep link into full Community module.
●	Certificates: gallery of earned/verifiable certificates with a shareable/downloadable (PDF) certificate view.
●	Profile: editable personal info (name, phone, college, year, stream) with a profile-completeness indicator, plus dedicated entry points to AI Resume Builder and AI ATS score checker.
●	Notification center: bell icon with unread badge, categorized by type (class, job, community, payment), mark-as-read support.
6.9 Admin Portal
Internal operations console with authenticated login.
●	Dashboard: KPI tiles (total students, active courses, total revenue, placement rate), monthly enrollment trend chart, quick actions, and recent-enrollments table.
●	Students: searchable/paginated table (name, email, college, year, enrolled-course count) with add/edit/delete and drill-down.
●	Courses: CRUD for courses (title, category, duration, level, price, instructor, description), publish/unpublish toggle, enrollment counts.
●	Classes: scheduling CRUD (course, title, date, time, instructor, meeting link) with attendee counts.
●	Assignments: CRUD (course, title, due date, description) plus submissions review/grading table per assignment.
●	Payments: KPI summary (total revenue, transaction count, completed count) and a full transaction ledger (receipt no., student, course, amount, method, date, status).
●	Jobs: CRUD for job postings plus an applications table per job including AI ATS match score and AI-generated match explanation.
●	Contacts: inbox of all contact-form/partnership leads with read/unread state.
●	Role-based access: Super Admin vs. limited Admin (future-ready; Phase 1 may implement a single Admin role with audit logging).
6.10 Corporate Portal
Authenticated dashboard for hiring/employer partners.
●	Dashboard: KPIs (active jobs, total applicants, campus drives scheduled, average AI match rate), recent job openings, and a quick-ATS-screening preview.
●	Job Openings: CRUD for job postings scoped to the logged-in company; per-job applicant counts and status.
●	ATS Applicants: full pipeline table (candidate, applied job, AI match score, status, applied date) with one-click actions to Shortlist / Interview / Reject.
●	Campus Drives: request/schedule drives against partner colleges (target college, date, target branches) with an approval-status workflow.
●	Partner Colleges: browsable directory of available colleges with placement-rate context and a 'Request Drive' action.
●	Company Profile: editable company name, industry, website, description, logo/branding, verification-status display.
6.11 Mentor Portal
Authenticated dashboard for mentors to manage teaching and earnings.
●	Dashboard: KPIs (total students, active courses, total earnings, average rating), upcoming sessions, and course-performance snapshot.
●	My Courses: CRUD for mentor-authored courses (title, category, duration, level, price, description, modules, tags) with per-course performance (enrolled, rating, earnings).
●	Sessions: full list of scheduled 1:1 sessions with join/start action and attendee counts.
●	My Students: roster of students enrolled in the mentor's courses with per-student progress.
●	Earnings: total/monthly earnings, pending payout, and a detailed breakdown table (receipt, student, course, amount, 80% mentor share, date) — revenue-share model configurable by Admin.
●	Create Course: guided course-authoring form with modules-as-lines input and a live earnings calculator (price × 100 hypothetical enrollments × mentor share).
●	Reviews: aggregate rating display and (future) individual review feed.
●	Profile: bio, title, session price, LinkedIn, public shareable profile link/slug.
6.12 Checkout & Payments
Three-step enrollment funnel: Course Selection → Student Details → Payment.
●	Step 1: course selection grid (or deep-linked via courseId query parameter) sourced live from the course catalogue.
●	Step 2: student detail capture (name, email, phone, college, year) with client + server-side validation.
●	Step 3: payment method tabs — UPI (QR + UPI ID), Card (number/expiry/CVV — tokenized via PCI-compliant gateway, never stored raw), Net Banking (bank selection).
●	Order summary panel: course fee, discount-code application (validated server-side against an active promotions table), GST computation (18%), and total.
●	On successful payment: create/reuse Student record, create Enrollment record, create Payment/Receipt record, send confirmation email/SMS, and redirect to a Success view with a downloadable receipt.
●	All payment processing must occur through a licensed payment gateway (e.g., Razorpay/PayU/Stripe-India equivalent) — no raw card data touches the application backend.
 
7. AI Capabilities (Cross-Cutting Requirements)
AI is a core differentiator of the rebuilt platform and must be designed as a dedicated services layer (Section 11.4) consumed by every module, rather than isolated features. This section defines business and functional requirements for five headline AI products plus supporting AI utilities. Each sub-section specifies purpose, inputs/outputs, workflow, and acceptance criteria; underlying model/infrastructure choices are addressed in Section 11.
7.1 AI Mock Interview Engine
Available in: Student Portal (Career Development), OCC TIP (Interview Prep module), OCC Exams (viva/interview-based exams where relevant).
Purpose
Provide unlimited, on-demand, realistic mock interview practice (HR and Technical) with instant AI feedback, replacing/augmenting human mock-interview capacity.
Functional Requirements
●	Student selects interview type: HR / Behavioral, Technical (by domain: Web Dev, AI/ML, Data Science, Core CS, etc.), or Company-Specific (using a curated question bank per target company, where available).
●	System generates a dynamic question set (mix of curated bank + LLM-generated questions tailored to the student's resume/target role) and conducts the session via text or voice (speech-to-text) input.
●	Real-time or end-of-session AI evaluation covering: content relevance, structure (e.g., STAR method for behavioral answers), technical correctness (for technical questions), confidence/tone (if voice), clarity, and filler-word/pace analysis (voice mode).
●	Each session produces a scorecard (numeric score per dimension + overall), a transcript, and specific improvement suggestions with example 'better answer' snippets.
●	Session history stored per student with trend charts across multiple attempts (progress over time).
●	Support company-specific and role-specific practice packs (e.g., 'TCS Digital HR Round', 'SDE-1 DSA Round') as a monetizable premium tier.
●	Available 24/7 with no scheduling dependency, unlike human mentor sessions.
Data & Integration
●	Inputs: student profile, resume (parsed), target role/company, chosen interview type, live responses (text/audio).
●	Outputs: JSON scorecard, transcript, audio recording (optional, with consent), suggested resources/course links.
●	Integrates with AI Resume Builder (Section 7.4) to tailor technical questions to listed skills/projects, and with AI Study Plan (Section 7.3) to schedule practice sessions.
7.2 AI Test Series (Previous-Year-Paper Based)
Available in: OCC Exams (primary), OCC TIP (course-level quizzes/assessments), Student Portal (Exam Prep tab).
Purpose
Generate high-quality, exam-pattern-accurate mock tests derived from a corpus of previous years' question papers (PYQs), with adaptive difficulty and instant, explained scoring.
Functional Requirements
●	Admin/content pipeline to ingest and tag a PYQ corpus (per exam: JEE, NEET, UPSC, GATE, CAT, SSC, etc.) by year, subject, topic, difficulty, and question type.
●	AI generation engine produces full-length or topic-wise mock tests that statistically mirror the real exam's pattern (section weightage, marking scheme, negative marking, time limits) using retrieved PYQs plus AI-generated variations of similar difficulty and style to avoid pure repetition and to expand the effective question bank.
●	Adaptive mode: question difficulty adjusts in real time based on the student's running performance (computerized adaptive testing) for a personalized challenge level.
●	Auto-scoring with instant results: score, percentile estimate (vs. historical/synthetic distribution), sectional break-down, and time-per-question analytics.
●	AI-generated step-by-step explanations for every question (including for AI-generated variants), with the ability to ask a follow-up doubt via the AI Chat Assistant (Section 7.6).
●	Performance analytics dashboard: strength/weakness heatmap by topic, accuracy vs. speed trade-off, comparison to peer cohort and to previous own attempts.
●	Bookmark/flag questions for revision; auto-generated 'weak topics' revision test.
●	Full previous-year paper mode (unmodified, for authentic practice) as a distinct option from AI-augmented mode.
Data & Integration
●	Inputs: PYQ corpus (structured question bank), student's exam goal & syllabus coverage, past attempt history.
●	Outputs: test paper (JSON), scored result object, analytics payload, recommended next topics — feeds directly into AI Study Plan (7.3).
●	Requires a licensed/legally-sourced PYQ dataset or partnership; content ingestion pipeline must support OCR + tagging for scanned papers.
7.3 AI Study Plan Generator
Available in: OCC Exams, OCC TIP, Student Portal (Overview & Exam Prep).
Purpose
Produce a personalized, adaptive day-by-day/week-by-week study schedule that adjusts based on the learner's goal, available time, current level, and ongoing performance.
Functional Requirements
●	Onboarding questionnaire: target exam/course/job-role goal, target date, daily/weekly available study hours, current proficiency (self-assessed or via a diagnostic AI Test Series attempt), preferred learning style/pace.
●	Engine outputs a structured plan (12-month / 6-month / 3-month / custom) broken into weekly milestones, daily tasks (topics to study, resources/videos/notes to consume, and an AI Test Series checkpoint), each mapped to platform content (courses, exam resources, mock tests).
●	Plan dynamically re-balances when the learner falls behind, gets ahead, or under/over-performs on checkpoint tests (adaptive re-planning, not a static calendar).
●	Daily reminders/notifications (in-app, email, optionally WhatsApp) for the day's tasks; streak tracking and gamified progress indicators.
●	Progress dashboard: plan adherence %, topic-coverage %, and projected readiness score for the target exam/date.
●	Manual override: learner can reschedule/skip tasks; system re-optimizes remaining plan accordingly.
Data & Integration
●	Inputs: onboarding profile, syllabus/curriculum data per exam or course, AI Test Series results, course-progress data.
●	Outputs: structured plan object (tasks with dates, type, content reference, status) surfaced on Student dashboard and via notifications.
7.4 AI Resume Builder & Optimizer
Available in: Student Portal (Profile / Career Tools), OCC TIP (Career Development module — Resume Writing, ATS Resume).
Purpose
Help students create, and continuously improve, an ATS-friendly, recruiter-ready resume, and optionally optimize it against a specific job description.
Functional Requirements
●	Guided resume builder: structured form (contact info, summary, education, skills, projects, experience, certifications) with AI-assisted content generation — e.g., converting a rough project description into a polished, quantified bullet point.
●	Resume import: parse an uploaded existing resume (PDF/DOCX) into structured fields using AI/NLP extraction for quick editing rather than starting from scratch.
●	Multiple ATS-safe templates (single-column, standard fonts, parseable structure); live preview and PDF export.
●	AI ATS Score (see also 7.5): real-time score (0–100) reflecting keyword match, formatting compatibility, section completeness, and action-verb/quantification usage, with a prioritized improvement checklist.
●	Job-Description Match Mode: paste/select a target job description; AI highlights missing keywords/skills and suggests specific resume edits to increase match score for that role.
●	LinkedIn optimization companion: AI suggestions for headline, summary and keyword usage aligned with the resume.
●	Version history: students can maintain multiple tailored resume versions (e.g., per job application) linked to specific job applications in OCC Jobs.
Data & Integration
●	Inputs: structured resume fields or uploaded file, optional target job description.
●	Outputs: structured resume JSON, rendered PDF, ATS score + explanation — the resume/score is attachable directly to job applications (7.5) and referenced by the AI Mock Interview engine (7.1).
7.5 AI ATS (Applicant Tracking & Screening)
Available in: OCC Jobs (application submission), Corporate Portal (ATS Applicants), Admin Portal (Jobs → Applications).
Purpose
Automatically screen, score, and rank candidates against a job's requirements to reduce recruiter/employer manual effort and surface the best-fit applicants first.
Functional Requirements
●	On every job application submission, the AI ATS engine parses the candidate's resume (uploaded file or platform-generated resume) and computes a Match Score (%) against the job's title, description, required skills, and experience level.
●	System generates a human-readable Match Explanation (e.g., 'Strong match on React, Node.js; missing AWS experience; 1.5 years relevant experience vs. 2 years required') stored alongside the application.
●	Corporate/Admin ATS pipeline view is sortable/filterable by match score band (e.g., 80%+, 50–79%, <50%) with color-coded badges.
●	Bulk-screening: for a given job, corporate users can request AI to auto-shortlist the top N candidates or all candidates above a configurable score threshold.
●	Bias/fairness guardrails: scoring must be based on job-relevant skills/experience/education signals only; the model must not use protected attributes (gender, name-implied ethnicity/religion, age, marital status, photo) as scoring features, and resumes should be pre-processed to redact such fields before scoring where feasible.
●	Recruiters can override AI status/ranking at any time; every override is logged for model-quality feedback and audit.
●	Duplicate/spam application detection (same candidate applying repeatedly, resume-content plagiarism heuristics).
Data & Integration
●	Inputs: job posting (title, description, required skills, experience, domain), candidate resume (parsed structured data or raw file), optional cover letter.
●	Outputs: match_score (0–100), match_explanation (text), extracted_skills[], flags[] (e.g., missing_requirement, overqualified) — persisted on the Application entity (Section 12).
7.6 Supporting AI Utilities
7.6.1 AI Chat / Doubt-Solving Assistant
●	Platform-wide chat widget for course-content doubts, exam-question explanations, and general navigation help; retrieval-augmented over the platform's own course/exam content plus general knowledge.
●	Escalation path to a human mentor/support agent when the AI cannot resolve a query confidently.
7.6.2 AI Content & Job Recommendations
●	Personalized course, mentor, exam-resource, and job recommendations on the Student dashboard and Home page, based on profile, activity, and stated goals.
●	'Similar candidates who got placed' guidance to suggest missing skills/courses.
7.6.3 AI Community & Content Moderation
●	Automated moderation of community posts/comments for spam, abuse, and policy violations prior to or immediately after publishing, with human-review queue for flagged content.
7.6.4 AI Analytics for Admin/Corporate
●	Natural-language query support over admin/corporate analytics (e.g., 'show me placement rate by course this quarter') translated to underlying report queries.

7.7 AI Feature Summary Matrix
AI Feature	Primary Module(s)	User Role(s)	Monetization
AI Mock Interview	TIP, Student Portal	Student	Freemium — limited free sessions, premium packs
AI Test Series (PYQ)	Exams, TIP	Student	Freemium — basic free, full-length premium
AI Study Plan	Exams, TIP, Student Portal	Student	Included with paid course/exam plan
AI Resume Builder	Student Portal, TIP	Student	Freemium — basic free, premium templates/JD-match
AI ATS	Jobs, Corporate Portal, Admin	Corporate, Admin	Included in corporate subscription/plan
AI Chat Assistant	All modules	Student, Guest	Included platform-wide
AI Recommendations	Home, Student Portal	Student	Included platform-wide
AI Moderation	Community	Admin (background)	Internal / operational
 
8. Consolidated Functional Requirements (Traceability Table)
The following IDs are referenced by QA test plans and sprint tickets. Priority: M = Must-have (Phase 1), S = Should-have (Phase 1/2), C = Could-have (Phase 2+).
8.1 Authentication & Account Management
ID	Requirement	Module	Priority
FR-001	Users can register/login as Student via email+password; email verification required before first course access	Auth	M
FR-002	Corporate, Mentor, and Admin logins are role-specific with separate login entry points and dashboards	Auth	M
FR-003	Password reset via secure emailed link with expiring token	Auth	M
FR-004	Session management with JWT access + refresh tokens; auto-logout on token expiry	Auth	M
FR-005	Social login (Google) for Students as an alternative to email/password	Auth	S
FR-006	Admin can create/deactivate any user account and view login audit trail	Auth	M
8.2 Courses & Learning (OCC TIP)
ID	Requirement	Module	Priority
FR-010	Browse/filter/search published courses by category, level, price	TIP	M
FR-011	View course detail with modules, instructor, rating, price	TIP	M
FR-012	Enroll in a course via Checkout; enrollment record created on payment success	TIP	M
FR-013	Track per-module completion; auto-calculate progress %	TIP	M
FR-014	Auto-issue certificate at 100% completion with unique verification code	TIP	M
FR-015	Admin/Mentor can schedule classes with meeting links; students see upcoming classes	TIP	M
FR-016	Admin/Mentor can create assignments; students submit; graders can score & comment	TIP	M
FR-017	Guaranteed Job Program tracks placement-within-90-days SLA and triggers refund workflow if breached	TIP	S
8.3 Jobs (OCC Jobs)
ID	Requirement	Module	Priority
FR-020	Search/filter jobs by keyword, location, type, domain, mode, experience	Jobs	M
FR-021	View job detail with description, skills, perks, process steps	Jobs	M
FR-022	Apply to a job (logged-in prefilled or guest) with resume link/upload and cover letter	Jobs	M
FR-023	Every application auto-scored by AI ATS with match score + explanation stored	Jobs / AI	M
FR-024	Student can track application status changes in their dashboard	Jobs	M
FR-025	Corporate/Admin can post, edit, close job listings	Jobs	M
8.4 Mentorship (OCC Mentor)
ID	Requirement	Module	Priority
FR-030	Browse/search/filter mentors by domain and price	Mentor	M
FR-031	Book a 1:1 session with a mentor (name, email, topic, time slot)	Mentor	M
FR-032	Mentor receives and manages session requests (accept/reschedule) from Mentor Portal	Mentor	M
FR-033	Any user can submit a Mentor application; Admin approves/rejects	Mentor	M
FR-034	Mentor can author, price, and publish courses from Mentor Portal	Mentor	M
8.5 Exams (OCC Exams)
ID	Requirement	Module	Priority
FR-040	Browse exam categories with syllabus, stats, and resources	Exams	M
FR-041	Access free study notes/videos without login; premium content gated	Exams	M
FR-042	Generate and attempt an AI Test Series paper (full-length or topic-wise)	Exams / AI	M
FR-043	View instant scored results with sectional analytics and explanations	Exams / AI	M
FR-044	Generate a personalized AI Study Plan for a chosen exam and target date	Exams / AI	M
8.6 Corporate & Community
ID	Requirement	Module	Priority
FR-050	Submit partnership request (company/college) via form; lead routed to Admin	Corporate	M
FR-051	Corporate can post jobs and manage ATS pipeline from Corporate Portal	Corporate / AI	M
FR-052	Corporate can request/schedule campus drives against partner colleges	Corporate	S
FR-053	Create, view, like, and comment on Community posts by category	Community	M
FR-054	AI moderation flags posts violating content policy prior to publish	Community / AI	S
8.7 AI Feature Requirements
ID	Requirement	Module	Priority
FR-060	Student can start an AI Mock Interview session (HR/Technical/Company-specific) and receive a scorecard + transcript	AI	M
FR-061	System tracks AI Mock Interview score trend across sessions	AI	S
FR-062	Student can build/import a resume and receive an AI ATS Score with improvement checklist	AI	M
FR-063	Student can match resume against a specific job description for tailored suggestions	AI	S
FR-064	Corporate can view AI match score & explanation for every applicant, sortable/filterable	AI	M
FR-065	Corporate can bulk-shortlist applicants above a score threshold	AI	S
FR-066	AI Study Plan re-adjusts automatically based on test performance and adherence	AI	S
FR-067	AI Test Series supports adaptive difficulty mode	AI	S
FR-068	Platform-wide AI chat assistant answers content doubts with escalation to human support	AI	C
8.8 Payments & Admin
ID	Requirement	Module	Priority
FR-070	3-step checkout (course → details → payment) with UPI/Card/Net-Banking	Checkout	M
FR-071	Apply and validate discount codes server-side; compute GST and total	Checkout	M
FR-072	Generate receipt and confirmation on successful payment	Checkout	M
FR-073	Admin dashboard shows revenue, enrollment trend, and placement-rate KPIs	Admin	M
FR-074	Admin can manage students, courses, classes, assignments, jobs, and contacts (CRUD)	Admin	M
 
9. Non-Functional Requirements
9.1 Performance
●	Page load (LCP) under 2.5s on 4G for public pages; API p95 response time under 400ms for standard CRUD endpoints.
●	AI endpoints (mock interview evaluation, ATS scoring, test generation) must return within 3–8 seconds; long-running generation (e.g., full-length adaptive test creation) may be handled asynchronously with a job-status/polling or websocket pattern.
●	Support at least 10,000 concurrent users at launch, horizontally scalable to 100,000+.
9.2 Availability & Reliability
●	Target uptime SLA: 99.9% for core platform; 99.5% acceptable for AI services during initial phase with graceful degradation (e.g., fallback to cached/template feedback if AI service is unavailable).
●	Automated daily database backups with point-in-time recovery; disaster-recovery RTO ≤ 4 hours, RPO ≤ 1 hour.
9.3 Security & Privacy
●	All traffic over HTTPS/TLS 1.2+; secrets managed via a vault/secret manager, never committed to source.
●	Password hashing via bcrypt/argon2; JWT with short-lived access tokens and rotated refresh tokens.
●	Role-Based Access Control (RBAC) enforced at API layer for every endpoint, not just UI.
●	PCI-DSS compliant payment gateway integration; no raw card data stored on platform servers.
●	Personal data (resumes, contact info) encrypted at rest; compliance with India's Digital Personal Data Protection (DPDP) Act — explicit consent for data usage, right-to-erasure support.
●	AI ATS models must exclude protected/sensitive attributes from scoring features (see Section 7.5 fairness guardrails); periodic bias audits of match-score outputs.
●	Rate limiting and WAF/bot protection on public forms (contact, application, registration) to prevent abuse/spam.
9.4 Scalability & Maintainability
●	Microservice or modular-monolith backend separating core domain services (User, Course, Job, Payment) from the AI services layer so AI models can be scaled/updated independently.
●	Infrastructure as Code (Terraform/CloudFormation) for reproducible environments (Dev/Staging/Prod).
●	CI/CD pipeline with automated tests, linting, and staged deployments.
9.5 Usability & Accessibility
●	WCAG 2.1 AA compliance target for public pages (contrast, keyboard navigation, aria labels, alt text).
●	Fully responsive across mobile, tablet, and desktop breakpoints; dark/light theme toggle retained.
●	Consistent design system/component library across all portals and public pages.
9.6 Auditability & Compliance
●	Full audit log of admin actions (create/update/delete on students, courses, payments) with actor, timestamp, and before/after diff.
●	Every AI-generated decision affecting a person (ATS score, interview scorecard) must be explainable and human-overridable, with the override logged.
 
10. System Architecture Overview
The platform will be built as an API-first, layered architecture so the same backend serves the public website, four portals, and (in future) native mobile apps.
10.1 Logical Layers
●	Presentation Layer: Web frontend (public site + 4 portals) consuming REST/GraphQL APIs; Server-Side Rendering (SSR) for public/SEO-critical pages, Client-Side Rendering (SPA) for authenticated portals.
●	API Gateway Layer: Single entry point handling authentication, rate limiting, request routing, and API versioning.
●	Application/Domain Services Layer: Modular services — Identity & Access, Course/LMS, Jobs, Mentorship, Exams, Community, Corporate, Payments, Notifications, Admin/Reporting.
●	AI Services Layer: Dedicated microservices for AI Mock Interview, AI Test Series Generation, AI Study Plan, AI Resume Builder, AI ATS Scoring, AI Chat, and AI Moderation/Recommendations — each exposing internal APIs consumed by the Application layer, orchestrated via an LLM/ML gateway (Section 11.4).
●	Data Layer: Primary relational database (transactional data), object storage (resumes, certificates, videos, media), search index (job/course/mentor search), cache (sessions, hot reads), vector store (for AI retrieval-augmented features).
●	Infrastructure Layer: Cloud hosting, containers/orchestration, CI/CD, monitoring/logging, secrets management.
10.2 Key Architectural Principles
●	API-first: every UI capability is backed by a versioned, documented API; no business logic embedded only in the frontend.
●	Asynchronous processing for long-running or AI-heavy tasks (test generation, bulk ATS scoring, certificate rendering) via a message queue/worker pattern.
●	Event-driven integration between domain services for cross-cutting workflows (e.g., 'PaymentSucceeded' event triggers Enrollment creation, Notification dispatch, and Analytics update).
●	AI services are stateless and horizontally scalable; all AI outputs are persisted to the primary database for auditability, not solely regenerated on demand.
●	Multi-tenant-ready data model to allow future white-labeling for college/corporate partners if required.
11. Recommended Technology Stack
These are recommended defaults; final selection to be confirmed with Engineering leadership based on team expertise and cost constraints.
11.1 Frontend
Layer	Recommendation
Framework	React (Next.js) for SSR/SEO on public pages; React SPA for portals — single codebase, shared component library
Styling/Design System	Tailwind CSS + a shared component library (design tokens for theme/dark-mode support)
State Management	React Query/TanStack Query for server state; Zustand/Redux Toolkit for local/UI state
Forms & Validation	React Hook Form + Zod/Yup schema validation (mirrored on backend)
Charts/Analytics UI	Recharts / Chart.js for KPI dashboards
11.2 Backend
Layer	Recommendation
Runtime/Framework	Node.js (NestJS) or Python (FastAPI/Django) for core services — NestJS recommended for TypeScript parity with frontend
API Style	REST (OpenAPI/Swagger documented); GraphQL optional for portal dashboards with complex nested queries
Auth	JWT (access + refresh) via an Identity service; OAuth2 for social login
Background Jobs	BullMQ (Redis-backed) or Celery for async/queued tasks (emails, AI generation, certificate PDFs)
File/Media Storage	S3-compatible object storage (resumes, videos, certificates, course assets) with CDN in front
11.3 Database
Layer	Recommendation
Primary Database	PostgreSQL (relational, ACID-compliant) for all transactional/core data
Cache	Redis for session storage, rate limiting, hot-read caching (course catalogue, job listings)
Search	Elasticsearch/OpenSearch or Postgres full-text search for job/course/mentor search & filters
Vector Store	pgvector (Postgres extension) or a dedicated vector DB (e.g., Pinecone/Weaviate) for AI retrieval (chat assistant, resume/job matching embeddings)
Analytics/Warehouse	A read-replica or ETL pipeline into a warehouse (e.g., BigQuery/Redshift) for heavy admin reporting, decoupled from the transactional DB
11.4 AI/ML Layer
Component	Recommendation
LLM Gateway	Unified internal gateway to one or more LLM providers (e.g., Claude/GPT-class models) for generation, evaluation, and explanation tasks, with prompt templates versioned in source control
Resume/Doc Parsing	OCR + NLP pipeline (e.g., layout-aware parsing) to extract structured fields from uploaded PDFs/DOCX resumes
Embeddings/Matching	Embedding model for resume↔job semantic matching, feeding the AI ATS score alongside rule-based skill/experience matching
Speech (Mock Interview voice mode)	Speech-to-text and text-to-speech services for voice-based interview practice
PYQ Content Pipeline	Ingestion + tagging pipeline (subject/topic/year/difficulty) for the previous-year-question corpus feeding AI Test Series
Model Ops	Versioned prompts/models, evaluation harness (accuracy/consistency checks for scoring features), logging of every AI decision for audit and re-training
11.5 Infrastructure & DevOps
●	Cloud provider: AWS/GCP/Azure (any is viable; recommend AWS for mature India-region support: Mumbai/Hyderabad regions).
●	Containerization via Docker; orchestration via Kubernetes or a managed container service (ECS/GKE) for autoscaling.
●	CI/CD via GitHub Actions/GitLab CI with automated test, build, and staged (Dev → Staging → Prod) deployment gates.
●	Observability: centralized logging (ELK/CloudWatch), metrics/dashboards (Grafana/Prometheus or vendor equivalent), and error tracking (Sentry).
●	CDN (CloudFront/Cloudflare) for static assets, media, and edge caching of public pages.
 
12. Database Design — Core Entities
High-level entity list with key attributes to guide schema design (full ERD and migration scripts to be produced in the technical design phase).
12.1 Identity & Access
Entity	Key Attributes
users	id, email, phone, password_hash, role(student/mentor/corporate/admin), status, created_at, last_login_at
roles_permissions	role, permission_key, resource
auth_sessions	id, user_id, refresh_token_hash, device_info, expires_at
12.2 Learning (TIP)
Entity	Key Attributes
students	id, user_id, name, college, year, stream, profile_complete_pct, avatar, joined_at
courses	id, title, category, level, duration, price, description, instructor_id, rating, enrolled_count, published, module
course_modules	id, course_id, title, sequence, content_ref
enrollments	id, student_id, course_id, progress_pct, completed_modules[], certificate_issued, start_date
classes	id, course_id, title, date, time, instructor, meeting_link, attendees[]
assignments	id, course_id, title, due_date, description
assignment_submissions	id, assignment_id, student_id, file_url, submitted_at, grade, feedback
certificates	id, enrollment_id, verification_code, issued_at, pdf_url
12.3 Jobs & Corporate
Entity	Key Attributes
companies	id, name, industry, website, description, logo_url, partner_type, verified
jobs	id, company_id, role, type, location, mode, domain, stipend/salary, description, skills[], experience, status, deadline
applications	id, job_id, student_id (nullable for guest), name, email, phone, college, resume_url, cover_letter, status, ai_match_score, ai_match_explanation, applied_at
colleges	id, name, type, location, collaboration_type, partner_since, placement_rate
campus_drives	id, company_id, college_id, drive_date, target_branches[], status
leads_contacts	id, name, email, phone, subject, message, source(contact/partnership), read, created_at
12.4 Mentorship & Exams
Entity	Key Attributes
mentors	id, user_id, name, title, company, bio, domains[], specialties[], price, price_type, rating, verified, linkedin
mentor_sessions	id, mentor_id, student_id (nullable), name, email, topic, preferred_time, status, meeting_link, scheduled_at
exam_categories	id, name, difficulty, conducted_by, frequency, seats, syllabus[], resources[]
pyq_bank	id, exam_id, year, subject, topic, question_text, options[], correct_answer, difficulty, source
ai_test_attempts	id, student_id, exam_id, mode(full/topic/adaptive), question_ids[], responses[], score, percentile_est, generated_at
ai_study_plans	id, student_id, goal_type(exam/course/job), target_date, tasks[] (date, type, ref_id, status), created_at, last_recalculated_at
12.5 Community, Payments & AI Artifacts
Entity	Key Attributes
community_posts	id, author_id, category, title, content, tags[], likes, comments_count, views, pinned, moderation_status, posted_at
payments	id, student_id, course_id, receipt_no, amount, discount_code, method, status, gateway_txn_id, date
notifications	id, user_id, type, message, read, created_at
ai_resumes	id, student_id, structured_data(json), template, ats_score, ats_feedback(json), target_job_id(nullable), version, pdf_url, updated_at
ai_interview_sessions	id, student_id, type(hr/technical/company), target_role, transcript(json), scorecard(json), overall_score, created_at
ai_decision_audit	id, entity_type, entity_id, ai_output(json), overridden_by_user_id, override_reason, created_at
 
13. API Design — Endpoint Groups
All endpoints versioned under /api/v1. Authentication via Bearer JWT except public/read-only endpoints marked (Public).
13.1 Core Domain APIs
Group	Sample Endpoints	Notes
Auth	POST /auth/register, POST /auth/login, POST /auth/refresh, POST /auth/forgot-password	Role-aware login response
Courses	GET /courses (Public), GET /courses/:id (Public), POST /courses, PATCH /courses/:id	Write ops restricted to Admin/Mentor
Enrollments	POST /enrollments, GET /students/:id/enrollments, PATCH /enrollments/:id/progress	Progress updates trigger certificate check
Jobs	GET /jobs (Public), GET /jobs/:id (Public), POST /jobs, POST /jobs/:id/apply	apply triggers AI ATS scoring event
Applications	GET /jobs/:id/applications, PATCH /applications/:id/status	Corporate/Admin scoped
Mentors	GET /mentors (Public), POST /mentors/:id/sessions	Session booking
Exams	GET /exams (Public), GET /exams/:id (Public)	Free-tier content marked in response
Community	GET /community/posts (Public), POST /community/posts, POST /posts/:id/like	Moderation hook on create
Payments	POST /checkout/validate-discount, POST /checkout/pay, GET /payments/:id/receipt	Delegates to payment gateway SDK
Admin	GET /admin/dashboard, GET /admin/students, GET /admin/payments	Aggregation endpoints for KPIs
13.2 AI Services APIs
Group	Sample Endpoints	Notes
AI Mock Interview	POST /ai/interviews/start, POST /ai/interviews/:id/answer, GET /ai/interviews/:id/scorecard	Async scorecard generation via job queue
AI Test Series	POST /ai/tests/generate, POST /ai/tests/:id/submit, GET /ai/tests/:id/analytics	generate accepts mode: full/topic/adaptive
AI Study Plan	POST /ai/study-plans, GET /ai/study-plans/:id, POST /ai/study-plans/:id/recalculate	Recalculate triggered post test-attempt
AI Resume	POST /ai/resumes, POST /ai/resumes/:id/score, POST /ai/resumes/:id/match-job	Import endpoint accepts file upload
AI ATS	POST /ai/ats/score (internal, triggered on apply), POST /ai/ats/bulk-shortlist	bulk-shortlist scoped to Corporate/Admin
AI Chat	POST /ai/chat/query	Includes escalate_to_human flag in response
 
14. Third-Party Integrations
Category	Example Providers	Purpose
Payment Gateway	Razorpay / PayU / Cashfree	UPI, Card, Net-Banking processing; PCI-DSS compliance offloaded to gateway
Email	SendGrid / AWS SES	Transactional emails (verification, receipts, notifications)
SMS/WhatsApp	MSG91 / Twilio / WhatsApp Business API	OTP, class/interview reminders, study-plan nudges
Video Conferencing	Google Meet / Zoom API	Mentor sessions and live classes
Cloud Storage/CDN	AWS S3 + CloudFront (or GCP equivalent)	Resumes, certificates, videos, static assets
LLM / AI Provider	Claude / GPT-class model API	Mock interview evaluation, test/explanation generation, resume/ATS scoring, chat assistant
Speech Services	Cloud Speech-to-Text / Text-to-Speech	Voice-mode AI mock interviews
Analytics	Google Analytics / Mixpanel + internal BI	Product usage analytics distinct from admin business KPIs
Maps	Google Maps Embed API	Contact page location display
Error Monitoring	Sentry	Frontend & backend exception tracking
15. Assumptions & Constraints
15.1 Assumptions
●	SHAMIIT LLP will provide/license a legally usable corpus of previous-year exam papers (PYQs) for the AI Test Series feature, or authorize procurement of the same.
●	A payment gateway merchant account will be established in the SHAMIIT LLP/Offcampuscareer entity name prior to Checkout go-live.
●	Existing brand assets (logo, color palette, copy) will be reused; no full rebrand is in scope.
●	Initial AI features will use a commercial LLM API rather than a self-hosted model, to reduce time-to-market; a self-hosted/fine-tuned option can be evaluated post-launch for cost optimization.
●	Mentors and Corporate partners will be onboarded via an approval workflow rather than fully open self-signup at launch.
15.2 Constraints
●	Must comply with Indian data-protection regulation (DPDP Act) given the predominantly India-based user base.
●	AI-driven candidate screening (ATS) must remain explainable and overridable to avoid unlawful automated-decision-making concerns and to maintain recruiter trust.
●	Budget/timeline for licensing a high-quality PYQ dataset may constrain the initial breadth of exam coverage in AI Test Series (recommend phased exam rollout — JEE/NEET first, then UPSC/GATE/CAT/SSC).
●	Video/voice AI mock interview features have higher infrastructure cost (speech APIs); may be phased in after text-based mock interviews.
16. Risks & Mitigation
Risk	Impact	Mitigation
AI ATS produces biased or inaccurate scores	Legal/reputational risk, poor hiring outcomes	Bias audits, explainability, human override always available, exclude protected attributes from features
PYQ content licensing/copyright issues	Legal exposure, delayed Exams module	Secure explicit licensing or use only publicly released official papers; legal review before ingestion
LLM API cost scales faster than revenue	Margin erosion	Cache/reuse AI outputs where possible, tiered/premium gating of heavy AI features, usage quotas per user
Payment gateway or KYC delays	Checkout launch delay	Start merchant onboarding early in parallel with development
Data privacy non-compliance (DPDP Act)	Regulatory penalty	Privacy-by-design, consent capture, data retention policy, DPO review before launch
Low mentor/corporate supply at launch (marketplace cold-start)	Poor learner experience	Seed with curated mentor/company partners pre-launch; manual concierge matching initially
AI mock interview/voice latency impacting UX	User drop-off	Start with text-based mode; add voice in phase 2 with async processing and clear loading states
17. Success Metrics / KPIs
KPI	Target / Tracking Approach
Monthly Active Students	Track via product analytics; growth trend month-over-month
Course Completion Rate	Enrollments reaching 100% progress ÷ total enrollments
Placement Rate	Students placed ÷ students who completed a placement-track program
AI Feature Adoption	% of active students using ≥1 of (Mock Interview, Study Plan, Resume Builder, Test Series) monthly
AI ATS Time-to-Shortlist	Average time from job posting to first shortlist, before vs. after AI ATS
Mock Interview Score Improvement	Average score delta between a student's 1st and 3rd+ attempt
Corporate Retention	% of corporate partners posting a repeat job within 90 days
Platform Uptime	Measured against 99.9% SLA (Section 9.2)
Payment Success Rate	Successful transactions ÷ initiated checkouts
18. Project Phases & High-Level Timeline
Indicative phasing; to be refined into sprints during technical planning.
Phase	Duration (Indicative)	Scope
Phase 0	2–3 weeks	Technical design, architecture finalization, environment setup, database schema sign-off, UI/UX design system
Phase 1	8–10 weeks	Core platform: Auth, Public site, TIP (courses/enrollment/checkout), Student Portal, Admin Portal (core), Payments
Phase 2	6–8 weeks	Jobs + Corporate Portal, Mentor + Mentor Portal, Community, remaining Admin modules
Phase 3	8–10 weeks	AI Layer v1: AI Resume Builder, AI ATS, AI Study Plan (basic), AI Test Series (basic, top 2 exams)
Phase 4	6–8 weeks	AI Layer v2: AI Mock Interview (text mode), adaptive Test Series, Study Plan auto-recalculation, expand exam coverage
Phase 5	4–6 weeks	Voice-mode Mock Interview, AI Chat Assistant, Community moderation AI, analytics/BI hardening
Phase 6	Ongoing	Hardening, security audit, load testing, UAT, phased production rollout, post-launch monitoring
19. Sign-off / Approval
Name	Role	Signature	Date
	Business Owner / Sponsor		
	Product Manager		
	Engineering Lead		
	AI/ML Lead		
 
20. Appendix — Glossary
Term	Definition
ATS	Applicant Tracking System — software used to screen, score and manage job applicants.
PYQ	Previous Year Question(s) — official past exam papers used as a basis for mock test generation.
TIP	Training, Internship & Placement — Offcampuscareer's flagship learning-to-employment program.
RBAC	Role-Based Access Control — restricting system access based on a user's assigned role.
LLM	Large Language Model — the AI model class powering generation, evaluation, and chat features.
RAG	Retrieval-Augmented Generation — technique combining a knowledge base/search with an LLM for grounded answers.
JWT	JSON Web Token — a compact, signed token format used for stateless authentication.
KPI	Key Performance Indicator — a measurable value indicating business/product performance.
SLA	Service Level Agreement — a committed target for a metric such as uptime or response time.
DPDP Act	India's Digital Personal Data Protection Act — governing lawful processing of personal data.


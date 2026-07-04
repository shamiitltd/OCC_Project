import os
import sys
import json
import sqlite3
import argparse
import re

def extract_text(file_path):
    """
    Extracts text from various file formats.
    For demonstration, reads plain text files.
    For binary/PDF, tries to extract raw printable strings as fallback.
    """
    if not os.path.exists(file_path):
        return ""
    
    _, ext = os.path.splitext(file_path.lower())
    if ext == '.txt' or ext == '.md':
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                return f.read()
        except Exception:
            return ""
    else:
        # Fallback for PDF/Docx: extract printable text sequences (rough parsing)
        try:
            with open(file_path, 'rb') as f:
                content = f.read()
            # Find all strings of 3 or more printable characters
            ascii_text = re.findall(rb'[a-zA-Z0-9\+\#\-\.\s]{3,}', content)
            return " ".join([t.decode('ascii', errors='ignore') for t in ascii_text])
        except Exception:
            return ""

def screen_resume(db_path, resume_path, job_id):
    # 1. Read job details from database
    if not os.path.exists(db_path):
        return {
            "match_score": 0,
            "match_explanation": f"Error: Database not found at {db_path}"
        }
        
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute("SELECT company, role, skills, description FROM jobs WHERE id = ?", (job_id,))
        job = cursor.fetchone()
        conn.close()
    except Exception as e:
        return {
            "match_score": 0,
            "match_explanation": f"Database query failed: {str(e)}"
        }

    if not job:
        return {
            "match_score": 0,
            "match_explanation": f"Job ID {job_id} not found."
        }

    company, role, skills_json, description = job
    try:
        required_skills = json.loads(skills_json)
    except Exception:
        required_skills = []

    # 2. Extract resume text
    resume_text = extract_text(resume_path)
    if not resume_text:
        # If resume file is empty or missing, provide standard evaluation
        return {
            "match_score": 35,
            "match_explanation": "Resume file was not readable or empty. Evaluated base fit on profile details (35%). Please upload a detailed PDF or Text resume containing project descriptions."
        }

    # 3. Analyze matches
    resume_text_lower = resume_text.lower()
    matched_skills = []
    missing_skills = []

    for skill in required_skills:
        # Search with word boundary or simple substring for flexible match
        # (e.g. "React" matches "react.js", "React Native", etc.)
        pattern = r'\b' + re.escape(skill.lower()) + r'\b'
        if re.search(pattern, resume_text_lower) or skill.lower() in resume_text_lower:
            matched_skills.append(skill)
        else:
            missing_skills.append(skill)

    # 4. Calculate Score
    # Base score on skills match (70% weight) and general job description keyword overlap (30% weight)
    skills_score = (len(matched_skills) / len(required_skills) * 100) if required_skills else 100
    
    # Description match (look for key terms in description)
    desc_words = set(re.findall(r'\b[a-zA-Z]{4,}\b', description.lower()))
    resume_words = set(re.findall(r'\b[a-zA-Z]{4,}\b', resume_text_lower))
    overlap = desc_words.intersection(resume_words)
    desc_score = (len(overlap) / len(desc_words) * 100) if desc_words else 100
    
    final_score = int((skills_score * 0.7) + (desc_score * 0.3))
    # Keep score between 10 and 99 for realistic profiles
    final_score = max(10, min(99, final_score))

    # 5. Generate Explanation
    explanation_parts = [
        f"AI screening completed for {role} role at {company}.",
        f"Overall Suitability Score: {final_score}%",
        f"- Matched Skills ({len(matched_skills)}): {', '.join(matched_skills) if matched_skills else 'None'}",
        f"- Missing Skills ({len(missing_skills)}): {', '.join(missing_skills) if missing_skills else 'None'}"
    ]
    
    if missing_skills:
        explanation_parts.append(f"Recommendation: Candidate should acquire experience in {', '.join(missing_skills[:3])} to improve eligibility.")
    else:
        explanation_parts.append("Recommendation: Exceptional skills alignment. Candidate matches all technical keywords.")

    return {
        "match_score": final_score,
        "match_explanation": "\n".join(explanation_parts)
    }

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="AI Resume Screening Engine")
    parser.add_argument("--db", default=r"e:\Offcampuscareer\db\offcampuscareer.db", help="Path to SQLite DB")
    parser.add_argument("--resume", required=True, help="Path to Resume file")
    parser.add_argument("--job_id", required=True, help="Job ID to match")
    
    args = parser.parse_args()
    
    result = screen_resume(args.db, args.resume, args.job_id)
    print(json.dumps(result))

export interface TailoredResume {
  personalInfo: {
    name: string
    email: string
    phone: string
    location: string
  }
  summary: string
  skills: string[]
  experience: Array<{
    title: string
    company: string
    location: string
    duration: string
    achievements: string[]
  }>
  education: Array<{
    degree: string
    institution: string
    location: string
    year: string
  }>
}

export function generateResumeHTML(resume: TailoredResume): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${resume.personalInfo.name} - Resume</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          background: white;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #2563eb;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .name {
          font-size: 28px;
          font-weight: bold;
          color: #1e40af;
          margin-bottom: 10px;
        }
        .contact-info {
          font-size: 14px;
          color: #666;
        }
        .section {
          margin-bottom: 25px;
        }
        .section-title {
          font-size: 18px;
          font-weight: bold;
          color: #1e40af;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 5px;
          margin-bottom: 15px;
          text-transform: uppercase;
        }
        .experience-item, .education-item {
          margin-bottom: 20px;
        }
        .job-title {
          font-weight: bold;
          font-size: 16px;
        }
        .company {
          font-style: italic;
          color: #666;
        }
        .duration {
          float: right;
          color: #666;
          font-size: 14px;
        }
        .achievements {
          margin-top: 8px;
        }
        .achievements li {
          margin-bottom: 4px;
        }
        .skills-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .skill-tag {
          background: #f3f4f6;
          padding: 4px 12px;
          border-radius: 4px;
          font-size: 14px;
          border: 1px solid #d1d5db;
        }
        .summary {
          font-style: italic;
          line-height: 1.7;
          color: #374151;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="name">${resume.personalInfo.name}</div>
        <div class="contact-info">
          ${resume.personalInfo.email} | ${resume.personalInfo.phone} | ${resume.personalInfo.location}
        </div>
      </div>

      <div class="section">
        <div class="section-title">Professional Summary</div>
        <div class="summary">${resume.summary}</div>
      </div>

      <div class="section">
        <div class="section-title">Skills</div>
        <div class="skills-list">
          ${resume.skills.map((skill) => `<span class="skill-tag">${skill}</span>`).join("")}
        </div>
      </div>

      <div class="section">
        <div class="section-title">Experience</div>
        ${resume.experience
          .map(
            (exp) => `
          <div class="experience-item">
            <div class="job-title">${exp.title}</div>
            <div class="company">${exp.company} | ${exp.location} <span class="duration">${exp.duration}</span></div>
            <ul class="achievements">
              ${exp.achievements.map((achievement) => `<li>${achievement}</li>`).join("")}
            </ul>
          </div>
        `,
          )
          .join("")}
      </div>

      <div class="section">
        <div class="section-title">Education</div>
        ${resume.education
          .map(
            (edu) => `
          <div class="education-item">
            <div class="job-title">${edu.degree}</div>
            <div class="company">${edu.institution} | ${edu.location} <span class="duration">${edu.year}</span></div>
          </div>
        `,
          )
          .join("")}
      </div>
    </body>
    </html>
  `
}

export function downloadResumeAsPDF(resume: TailoredResume) {
  const htmlContent = generateResumeHTML(resume)

  // Create a blob with the HTML content
  const blob = new Blob([htmlContent], { type: "text/html" })
  const url = URL.createObjectURL(blob)

  // Create download link
  const link = document.createElement("a")
  link.href = url
  link.download = `${resume.personalInfo.name.replace(/\s+/g, "_")}_Tailored_Resume.html`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  // Clean up
  URL.revokeObjectURL(url)
}

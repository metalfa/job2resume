import type { ResumeData } from "@/types/resume-builder"

export function generateResumeHTML(resumeData: ResumeData): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${resumeData.contactInfo.fullName} - Resume</title>
        <style>
            body {
                font-family: 'Arial', sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 8.5in;
                margin: 0 auto;
                padding: 0.5in;
                background: white;
            }
            .header {
                text-align: center;
                border-bottom: 2px solid #333;
                padding-bottom: 10px;
                margin-bottom: 20px;
            }
            .name {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 5px;
            }
            .contact-info {
                font-size: 12px;
                color: #666;
            }
            .section {
                margin-bottom: 20px;
            }
            .section-title {
                font-size: 16px;
                font-weight: bold;
                text-transform: uppercase;
                border-bottom: 1px solid #ccc;
                padding-bottom: 2px;
                margin-bottom: 10px;
            }
            .job {
                margin-bottom: 15px;
            }
            .job-header {
                display: flex;
                justify-content: space-between;
                align-items: baseline;
                margin-bottom: 5px;
            }
            .job-title {
                font-weight: bold;
                font-size: 14px;
            }
            .job-date {
                font-size: 12px;
                color: #666;
            }
            .company {
                font-style: italic;
                color: #666;
                margin-bottom: 5px;
            }
            .responsibilities {
                margin-left: 20px;
            }
            .responsibilities li {
                margin-bottom: 3px;
                font-size: 12px;
            }
            .skills {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
            }
            .skill {
                background: #f0f0f0;
                padding: 2px 8px;
                border-radius: 3px;
                font-size: 12px;
            }
            .education-item {
                margin-bottom: 10px;
            }
            .degree {
                font-weight: bold;
            }
            .institution {
                color: #666;
            }
            @media print {
                body { margin: 0; padding: 0.5in; }
            }
        </style>
    </head>
    <body>
        <div class="header">
            <div class="name">${resumeData.contactInfo.fullName}</div>
            <div class="contact-info">
                ${resumeData.contactInfo.email} • ${resumeData.contactInfo.phone} • ${resumeData.contactInfo.location}
                ${resumeData.contactInfo.linkedin ? ` • ${resumeData.contactInfo.linkedin}` : ""}
            </div>
        </div>

        ${
          resumeData.professionalSummary
            ? `
        <div class="section">
            <div class="section-title">Professional Summary</div>
            <p>${resumeData.professionalSummary}</p>
        </div>
        `
            : ""
        }

        ${
          resumeData.workExperience.length > 0
            ? `
        <div class="section">
            <div class="section-title">Work Experience</div>
            ${resumeData.workExperience
              .map(
                (exp) => `
                <div class="job">
                    <div class="job-header">
                        <div class="job-title">${exp.jobTitle}</div>
                        <div class="job-date">${exp.startDate} - ${exp.isCurrentRole ? "Present" : exp.endDate}</div>
                    </div>
                    <div class="company">${exp.company} • ${exp.location}</div>
                    <ul class="responsibilities">
                        ${exp.responsibilities.map((resp) => `<li>${resp}</li>`).join("")}
                    </ul>
                </div>
            `,
              )
              .join("")}
        </div>
        `
            : ""
        }

        ${
          resumeData.skills.length > 0
            ? `
        <div class="section">
            <div class="section-title">Skills</div>
            <div class="skills">
                ${resumeData.skills.map((skill) => `<span class="skill">${skill}</span>`).join("")}
            </div>
        </div>
        `
            : ""
        }

        ${
          resumeData.education.length > 0
            ? `
        <div class="section">
            <div class="section-title">Education</div>
            ${resumeData.education
              .map(
                (edu) => `
                <div class="education-item">
                    <div class="degree">${edu.degree}${edu.major ? ` in ${edu.major}` : ""}</div>
                    <div class="institution">${edu.institution} • ${edu.graduationDate}</div>
                </div>
            `,
              )
              .join("")}
        </div>
        `
            : ""
        }

        ${
          resumeData.certifications.length > 0
            ? `
        <div class="section">
            <div class="section-title">Certifications</div>
            <ul>
                ${resumeData.certifications.map((cert) => `<li>${cert}</li>`).join("")}
            </ul>
        </div>
        `
            : ""
        }

        ${
          resumeData.awards.length > 0
            ? `
        <div class="section">
            <div class="section-title">Awards & Recognition</div>
            <ul>
                ${resumeData.awards.map((award) => `<li>${award}</li>`).join("")}
            </ul>
        </div>
        `
            : ""
        }
    </body>
    </html>
  `
}

export function downloadResumeAsPDF(resumeData: ResumeData) {
  const html = generateResumeHTML(resumeData)
  const blob = new Blob([html], { type: "text/html" })
  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.href = url
  link.download = `${resumeData.contactInfo.fullName.replace(/\s+/g, "_")}_Resume.html`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function printResume() {
  window.print()
}

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

export function generateResumeHTML(resume: TailoredResume, template = "professional", colorScheme = "blue"): string {
  const colors = {
    blue: {
      primary: "#1e40af",
      secondary: "#2563eb",
      accent: "#3b82f6",
      light: "#eff6ff",
    },
    green: {
      primary: "#166534",
      secondary: "#16a34a",
      accent: "#22c55e",
      light: "#f0fdf4",
    },
    gray: {
      primary: "#374151",
      secondary: "#4b5563",
      accent: "#6b7280",
      light: "#f9fafb",
    },
  }

  const currentColors = colors[colorScheme as keyof typeof colors] || colors.blue

  return `
    <div class="resume-container">
      <!-- Header Section -->
      <div class="header">
        <div class="name">${resume.personalInfo.name}</div>
        <div class="contact-info">
          <span class="contact-item">${resume.personalInfo.email}</span>
          <span class="contact-separator">•</span>
          <span class="contact-item">${resume.personalInfo.phone}</span>
          <span class="contact-separator">•</span>
          <span class="contact-item">${resume.personalInfo.location}</span>
        </div>
      </div>

      <!-- Professional Summary -->
      <div class="section">
        <div class="section-title">PROFESSIONAL SUMMARY</div>
        <div class="summary-content">${resume.summary}</div>
      </div>

      <!-- Core Competencies -->
      <div class="section">
        <div class="section-title">CORE COMPETENCIES</div>
        <div class="skills-grid">
          ${resume.skills.map((skill) => `<span class="skill-item">${skill}</span>`).join("")}
        </div>
      </div>

      <!-- Professional Experience -->
      <div class="section">
        <div class="section-title">PROFESSIONAL EXPERIENCE</div>
        ${resume.experience
          .map(
            (exp) => `
          <div class="experience-item">
            <div class="experience-header">
              <div class="job-info">
                <div class="job-title">${exp.title}</div>
                <div class="company-info">${exp.company} | ${exp.location}</div>
              </div>
              <div class="duration">${exp.duration}</div>
            </div>
            <ul class="achievements-list">
              ${exp.achievements.map((achievement) => `<li class="achievement-item">${achievement}</li>`).join("")}
            </ul>
          </div>
        `,
          )
          .join("")}
      </div>

      <!-- Education -->
      <div class="section">
        <div class="section-title">EDUCATION</div>
        ${resume.education
          .map(
            (edu) => `
          <div class="education-item">
            <div class="education-header">
              <div class="degree-info">
                <div class="degree">${edu.degree}</div>
                <div class="institution">${edu.institution} | ${edu.location}</div>
              </div>
              <div class="graduation-year">${edu.year}</div>
            </div>
          </div>
        `,
          )
          .join("")}
      </div>

      <style>
        :root {
          --primary-color: ${currentColors.primary};
          --secondary-color: ${currentColors.secondary};
          --accent-color: ${currentColors.accent};
          --light-color: ${currentColors.light};
        }
      </style>
    </div>
  `
}

export async function downloadResumeAsPDF(resume: TailoredResume, template = "professional", colorScheme = "blue") {
  const htmlContent = generateResumeHTML(resume, template, colorScheme)
  const printWindow = window.open("", "_blank")

  if (!printWindow) {
    alert("Please allow pop-ups to download your resume as PDF")
    return
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${resume.personalInfo.name} - Professional Resume</title>
      <meta charset="UTF-8">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          @page {
            size: letter;
            margin: 0.5in;
          }
          .resume-container {
            page-break-inside: avoid;
          }
          .section {
            page-break-inside: avoid;
          }
          .experience-item {
            page-break-inside: avoid;
            margin-bottom: 20px;
          }
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          line-height: 1.5;
          color: #1a1a1a;
          background: white;
          font-size: 11pt;
        }

        .resume-container {
          max-width: 8.5in;
          margin: 0 auto;
          padding: 0.5in;
          background: white;
        }

        /* Header Styles */
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 3px solid var(--secondary-color);
        }

        .name {
          font-size: 28pt;
          font-weight: 700;
          color: var(--primary-color);
          margin-bottom: 8px;
          letter-spacing: -0.5px;
        }

        .contact-info {
          font-size: 10pt;
          color: #4b5563;
          font-weight: 400;
        }

        .contact-item {
          display: inline;
        }

        .contact-separator {
          margin: 0 8px;
          color: #9ca3af;
        }

        /* Section Styles */
        .section {
          margin-bottom: 25px;
        }

        .section-title {
          font-size: 12pt;
          font-weight: 600;
          color: var(--primary-color);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 12px;
          padding-bottom: 4px;
          border-bottom: 1px solid var(--accent-color);
        }

        /* Summary Styles */
        .summary-content {
          font-size: 11pt;
          line-height: 1.6;
          color: #374151;
          text-align: justify;
          font-weight: 400;
        }

        /* Skills Styles */
        .skills-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 8px;
        }

        .skill-item {
          background: var(--light-color);
          border: 1px solid var(--accent-color);
          padding: 4px 12px;
          border-radius: 4px;
          font-size: 9pt;
          font-weight: 500;
          color: var(--primary-color);
          display: inline-block;
        }

        /* Experience Styles */
        .experience-item {
          margin-bottom: 20px;
          page-break-inside: avoid;
        }

        .experience-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
        }

        .job-info {
          flex: 1;
        }

        .job-title {
          font-size: 12pt;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 2px;
        }

        .company-info {
          font-size: 10pt;
          color: #6b7280;
          font-weight: 500;
          font-style: italic;
        }

        .duration {
          font-size: 10pt;
          color: #6b7280;
          font-weight: 500;
          text-align: right;
          white-space: nowrap;
          margin-left: 20px;
        }

        .achievements-list {
          list-style: none;
          margin-left: 0;
          padding-left: 0;
        }

        .achievement-item {
          position: relative;
          padding-left: 16px;
          margin-bottom: 4px;
          font-size: 10pt;
          line-height: 1.5;
          color: #374151;
        }

        .achievement-item::before {
          content: "▸";
          position: absolute;
          left: 0;
          color: var(--secondary-color);
          font-weight: bold;
        }

        /* Education Styles */
        .education-item {
          margin-bottom: 12px;
        }

        .education-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .degree-info {
          flex: 1;
        }

        .degree {
          font-size: 11pt;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 2px;
        }

        .institution {
          font-size: 10pt;
          color: #6b7280;
          font-style: italic;
        }

        .graduation-year {
          font-size: 10pt;
          color: #6b7280;
          font-weight: 500;
          white-space: nowrap;
          margin-left: 20px;
        }

        /* Print Optimizations */
        @media print {
          .resume-container {
            padding: 0.3in;
          }
          
          .header {
            margin-bottom: 20px;
            padding-bottom: 15px;
          }
          
          .section {
            margin-bottom: 18px;
          }
          
          .experience-item {
            margin-bottom: 16px;
          }
        }
      </style>
    </head>
    <body>
      ${htmlContent}
      <script>
        window.onload = function() {
          setTimeout(() => {
            window.print();
            setTimeout(() => {
              window.close();
            }, 500);
          }, 500);
        };
      </script>
    </body>
    </html>
  `)

  printWindow.document.close()
}

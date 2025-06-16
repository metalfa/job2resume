import jsPDF from "jspdf"
import html2canvas from "html2canvas"

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
    <div class="resume-container" style="width: 8.5in; margin: 0 auto; background: white; padding: 0 0.5in 0.25in 0.5in; font-family: 'Inter', sans-serif; font-size: 10.5pt; line-height: 1.4; color: #1a1a1a;">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        :root {
          --primary-color: ${currentColors.primary};
          --secondary-color: ${currentColors.secondary};
          --accent-color: ${currentColors.accent};
          --light-color: ${currentColors.light};
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .header { text-align: center; margin-bottom: 20px; padding-top: 10px; padding-bottom: 15px; border-bottom: 2px solid var(--secondary-color); }
        .name { font-size: 26pt; font-weight: 700; color: var(--primary-color); margin-bottom: 6px; letter-spacing: -0.5px; }
        .contact-info { font-size: 9.5pt; color: #4b5563; font-weight: 400; }
        .contact-item { display: inline; }
        .contact-separator { margin: 0 6px; color: #9ca3af; }
        .section { margin-bottom: 15px; }
        .section-title { font-size: 11pt; font-weight: 600; color: var(--primary-color); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; padding-bottom: 3px; border-bottom: 1px solid var(--accent-color); }
        .summary-content { font-size: 10pt; line-height: 1.45; color: #374151; text-align: justify; font-weight: 400; }
        .skills-grid { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px; }
        .skill-item { background: var(--light-color); border: 1px solid var(--accent-color); padding: 3px 10px; border-radius: 3px; font-size: 8.5pt; font-weight: 500; color: var(--primary-color); display: inline-block; }
        .experience-item { margin-bottom: 12px; page-break-inside: avoid; }
        .experience-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 5px; }
        .job-info { flex: 1; }
        .job-title { font-size: 11pt; font-weight: 600; color: #1f2937; margin-bottom: 1px; }
        .company-info { font-size: 9.5pt; color: #6b7280; font-weight: 500; font-style: italic; }
        .duration { font-size: 9.5pt; color: #6b7280; font-weight: 500; text-align: right; white-space: nowrap; margin-left: 15px; }
        .achievements-list { list-style: none; margin-left: 0; padding-left: 0; }
        .achievement-item { position: relative; padding-left: 14px; margin-bottom: 3px; font-size: 9.5pt; line-height: 1.4; color: #374151; }
        .achievement-item::before { content: "▸"; position: absolute; left: 0; top: 1px; color: var(--secondary-color); font-weight: bold; font-size: 9pt; }
        .education-item { margin-bottom: 8px; page-break-inside: avoid; }
        .education-header { display: flex; justify-content: space-between; align-items: flex-start; }
        .degree-info { flex: 1; }
        .degree { font-size: 10.5pt; font-weight: 600; color: #1f2937; margin-bottom: 1px; }
        .institution { font-size: 9.5pt; color: #6b7280; font-style: italic; }
        .graduation-year { font-size: 9.5pt; color: #6b7280; font-weight: 500; white-space: nowrap; margin-left: 15px; }
      </style>
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
    </div>
  `
}

function openPrintWindow(htmlContent: string, title: string) {
  const printWindow = window.open("", "_blank")
  if (!printWindow) {
    alert("Please allow pop-ups for this action.")
    return
  }
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <meta charset="UTF-8">
      <style>
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          /* Adjusted margins: top 0, right 0.5in, bottom 0.25in, left 0.5in */
          @page { size: letter; margin: 0 0.5in 0.25in 0.5in; }
          .resume-container { width: 100% !important; padding: 0 !important; margin: 0 !important; box-shadow: none !important; border: none !important; page-break-inside: avoid; }
          .section { page-break-inside: avoid; }
          .experience-item { page-break-inside: avoid; }
          .education-item { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      ${htmlContent}
      <script>
        window.onload = function() {
          setTimeout(() => { window.print(); }, 500);
        };
      </script>
    </body>
    </html>
  `)
  printWindow.document.close()
}

export async function downloadResumeAsDirectPDF(
  resume: TailoredResume,
  template = "professional",
  colorScheme = "blue",
) {
  const htmlContent = generateResumeHTML(resume, template, colorScheme)

  const tempContainer = document.createElement("div")
  tempContainer.style.position = "absolute"
  tempContainer.style.left = "-9999px"
  tempContainer.innerHTML = htmlContent
  document.body.appendChild(tempContainer)

  const resumeElement = tempContainer.querySelector<HTMLElement>(".resume-container")
  if (!resumeElement) {
    console.error("Resume element (.resume-container) not found in tempContainer.")
    document.body.removeChild(tempContainer)
    alert("Error: Could not find resume content for PDF generation.")
    return
  }

  await new Promise((resolve) => setTimeout(resolve, 500))

  try {
    const canvas = await html2canvas(resumeElement, {
      scale: 2, // Increased scale for better quality on high DPI, might need adjustment
      useCORS: true,
      logging: false,
      windowWidth: resumeElement.scrollWidth, // Ensure full width is captured
      windowHeight: resumeElement.scrollHeight, // Ensure full height is captured
    })

    const imgData = canvas.toDataURL("image/jpeg", 0.9) // Slightly higher quality JPEG

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "in",
      format: "letter",
    })

    const pdfPageWidth = pdf.internal.pageSize.getWidth()
    const pdfPageHeight = pdf.internal.pageSize.getHeight()

    const imgProps = pdf.getImageProperties(imgData)
    const aspectRatio = imgProps.width / imgProps.height

    let finalImgWidth, finalImgHeight

    // Fit to page width, adjust height proportionally
    finalImgWidth = pdfPageWidth
    finalImgHeight = finalImgWidth / aspectRatio

    // If calculated height is greater than page height, scale down to fit page height
    if (finalImgHeight > pdfPageHeight) {
      finalImgHeight = pdfPageHeight
      finalImgWidth = finalImgHeight * aspectRatio
    }

    // If after fitting to height, width is greater than page width (shouldn't happen if aspect ratio is maintained from width-first fit)
    // This is a safeguard, primary fitting is by width then scale down if height exceeds.
    if (finalImgWidth > pdfPageWidth) {
      finalImgWidth = pdfPageWidth
      finalImgHeight = finalImgWidth / aspectRatio
    }

    const xOffset = (pdfPageWidth - finalImgWidth) / 2
    const yOffset = 0 // Content starts at the top of the PDF page

    pdf.addImage(imgData, "JPEG", xOffset, yOffset, finalImgWidth, finalImgHeight, undefined, "FAST")
    pdf.save(`${resume.personalInfo.name.replace(/\s+/g, "_")}_Resume.pdf`)
  } catch (error) {
    console.error("Error generating PDF:", error)
    alert(
      "Sorry, there was an error generating the PDF. Please try printing instead or check the browser console for details.",
    )
  } finally {
    document.body.removeChild(tempContainer)
  }
}

export async function printResumeDocument(resume: TailoredResume, template = "professional", colorScheme = "blue") {
  const htmlContent = generateResumeHTML(resume, template, colorScheme)
  const title = `Print Resume - ${resume.personalInfo.name}`
  openPrintWindow(htmlContent, title)
}

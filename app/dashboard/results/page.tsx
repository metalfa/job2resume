"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, FileText, Mail, Share2, Check } from "lucide-react"

export default function ResultsPage() {
  const [downloadFormat, setDownloadFormat] = useState<"pdf" | "docx">("pdf")

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Your Tailored Documents</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <div className="relative">
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Download {downloadFormat.toUpperCase()}
            </Button>
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-10 hidden group-hover:block">
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                onClick={() => setDownloadFormat("pdf")}
              >
                Download as PDF
              </button>
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                onClick={() => setDownloadFormat("docx")}
              >
                Download as DOCX
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-green-50 border border-green-100 rounded-lg p-4 mb-8">
        <div className="flex items-start gap-3">
          <div className="bg-green-100 rounded-full p-2">
            <FileText className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h2 className="font-medium text-green-800">Documents Generated Successfully!</h2>
            <p className="text-sm text-green-700 mt-1">
              Your resume and cover letter have been tailored to match the job description. You can preview and download
              them below.
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="resume" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mb-8">
          <TabsTrigger value="resume">Resume</TabsTrigger>
          <TabsTrigger value="cover-letter">Cover Letter</TabsTrigger>
        </TabsList>

        <TabsContent value="resume" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 bg-white border rounded-lg shadow-sm overflow-hidden">
              <div className="border-b p-4 flex items-center justify-between">
                <h3 className="font-medium">Resume Preview</h3>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
              <div className="p-8 bg-gray-50 min-h-[800px] flex justify-center">
                {/* This would be the actual resume preview */}
                <div className="bg-white shadow-md w-full max-w-[600px] h-[800px] border">
                  <div className="p-8">
                    <h1 className="text-2xl font-bold mb-1">John Doe</h1>
                    <p className="text-gray-600 mb-4">Frontend Developer</p>
                    <div className="flex text-sm text-gray-600 mb-6 gap-4">
                      <span>john@example.com</span>
                      <span>(123) 456-7890</span>
                      <span>New York, NY</span>
                    </div>

                    <div className="mb-6">
                      <h2 className="text-lg font-semibold border-b pb-1 mb-2">Professional Summary</h2>
                      <p className="text-sm">
                        Experienced Frontend Developer with 5+ years of expertise in building responsive web
                        applications using React, TypeScript, and modern CSS frameworks. Passionate about creating
                        intuitive user interfaces and optimizing web performance.
                      </p>
                    </div>

                    <div className="mb-6">
                      <h2 className="text-lg font-semibold border-b pb-1 mb-2">Experience</h2>
                      <div className="mb-4">
                        <div className="flex justify-between mb-1">
                          <h3 className="font-medium">Senior Frontend Developer</h3>
                          <span className="text-sm text-gray-600">2020 - Present</span>
                        </div>
                        <p className="text-sm font-medium mb-1">Tech Solutions Inc.</p>
                        <ul className="text-sm list-disc list-inside space-y-1">
                          <li>
                            Led the development of the company's flagship web application using React and TypeScript
                          </li>
                          <li>Improved application performance by 40% through code optimization and lazy loading</li>
                          <li>Collaborated with UX designers to implement responsive designs and animations</li>
                        </ul>
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <h3 className="font-medium">Frontend Developer</h3>
                          <span className="text-sm text-gray-600">2018 - 2020</span>
                        </div>
                        <p className="text-sm font-medium mb-1">Web Innovators LLC</p>
                        <ul className="text-sm list-disc list-inside space-y-1">
                          <li>Developed and maintained multiple client websites using React and Redux</li>
                          <li>Implemented responsive designs ensuring cross-browser compatibility</li>
                          <li>Participated in code reviews and mentored junior developers</li>
                        </ul>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h2 className="text-lg font-semibold border-b pb-1 mb-2">Skills</h2>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-gray-100 text-sm rounded">React</span>
                        <span className="px-2 py-1 bg-gray-100 text-sm rounded">TypeScript</span>
                        <span className="px-2 py-1 bg-gray-100 text-sm rounded">JavaScript</span>
                        <span className="px-2 py-1 bg-gray-100 text-sm rounded">HTML5</span>
                        <span className="px-2 py-1 bg-gray-100 text-sm rounded">CSS3</span>
                        <span className="px-2 py-1 bg-gray-100 text-sm rounded">Tailwind CSS</span>
                        <span className="px-2 py-1 bg-gray-100 text-sm rounded">Redux</span>
                        <span className="px-2 py-1 bg-gray-100 text-sm rounded">Next.js</span>
                        <span className="px-2 py-1 bg-gray-100 text-sm rounded">Git</span>
                        <span className="px-2 py-1 bg-gray-100 text-sm rounded">UI/UX</span>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-lg font-semibold border-b pb-1 mb-2">Education</h2>
                      <div>
                        <div className="flex justify-between mb-1">
                          <h3 className="font-medium">Bachelor of Science in Computer Science</h3>
                          <span className="text-sm text-gray-600">2014 - 2018</span>
                        </div>
                        <p className="text-sm">University of Technology</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white border rounded-lg p-6">
                <h3 className="font-medium mb-4">Resume Insights</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Keyword Match</span>
                      <span className="text-sm font-medium">92%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: "92%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">ATS Compatibility</span>
                      <span className="text-sm font-medium">98%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: "98%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Readability</span>
                      <span className="text-sm font-medium">85%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: "85%" }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border rounded-lg p-6">
                <h3 className="font-medium mb-4">Matched Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  <div className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">React</div>
                  <div className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">TypeScript</div>
                  <div className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Frontend</div>
                  <div className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">UI/UX</div>
                  <div className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Responsive Design</div>
                  <div className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Performance</div>
                  <div className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Team Collaboration</div>
                </div>
              </div>

              <div className="bg-white border rounded-lg p-6">
                <h3 className="font-medium mb-4">Download Options</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Download as PDF
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Download as DOCX
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="cover-letter" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 bg-white border rounded-lg shadow-sm overflow-hidden">
              <div className="border-b p-4 flex items-center justify-between">
                <h3 className="font-medium">Cover Letter Preview</h3>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
              <div className="p-8 bg-gray-50 min-h-[800px] flex justify-center">
                {/* This would be the actual cover letter preview */}
                <div className="bg-white shadow-md w-full max-w-[600px] h-[800px] border">
                  <div className="p-8">
                    <div className="mb-8">
                      <h1 className="text-2xl font-bold mb-1">John Doe</h1>
                      <p className="text-gray-600">Frontend Developer</p>
                      <div className="text-sm text-gray-600 mt-2">
                        <p>john@example.com</p>
                        <p>(123) 456-7890</p>
                        <p>New York, NY</p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <p className="mb-2">June 13, 2025</p>
                      <p className="mb-2">Hiring Manager</p>
                      <p className="mb-2">Tech Innovations Inc.</p>
                      <p>New York, NY</p>
                    </div>

                    <div className="mb-4">
                      <p className="mb-4">Dear Hiring Manager,</p>

                      <p className="mb-4">
                        I am writing to express my interest in the Senior Frontend Developer position at Tech
                        Innovations Inc. With over 5 years of experience in developing responsive web applications using
                        React, TypeScript, and modern CSS frameworks, I am confident in my ability to contribute to your
                        team's success.
                      </p>

                      <p className="mb-4">
                        In my current role as Senior Frontend Developer at Tech Solutions Inc., I have led the
                        development of the company's flagship web application, improving its performance by 40% through
                        code optimization and implementing modern frontend practices. I have collaborated closely with
                        UX designers to create intuitive user interfaces and ensure a seamless user experience across
                        all devices.
                      </p>

                      <p className="mb-4">
                        I was particularly excited to see that your job description emphasizes expertise in React,
                        TypeScript, and UI/UX collaboration—areas where I have demonstrated strong capabilities. Your
                        focus on creating innovative digital solutions aligns perfectly with my professional interests
                        and strengths.
                      </p>

                      <p className="mb-4">
                        I am impressed by Tech Innovations' commitment to pushing the boundaries of web technology and
                        would welcome the opportunity to bring my technical skills, creative problem-solving abilities,
                        and collaborative approach to your team.
                      </p>

                      <p className="mb-4">
                        Thank you for considering my application. I look forward to the possibility of discussing how my
                        background and skills would be a good match for the Senior Frontend Developer position at Tech
                        Innovations Inc.
                      </p>

                      <p className="mt-8">Sincerely,</p>
                      <p className="font-medium">John Doe</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white border rounded-lg p-6">
                <h3 className="font-medium mb-4">Cover Letter Insights</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Relevance</span>
                      <span className="text-sm font-medium">95%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: "95%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Tone</span>
                      <span className="text-sm font-medium">Professional</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: "100%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Personalization</span>
                      <span className="text-sm font-medium">90%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: "90%" }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border rounded-lg p-6">
                <h3 className="font-medium mb-4">Key Highlights</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <span>Addresses specific job requirements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <span>Highlights relevant experience and achievements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <span>Shows knowledge of the company</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <span>Clear and professional structure</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white border rounded-lg p-6">
                <h3 className="font-medium mb-4">Download Options</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Download as PDF
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Download as DOCX
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Mail className="h-4 w-4 mr-2" />
                    Email to Yourself
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

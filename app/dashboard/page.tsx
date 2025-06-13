import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { JobDescriptionForm } from "@/components/job-description-form"
import { ResumeUpload } from "@/components/resume-upload"
import { ResumeTemplates } from "@/components/resume-templates"
import { GenerateButton } from "@/components/generate-button"

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">Create Your Tailored Resume</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Step 1: Paste Job Description</h2>
            <JobDescriptionForm />
          </div>

          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Step 2: Your Resume</h2>
            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="upload">Upload Resume</TabsTrigger>
                <TabsTrigger value="template">Use Template</TabsTrigger>
              </TabsList>
              <TabsContent value="upload" className="mt-0">
                <ResumeUpload />
              </TabsContent>
              <TabsContent value="template" className="mt-0">
                <ResumeTemplates />
              </TabsContent>
            </Tabs>
          </div>

          <div className="flex justify-center mt-8">
            <GenerateButton />
          </div>
        </div>

        <div className="bg-white rounded-lg border shadow-sm p-6 h-fit">
          <h2 className="text-xl font-semibold mb-4">Your Progress</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
                1
              </div>
              <div>
                <p className="font-medium">Job Description</p>
                <p className="text-sm text-gray-500">Paste the job description</p>
              </div>
            </div>
            <div className="w-0.5 h-6 bg-gray-200 ml-4"></div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-sm font-medium">
                2
              </div>
              <div>
                <p className="font-medium text-gray-500">Resume</p>
                <p className="text-sm text-gray-500">Upload or create your resume</p>
              </div>
            </div>
            <div className="w-0.5 h-6 bg-gray-200 ml-4"></div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-sm font-medium">
                3
              </div>
              <div>
                <p className="font-medium text-gray-500">Generate</p>
                <p className="text-sm text-gray-500">Create tailored documents</p>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-dashed">
            <h3 className="font-medium mb-2">Need Help?</h3>
            <p className="text-sm text-gray-500 mb-4">Watch our quick tutorial on how to get the best results.</p>
            <button className="text-sm text-primary font-medium hover:underline">Watch Tutorial</button>
          </div>
        </div>
      </div>
    </div>
  )
}

import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Scale, Shield, Sparkles, BookOpen, FileText, MessageSquare } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted/30">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-[#0ABAB5]/10 px-3 py-1 text-sm text-[#0ABAB5]">
                  Powered by AI
                </div>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  LexiAI: Smart Legal Workspace
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Streamline your legal work with AI-powered document analysis, smart summarization, and intelligent Q&A. Your digital legal assistant.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild className="bg-[#0ABAB5] hover:bg-[#089996]">
                    <Link href="/auth">Get Started</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="#features">Learn More</Link>
                  </Button>
                </div>
              </div>
              <div className="mx-auto lg:mr-0 flex items-center justify-center">
                <div className="relative w-full max-w-[500px] aspect-square">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0ABAB5]/20 to-[#0ABAB5]/30 rounded-lg transform rotate-3 scale-105"></div>
                  <div className="absolute inset-0 bg-card rounded-lg shadow-lg overflow-hidden">
                    <div className="absolute top-0 w-full h-12 bg-[#0ABAB5]/90 flex items-center px-4">
                      <div className="flex items-center space-x-2">
                        <Scale className="h-5 w-5 text-white" />
                        <span className="font-bold text-white">LexiAI</span>
                      </div>
                    </div>
                    <div className="pt-14 p-4">
                      <div className="mb-4">
                        <h4 className="text-sm font-medium mb-2">Document Summary</h4>
                        <div className="bg-muted/50 rounded-md p-3 space-y-2">
                          <div className="h-2 bg-muted-foreground/20 rounded-full w-3/4"></div>
                          <div className="h-2 bg-muted-foreground/20 rounded-full w-5/6"></div>
                          <div className="h-2 bg-muted-foreground/20 rounded-full w-2/3"></div>
                        </div>
                      </div>
                      <div className="mb-4">
                        <h4 className="text-sm font-medium mb-2">Key Clauses</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-[#0ABAB5]/10 text-[#0ABAB5] px-2 py-1 rounded text-xs">Termination</div>
                          <div className="bg-[#0ABAB5]/10 text-[#0ABAB5] px-2 py-1 rounded text-xs">Confidentiality</div>
                          <div className="bg-[#0ABAB5]/10 text-[#0ABAB5] px-2 py-1 rounded text-xs">Jurisdiction</div>
                          <div className="bg-[#0ABAB5]/10 text-[#0ABAB5] px-2 py-1 rounded text-xs">Liability</div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-2">Ask a Question</h4>
                        <div className="relative">
                          <div className="h-8 bg-background border rounded-md w-full"></div>
                          <div className="absolute right-2 top-1.5 h-5 w-5 rounded-full bg-[#0ABAB5] flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><polyline points="9 18 15 12 9 6"></polyline></svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  Key Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Streamline Your Legal Workflow
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  LexiAI combines cutting-edge AI with legal expertise to help you work smarter
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-[#0ABAB5]/10 p-3">
                  <FileText className="h-6 w-6 text-[#0ABAB5]" />
                </div>
                <h3 className="text-xl font-bold">Document Analysis</h3>
                <p className="text-center text-muted-foreground">
                  Upload legal documents and get AI-powered summaries, clause identification, and risk assessment.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-[#0ABAB5]/10 p-3">
                  <MessageSquare className="h-6 w-6 text-[#0ABAB5]" />
                </div>
                <h3 className="text-xl font-bold">Legal Q&A</h3>
                <p className="text-center text-muted-foreground">
                  Ask questions about specific clauses or terms and get instant, accurate answers from your documents.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-[#0ABAB5]/10 p-3">
                  <BookOpen className="h-6 w-6 text-[#0ABAB5]" />
                </div>
                <h3 className="text-xl font-bold">Research Assistant</h3>
                <p className="text-center text-muted-foreground">
                  Find authoritative legal references and citations related to your documents or specific terms.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-[#0ABAB5]/10 p-3">
                  <Shield className="h-6 w-6 text-[#0ABAB5]" />
                </div>
                <h3 className="text-xl font-bold">Secure & Private</h3>
                <p className="text-center text-muted-foreground">
                  Enterprise-grade security with role-based access control and detailed audit logs for compliance.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-[#0ABAB5]/10 p-3">
                  <Sparkles className="h-6 w-6 text-[#0ABAB5]" />
                </div>
                <h3 className="text-xl font-bold">Smart Reports</h3>
                <p className="text-center text-muted-foreground">
                  Generate comprehensive PDF reports with document analysis, Q&A history, and relevant references.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-[#0ABAB5]/10 p-3">
                  <Scale className="h-6 w-6 text-[#0ABAB5]" />
                </div>
                <h3 className="text-xl font-bold">Legal-First Design</h3>
                <p className="text-center text-muted-foreground">
                  Built specifically for legal professionals with an interface designed for legal workflows.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Ready to Transform Your Legal Work?
                </h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join law firms and legal departments using LexiAI to work smarter and faster.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild className="bg-[#0ABAB5] hover:bg-[#089996]">
                  <Link href="/auth">Get Started Now</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 LexiAI. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="#" className="underline underline-offset-4 hover:text-foreground">
              Terms
            </Link>
            <Link href="#" className="underline underline-offset-4 hover:text-foreground">
              Privacy
            </Link>
            <Link href="#" className="underline underline-offset-4 hover:text-foreground">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
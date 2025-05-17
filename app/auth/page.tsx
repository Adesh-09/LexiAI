import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";
import { Scale } from "lucide-react";

export default function AuthPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex h-[60px] items-center border-b px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Scale className="h-6 w-6 text-[#0ABAB5]" />
          <span className="font-bold">LexiAI</span>
        </Link>
      </div>
      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="mx-auto grid w-full max-w-md gap-6">
          <AuthForm />
        </div>
      </main>
    </div>
  );
}
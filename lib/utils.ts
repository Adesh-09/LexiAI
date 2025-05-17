import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function parseDocumentContent(file: File): Promise<string> {
  // This is a placeholder for actual document parsing
  // In a complete implementation, we would use:
  // - pdf-parse for PDFs
  // - mammoth for DOCX
  // - Basic text reading for TXT
  
  if (file.type === 'application/pdf') {
    // For PDF parsing in browser context
    return "PDF content would be extracted here";
  } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    // For DOCX parsing in browser context
    return "DOCX content would be extracted here";
  } else {
    // Plain text or fallback
    return await file.text();
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
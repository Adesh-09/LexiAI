import { createClient } from "@supabase/supabase-js";
import { Database } from "@/lib/supabase/database.types";

// These are safe to expose on the client
const supabaseUrl = "https://ggildfnhlfzqvyibmzgc.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdnaWxkZm5obGZ6cXZ5aWJtemdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0NjQzMDIsImV4cCI6MjA2MzA0MDMwMn0.3plK-Vs-PVLjhUJUMkoyXiw1T85cHkV47nmvUEAv5dY";

// Create a singleton instance for the browser
export const createBrowserClient = () => 
  createClient<Database>(supabaseUrl, supabaseAnonKey);

// Server-side Supabase client (to be used in Server Components or API routes)
export const createServerClient = () => 
  createClient<Database>(supabaseUrl, supabaseAnonKey);
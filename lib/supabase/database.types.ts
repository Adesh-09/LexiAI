export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          role: string
          firm_name: string | null
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          role?: string
          firm_name?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          role?: string
          firm_name?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      documents: {
        Row: {
          id: string
          user_id: string
          title: string
          file_url: string
          file_text: string
          summary: string | null
          doc_type: string | null
          clause_tags: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          file_url: string
          file_text: string
          summary?: string | null
          doc_type?: string | null
          clause_tags?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          file_url?: string
          file_text?: string
          summary?: string | null
          doc_type?: string | null
          clause_tags?: Json | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      qa_logs: {
        Row: {
          id: string
          document_id: string
          question: string
          answer: string
          created_at: string
        }
        Insert: {
          id?: string
          document_id: string
          question: string
          answer: string
          created_at?: string
        }
        Update: {
          id?: string
          document_id?: string
          question?: string
          answer?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "qa_logs_document_id_fkey"
            columns: ["document_id"]
            referencedRelation: "documents"
            referencedColumns: ["id"]
          }
        ]
      }
      references: {
        Row: {
          id: string
          document_id: string
          url: string
          title: string
          snippet: string
          citation: string
          created_at: string
        }
        Insert: {
          id?: string
          document_id: string
          url: string
          title: string
          snippet: string
          citation: string
          created_at?: string
        }
        Update: {
          id?: string
          document_id?: string
          url?: string
          title?: string
          snippet?: string
          citation?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "references_document_id_fkey"
            columns: ["document_id"]
            referencedRelation: "documents"
            referencedColumns: ["id"]
          }
        ]
      }
      logs: {
        Row: {
          id: string
          user_id: string
          action_type: string
          doc_id: string | null
          timestamp: string
          ip_address: string | null
        }
        Insert: {
          id?: string
          user_id: string
          action_type: string
          doc_id?: string | null
          timestamp?: string
          ip_address?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          action_type?: string
          doc_id?: string | null
          timestamp?: string
          ip_address?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "logs_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "logs_doc_id_fkey"
            columns: ["doc_id"]
            referencedRelation: "documents"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
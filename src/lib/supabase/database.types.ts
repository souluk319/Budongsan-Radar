export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          role: "user" | "admin";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          role?: "user" | "admin";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          email?: string;
          role?: "user" | "admin";
          updated_at?: string;
        };
        Relationships: [];
      };
      links: {
        Row: {
          id: string;
          title: string;
          source_name: string;
          source_url: string;
          submitted_at: string;
          published_at: string | null;
          category: string;
          regions: string[];
          summary_bullets: string[];
          why_it_matters: string;
          audience_impact: Json;
          checkpoints: string[];
          score: number;
          is_daily_pick: boolean;
          impact_line: string;
          reading_minutes: number;
          is_sample: boolean;
          status: "pending" | "published" | "rejected";
          created_by: string | null;
          source_type: "sample" | "user" | "rss" | "admin";
          raw_excerpt: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          title: string;
          source_name?: string;
          source_url: string;
          submitted_at?: string;
          published_at?: string | null;
          category: string;
          regions?: string[];
          summary_bullets?: string[];
          why_it_matters?: string;
          audience_impact?: Json;
          checkpoints?: string[];
          score?: number;
          is_daily_pick?: boolean;
          impact_line?: string;
          reading_minutes?: number;
          is_sample?: boolean;
          status?: "pending" | "published" | "rejected";
          created_by?: string | null;
          source_type?: "sample" | "user" | "rss" | "admin";
          raw_excerpt?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          source_name?: string;
          source_url?: string;
          submitted_at?: string;
          published_at?: string | null;
          category?: string;
          regions?: string[];
          summary_bullets?: string[];
          why_it_matters?: string;
          audience_impact?: Json;
          checkpoints?: string[];
          score?: number;
          is_daily_pick?: boolean;
          impact_line?: string;
          reading_minutes?: number;
          is_sample?: boolean;
          status?: "pending" | "published" | "rejected";
          created_by?: string | null;
          source_type?: "sample" | "user" | "rss" | "admin";
          raw_excerpt?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      summaries: {
        Row: {
          id: string;
          link_id: string;
          model: string;
          summary_bullets: string[];
          why_it_matters: string;
          audience_impact: Json;
          checkpoints: string[];
          confidence: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          link_id: string;
          model: string;
          summary_bullets: string[];
          why_it_matters: string;
          audience_impact: Json;
          checkpoints: string[];
          confidence: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          link_id?: string;
          model?: string;
          summary_bullets?: string[];
          why_it_matters?: string;
          audience_impact?: Json;
          checkpoints?: string[];
          confidence?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      rss_sources: {
        Row: {
          id: string;
          name: string;
          url: string;
          enabled: boolean;
          category: string;
          default_regions: string[];
          last_fetched_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          url: string;
          enabled?: boolean;
          category: string;
          default_regions?: string[];
          last_fetched_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          url?: string;
          enabled?: boolean;
          category?: string;
          default_regions?: string[];
          last_fetched_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      saved_links: {
        Row: {
          user_id: string;
          link_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          link_id: string;
          created_at?: string;
        };
        Update: never;
        Relationships: [];
      };
      link_votes: {
        Row: {
          user_id: string;
          link_id: string;
          value: number;
          created_at: string;
        };
        Insert: {
          user_id: string;
          link_id: string;
          value?: number;
          created_at?: string;
        };
        Update: {
          value?: number;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      radar_link_status: "pending" | "published" | "rejected";
    };
    CompositeTypes: Record<string, never>;
  };
};

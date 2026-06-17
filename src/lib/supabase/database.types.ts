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
      regions: {
        Row: {
          id: string;
          name: string;
          level:
            | "country"
            | "metro"
            | "province"
            | "city"
            | "district"
            | "neighborhood";
          parent_id: string | null;
          aliases: string[];
          external_refs: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          level:
            | "country"
            | "metro"
            | "province"
            | "city"
            | "district"
            | "neighborhood";
          parent_id?: string | null;
          aliases?: string[];
          external_refs?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          level?:
            | "country"
            | "metro"
            | "province"
            | "city"
            | "district"
            | "neighborhood";
          parent_id?: string | null;
          aliases?: string[];
          external_refs?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      complexes: {
        Row: {
          id: string;
          name: string;
          region_id: string | null;
          address: string | null;
          road_address: string | null;
          jibun_address: string | null;
          latitude: number | null;
          longitude: number | null;
          external_refs: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          region_id?: string | null;
          address?: string | null;
          road_address?: string | null;
          jibun_address?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          external_refs?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          region_id?: string | null;
          address?: string | null;
          road_address?: string | null;
          jibun_address?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          external_refs?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      buildings: {
        Row: {
          id: string;
          complex_id: string | null;
          region_id: string | null;
          name: string | null;
          address: string | null;
          building_register_pk: string | null;
          external_refs: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          complex_id?: string | null;
          region_id?: string | null;
          name?: string | null;
          address?: string | null;
          building_register_pk?: string | null;
          external_refs?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          complex_id?: string | null;
          region_id?: string | null;
          name?: string | null;
          address?: string | null;
          building_register_pk?: string | null;
          external_refs?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      units: {
        Row: {
          id: string;
          building_id: string;
          label: string | null;
          area_m2: number | null;
          floor: string | null;
          external_refs: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          building_id: string;
          label?: string | null;
          area_m2?: number | null;
          floor?: string | null;
          external_refs?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          building_id?: string;
          label?: string | null;
          area_m2?: number | null;
          floor?: string | null;
          external_refs?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      data_observations: {
        Row: {
          id: string;
          dedupe_key: string;
          source: "sample" | "naver" | "ecos" | "data_go_kr" | "reb" | "law" | "admin";
          kind:
            | "news_context"
            | "interest_rate"
            | "trade"
            | "rent"
            | "market_stat"
            | "law"
            | "policy"
            | "subscription"
            | "source_status";
          title: string;
          summary: string;
          source_url: string | null;
          observed_at: string;
          region_id: string | null;
          complex_id: string | null;
          building_id: string | null;
          unit_id: string | null;
          region_name: string | null;
          entity_label: string | null;
          metric_label: string | null;
          metric_value: number | null;
          metric_unit: string | null;
          payload: Json;
          is_sample: boolean;
          confidence: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          dedupe_key: string;
          source: "sample" | "naver" | "ecos" | "data_go_kr" | "reb" | "law" | "admin";
          kind:
            | "news_context"
            | "interest_rate"
            | "trade"
            | "rent"
            | "market_stat"
            | "law"
            | "policy"
            | "subscription"
            | "source_status";
          title: string;
          summary: string;
          source_url?: string | null;
          observed_at?: string;
          region_id?: string | null;
          complex_id?: string | null;
          building_id?: string | null;
          unit_id?: string | null;
          region_name?: string | null;
          entity_label?: string | null;
          metric_label?: string | null;
          metric_value?: number | null;
          metric_unit?: string | null;
          payload?: Json;
          is_sample?: boolean;
          confidence?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          dedupe_key?: string;
          source?: "sample" | "naver" | "ecos" | "data_go_kr" | "reb" | "law" | "admin";
          kind?:
            | "news_context"
            | "interest_rate"
            | "trade"
            | "rent"
            | "market_stat"
            | "law"
            | "policy"
            | "subscription"
            | "source_status";
          title?: string;
          summary?: string;
          source_url?: string | null;
          observed_at?: string;
          region_id?: string | null;
          complex_id?: string | null;
          building_id?: string | null;
          unit_id?: string | null;
          region_name?: string | null;
          entity_label?: string | null;
          metric_label?: string | null;
          metric_value?: number | null;
          metric_unit?: string | null;
          payload?: Json;
          is_sample?: boolean;
          confidence?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      link_observations: {
        Row: {
          link_id: string;
          observation_id: string;
          relevance: number;
          created_at: string;
        };
        Insert: {
          link_id: string;
          observation_id: string;
          relevance?: number;
          created_at?: string;
        };
        Update: {
          link_id?: string;
          observation_id?: string;
          relevance?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      community_posts: {
        Row: {
          id: string;
          title: string;
          body: string;
          post_type: "question" | "local_signal" | "link_tip" | "my_situation";
          region: string;
          category: string | null;
          source_url: string | null;
          related_link_id: string | null;
          status: "pending" | "published" | "rejected";
          created_by: string | null;
          author_email: string;
          vote_count: number;
          comment_count: number;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          body: string;
          post_type: "question" | "local_signal" | "link_tip" | "my_situation";
          region?: string;
          category?: string | null;
          source_url?: string | null;
          related_link_id?: string | null;
          status?: "pending" | "published" | "rejected";
          created_by?: string | null;
          author_email?: string;
          vote_count?: number;
          comment_count?: number;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          body?: string;
          post_type?: "question" | "local_signal" | "link_tip" | "my_situation";
          region?: string;
          category?: string | null;
          source_url?: string | null;
          related_link_id?: string | null;
          status?: "pending" | "published" | "rejected";
          created_by?: string | null;
          author_email?: string;
          vote_count?: number;
          comment_count?: number;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
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
          evidence_count: number;
          evidence_updated_at: string | null;
          grounding_notes: string[];
          uncertainties: string[];
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
          evidence_count?: number;
          evidence_updated_at?: string | null;
          grounding_notes?: string[];
          uncertainties?: string[];
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
          evidence_count?: number;
          evidence_updated_at?: string | null;
          grounding_notes?: string[];
          uncertainties?: string[];
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
          grounding_notes: string[];
          uncertainties: string[];
          source_observation_ids: string[];
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
          grounding_notes?: string[];
          uncertainties?: string[];
          source_observation_ids?: string[];
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
          grounding_notes?: string[];
          uncertainties?: string[];
          source_observation_ids?: string[];
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

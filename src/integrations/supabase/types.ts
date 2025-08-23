export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4";
  };
  public: {
    Tables: {
      calendar_events: {
        Row: {
          color: string | null;
          created_at: string;
          description: string | null;
          event_date: string;
          event_time: string;
          id: string;
          metadata: Json | null;
          platform: string;
          status: string;
          title: string;
          updated_at: string;
          user_id: string;
          workspace_id: string;
        };
        Insert: {
          color?: string | null;
          created_at?: string;
          description?: string | null;
          event_date: string;
          event_time: string;
          id?: string;
          metadata?: Json | null;
          platform: string;
          status: string;
          title: string;
          updated_at?: string;
          user_id: string;
          workspace_id: string;
        };
        Update: {
          color?: string | null;
          created_at?: string;
          description?: string | null;
          event_date?: string;
          event_time?: string;
          id?: string;
          metadata?: Json | null;
          platform?: string;
          status?: string;
          title?: string;
          updated_at?: string;
          user_id?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "calendar_events_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          }
        ];
      };
      campaigns: {
        Row: {
          budget: number | null;
          created_at: string | null;
          description: string | null;
          end_date: string | null;
          id: string;
          metadata: Json | null;
          name: string;
          start_date: string | null;
          status: Database["public"]["Enums"]["CampaignStatus"];
          tags: string[] | null;
          updated_at: string | null;
          user_id: string;
          workspace_id: string;
        };
        Insert: {
          budget?: number | null;
          created_at?: string | null;
          description?: string | null;
          end_date?: string | null;
          id?: string;
          metadata?: Json | null;
          name: string;
          start_date?: string | null;
          status?: Database["public"]["Enums"]["CampaignStatus"];
          tags?: string[] | null;
          updated_at?: string | null;
          user_id: string;
          workspace_id: string;
        };
        Update: {
          budget?: number | null;
          created_at?: string | null;
          description?: string | null;
          end_date?: string | null;
          id?: string;
          metadata?: Json | null;
          name?: string;
          start_date?: string | null;
          status?: Database["public"]["Enums"]["CampaignStatus"];
          tags?: string[] | null;
          updated_at?: string | null;
          user_id?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "campaigns_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          }
        ];
      };
      workspaces: {
        Row: {
          billing_cycle: string | null;
          created_at: string | null;
          credits: number;
          credits_used: number;
          description: string | null;
          id: string;
          name: string;
          owner_id: string;
          plan: Database["public"]["Enums"]["Plan"];
          slug: string;
          updated_at: string | null;
        };
        Insert: {
          billing_cycle?: string | null;
          created_at?: string | null;
          credits?: number;
          credits_used?: number;
          description?: string | null;
          id?: string;
          name: string;
          owner_id: string;
          plan?: Database["public"]["Enums"]["Plan"];
          slug: string;
          updated_at?: string | null;
        };
        Update: {
          billing_cycle?: string | null;
          created_at?: string | null;
          credits?: number;
          credits_used?: number;
          description?: string | null;
          id?: string;
          name?: string;
          owner_id?: string;
          plan?: Database["public"]["Enums"]["Plan"];
          slug?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string | null;
          customer_id: string | null;
          email: string;
          full_name: string | null;
          id: string;
          last_ip_address: unknown | null;
          last_login_at: string | null;
          monthly_tokens_limit: number | null;
          monthly_tokens_used: number | null;
          plan: string | null;
          role: string | null;
          subscription_id: string | null;
          subscription_status: string | null;
          total_content_generated: number | null;
          total_tokens_used: number | null;
          trial_ends_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string | null;
          customer_id?: string | null;
          email: string;
          full_name?: string | null;
          id: string;
          last_ip_address?: unknown | null;
          last_login_at?: string | null;
          monthly_tokens_limit?: number | null;
          monthly_tokens_used?: number | null;
          plan?: string | null;
          role?: string | null;
          subscription_id?: string | null;
          subscription_status?: string | null;
          total_content_generated?: number | null;
          total_tokens_used?: number | null;
          trial_ends_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string | null;
          customer_id?: string | null;
          email?: string;
          full_name?: string | null;
          id?: string;
          last_ip_address?: unknown | null;
          last_login_at?: string | null;
          monthly_tokens_limit?: number | null;
          monthly_tokens_used?: number | null;
          plan?: string | null;
          role?: string | null;
          subscription_id?: string | null;
          subscription_status?: string | null;
          total_content_generated?: number | null;
          total_tokens_used?: number | null;
          trial_ends_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      brand_voices: {
        Row: {
          created_at: string | null;
          description: string | null;
          examples: string[] | null;
          guidelines: string | null;
          id: string;
          is_active: boolean | null;
          name: string;
          style: string;
          tone: string;
          updated_at: string | null;
          usage_count: number | null;
          user_id: string;
          workspace_id: string;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          examples?: string[] | null;
          guidelines?: string | null;
          id?: string;
          is_active?: boolean | null;
          name: string;
          style: string;
          tone: string;
          updated_at?: string | null;
          usage_count?: number | null;
          user_id: string;
          workspace_id: string;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          examples?: string[] | null;
          guidelines?: string | null;
          id?: string;
          is_active?: boolean | null;
          name?: string;
          style?: string;
          tone?: string;
          updated_at?: string | null;
          usage_count?: number | null;
          user_id?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "brand_voices_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          }
        ];
      };
      target_personas: {
        Row: {
          age_range: string | null;
          created_at: string | null;
          goals: string[] | null;
          id: string;
          interests: string[] | null;
          location: string | null;
          name: string;
          occupation: string | null;
          pain_points: string[] | null;
          preferred_channels: string[] | null;
          updated_at: string | null;
          usage_count: number | null;
          user_id: string;
          workspace_id: string;
        };
        Insert: {
          age_range?: string | null;
          created_at?: string | null;
          goals?: string[] | null;
          id?: string;
          interests?: string[] | null;
          location?: string | null;
          name: string;
          occupation?: string | null;
          pain_points?: string[] | null;
          preferred_channels?: string[] | null;
          updated_at?: string | null;
          usage_count?: number | null;
          user_id: string;
          workspace_id: string;
        };
        Update: {
          age_range?: string | null;
          created_at?: string | null;
          goals?: string[] | null;
          id?: string;
          interests?: string[] | null;
          location?: string | null;
          name?: string;
          occupation?: string | null;
          pain_points?: string[] | null;
          preferred_channels?: string[] | null;
          updated_at?: string | null;
          usage_count?: number | null;
          user_id?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "target_personas_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          }
        ];
      };
      generated_copies: {
        Row: {
          ai_model: string;
          ai_provider: string;
          brand_voice_id: string | null;
          brief: Json;
          campaign_id: string | null;
          channel: string;
          content: string;
          created_at: string | null;
          credits_used: number;
          id: string;
          is_favorite: boolean | null;
          persona_id: string | null;
          status: string | null;
          updated_at: string | null;
          user_id: string;
          word_count: number;
          workspace_id: string;
        };
        Insert: {
          ai_model?: string;
          ai_provider?: string;
          brand_voice_id?: string | null;
          brief: Json;
          campaign_id?: string | null;
          channel: string;
          content: string;
          created_at?: string | null;
          credits_used?: number;
          id?: string;
          is_favorite?: boolean | null;
          persona_id?: string | null;
          status?: string | null;
          updated_at?: string | null;
          user_id: string;
          word_count?: number;
          workspace_id: string;
        };
        Update: {
          ai_model?: string;
          ai_provider?: string;
          brand_voice_id?: string | null;
          brief?: Json;
          campaign_id?: string | null;
          channel?: string;
          content?: string;
          created_at?: string | null;
          credits_used?: number;
          id?: string;
          is_favorite?: boolean | null;
          persona_id?: string | null;
          status?: string | null;
          updated_at?: string | null;
          user_id?: string;
          word_count?: number;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "generated_copies_brand_voice_id_fkey";
            columns: ["brand_voice_id"];
            isOneToOne: false;
            referencedRelation: "brand_voices";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "generated_copies_campaign_id_fkey";
            columns: ["campaign_id"];
            isOneToOne: false;
            referencedRelation: "campaigns";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "generated_copies_persona_id_fkey";
            columns: ["persona_id"];
            isOneToOne: false;
            referencedRelation: "target_personas";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "generated_copies_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          }
        ];
      };
      templates: {
        Row: {
          category: string | null;
          content: string;
          created_at: string | null;
          description: string | null;
          id: string;
          is_public: boolean | null;
          metadata: Json | null;
          name: string;
          tags: string[] | null;
          type: Database["public"]["Enums"]["TemplateType"];
          updated_at: string | null;
          usage_count: number | null;
          user_id: string;
          variables: string[] | null;
          workspace_id: string;
        };
        Insert: {
          category?: string | null;
          content: string;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          is_public?: boolean | null;
          metadata?: Json | null;
          name: string;
          tags?: string[] | null;
          type: Database["public"]["Enums"]["TemplateType"];
          updated_at?: string | null;
          usage_count?: number | null;
          user_id: string;
          variables?: string[] | null;
          workspace_id: string;
        };
        Update: {
          category?: string | null;
          content?: string;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          is_public?: boolean | null;
          metadata?: Json | null;
          name?: string;
          tags?: string[] | null;
          type?: Database["public"]["Enums"]["TemplateType"];
          updated_at?: string | null;
          usage_count?: number | null;
          user_id?: string;
          variables?: string[] | null;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "templates_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      CampaignStatus: "DRAFT" | "ACTIVE" | "PAUSED" | "COMPLETED";
      Plan: "FREE" | "STARTER" | "PRO" | "ENTERPRISE";
      TemplateType: "AD" | "EMAIL" | "SOCIAL" | "BLOG" | "LANDING";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
      DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
      DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      _prisma_migrations: {
        Row: {
          applied_steps_count: number
          checksum: string
          finished_at: string | null
          id: string
          logs: string | null
          migration_name: string
          rolled_back_at: string | null
          started_at: string
        }
        Insert: {
          applied_steps_count?: number
          checksum: string
          finished_at?: string | null
          id: string
          logs?: string | null
          migration_name: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Update: {
          applied_steps_count?: number
          checksum?: string
          finished_at?: string | null
          id?: string
          logs?: string | null
          migration_name?: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Relationships: []
      }
      admin_analytics: {
        Row: {
          created_at: string | null
          date: string
          id: string
          metadata: Json | null
          metric_type: string
          metric_value: number
        }
        Insert: {
          created_at?: string | null
          date?: string
          id?: string
          metadata?: Json | null
          metric_type: string
          metric_value?: number
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          metadata?: Json | null
          metric_type?: string
          metric_value?: number
        }
        Relationships: []
      }
      admin_audit_logs: {
        Row: {
          action: string
          admin_id: string | null
          created_at: string | null
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          target_id: string | null
          target_type: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          admin_id?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          target_id?: string | null
          target_type?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          admin_id?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          target_id?: string | null
          target_type?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      admin_integrations: {
        Row: {
          created_at: string | null
          default_analytics_provider: string | null
          default_email_provider: string | null
          facebook_active: boolean | null
          facebook_app_id: string | null
          facebook_app_secret: string | null
          google_analytics_active: boolean | null
          google_analytics_id: string | null
          google_client_id: string | null
          google_client_secret: string | null
          google_oauth_active: boolean | null
          id: string
          mixpanel_active: boolean | null
          mixpanel_token: string | null
          resend_active: boolean | null
          resend_api_key: string | null
          resend_from_email: string | null
          resend_from_name: string | null
          sendgrid_active: boolean | null
          sendgrid_api_key: string | null
          sendgrid_from_email: string | null
          sendgrid_from_name: string | null
          sentry_active: boolean | null
          sentry_dsn: string | null
          stripe_active: boolean | null
          stripe_mode: string | null
          stripe_publishable_key: string | null
          stripe_secret_key: string | null
          stripe_webhook_secret: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          default_analytics_provider?: string | null
          default_email_provider?: string | null
          facebook_active?: boolean | null
          facebook_app_id?: string | null
          facebook_app_secret?: string | null
          google_analytics_active?: boolean | null
          google_analytics_id?: string | null
          google_client_id?: string | null
          google_client_secret?: string | null
          google_oauth_active?: boolean | null
          id?: string
          mixpanel_active?: boolean | null
          mixpanel_token?: string | null
          resend_active?: boolean | null
          resend_api_key?: string | null
          resend_from_email?: string | null
          resend_from_name?: string | null
          sendgrid_active?: boolean | null
          sendgrid_api_key?: string | null
          sendgrid_from_email?: string | null
          sendgrid_from_name?: string | null
          sentry_active?: boolean | null
          sentry_dsn?: string | null
          stripe_active?: boolean | null
          stripe_mode?: string | null
          stripe_publishable_key?: string | null
          stripe_secret_key?: string | null
          stripe_webhook_secret?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          default_analytics_provider?: string | null
          default_email_provider?: string | null
          facebook_active?: boolean | null
          facebook_app_id?: string | null
          facebook_app_secret?: string | null
          google_analytics_active?: boolean | null
          google_analytics_id?: string | null
          google_client_id?: string | null
          google_client_secret?: string | null
          google_oauth_active?: boolean | null
          id?: string
          mixpanel_active?: boolean | null
          mixpanel_token?: string | null
          resend_active?: boolean | null
          resend_api_key?: string | null
          resend_from_email?: string | null
          resend_from_name?: string | null
          sendgrid_active?: boolean | null
          sendgrid_api_key?: string | null
          sendgrid_from_email?: string | null
          sendgrid_from_name?: string | null
          sentry_active?: boolean | null
          sentry_dsn?: string | null
          stripe_active?: boolean | null
          stripe_mode?: string | null
          stripe_publishable_key?: string | null
          stripe_secret_key?: string | null
          stripe_webhook_secret?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      admin_invites: {
        Row: {
          accepted_at: string | null
          created_at: string | null
          email: string
          expires_at: string
          id: string
          invited_by: string | null
          notes: string | null
          permissions: Json | null
          role: string
          status: string
          token: string
          updated_at: string | null
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string | null
          email: string
          expires_at: string
          id?: string
          invited_by?: string | null
          notes?: string | null
          permissions?: Json | null
          role: string
          status?: string
          token: string
          updated_at?: string | null
        }
        Update: {
          accepted_at?: string | null
          created_at?: string | null
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          notes?: string | null
          permissions?: Json | null
          role?: string
          status?: string
          token?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      admin_llm_settings: {
        Row: {
          anthropic_active: boolean | null
          anthropic_api_key: string | null
          anthropic_model: string | null
          created_at: string | null
          default_provider: string | null
          frequency_penalty: number | null
          gemini_active: boolean | null
          gemini_api_key: string | null
          gemini_model: string | null
          huggingface_active: boolean | null
          huggingface_api_key: string | null
          huggingface_model: string | null
          id: string
          max_tokens: number | null
          ollama_active: boolean | null
          ollama_base_url: string | null
          ollama_model: string | null
          openai_active: boolean | null
          openai_api_key: string | null
          openai_model: string | null
          openrouter_active: boolean | null
          openrouter_api_key: string | null
          openrouter_model: string | null
          presence_penalty: number | null
          temperature: number | null
          top_p: number | null
          updated_at: string | null
        }
        Insert: {
          anthropic_active?: boolean | null
          anthropic_api_key?: string | null
          anthropic_model?: string | null
          created_at?: string | null
          default_provider?: string | null
          frequency_penalty?: number | null
          gemini_active?: boolean | null
          gemini_api_key?: string | null
          gemini_model?: string | null
          huggingface_active?: boolean | null
          huggingface_api_key?: string | null
          huggingface_model?: string | null
          id?: string
          max_tokens?: number | null
          ollama_active?: boolean | null
          ollama_base_url?: string | null
          ollama_model?: string | null
          openai_active?: boolean | null
          openai_api_key?: string | null
          openai_model?: string | null
          openrouter_active?: boolean | null
          openrouter_api_key?: string | null
          openrouter_model?: string | null
          presence_penalty?: number | null
          temperature?: number | null
          top_p?: number | null
          updated_at?: string | null
        }
        Update: {
          anthropic_active?: boolean | null
          anthropic_api_key?: string | null
          anthropic_model?: string | null
          created_at?: string | null
          default_provider?: string | null
          frequency_penalty?: number | null
          gemini_active?: boolean | null
          gemini_api_key?: string | null
          gemini_model?: string | null
          huggingface_active?: boolean | null
          huggingface_api_key?: string | null
          huggingface_model?: string | null
          id?: string
          max_tokens?: number | null
          ollama_active?: boolean | null
          ollama_base_url?: string | null
          ollama_model?: string | null
          openai_active?: boolean | null
          openai_api_key?: string | null
          openai_model?: string | null
          openrouter_active?: boolean | null
          openrouter_api_key?: string | null
          openrouter_model?: string | null
          presence_penalty?: number | null
          temperature?: number | null
          top_p?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      admin_managers: {
        Row: {
          activated_at: string | null
          created_at: string | null
          email: string
          full_name: string
          id: string
          invited_at: string | null
          invited_by: string | null
          last_login_at: string | null
          notes: string | null
          permissions: Json | null
          profile_id: string | null
          role: Database["public"]["Enums"]["admin_role_type"]
          status: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          activated_at?: string | null
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          last_login_at?: string | null
          notes?: string | null
          permissions?: Json | null
          profile_id?: string | null
          role?: Database["public"]["Enums"]["admin_role_type"]
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          activated_at?: string | null
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          last_login_at?: string | null
          notes?: string | null
          permissions?: Json | null
          profile_id?: string | null
          role?: Database["public"]["Enums"]["admin_role_type"]
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_managers_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "admin_managers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_managers_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_role_permissions: {
        Row: {
          created_at: string | null
          id: string
          module: string
          permissions: string[]
          role: Database["public"]["Enums"]["admin_role_type"]
        }
        Insert: {
          created_at?: string | null
          id?: string
          module: string
          permissions: string[]
          role: Database["public"]["Enums"]["admin_role_type"]
        }
        Update: {
          created_at?: string | null
          id?: string
          module?: string
          permissions?: string[]
          role?: Database["public"]["Enums"]["admin_role_type"]
        }
        Relationships: []
      }
      admin_users_overview: {
        Row: {
          admin_notes: string | null
          avatar_url: string | null
          banned_at: string | null
          banned_by: string | null
          banned_reason: string | null
          created_at: string | null
          customer_id: string | null
          email: string
          full_name: string | null
          id: string
          last_ip_address: unknown | null
          last_login_at: string | null
          monthly_tokens_limit: number | null
          monthly_tokens_used: number | null
          notes: string | null
          plan: string | null
          referral_code: string | null
          referred_by: string | null
          signup_source: string | null
          status: string | null
          subscription_id: string | null
          subscription_status: string | null
          total_content_generated: number | null
          total_tokens_used: number | null
          trial_ends_at: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          avatar_url?: string | null
          banned_at?: string | null
          banned_by?: string | null
          banned_reason?: string | null
          created_at?: string | null
          customer_id?: string | null
          email: string
          full_name?: string | null
          id?: string
          last_ip_address?: unknown | null
          last_login_at?: string | null
          monthly_tokens_limit?: number | null
          monthly_tokens_used?: number | null
          notes?: string | null
          plan?: string | null
          referral_code?: string | null
          referred_by?: string | null
          signup_source?: string | null
          status?: string | null
          subscription_id?: string | null
          subscription_status?: string | null
          total_content_generated?: number | null
          total_tokens_used?: number | null
          trial_ends_at?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          avatar_url?: string | null
          banned_at?: string | null
          banned_by?: string | null
          banned_reason?: string | null
          created_at?: string | null
          customer_id?: string | null
          email?: string
          full_name?: string | null
          id?: string
          last_ip_address?: unknown | null
          last_login_at?: string | null
          monthly_tokens_limit?: number | null
          monthly_tokens_used?: number | null
          notes?: string | null
          plan?: string | null
          referral_code?: string | null
          referred_by?: string | null
          signup_source?: string | null
          status?: string | null
          subscription_id?: string | null
          subscription_status?: string | null
          total_content_generated?: number | null
          total_tokens_used?: number | null
          trial_ends_at?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      ai_suggestions: {
        Row: {
          action_data: Json | null
          action_type: string | null
          created_at: string | null
          description: string | null
          id: string
          is_dismissed: boolean | null
          priority: string | null
          title: string
          type: string
          user_id: string
          workspace_id: string
        }
        Insert: {
          action_data?: Json | null
          action_type?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_dismissed?: boolean | null
          priority?: string | null
          title: string
          type: string
          user_id: string
          workspace_id: string
        }
        Update: {
          action_data?: Json | null
          action_type?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_dismissed?: boolean | null
          priority?: string | null
          title?: string
          type?: string
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_suggestions_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_usage_logs: {
        Row: {
          cost: number | null
          created_at: string | null
          error_message: string | null
          id: string
          model: string
          provider: string
          request_type: string | null
          success: boolean | null
          tokens_used: number
          user_id: string | null
          workspace_id: string | null
        }
        Insert: {
          cost?: number | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          model: string
          provider: string
          request_type?: string | null
          success?: boolean | null
          tokens_used?: number
          user_id?: string | null
          workspace_id?: string | null
        }
        Update: {
          cost?: number | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          model?: string
          provider?: string
          request_type?: string | null
          success?: boolean | null
          tokens_used?: number
          user_id?: string | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_usage_logs_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      billing_events: {
        Row: {
          amount: number | null
          created_at: string | null
          currency: string | null
          event_type: string
          id: string
          metadata: Json | null
          processed: boolean | null
          stripe_event_id: string | null
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          currency?: string | null
          event_type: string
          id?: string
          metadata?: Json | null
          processed?: boolean | null
          stripe_event_id?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          currency?: string | null
          event_type?: string
          id?: string
          metadata?: Json | null
          processed?: boolean | null
          stripe_event_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      brand_voices: {
        Row: {
          created_at: string | null
          description: string | null
          examples: string[] | null
          guidelines: string | null
          id: string
          is_active: boolean | null
          name: string
          style: string
          tone: string
          updated_at: string | null
          usage_count: number | null
          user_id: string
          workspace_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          examples?: string[] | null
          guidelines?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          style: string
          tone: string
          updated_at?: string | null
          usage_count?: number | null
          user_id: string
          workspace_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          examples?: string[] | null
          guidelines?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          style?: string
          tone?: string
          updated_at?: string | null
          usage_count?: number | null
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "brand_voices_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          budget: number | null
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          metadata: Json | null
          name: string
          start_date: string | null
          status: Database["public"]["Enums"]["CampaignStatus"]
          tags: string[] | null
          updated_at: string | null
          user_id: string
          workspace_id: string
        }
        Insert: {
          budget?: number | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          metadata?: Json | null
          name: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["CampaignStatus"]
          tags?: string[] | null
          updated_at?: string | null
          user_id: string
          workspace_id: string
        }
        Update: {
          budget?: number | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["CampaignStatus"]
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      generated_copies: {
        Row: {
          ai_model: string
          ai_provider: string
          brand_voice_id: string | null
          brief: Json
          campaign_id: string | null
          channel: string
          content: string
          created_at: string | null
          credits_used: number
          id: string
          is_favorite: boolean | null
          persona_id: string | null
          status: string | null
          updated_at: string | null
          user_id: string
          word_count: number
          workspace_id: string
        }
        Insert: {
          ai_model?: string
          ai_provider?: string
          brand_voice_id?: string | null
          brief: Json
          campaign_id?: string | null
          channel: string
          content: string
          created_at?: string | null
          credits_used?: number
          id?: string
          is_favorite?: boolean | null
          persona_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
          word_count?: number
          workspace_id: string
        }
        Update: {
          ai_model?: string
          ai_provider?: string
          brand_voice_id?: string | null
          brief?: Json
          campaign_id?: string | null
          channel?: string
          content?: string
          created_at?: string | null
          credits_used?: number
          id?: string
          is_favorite?: boolean | null
          persona_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
          word_count?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "generated_copies_brand_voice_id_fkey"
            columns: ["brand_voice_id"]
            isOneToOne: false
            referencedRelation: "brand_voices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "generated_copies_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "generated_copies_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "target_personas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "generated_copies_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      metrics_cache: {
        Row: {
          cache_data: Json
          cache_key: string
          created_at: string | null
          expires_at: string
          id: string
          updated_at: string | null
        }
        Insert: {
          cache_data: Json
          cache_key: string
          created_at?: string | null
          expires_at: string
          id?: string
          updated_at?: string | null
        }
        Update: {
          cache_data?: Json
          cache_key?: string
          created_at?: string | null
          expires_at?: string
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string | null
          id: string
          message: string | null
          metadata: Json | null
          read_at: string | null
          title: string
          type: string
          user_id: string
          workspace_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          message?: string | null
          metadata?: Json | null
          read_at?: string | null
          title: string
          type: string
          user_id: string
          workspace_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          message?: string | null
          metadata?: Json | null
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          customer_id: string | null
          email: string
          full_name: string | null
          id: string
          last_ip_address: unknown | null
          last_login_at: string | null
          monthly_tokens_limit: number | null
          monthly_tokens_used: number | null
          plan: string | null
          role: string | null
          subscription_id: string | null
          subscription_status: string | null
          total_content_generated: number | null
          total_tokens_used: number | null
          trial_ends_at: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          customer_id?: string | null
          email: string
          full_name?: string | null
          id: string
          last_ip_address?: unknown | null
          last_login_at?: string | null
          monthly_tokens_limit?: number | null
          monthly_tokens_used?: number | null
          plan?: string | null
          role?: string | null
          subscription_id?: string | null
          subscription_status?: string | null
          total_content_generated?: number | null
          total_tokens_used?: number | null
          trial_ends_at?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          customer_id?: string | null
          email?: string
          full_name?: string | null
          id?: string
          last_ip_address?: unknown | null
          last_login_at?: string | null
          monthly_tokens_limit?: number | null
          monthly_tokens_used?: number | null
          plan?: string | null
          role?: string | null
          subscription_id?: string | null
          subscription_status?: string | null
          total_content_generated?: number | null
          total_tokens_used?: number | null
          trial_ends_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      security_settings: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_sensitive: boolean | null
          setting_key: string
          setting_value: Json
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_sensitive?: boolean | null
          setting_key: string
          setting_value: Json
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_sensitive?: boolean | null
          setting_key?: string
          setting_value?: Json
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      system_logs: {
        Row: {
          created_at: string | null
          id: string
          level: string
          message: string
          metadata: Json | null
          service: string
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          level: string
          message: string
          metadata?: Json | null
          service: string
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          level?: string
          message?: string
          metadata?: Json | null
          service?: string
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      system_metrics: {
        Row: {
          active_users: number | null
          cpu_usage_percentage: number | null
          created_at: string | null
          disk_usage_percentage: number | null
          error_rate_percentage: number | null
          id: string
          memory_usage_percentage: number | null
          network_traffic_gb: number | null
          response_time_ms: number | null
          timestamp: string | null
          uptime_percentage: number | null
        }
        Insert: {
          active_users?: number | null
          cpu_usage_percentage?: number | null
          created_at?: string | null
          disk_usage_percentage?: number | null
          error_rate_percentage?: number | null
          id?: string
          memory_usage_percentage?: number | null
          network_traffic_gb?: number | null
          response_time_ms?: number | null
          timestamp?: string | null
          uptime_percentage?: number | null
        }
        Update: {
          active_users?: number | null
          cpu_usage_percentage?: number | null
          created_at?: string | null
          disk_usage_percentage?: number | null
          error_rate_percentage?: number | null
          id?: string
          memory_usage_percentage?: number | null
          network_traffic_gb?: number | null
          response_time_ms?: number | null
          timestamp?: string | null
          uptime_percentage?: number | null
        }
        Relationships: []
      }
      target_personas: {
        Row: {
          age_range: string | null
          created_at: string | null
          goals: string[] | null
          id: string
          interests: string[] | null
          location: string | null
          name: string
          occupation: string | null
          pain_points: string[] | null
          preferred_channels: string[] | null
          updated_at: string | null
          usage_count: number | null
          user_id: string
          workspace_id: string
        }
        Insert: {
          age_range?: string | null
          created_at?: string | null
          goals?: string[] | null
          id?: string
          interests?: string[] | null
          location?: string | null
          name: string
          occupation?: string | null
          pain_points?: string[] | null
          preferred_channels?: string[] | null
          updated_at?: string | null
          usage_count?: number | null
          user_id: string
          workspace_id: string
        }
        Update: {
          age_range?: string | null
          created_at?: string | null
          goals?: string[] | null
          id?: string
          interests?: string[] | null
          location?: string | null
          name?: string
          occupation?: string | null
          pain_points?: string[] | null
          preferred_channels?: string[] | null
          updated_at?: string | null
          usage_count?: number | null
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "target_personas_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      templates: {
        Row: {
          category: string | null
          content: string
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          metadata: Json | null
          name: string
          tags: string[] | null
          type: Database["public"]["Enums"]["TemplateType"]
          updated_at: string | null
          usage_count: number | null
          user_id: string
          variables: string[] | null
          workspace_id: string
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          metadata?: Json | null
          name: string
          tags?: string[] | null
          type: Database["public"]["Enums"]["TemplateType"]
          updated_at?: string | null
          usage_count?: number | null
          user_id: string
          variables?: string[] | null
          workspace_id: string
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          metadata?: Json | null
          name?: string
          tags?: string[] | null
          type?: Database["public"]["Enums"]["TemplateType"]
          updated_at?: string | null
          usage_count?: number | null
          user_id?: string
          variables?: string[] | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "templates_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      usage_events: {
        Row: {
          created_at: string | null
          credits_used: number
          event_type: string
          id: string
          metadata: Json | null
          user_id: string
          workspace_id: string
        }
        Insert: {
          created_at?: string | null
          credits_used?: number
          event_type: string
          id?: string
          metadata?: Json | null
          user_id: string
          workspace_id: string
        }
        Update: {
          created_at?: string | null
          credits_used?: number
          event_type?: string
          id?: string
          metadata?: Json | null
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "usage_events_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activities: {
        Row: {
          action: string | null
          created_at: string | null
          description: string | null
          id: string
          metadata: Json | null
          target_id: string | null
          target_type: string | null
          title: string
          type: string
          user_id: string
          workspace_id: string
        }
        Insert: {
          action?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          target_id?: string | null
          target_type?: string | null
          title: string
          type: string
          user_id: string
          workspace_id: string
        }
        Update: {
          action?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          target_id?: string | null
          target_type?: string | null
          title?: string
          type?: string
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_activities_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          created_at: string | null
          email_notifications: Json | null
          id: string
          in_app_notifications: Json | null
          privacy_settings: Json | null
          ui_preferences: Json | null
          updated_at: string | null
          user_id: string
          workspace_id: string
        }
        Insert: {
          created_at?: string | null
          email_notifications?: Json | null
          id?: string
          in_app_notifications?: Json | null
          privacy_settings?: Json | null
          ui_preferences?: Json | null
          updated_at?: string | null
          user_id: string
          workspace_id: string
        }
        Update: {
          created_at?: string | null
          email_notifications?: Json | null
          id?: string
          in_app_notifications?: Json | null
          privacy_settings?: Json | null
          ui_preferences?: Json | null
          updated_at?: string | null
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace_members: {
        Row: {
          created_at: string | null
          id: string
          joined_at: string | null
          role: Database["public"]["Enums"]["WorkspaceRole"]
          status: string
          updated_at: string | null
          user_id: string
          workspace_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          joined_at?: string | null
          role?: Database["public"]["Enums"]["WorkspaceRole"]
          status?: string
          updated_at?: string | null
          user_id: string
          workspace_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          joined_at?: string | null
          role?: Database["public"]["Enums"]["WorkspaceRole"]
          status?: string
          updated_at?: string | null
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_members_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspaces: {
        Row: {
          billing_cycle: string | null
          created_at: string | null
          credits: number
          credits_used: number
          description: string | null
          id: string
          name: string
          owner_id: string
          plan: Database["public"]["Enums"]["Plan"]
          slug: string
          updated_at: string | null
        }
        Insert: {
          billing_cycle?: string | null
          created_at?: string | null
          credits?: number
          credits_used?: number
          description?: string | null
          id?: string
          name: string
          owner_id: string
          plan?: Database["public"]["Enums"]["Plan"]
          slug: string
          updated_at?: string | null
        }
        Update: {
          billing_cycle?: string | null
          created_at?: string | null
          credits?: number
          credits_used?: number
          description?: string | null
          id?: string
          name?: string
          owner_id?: string
          plan?: Database["public"]["Enums"]["Plan"]
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_token_limit: {
        Args: { tokens_to_use: number; user_id: string }
        Returns: boolean
      }
      cleanup_expired_cache: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      cleanup_expired_invites: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_ai_usage_stats: {
        Args: { timeframe?: string }
        Returns: Json
      }
      get_revenue_stats: {
        Args: { timeframe?: string }
        Returns: Json
      }
      get_system_logs: {
        Args: {
          log_level?: string
          page_num?: number
          page_size?: number
          service_filter?: string
        }
        Returns: Json
      }
      get_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_stats: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      increment_token_usage: {
        Args: { tokens_used: number; user_id: string }
        Returns: undefined
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_super_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      reset_monthly_token_usage: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_system_metrics: {
        Args: {
          active_users_count?: number
          cpu_usage?: number
          disk_usage?: number
          error_rate?: number
          memory_usage?: number
          network_traffic?: number
          response_time?: number
          uptime_pct?: number
        }
        Returns: Json
      }
    }
    Enums: {
      admin_role_type:
        | "super_admin"
        | "admin"
        | "blog_admin"
        | "analytics_admin"
        | "support_admin"
      CampaignStatus: "DRAFT" | "ACTIVE" | "PAUSED" | "COMPLETED"
      CopyStatus: "DRAFT" | "PUBLISHED" | "ARCHIVED"
      CopyType: "AD" | "EMAIL" | "SOCIAL" | "BLOG" | "LANDING"
      CreditType: "PURCHASE" | "USAGE" | "BONUS" | "REFUND"
      Plan: "FREE" | "STARTER" | "PRO" | "ENTERPRISE"
      Platform:
        | "FACEBOOK"
        | "INSTAGRAM"
        | "TWITTER"
        | "LINKEDIN"
        | "GOOGLE"
        | "EMAIL"
        | "BLOG"
      SubscriptionStatus: "ACTIVE" | "INACTIVE" | "CANCELED" | "PAST_DUE"
      TemplateType: "AD" | "EMAIL" | "SOCIAL" | "BLOG" | "LANDING"
      WorkspaceRole: "OWNER" | "ADMIN" | "MEMBER"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      admin_role_type: [
        "super_admin",
        "admin",
        "blog_admin",
        "analytics_admin",
        "support_admin",
      ],
      CampaignStatus: ["DRAFT", "ACTIVE", "PAUSED", "COMPLETED"],
      CopyStatus: ["DRAFT", "PUBLISHED", "ARCHIVED"],
      CopyType: ["AD", "EMAIL", "SOCIAL", "BLOG", "LANDING"],
      CreditType: ["PURCHASE", "USAGE", "BONUS", "REFUND"],
      Plan: ["FREE", "STARTER", "PRO", "ENTERPRISE"],
      Platform: [
        "FACEBOOK",
        "INSTAGRAM",
        "TWITTER",
        "LINKEDIN",
        "GOOGLE",
        "EMAIL",
        "BLOG",
      ],
      SubscriptionStatus: ["ACTIVE", "INACTIVE", "CANCELED", "PAST_DUE"],
      TemplateType: ["AD", "EMAIL", "SOCIAL", "BLOG", "LANDING"],
      WorkspaceRole: ["OWNER", "ADMIN", "MEMBER"],
    },
  },
} as const

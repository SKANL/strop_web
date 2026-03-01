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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      ai_document_chunks: {
        Row: {
          chunk_index: number
          chunk_text: string
          created_at: string
          document_id: string
          document_url: string
          embedding: string | null
          id: string
          model: string
          organization_id: string
          provider: string
          updated_at: string
        }
        Insert: {
          chunk_index: number
          chunk_text: string
          created_at?: string
          document_id: string
          document_url: string
          embedding?: string | null
          id?: string
          model?: string
          organization_id: string
          provider?: string
          updated_at?: string
        }
        Update: {
          chunk_index?: number
          chunk_text?: string
          created_at?: string
          document_id?: string
          document_url?: string
          embedding?: string | null
          id?: string
          model?: string
          organization_id?: string
          provider?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_document_chunks_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_embeddings: {
        Row: {
          content_hash: string | null
          content_preview: string | null
          created_at: string
          embedding: string | null
          entity_id: string
          entity_type: string
          id: string
          model: string
          provider: string
          updated_at: string
        }
        Insert: {
          content_hash?: string | null
          content_preview?: string | null
          created_at?: string
          embedding?: string | null
          entity_id: string
          entity_type: string
          id?: string
          model?: string
          provider?: string
          updated_at?: string
        }
        Update: {
          content_hash?: string | null
          content_preview?: string | null
          created_at?: string
          embedding?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          model?: string
          provider?: string
          updated_at?: string
        }
        Relationships: []
      }
      ai_usage_logs: {
        Row: {
          cost_usd: number | null
          created_at: string | null
          error_message: string | null
          id: string
          latency_ms: number | null
          metadata: Json | null
          model: string
          provider: string
          success: boolean | null
          task_type: string
          tokens_used: number | null
          user_id: string | null
        }
        Insert: {
          cost_usd?: number | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          latency_ms?: number | null
          metadata?: Json | null
          model: string
          provider: string
          success?: boolean | null
          task_type: string
          tokens_used?: number | null
          user_id?: string | null
        }
        Update: {
          cost_usd?: number | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          latency_ms?: number | null
          metadata?: Json | null
          model?: string
          provider?: string
          success?: boolean | null
          task_type?: string
          tokens_used?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_usage_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          comment: string | null
          id: string
          incident_id: string | null
          modified_by: string | null
          new_value: Json | null
          old_value: Json | null
          timestamp: string
        }
        Insert: {
          action: string
          comment?: string | null
          id?: string
          incident_id?: string | null
          modified_by?: string | null
          new_value?: Json | null
          old_value?: Json | null
          timestamp?: string
        }
        Update: {
          action?: string
          comment?: string | null
          id?: string
          incident_id?: string | null
          modified_by?: string | null
          new_value?: Json | null
          old_value?: Json | null
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_incident_id_fkey"
            columns: ["incident_id"]
            isOneToOne: false
            referencedRelation: "incidents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_logs_modified_by_fkey"
            columns: ["modified_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      incident_photos: {
        Row: {
          annotations: Json | null
          id: string
          incident_id: string
          photo_type: string
          photo_url: string
          uploaded_at: string
          uploaded_by: string | null
        }
        Insert: {
          annotations?: Json | null
          id?: string
          incident_id: string
          photo_type: string
          photo_url: string
          uploaded_at?: string
          uploaded_by?: string | null
        }
        Update: {
          annotations?: Json | null
          id?: string
          incident_id?: string
          photo_type?: string
          photo_url?: string
          uploaded_at?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "incident_photos_incident_id_fkey"
            columns: ["incident_id"]
            isOneToOne: false
            referencedRelation: "incidents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incident_photos_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      incidents: {
        Row: {
          actual_cost: number | null
          ai_audit_result: Json | null
          approved_via_whatsapp: boolean | null
          assigned_at: string | null
          assigned_to: string | null
          audio_url: string | null
          category: string | null
          closed_at: string | null
          closed_by: string | null
          created_at: string
          created_by: string
          description: string
          estimated_cost: number
          folio_number: number
          gps_coords: unknown
          id: string
          is_billable: boolean
          location_tag: string | null
          priority: string
          project_id: string
          public_token: string | null
          rejection_reason: string | null
          resolution_photo_url: string | null
          resolution_timestamp: string | null
          status: string
          title: string | null
          updated_at: string
          whatsapp_approval_timestamp: string | null
        }
        Insert: {
          actual_cost?: number | null
          ai_audit_result?: Json | null
          approved_via_whatsapp?: boolean | null
          assigned_at?: string | null
          assigned_to?: string | null
          audio_url?: string | null
          category?: string | null
          closed_at?: string | null
          closed_by?: string | null
          created_at?: string
          created_by: string
          description: string
          estimated_cost?: number
          folio_number: number
          gps_coords?: unknown
          id?: string
          is_billable?: boolean
          location_tag?: string | null
          priority?: string
          project_id: string
          public_token?: string | null
          rejection_reason?: string | null
          resolution_photo_url?: string | null
          resolution_timestamp?: string | null
          status?: string
          title?: string | null
          updated_at?: string
          whatsapp_approval_timestamp?: string | null
        }
        Update: {
          actual_cost?: number | null
          ai_audit_result?: Json | null
          approved_via_whatsapp?: boolean | null
          assigned_at?: string | null
          assigned_to?: string | null
          audio_url?: string | null
          category?: string | null
          closed_at?: string | null
          closed_by?: string | null
          created_at?: string
          created_by?: string
          description?: string
          estimated_cost?: number
          folio_number?: number
          gps_coords?: unknown
          id?: string
          is_billable?: boolean
          location_tag?: string | null
          priority?: string
          project_id?: string
          public_token?: string | null
          rejection_reason?: string | null
          resolution_photo_url?: string | null
          resolution_timestamp?: string | null
          status?: string
          title?: string | null
          updated_at?: string
          whatsapp_approval_timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "incidents_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incidents_closed_by_fkey"
            columns: ["closed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incidents_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incidents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          id: string
          logo_url: string | null
          name: string
          staff_limit: number
          stripe_customer_id: string | null
          subscription_activated_at: string | null
          subscription_plan: string
          subscription_status: string
          trial_ends_at: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name: string
          staff_limit?: number
          stripe_customer_id?: string | null
          subscription_activated_at?: string | null
          subscription_plan?: string
          subscription_status?: string
          trial_ends_at?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string
          staff_limit?: number
          stripe_customer_id?: string | null
          subscription_activated_at?: string | null
          subscription_plan?: string
          subscription_status?: string
          trial_ends_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      project_members: {
        Row: {
          assigned_at: string
          id: string
          project_id: string
          user_id: string
        }
        Insert: {
          assigned_at?: string
          id?: string
          project_id: string
          user_id: string
        }
        Update: {
          assigned_at?: string
          id?: string
          project_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          contingency_budget: number
          cover_photo_url: string | null
          created_at: string
          end_date: string | null
          geofence_radius_meters: number | null
          id: string
          is_active: boolean
          location_address: string | null
          location_gps: unknown
          name: string
          organization_id: string
          phase: string | null
          start_date: string | null
          updated_at: string
        }
        Insert: {
          contingency_budget?: number
          cover_photo_url?: string | null
          created_at?: string
          end_date?: string | null
          geofence_radius_meters?: number | null
          id?: string
          is_active?: boolean
          location_address?: string | null
          location_gps?: unknown
          name: string
          organization_id: string
          phase?: string | null
          start_date?: string | null
          updated_at?: string
        }
        Update: {
          contingency_budget?: number
          cover_photo_url?: string | null
          created_at?: string
          end_date?: string | null
          geofence_radius_meters?: number | null
          id?: string
          is_active?: boolean
          location_address?: string | null
          location_gps?: unknown
          name?: string
          organization_id?: string
          phase?: string | null
          start_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          capabilities: Json
          created_at: string
          display_name: string
          id: string
          is_system_role: boolean
          organization_id: string
          updated_at: string
        }
        Insert: {
          capabilities?: Json
          created_at?: string
          display_name: string
          id?: string
          is_system_role?: boolean
          organization_id: string
          updated_at?: string
        }
        Update: {
          capabilities?: Json
          created_at?: string
          display_name?: string
          id?: string
          is_system_role?: boolean
          organization_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "roles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_device_sessions: {
        Row: {
          created_at: string
          device_fingerprint: string
          device_label: string | null
          id: string
          is_current: boolean
          last_seen_at: string
          lock_to_device: boolean
          user_id: string
        }
        Insert: {
          created_at?: string
          device_fingerprint: string
          device_label?: string | null
          id?: string
          is_current?: boolean
          last_seen_at?: string
          lock_to_device?: boolean
          user_id: string
        }
        Update: {
          created_at?: string
          device_fingerprint?: string
          device_label?: string | null
          id?: string
          is_current?: boolean
          last_seen_at?: string
          lock_to_device?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_device_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          is_active: boolean
          organization_id: string
          phone: string | null
          role_id: string
          updated_at: string
          user_type: string
          whatsapp_phone: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          is_active?: boolean
          organization_id: string
          phone?: string | null
          role_id: string
          updated_at?: string
          user_type: string
          whatsapp_phone?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          is_active?: boolean
          organization_id?: string
          phone?: string | null
          role_id?: string
          updated_at?: string
          user_type?: string
          whatsapp_phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_interactions: {
        Row: {
          ai_model: string | null
          ai_provider: string | null
          ai_response: string | null
          cost_usd: number | null
          created_at: string | null
          error_message: string | null
          id: string
          incident_id: string | null
          latency_ms: number | null
          message_content: string | null
          message_type: string | null
          phone_number: string
          success: boolean | null
          tokens_used: number | null
          user_id: string | null
        }
        Insert: {
          ai_model?: string | null
          ai_provider?: string | null
          ai_response?: string | null
          cost_usd?: number | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          incident_id?: string | null
          latency_ms?: number | null
          message_content?: string | null
          message_type?: string | null
          phone_number: string
          success?: boolean | null
          tokens_used?: number | null
          user_id?: string | null
        }
        Update: {
          ai_model?: string | null
          ai_provider?: string | null
          ai_response?: string | null
          cost_usd?: number | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          incident_id?: string | null
          latency_ms?: number | null
          message_content?: string | null
          message_type?: string | null
          phone_number?: string
          success?: boolean | null
          tokens_used?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_interactions_incident_id_fkey"
            columns: ["incident_id"]
            isOneToOne: false
            referencedRelation: "incidents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_interactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_preferences: {
        Row: {
          approval_notifications_enabled: boolean | null
          briefing_time: string | null
          critical_alerts_enabled: boolean | null
          daily_briefing_enabled: boolean | null
          language: string | null
          predictive_alerts_enabled: boolean | null
          timezone: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          approval_notifications_enabled?: boolean | null
          briefing_time?: string | null
          critical_alerts_enabled?: boolean | null
          daily_briefing_enabled?: boolean | null
          language?: string | null
          predictive_alerts_enabled?: boolean | null
          timezone?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          approval_notifications_enabled?: boolean | null
          briefing_time?: string | null
          critical_alerts_enabled?: boolean | null
          daily_briefing_enabled?: boolean | null
          language?: string | null
          predictive_alerts_enabled?: boolean | null
          timezone?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      assign_incident: {
        Args: { p_assigned_to: string; p_incident_id: string }
        Returns: Json
      }
      bulk_update_user_role: {
        Args: {
          p_new_role_id: string
          p_old_role_id: string
          p_user_ids?: string[]
        }
        Returns: Json
      }
      calculate_available_budget: {
        Args: { project_uuid: string }
        Returns: number
      }
      calculate_money_at_risk: {
        Args: { project_uuid: string }
        Returns: number
      }
      calculate_money_recovered: {
        Args: { project_uuid: string }
        Returns: number
      }
      create_incident: {
        Args: {
          p_audio_url?: string
          p_description: string
          p_estimated_cost?: number
          p_gps_coords?: unknown
          p_location_tag?: string
          p_priority?: string
          p_project_id: string
        }
        Returns: Json
      }
      create_organization_and_owner: {
        Args: {
          p_avatar_url?: string
          p_full_name?: string
          p_org_name: string
          p_plan?: string
        }
        Returns: Json
      }
      current_user_has_capability: {
        Args: { capability_name: string }
        Returns: boolean
      }
      current_user_in_project: {
        Args: { project_uuid: string }
        Returns: boolean
      }
      current_user_organization_id: { Args: never; Returns: string }
      find_similar_incidents: {
        Args: {
          incident_uuid: string
          match_count?: number
          match_threshold?: number
        }
        Returns: {
          created_at: string
          description: string
          incident_id: string
          project_id: string
          similarity: number
          status: string
          title: string
        }[]
      }
      generate_incident_embedding_content: {
        Args: { incident_uuid: string }
        Returns: string
      }
      generate_public_token: { Args: never; Returns: string }
      get_ai_cost_by_user: {
        Args: { end_date?: string; start_date?: string }
        Returns: {
          avg_latency_ms: number
          total_cost_usd: number
          total_requests: number
          total_tokens: number
          user_email: string
          user_id: string
          user_name: string
        }[]
      }
      get_ai_provider_stats: {
        Args: { end_date?: string; start_date?: string }
        Returns: {
          avg_latency_ms: number
          model: string
          provider: string
          requests: number
          success_rate: number
          task_type: string
          total_cost_usd: number
        }[]
      }
      get_incident_by_public_token: { Args: { p_token: string }; Returns: Json }
      get_next_folio_number: { Args: { project_uuid: string }; Returns: number }
      get_project_financial_summary: {
        Args: { p_project_uuid: string }
        Returns: Json
      }
      get_whatsapp_approval_rate: {
        Args: {
          end_date?: string
          project_id_param?: string
          start_date?: string
        }
        Returns: {
          app_approvals: number
          total_approvals: number
          whatsapp_approvals: number
          whatsapp_percentage: number
        }[]
      }
      is_within_geofence: {
        Args: { incident_coords: unknown; project_uuid: string }
        Returns: boolean
      }
      match_documents: {
        Args: {
          filter_org_id?: string
          match_count?: number
          match_threshold?: number
          query_embedding: string
        }
        Returns: {
          chunk_id: string
          chunk_index: number
          chunk_text: string
          document_id: string
          document_url: string
          similarity: number
        }[]
      }
      match_incidents: {
        Args: {
          filter_org_id?: string
          match_count?: number
          match_threshold?: number
          query_embedding: string
        }
        Returns: {
          created_at: string
          description: string
          incident_id: string
          project_id: string
          similarity: number
          status: string
          title: string
        }[]
      }
      update_incident_status: {
        Args: {
          p_actual_cost?: number
          p_comment?: string
          p_incident_id: string
          p_new_status: string
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const

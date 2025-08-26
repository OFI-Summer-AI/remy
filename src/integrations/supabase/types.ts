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
      alerts: {
        Row: {
          created_at: string
          entity_ref: string | null
          id: string
          is_resolved: boolean | null
          message: string
          resolved_at: string | null
          resolved_by: string | null
          severity: Database["public"]["Enums"]["alert_severity"]
          title: string
          type: Database["public"]["Enums"]["alert_type"]
        }
        Insert: {
          created_at?: string
          entity_ref?: string | null
          id?: string
          is_resolved?: boolean | null
          message: string
          resolved_at?: string | null
          resolved_by?: string | null
          severity: Database["public"]["Enums"]["alert_severity"]
          title: string
          type: Database["public"]["Enums"]["alert_type"]
        }
        Update: {
          created_at?: string
          entity_ref?: string | null
          id?: string
          is_resolved?: boolean | null
          message?: string
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: Database["public"]["Enums"]["alert_severity"]
          title?: string
          type?: Database["public"]["Enums"]["alert_type"]
        }
        Relationships: [
          {
            foreignKeyName: "alerts_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          id: string
          new_values: Json | null
          old_values: Json | null
          performed_at: string
          performed_by: string | null
          record_id: string
          table_name: string
        }
        Insert: {
          action: string
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          performed_at?: string
          performed_by?: string | null
          record_id: string
          table_name: string
        }
        Update: {
          action?: string
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          performed_at?: string
          performed_by?: string | null
          record_id?: string
          table_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_performed_by_fkey"
            columns: ["performed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      automation_rules: {
        Row: {
          actions: Json
          conditions: Json
          created_at: string
          id: string
          is_active: boolean
          name: string
          trigger_event: string
        }
        Insert: {
          actions?: Json
          conditions?: Json
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          trigger_event: string
        }
        Update: {
          actions?: Json
          conditions?: Json
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          trigger_event?: string
        }
        Relationships: []
      }
      dining_tables: {
        Row: {
          area: string | null
          capacity: number
          created_at: string
          id: string
          is_active: boolean | null
          name: string
          shape: string | null
          x_position: number | null
          y_position: number | null
        }
        Insert: {
          area?: string | null
          capacity: number
          created_at?: string
          id?: string
          is_active?: boolean | null
          name: string
          shape?: string | null
          x_position?: number | null
          y_position?: number | null
        }
        Update: {
          area?: string | null
          capacity?: number
          created_at?: string
          id?: string
          is_active?: boolean | null
          name?: string
          shape?: string | null
          x_position?: number | null
          y_position?: number | null
        }
        Relationships: []
      }
      employees: {
        Row: {
          created_at: string
          department: string | null
          employee_id: string | null
          full_name: string
          hire_date: string | null
          hourly_rate: number | null
          id: string
          is_active: boolean | null
          profile_id: string | null
          role: string
        }
        Insert: {
          created_at?: string
          department?: string | null
          employee_id?: string | null
          full_name: string
          hire_date?: string | null
          hourly_rate?: number | null
          id?: string
          is_active?: boolean | null
          profile_id?: string | null
          role: string
        }
        Update: {
          created_at?: string
          department?: string | null
          employee_id?: string | null
          full_name?: string
          hire_date?: string | null
          hourly_rate?: number | null
          id?: string
          is_active?: boolean | null
          profile_id?: string | null
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "employees_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      forecasts: {
        Row: {
          actual_covers: number | null
          confidence_score: number | null
          created_at: string
          date: string
          id: string
          method: string | null
          notes: string | null
          predicted_covers: number
          service: Database["public"]["Enums"]["service_type"]
        }
        Insert: {
          actual_covers?: number | null
          confidence_score?: number | null
          created_at?: string
          date: string
          id?: string
          method?: string | null
          notes?: string | null
          predicted_covers?: number
          service: Database["public"]["Enums"]["service_type"]
        }
        Update: {
          actual_covers?: number | null
          confidence_score?: number | null
          created_at?: string
          date?: string
          id?: string
          method?: string | null
          notes?: string | null
          predicted_covers?: number
          service?: Database["public"]["Enums"]["service_type"]
        }
        Relationships: []
      }
      items: {
        Row: {
          category: string | null
          cost_per_unit: number | null
          created_at: string
          id: string
          is_active: boolean | null
          lead_time_days: number | null
          name: string
          par_level: number | null
          sku: string | null
          supplier_id: string | null
          unit: string
        }
        Insert: {
          category?: string | null
          cost_per_unit?: number | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          lead_time_days?: number | null
          name: string
          par_level?: number | null
          sku?: string | null
          supplier_id?: string | null
          unit: string
        }
        Update: {
          category?: string | null
          cost_per_unit?: number | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          lead_time_days?: number | null
          name?: string
          par_level?: number | null
          sku?: string | null
          supplier_id?: string | null
          unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "items_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      job_schedules: {
        Row: {
          created_at: string
          cron: string
          description: string | null
          enabled: boolean
          id: string
          key: string
          payload: Json
          tz: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          cron: string
          description?: string | null
          enabled?: boolean
          id?: string
          key: string
          payload?: Json
          tz?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          cron?: string
          description?: string | null
          enabled?: boolean
          id?: string
          key?: string
          payload?: Json
          tz?: string
          updated_at?: string
        }
        Relationships: []
      }
      jobs: {
        Row: {
          attempts: number
          finished_at: string | null
          id: string
          idempotency_key: string | null
          last_error: string | null
          payload: Json
          queued_at: string
          started_at: string | null
          status: Database["public"]["Enums"]["job_status"]
          type: string
        }
        Insert: {
          attempts?: number
          finished_at?: string | null
          id?: string
          idempotency_key?: string | null
          last_error?: string | null
          payload: Json
          queued_at?: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["job_status"]
          type: string
        }
        Update: {
          attempts?: number
          finished_at?: string | null
          id?: string
          idempotency_key?: string | null
          last_error?: string | null
          payload?: Json
          queued_at?: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["job_status"]
          type?: string
        }
        Relationships: []
      }
      outbox: {
        Row: {
          attempt: number
          created_at: string
          id: string
          next_attempt_at: string
          payload: Json
          status: string
          topic: string
        }
        Insert: {
          attempt?: number
          created_at?: string
          id?: string
          next_attempt_at?: string
          payload: Json
          status?: string
          topic: string
        }
        Update: {
          attempt?: number
          created_at?: string
          id?: string
          next_attempt_at?: string
          payload?: Json
          status?: string
          topic?: string
        }
        Relationships: []
      }
      po_line_items: {
        Row: {
          created_at: string
          id: string
          item_id: string
          line_total: number | null
          po_id: string
          quantity: number
          unit_cost: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          item_id: string
          line_total?: number | null
          po_id: string
          quantity: number
          unit_cost?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string
          line_total?: number | null
          po_id?: string
          quantity?: number
          unit_cost?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "po_line_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "po_line_items_po_id_fkey"
            columns: ["po_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_accounts: {
        Row: {
          account_name: string
          connected_at: string | null
          created_at: string
          credentials: Json
          id: string
          last_sync_at: string | null
          provider: Database["public"]["Enums"]["pos_provider"]
          status: string | null
        }
        Insert: {
          account_name: string
          connected_at?: string | null
          created_at?: string
          credentials?: Json
          id?: string
          last_sync_at?: string | null
          provider: Database["public"]["Enums"]["pos_provider"]
          status?: string | null
        }
        Update: {
          account_name?: string
          connected_at?: string | null
          created_at?: string
          credentials?: Json
          id?: string
          last_sync_at?: string | null
          provider?: Database["public"]["Enums"]["pos_provider"]
          status?: string | null
        }
        Relationships: []
      }
      pos_sales_cache: {
        Row: {
          avg_check: number | null
          covers: number | null
          created_at: string
          date: string
          id: string
          payment_data: Json | null
          pos_account_id: string
          service: Database["public"]["Enums"]["service_type"] | null
          total_sales: number | null
        }
        Insert: {
          avg_check?: number | null
          covers?: number | null
          created_at?: string
          date: string
          id?: string
          payment_data?: Json | null
          pos_account_id: string
          service?: Database["public"]["Enums"]["service_type"] | null
          total_sales?: number | null
        }
        Update: {
          avg_check?: number | null
          covers?: number | null
          created_at?: string
          date?: string
          id?: string
          payment_data?: Json | null
          pos_account_id?: string
          service?: Database["public"]["Enums"]["service_type"] | null
          total_sales?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pos_sales_cache_pos_account_id_fkey"
            columns: ["pos_account_id"]
            isOneToOne: false
            referencedRelation: "pos_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_comments: {
        Row: {
          author_name: string | null
          comment_text: string | null
          created_at: string
          external_id: string
          id: string
          platform: string
          post_id: string
          replied: boolean | null
          replied_at: string | null
          replied_by: string | null
          reply_text: string | null
        }
        Insert: {
          author_name?: string | null
          comment_text?: string | null
          created_at?: string
          external_id: string
          id?: string
          platform: string
          post_id: string
          replied?: boolean | null
          replied_at?: string | null
          replied_by?: string | null
          reply_text?: string | null
        }
        Update: {
          author_name?: string | null
          comment_text?: string | null
          created_at?: string
          external_id?: string
          id?: string
          platform?: string
          post_id?: string
          replied?: boolean | null
          replied_at?: string | null
          replied_by?: string | null
          reply_text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comments_replied_by_fkey"
            columns: ["replied_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          alt_text: string | null
          created_at: string
          created_by: string | null
          final_caption: string | null
          generated_caption: string | null
          hashtags: string[] | null
          id: string
          media_urls: string[] | null
          platforms: string[] | null
          published_at: string | null
          scheduled_at: string | null
          short_description: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          created_by?: string | null
          final_caption?: string | null
          generated_caption?: string | null
          hashtags?: string[] | null
          id?: string
          media_urls?: string[] | null
          platforms?: string[] | null
          published_at?: string | null
          scheduled_at?: string | null
          short_description?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          created_by?: string | null
          final_caption?: string | null
          generated_caption?: string | null
          hashtags?: string[] | null
          id?: string
          media_urls?: string[] | null
          platforms?: string[] | null
          published_at?: string | null
          scheduled_at?: string | null
          short_description?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      purchase_orders: {
        Row: {
          created_at: string
          created_by: string | null
          expected_date: string | null
          id: string
          notes: string | null
          order_date: string | null
          po_number: string
          status: string | null
          supplier_id: string
          total_amount: number | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          expected_date?: string | null
          id?: string
          notes?: string | null
          order_date?: string | null
          po_number: string
          status?: string | null
          supplier_id: string
          total_amount?: number | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          expected_date?: string | null
          id?: string
          notes?: string | null
          order_date?: string | null
          po_number?: string
          status?: string | null
          supplier_id?: string
          total_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "purchase_orders_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      reservations: {
        Row: {
          created_at: string
          created_by: string | null
          end_time: string
          guest_email: string | null
          guest_name: string
          guest_phone: string | null
          id: string
          notes: string | null
          party_size: number
          service_id: string | null
          source: string | null
          start_time: string
          status: Database["public"]["Enums"]["reservation_status"] | null
          table_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          end_time: string
          guest_email?: string | null
          guest_name: string
          guest_phone?: string | null
          id?: string
          notes?: string | null
          party_size: number
          service_id?: string | null
          source?: string | null
          start_time: string
          status?: Database["public"]["Enums"]["reservation_status"] | null
          table_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          end_time?: string
          guest_email?: string | null
          guest_name?: string
          guest_phone?: string | null
          id?: string
          notes?: string | null
          party_size?: number
          service_id?: string | null
          source?: string | null
          start_time?: string
          status?: Database["public"]["Enums"]["reservation_status"] | null
          table_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "service_windows"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "dining_tables"
            referencedColumns: ["id"]
          },
        ]
      }
      review_accounts: {
        Row: {
          access_token: string | null
          business_id: string
          connected_at: string | null
          created_at: string
          id: string
          is_active: boolean | null
          platform: string
          refresh_token: string | null
        }
        Insert: {
          access_token?: string | null
          business_id: string
          connected_at?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          platform: string
          refresh_token?: string | null
        }
        Update: {
          access_token?: string | null
          business_id?: string
          connected_at?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          platform?: string
          refresh_token?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          created_at: string
          external_id: string
          has_photo: boolean | null
          id: string
          platform: string
          rating: number | null
          replied: boolean | null
          replied_at: string | null
          replied_by: string | null
          reply_text: string | null
          review_date: string | null
          review_text: string | null
          reviewer_name: string | null
        }
        Insert: {
          created_at?: string
          external_id: string
          has_photo?: boolean | null
          id?: string
          platform: string
          rating?: number | null
          replied?: boolean | null
          replied_at?: string | null
          replied_by?: string | null
          reply_text?: string | null
          review_date?: string | null
          review_text?: string | null
          reviewer_name?: string | null
        }
        Update: {
          created_at?: string
          external_id?: string
          has_photo?: boolean | null
          id?: string
          platform?: string
          rating?: number | null
          replied?: boolean | null
          replied_at?: string | null
          replied_by?: string | null
          reply_text?: string | null
          review_date?: string | null
          review_text?: string | null
          reviewer_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_replied_by_fkey"
            columns: ["replied_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      service_windows: {
        Row: {
          created_at: string
          date: string
          end_time: string
          id: string
          is_active: boolean | null
          label: Database["public"]["Enums"]["service_type"]
          start_time: string
        }
        Insert: {
          created_at?: string
          date: string
          end_time: string
          id?: string
          is_active?: boolean | null
          label: Database["public"]["Enums"]["service_type"]
          start_time: string
        }
        Update: {
          created_at?: string
          date?: string
          end_time?: string
          id?: string
          is_active?: boolean | null
          label?: Database["public"]["Enums"]["service_type"]
          start_time?: string
        }
        Relationships: []
      }
      shift_requirements: {
        Row: {
          created_at: string
          date: string
          id: string
          required_count: number
          role: string
          service: Database["public"]["Enums"]["service_type"]
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          required_count: number
          role: string
          service: Database["public"]["Enums"]["service_type"]
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          required_count?: number
          role?: string
          service?: Database["public"]["Enums"]["service_type"]
        }
        Relationships: []
      }
      shifts: {
        Row: {
          created_at: string
          created_by: string | null
          employee_id: string
          end_time: string
          id: string
          is_published: boolean | null
          notes: string | null
          role: string
          start_time: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          employee_id: string
          end_time: string
          id?: string
          is_published?: boolean | null
          notes?: string | null
          role: string
          start_time: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          employee_id?: string
          end_time?: string
          id?: string
          is_published?: boolean | null
          notes?: string | null
          role?: string
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "shifts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shifts_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      social_accounts: {
        Row: {
          access_token: string | null
          account_name: string
          connected_at: string | null
          created_at: string
          id: string
          is_active: boolean | null
          platform: string
          refresh_token: string | null
          token_expires_at: string | null
        }
        Insert: {
          access_token?: string | null
          account_name: string
          connected_at?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          platform: string
          refresh_token?: string | null
          token_expires_at?: string | null
        }
        Update: {
          access_token?: string | null
          account_name?: string
          connected_at?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          platform?: string
          refresh_token?: string | null
          token_expires_at?: string | null
        }
        Relationships: []
      }
      stock_movements: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          item_id: string
          movement_type: string
          quantity: number
          reference: string | null
          unit_cost: number | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          item_id: string
          movement_type: string
          quantity: number
          reference?: string | null
          unit_cost?: number | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          item_id?: string
          movement_type?: string
          quantity?: number
          reference?: string | null
          unit_cost?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "stock_movements_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_movements_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          address: string | null
          contact_name: string | null
          created_at: string
          email: string | null
          id: string
          is_active: boolean | null
          name: string
          payment_terms: string | null
          phone: string | null
        }
        Insert: {
          address?: string | null
          contact_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          payment_terms?: string | null
          phone?: string | null
        }
        Update: {
          address?: string | null
          contact_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          payment_terms?: string | null
          phone?: string | null
        }
        Relationships: []
      }
      webhook_endpoints: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name: string
          secret: string | null
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          secret?: string | null
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          secret?: string | null
          url?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      citext: {
        Args: { "": boolean } | { "": string } | { "": unknown }
        Returns: string
      }
      citext_hash: {
        Args: { "": string }
        Returns: number
      }
      citextin: {
        Args: { "": unknown }
        Returns: string
      }
      citextout: {
        Args: { "": string }
        Returns: unknown
      }
      citextrecv: {
        Args: { "": unknown }
        Returns: string
      }
      citextsend: {
        Args: { "": string }
        Returns: string
      }
      gbt_bit_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_bool_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_bool_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_bpchar_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_bytea_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_cash_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_cash_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_date_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_date_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_enum_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_enum_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_float4_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_float4_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_float8_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_float8_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_inet_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_int2_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_int2_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_int4_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_int4_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_int8_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_int8_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_intv_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_intv_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_intv_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_macad_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_macad_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_macad8_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_macad8_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_numeric_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_oid_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_oid_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_text_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_time_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_time_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_timetz_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_ts_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_ts_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_tstz_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_uuid_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_uuid_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_var_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_var_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey_var_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey_var_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey16_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey16_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey2_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey2_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey32_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey32_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey4_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey4_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey8_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey8_out: {
        Args: { "": unknown }
        Returns: unknown
      }
    }
    Enums: {
      alert_severity: "low" | "medium" | "high" | "critical"
      alert_type:
        | "low_stock"
        | "overbook_risk"
        | "understaffed"
        | "no_show_spike"
      job_status: "queued" | "running" | "succeeded" | "failed" | "cancelled"
      pos_provider: "lightspeed" | "waiterpro"
      reservation_status:
        | "pending"
        | "confirmed"
        | "seated"
        | "completed"
        | "no_show"
        | "cancelled"
      service_type: "Breakfast" | "Lunch" | "Dinner" | "Brunch"
      user_role: "Admin" | "Manager" | "Staff"
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
      alert_severity: ["low", "medium", "high", "critical"],
      alert_type: [
        "low_stock",
        "overbook_risk",
        "understaffed",
        "no_show_spike",
      ],
      job_status: ["queued", "running", "succeeded", "failed", "cancelled"],
      pos_provider: ["lightspeed", "waiterpro"],
      reservation_status: [
        "pending",
        "confirmed",
        "seated",
        "completed",
        "no_show",
        "cancelled",
      ],
      service_type: ["Breakfast", "Lunch", "Dinner", "Brunch"],
      user_role: ["Admin", "Manager", "Staff"],
    },
  },
} as const

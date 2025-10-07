@@ .. @@
 export interface Database {
   public: {
     Tables: {
+      profiles: {
+        Row: {
+          id: string
+          role: 'admin' | 'client'
+          full_name: string
+          email: string
+          phone: string | null
+          whatsapp_number: string | null
+          company_name: string | null
+          address: string | null
+          avatar_url: string | null
+          is_active: boolean
+          created_at: string
+          updated_at: string
+        }
+        Insert: {
+          id: string
+          role?: 'admin' | 'client'
+          full_name: string
+          email: string
+          phone?: string | null
+          whatsapp_number?: string | null
+          company_name?: string | null
+          address?: string | null
+          avatar_url?: string | null
+          is_active?: boolean
+          created_at?: string
+          updated_at?: string
+        }
+        Update: {
+          id?: string
+          role?: 'admin' | 'client'
+          full_name?: string
+          email?: string
+          phone?: string | null
+          whatsapp_number?: string | null
+          company_name?: string | null
+          address?: string | null
+          avatar_url?: string | null
+          is_active?: boolean
+          created_at?: string
+          updated_at?: string
+        }
+      }
+      clients: {
+        Row: {
+          id: string
+          user_id: string
+          business_type: string | null
+          website: string | null
+          tax_id: string | null
+          billing_address: string | null
+          preferred_communication: 'email' | 'whatsapp' | 'phone'
+          timezone: string
+          notes: string | null
+          total_projects: number
+          total_spent: number
+          last_project_date: string | null
+          created_at: string
+        }
+        Insert: {
+          id?: string
+          user_id: string
+          business_type?: string | null
+          website?: string | null
+          tax_id?: string | null
+          billing_address?: string | null
+          preferred_communication?: 'email' | 'whatsapp' | 'phone'
+          timezone?: string
+          notes?: string | null
+          total_projects?: number
+          total_spent?: number
+          last_project_date?: string | null
+          created_at?: string
+        }
+        Update: {
+          id?: string
+          user_id?: string
+          business_type?: string | null
+          website?: string | null
+          tax_id?: string | null
+          billing_address?: string | null
+          preferred_communication?: 'email' | 'whatsapp' | 'phone'
+          timezone?: string
+          notes?: string | null
+          total_projects?: number
+          total_spent?: number
+          last_project_date?: string | null
+          created_at?: string
+        }
+      }
+      project_categories: {
+        Row: {
+          id: string
+          name: string
+          description: string | null
+          base_price: number | null
+          estimated_duration: number | null
+          is_active: boolean
+          created_at: string
+        }
+        Insert: {
+          id?: string
+          name: string
+          description?: string | null
+          base_price?: number | null
+          estimated_duration?: number | null
+          is_active?: boolean
+          created_at?: string
+        }
+        Update: {
+          id?: string
+          name?: string
+          description?: string | null
+          base_price?: number | null
+          estimated_duration?: number | null
+          is_active?: boolean
+          created_at?: string
+        }
+      }
+      projects: {
+        Row: {
+          id: string
+          client_id: string
+          title: string
+          description: string | null
+          category_id: string | null
+          status: 'draft' | 'pending_approval' | 'approved' | 'in_progress' | 'review' | 'revision' | 'completed' | 'delivered' | 'cancelled'
+          priority: 'low' | 'medium' | 'high' | 'urgent'
+          start_date: string | null
+          due_date: string | null
+          delivery_date: string | null
+          estimated_hours: number | null
+          actual_hours: number | null
+          budget: number | null
+          final_amount: number | null
+          progress_percentage: number
+          requirements: string | null
+          notes: string | null
+          created_by: string | null
+          created_at: string
+          updated_at: string
+        }
+        Insert: {
+          id?: string
+          client_id: string
+          title: string
+          description?: string | null
+          category_id?: string | null
+          status?: 'draft' | 'pending_approval' | 'approved' | 'in_progress' | 'review' | 'revision' | 'completed' | 'delivered' | 'cancelled'
+          priority?: 'low' | 'medium' | 'high' | 'urgent'
+          start_date?: string | null
+          due_date?: string | null
+          delivery_date?: string | null
+          estimated_hours?: number | null
+          actual_hours?: number | null
+          budget?: number | null
+          final_amount?: number | null
+          progress_percentage?: number
+          requirements?: string | null
+          notes?: string | null
+          created_by?: string | null
+          created_at?: string
+          updated_at?: string
+        }
+        Update: {
+          id?: string
+          client_id?: string
+          title?: string
+          description?: string | null
+          category_id?: string | null
+          status?: 'draft' | 'pending_approval' | 'approved' | 'in_progress' | 'review' | 'revision' | 'completed' | 'delivered' | 'cancelled'
+          priority?: 'low' | 'medium' | 'high' | 'urgent'
+          start_date?: string | null
+          due_date?: string | null
+          delivery_date?: string | null
+          estimated_hours?: number | null
+          actual_hours?: number | null
+          budget?: number | null
+          final_amount?: number | null
+          progress_percentage?: number
+          requirements?: string | null
+          notes?: string | null
+          created_by?: string | null
+          created_at?: string
+          updated_at?: string
+        }
+      }
+      project_requests: {
+        Row: {
+          id: string
+          client_id: string
+          title: string
+          description: string
+          category_id: string | null
+          preferred_deadline: string | null
+          budget_range_min: number | null
+          budget_range_max: number | null
+          priority_level: 'low' | 'medium' | 'high'
+          status: 'submitted' | 'under_review' | 'approved' | 'rejected' | 'converted'
+          rejection_reason: string | null
+          admin_notes: string | null
+          project_id: string | null
+          submitted_at: string
+          reviewed_at: string | null
+          reviewed_by: string | null
+        }
+        Insert: {
+          id?: string
+          client_id: string
+          title: string
+          description: string
+          category_id?: string | null
+          preferred_deadline?: string | null
+          budget_range_min?: number | null
+          budget_range_max?: number | null
+          priority_level?: 'low' | 'medium' | 'high'
+          status?: 'submitted' | 'under_review' | 'approved' | 'rejected' | 'converted'
+          rejection_reason?: string | null
+          admin_notes?: string | null
+          project_id?: string | null
+          submitted_at?: string
+          reviewed_at?: string | null
+          reviewed_by?: string | null
+        }
+        Update: {
+          id?: string
+          client_id?: string
+          title?: string
+          description?: string
+          category_id?: string | null
+          preferred_deadline?: string | null
+          budget_range_min?: number | null
+          budget_range_max?: number | null
+          priority_level?: 'low' | 'medium' | 'high'
+          status?: 'submitted' | 'under_review' | 'approved' | 'rejected' | 'converted'
+          rejection_reason?: string | null
+          admin_notes?: string | null
+          project_id?: string | null
+          submitted_at?: string
+          reviewed_at?: string | null
+          reviewed_by?: string | null
+        }
+      }
+      invoices: {
+        Row: {
+          id: string
+          invoice_number: string
+          client_id: string
+          project_id: string | null
+          amount: number
+          tax_amount: number
+          total_amount: number
+          status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
+          due_date: string
+          paid_date: string | null
+          payment_method: string | null
+          notes: string | null
+          created_at: string
+          sent_at: string | null
+        }
+        Insert: {
+          id?: string
+          invoice_number: string
+          client_id: string
+          project_id?: string | null
+          amount: number
+          tax_amount?: number
+          total_amount: number
+          status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
+          due_date: string
+          paid_date?: string | null
+          payment_method?: string | null
+          notes?: string | null
+          created_at?: string
+          sent_at?: string | null
+        }
+        Update: {
+          id?: string
+          invoice_number?: string
+          client_id?: string
+          project_id?: string | null
+          amount?: number
+          tax_amount?: number
+          total_amount?: number
+          status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
+          due_date?: string
+          paid_date?: string | null
+          payment_method?: string | null
+          notes?: string | null
+          created_at?: string
+          sent_at?: string | null
+        }
+      }
+      invoice_items: {
+        Row: {
+          id: string
+          invoice_id: string
+          description: string
+          quantity: number
+          unit_price: number
+          total_price: number
+          order_index: number
+        }
+        Insert: {
+          id?: string
+          invoice_id: string
+          description: string
+          quantity?: number
+          unit_price: number
+          total_price: number
+          order_index?: number
+        }
+        Update: {
+          id?: string
+          invoice_id?: string
+          description?: string
+          quantity?: number
+          unit_price?: number
+          total_price?: number
+          order_index?: number
+        }
+      }
+      communications: {
+        Row: {
+          id: string
+          client_id: string
+          project_id: string | null
+          sender_id: string | null
+          message_type: 'internal_note' | 'whatsapp' | 'email' | 'system' | 'file_share'
+          subject: string | null
+          message: string
+          is_read: boolean
+          attachments: any | null
+          created_at: string
+        }
+        Insert: {
+          id?: string
+          client_id: string
+          project_id?: string | null
+          sender_id?: string | null
+          message_type?: 'internal_note' | 'whatsapp' | 'email' | 'system' | 'file_share'
+          subject?: string | null
+          message: string
+          is_read?: boolean
+          attachments?: any | null
+          created_at?: string
+        }
+        Update: {
+          id?: string
+          client_id?: string
+          project_id?: string | null
+          sender_id?: string | null
+          message_type?: 'internal_note' | 'whatsapp' | 'email' | 'system' | 'file_share'
+          subject?: string | null
+          message?: string
+          is_read?: boolean
+          attachments?: any | null
+          created_at?: string
+        }
+      }
+      project_files: {
+        Row: {
+          id: string
+          project_id: string
+          uploaded_by: string | null
+          file_name: string
+          file_size: number | null
+          file_type: string | null
+          file_url: string
+          file_category: 'requirement' | 'reference' | 'draft' | 'final' | 'revision'
+          description: string | null
+          is_client_visible: boolean
+          upload_date: string
+        }
+        Insert: {
+          id?: string
+          project_id: string
+          uploaded_by?: string | null
+          file_name: string
+          file_size?: number | null
+          file_type?: string | null
+          file_url: string
+          file_category?: 'requirement' | 'reference' | 'draft' | 'final' | 'revision'
+          description?: string | null
+          is_client_visible?: boolean
+          upload_date?: string
+        }
+        Update: {
+          id?: string
+          project_id?: string
+          uploaded_by?: string | null
+          file_name?: string
+          file_size?: number | null
+          file_type?: string | null
+          file_url?: string
+          file_category?: 'requirement' | 'reference' | 'draft' | 'final' | 'revision'
+          description?: string | null
+          is_client_visible?: boolean
+          upload_date?: string
+        }
+      }
+      notifications: {
+        Row: {
+          id: string
+          recipient_id: string
+          type: 'project_update' | 'new_request' | 'deadline_reminder' | 'invoice_generated' | 'payment_received' | 'system'
+          title: string
+          message: string
+          data: any | null
+          is_read: boolean
+          created_at: string
+        }
+        Insert: {
+          id?: string
+          recipient_id: string
+          type?: 'project_update' | 'new_request' | 'deadline_reminder' | 'invoice_generated' | 'payment_received' | 'system'
+          title: string
+          message: string
+          data?: any | null
+          is_read?: boolean
+          created_at?: string
+        }
+        Update: {
+          id?: string
+          recipient_id?: string
+          type?: 'project_update' | 'new_request' | 'deadline_reminder' | 'invoice_generated' | 'payment_received' | 'system'
+          title?: string
+          message?: string
+          data?: any | null
+          is_read?: boolean
+          created_at?: string
+        }
+      }
+      project_milestones: {
+        Row: {
+          id: string
+          project_id: string
+          title: string
+          description: string | null
+          due_date: string
+          status: 'pending' | 'in_progress' | 'completed' | 'overdue'
+          completion_date: string | null
+          order_index: number
+          created_at: string
+        }
+        Insert: {
+          id?: string
+          project_id: string
+          title: string
+          description?: string | null
+          due_date: string
+          status?: 'pending' | 'in_progress' | 'completed' | 'overdue'
+          completion_date?: string | null
+          order_index?: number
+          created_at?: string
+        }
+        Update: {
+          id?: string
+          project_id?: string
+          title?: string
+          description?: string | null
+          due_date?: string
+          status?: 'pending' | 'in_progress' | 'completed' | 'overdue'
+          completion_date?: string | null
+          order_index?: number
+          created_at?: string
+        }
+      }
+      time_tracking: {
+        Row: {
+          id: string
+          project_id: string
+          user_id: string | null
+          description: string
+          start_time: string
+          end_time: string | null
+          duration_minutes: number | null
+          is_billable: boolean
+          hourly_rate: number | null
+          created_at: string
+        }
+        Insert: {
+          id?: string
+          project_id: string
+          user_id?: string | null
+          description: string
+          start_time: string
+          end_time?: string | null
+          duration_minutes?: number | null
+          is_billable?: boolean
+          hourly_rate?: number | null
+          created_at?: string
+        }
+        Update: {
+          id?: string
+          project_id?: string
+          user_id?: string | null
+          description?: string
+          start_time?: string
+          end_time?: string | null
+          duration_minutes?: number | null
+          is_billable?: boolean
+          hourly_rate?: number | null
+          created_at?: string
+        }
+      }
     }
     Views: {
       [_ in never]: never
@@ .. @@
     }
   }
 }
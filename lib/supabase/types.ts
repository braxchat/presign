export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      merchants: {
        Row: {
          id: string
          business_name: string
          contact_email: string
          email: string | null
          carrier_preference: 'ups' | 'fedex' | 'both'
          daily_update_time: string
          stripe_account_id: string | null
          shop_domain: string | null
          access_token: string | null
          ups_api_key: string | null
          ups_username: string | null
          ups_password: string | null
          ups_account_number: string | null
          fedex_api_key: string | null
          fedex_secret_key: string | null
          fedex_account_number: string | null
          fedex_meter_number: string | null
          billing_provider: 'shopify' | 'stripe' | null
          plan_tier: 'basic' | 'pro' | 'enterprise' | null
          status: 'trialing' | 'active' | 'canceled' | 'past_due' | null
          trial_end: string | null
          shopify_subscription_id: string | null
          shopify_plan_name: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          onboarding_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_name?: string
          contact_email?: string
          email?: string | null
          carrier_preference?: 'ups' | 'fedex' | 'both'
          daily_update_time?: string
          stripe_account_id?: string | null
          shop_domain?: string | null
          access_token?: string | null
          ups_api_key?: string | null
          ups_username?: string | null
          ups_password?: string | null
          ups_account_number?: string | null
          fedex_api_key?: string | null
          fedex_secret_key?: string | null
          fedex_account_number?: string | null
          fedex_meter_number?: string | null
          billing_provider?: 'shopify' | 'stripe' | null
          plan_tier?: 'basic' | 'pro' | 'enterprise' | null
          status?: 'trialing' | 'active' | 'canceled' | 'past_due' | null
          trial_end?: string | null
          shopify_subscription_id?: string | null
          shopify_plan_name?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_name?: string
          contact_email?: string
          email?: string | null
          carrier_preference?: 'ups' | 'fedex' | 'both'
          daily_update_time?: string
          stripe_account_id?: string | null
          shop_domain?: string | null
          access_token?: string | null
          ups_api_key?: string | null
          ups_username?: string | null
          ups_password?: string | null
          ups_account_number?: string | null
          fedex_api_key?: string | null
          fedex_secret_key?: string | null
          fedex_account_number?: string | null
          fedex_meter_number?: string | null
          billing_provider?: 'shopify' | 'stripe' | null
          plan_tier?: 'basic' | 'pro' | 'enterprise' | null
          status?: 'trialing' | 'active' | 'canceled' | 'past_due' | null
          trial_end?: string | null
          shopify_subscription_id?: string | null
          shopify_plan_name?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      shipments: {
        Row: {
          id: string
          merchant_id: string
          tracking_number: string
          carrier: 'UPS' | 'FedEx'
          order_number: string | null
          buyer_name: string
          buyer_email: string
          item_value_cents: number
          requires_signature: boolean
          carrier_status: 'PreTransit' | 'InTransit' | 'OutForDelivery' | 'Delivered'
          override_status: 'none' | 'requested' | 'completed'
          override_token: string | null
          buyer_status_token: string | null
          stripe_checkout_session_id: string | null
          stripe_payment_status: string | null
          merchant_earnings_cents: number | null
          authorization_pdf_url: string | null
          override_locked: boolean
          refund_status: 'none' | 'requested' | 'approved' | 'denied'
          refund_reason: string | null
          refund_requested_at: string | null
          refund_updated_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          merchant_id: string
          tracking_number: string
          carrier: 'UPS' | 'FedEx'
          order_number?: string | null
          buyer_name: string
          buyer_email: string
          item_value_cents?: number
          requires_signature?: boolean
          carrier_status?: 'PreTransit' | 'InTransit' | 'OutForDelivery' | 'Delivered'
          override_status?: 'none' | 'requested' | 'completed'
          override_token?: string | null
          buyer_status_token?: string | null
          stripe_checkout_session_id?: string | null
          stripe_payment_status?: string | null
          merchant_earnings_cents?: number | null
          authorization_pdf_url?: string | null
          override_locked?: boolean
          refund_status?: 'none' | 'requested' | 'approved' | 'denied'
          refund_reason?: string | null
          refund_requested_at?: string | null
          refund_updated_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          merchant_id?: string
          tracking_number?: string
          carrier?: 'UPS' | 'FedEx'
          order_number?: string | null
          buyer_name?: string
          buyer_email?: string
          item_value_cents?: number
          requires_signature?: boolean
          carrier_status?: 'PreTransit' | 'InTransit' | 'OutForDelivery' | 'Delivered'
          override_status?: 'none' | 'requested' | 'completed'
          override_token?: string | null
          buyer_status_token?: string | null
          stripe_checkout_session_id?: string | null
          stripe_payment_status?: string | null
          merchant_earnings_cents?: number | null
          authorization_pdf_url?: string | null
          override_locked?: boolean
          refund_status?: 'none' | 'requested' | 'approved' | 'denied'
          refund_reason?: string | null
          refund_requested_at?: string | null
          refund_updated_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shipments_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          }
        ]
      }
      signature_authorizations: {
        Row: {
          id: string
          shipment_id: string
          typed_name: string
          ip_address: string
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          shipment_id: string
          typed_name: string
          ip_address: string
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          shipment_id?: string
          typed_name?: string
          ip_address?: string
          user_agent?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "signature_authorizations_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "shipments"
            referencedColumns: ["id"]
          }
        ]
      }
      payouts: {
        Row: {
          id: string
          merchant_id: string
          amount_cents: number
          override_count: number
          status: 'pending' | 'processing' | 'completed' | 'failed'
          requested_at: string
          paid_at: string | null
        }
        Insert: {
          id?: string
          merchant_id: string
          amount_cents: number
          override_count: number
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          requested_at?: string
          paid_at?: string | null
        }
        Update: {
          id?: string
          merchant_id?: string
          amount_cents?: number
          override_count?: number
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          requested_at?: string
          paid_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payouts_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
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
      carrier_type: 'UPS' | 'FedEx'
      carrier_status: 'PreTransit' | 'InTransit' | 'OutForDelivery' | 'Delivered'
      override_status: 'none' | 'requested' | 'completed'
      payout_status: 'pending' | 'processing' | 'completed' | 'failed'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]

// Convenient type aliases
export type Merchant = Tables<'merchants'>
export type MerchantInsert = TablesInsert<'merchants'>
export type MerchantUpdate = TablesUpdate<'merchants'>

export type Shipment = Tables<'shipments'>
export type ShipmentInsert = TablesInsert<'shipments'>
export type ShipmentUpdate = TablesUpdate<'shipments'>

export type SignatureAuthorization = Tables<'signature_authorizations'>
export type SignatureAuthorizationInsert = TablesInsert<'signature_authorizations'>

export type Payout = Tables<'payouts'>
export type PayoutInsert = TablesInsert<'payouts'>
export type PayoutUpdate = TablesUpdate<'payouts'>

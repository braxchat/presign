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
          carrier_preference: 'ups' | 'fedex' | 'both'
          daily_update_time: string
          stripe_account_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_name: string
          contact_email: string
          carrier_preference?: 'ups' | 'fedex' | 'both'
          daily_update_time?: string
          stripe_account_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_name?: string
          contact_email?: string
          carrier_preference?: 'ups' | 'fedex' | 'both'
          daily_update_time?: string
          stripe_account_id?: string | null
          created_at?: string
          updated_at?: string
        }
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
          stripe_checkout_session_id: string | null
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
          stripe_checkout_session_id?: string | null
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
          stripe_checkout_session_id?: string | null
          created_at?: string
          updated_at?: string
        }
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

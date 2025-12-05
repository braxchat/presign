import 'server-only';
import { Session } from '@shopify/shopify-api';
import { supabaseAdmin } from './supabase-admin';

/**
 * Custom Shopify session storage using Supabase
 * Implements the SessionStorage interface required by Shopify API
 */
export class SupabaseSessionStorage {
  /**
   * Store a session in Supabase
   */
  async storeSession(session: Session): Promise<boolean> {
    try {
      // Serialize session to JSON for storage
      const sessionJson = JSON.stringify({
        id: session.id,
        shop: session.shop,
        state: session.state,
        isOnline: session.isOnline,
        scope: session.scope,
        expires: session.expires ? session.expires.toISOString() : null,
        accessToken: session.accessToken,
        associatedUser: session.associatedUser ? {
          id: session.associatedUser.id,
          firstName: session.associatedUser.firstName,
          lastName: session.associatedUser.lastName,
          email: session.associatedUser.email,
          accountOwner: session.associatedUser.accountOwner,
          locale: session.associatedUser.locale,
          collaborator: session.associatedUser.collaborator,
        } : null,
      });

      const { error } = await supabaseAdmin
        .from('shopify_sessions')
        .upsert(
          {
            id: session.id,
            shop: session.shop,
            state: session.state || null,
            is_online: session.isOnline || false,
            scope: session.scope || null,
            expires: session.expires ? session.expires.toISOString() : null,
            access_token: session.accessToken || null,
            user_id: session.associatedUser ? String(session.associatedUser.id) : null,
            session_data: sessionJson,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: 'id',
          }
        );

      if (error) {
        console.error('Error storing Shopify session:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error storing Shopify session:', error);
      return false;
    }
  }

  /**
   * Load a session from Supabase
   */
  async loadSession(id: string): Promise<Session | undefined> {
    try {
      const { data, error } = await supabaseAdmin
        .from('shopify_sessions')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        return undefined;
      }

      // Parse session data
      const sessionData = JSON.parse(data.session_data || '{}');
      
      // Reconstruct Session object
      const session = new Session({
        id: sessionData.id,
        shop: sessionData.shop,
        state: sessionData.state,
        isOnline: sessionData.isOnline,
        scope: sessionData.scope,
        expires: sessionData.expires ? new Date(sessionData.expires) : undefined,
        accessToken: sessionData.accessToken,
        associatedUser: sessionData.associatedUser || undefined,
      });

      return session;
    } catch (error) {
      console.error('Error loading Shopify session:', error);
      return undefined;
    }
  }

  /**
   * Delete a session from Supabase
   */
  async deleteSession(id: string): Promise<boolean> {
    try {
      const { error } = await supabaseAdmin
        .from('shopify_sessions')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting Shopify session:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting Shopify session:', error);
      return false;
    }
  }

  /**
   * Delete all sessions for a shop
   */
  async deleteSessions(shop: string): Promise<boolean> {
    try {
      const { error } = await supabaseAdmin
        .from('shopify_sessions')
        .delete()
        .eq('shop', shop);

      if (error) {
        console.error('Error deleting Shopify sessions:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting Shopify sessions:', error);
      return false;
    }
  }
}


import { supabase } from './supabaseClient'

/**
 * Returns the current auth state
 * @returns {Promise<{ isSignedIn: boolean, user: object | null }>}
 */
export async function getAuthStatus() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) {
    console.error('Error getting user:', error)
    return {
      isSignedIn: false,
      user: null,
    }
  }

  return {
    isSignedIn: !!user,
    user,
  }
}

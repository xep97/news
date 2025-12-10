// src/lib/hasActiveSubscription.js
import { supabase } from "./supabaseClient";
import { cookies } from "next/headers";

export async function getHasActiveSubscription() {
  const cookieStore = cookies(); // MUST be called inside server component
  // Supabase server client
  const supabaseServer = supabase;

  // Get session
  const { data: { session } } = await supabaseServer.auth.getSession();

  if (!session) return false;

  const { data: profile, error } = await supabaseServer
    .from("profiles")
    .select("subscription_status")
    .eq("id", session.user.id)
    .single();

  if (error || !profile?.subscription_status) return false;

  const now = new Date();
  const expiry = new Date(profile.subscription_status);

  return expiry.getTime() > now.getTime();
}

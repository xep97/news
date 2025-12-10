"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabaseClient";

export default function GetSubscriptionPage() {
  const [accessKey, setAccessKey] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setMessage("You must be signed in to activate a subscription.");
        setLoading(false);
        return;
      }

      // Trim and normalize the access key
      const normalizedKey = accessKey.trim().toUpperCase();

      // Look up access key
      const { data: keyData, error: keyError } = await supabase
        .from("access_keys")
        .select("*")
        .eq("key", normalizedKey)
        .eq("used", false)
        .single();
    
        console.log("Checking key:", `"${accessKey}"`);

      if (keyError || !keyData) {
        setMessage("Invalid or already used access key.");
        setLoading(false);
        return;
      }

      const monthsToAdd = keyData.months;

      // Get user's current subscription_status
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("subscription_status")
        .eq("id", session.user.id)
        .single();

      if (profileError) {
        setMessage("Failed to fetch your profile.");
        setLoading(false);
        return;
      }

      const now = new Date();
      let currentExpiry = profileData?.subscription_status
        ? new Date(profileData.subscription_status)
        : now;

      // If expired, start from now
      if (currentExpiry < now) currentExpiry = now;

      // Add months from access key
      const newExpiry = new Date(currentExpiry);
      newExpiry.setMonth(newExpiry.getMonth() + monthsToAdd);

      // Update profiles.subscription_status
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ subscription_status: newExpiry.toISOString() })
        .eq("id", session.user.id);

      if (updateError) {
        setMessage("Failed to update subscription. Try again.");
        setLoading(false);
        return;
      }

      // Mark the access key as used
      await supabase
        .from("access_keys")
        .update({ used: true })
        .eq("id", keyData.id);

      setMessage(`✅ Subscription activated! Expires on ${newExpiry.toLocaleDateString()}`);
      setAccessKey("");
    } catch (err) {
      console.error("Subscription error:", err);
      setMessage("An unexpected error occurred.");
    }

    setLoading(false);
  };

  return (
    <div className="get-subscription-page" style={{ maxWidth: "400px", margin: "2rem auto" }}>
      <h1>Activate Subscription</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your access key"
          value={accessKey}
          onChange={(e) => setAccessKey(e.target.value)}
          required
          style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
        />
        <button type="submit" disabled={loading} style={{ padding: "0.5rem 1rem" }}>
          {loading ? "Processing..." : "Activate"}
        </button>
      </form>
      {message && (
        <p style={{ marginTop: "1rem", fontWeight: "bold", color: message.startsWith("✅") ? "green" : "red" }}>
          {message}
        </p>
      )}
    </div>
  );
}

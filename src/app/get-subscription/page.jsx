"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabaseClient";

export default function GetSubscriptionPage() {
  const [accessKey, setAccessKey] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // Get current session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setMessage("You must be signed in to activate a subscription.");
      return;
    }

    // Check if access key exists and is unused
    const { data: keyData, error } = await supabase
      .from("access_keys")
      .select("*")
      .eq("key", accessKey)
      .eq("used", false)
      .single();

    if (error || !keyData) {
      setMessage("Invalid or already used access key.");
      return;
    }

    // Calculate new subscription expiration date
    const now = new Date();
    const currentExpiryRes = await supabase
      .from("profiles")
      .select("subscription_status")
      .eq("id", session.user.id)
      .single();

    let currentExpiry = currentExpiryRes.data?.subscription_status
      ? new Date(currentExpiryRes.data.subscription_status)
      : now;

    if (currentExpiry < now) currentExpiry = now; // If expired, start from now

    const newExpiry = new Date(
      currentExpiry.setMonth(currentExpiry.getMonth() + keyData.months)
    );

    // Update user's subscription_status
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ subscription_status: newExpiry.toISOString() })
      .eq("id", session.user.id);

    if (updateError) {
      setMessage("Failed to update subscription. Try again.");
      return;
    }

    // Mark the access key as used
    await supabase
      .from("access_keys")
      .update({ used: true })
      .eq("id", keyData.id);

    setMessage(`Subscription activated! Expires on ${newExpiry.toLocaleDateString()}`);
    setAccessKey("");
  };

  return (
    <div className="get-subscription-page">
      <h1>Activate Subscription</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your access key"
          value={accessKey}
          onChange={(e) => setAccessKey(e.target.value)}
          required
        />
        <button type="submit">Activate</button>
      </form>
      {message && <p style={{ marginTop: "1rem", fontWeight: "bold" }}>{message}</p>}
    </div>
  );
}

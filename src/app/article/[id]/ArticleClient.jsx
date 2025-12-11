"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabaseClient";

export default function ArticleClient({ post }) {
  const [canView, setCanView] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkSubscription() {
      // Get session
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        setLoading(false);
        setCanView(false);
        return;
      }

      // Get profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("subscription_status")
        .eq("id", session.user.id)
        .single();

      if (!profile?.subscription_status) {
        setLoading(false);
        setCanView(false);
        return;
      }

      // Check if subscription is active
      const now = new Date();
      const expiry = new Date(profile.subscription_status);

      setCanView(expiry > now);
      setLoading(false);
    }

    checkSubscription();
  }, []);

  return (
    <div className="page">
      <h1>{post.title}</h1>
      <p className="meta">
        By {post.author} • {new Date(post.created_at).toLocaleDateString()}
      </p>

      {post.image && (
        <img src={post.image} alt={post.title} className="article-image" />
      )}

      {loading ? (
        <p>Loading…</p>
      ) : canView ? (
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      ) : (
        <p style={{ fontWeight: "bold", color: "red" }}>
          Buy a subscription to read
        </p>
      )}
    </div>
  );
}

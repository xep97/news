// src/app/article/[id]/page.jsx
import { supabase } from "../../../../lib/supabaseClient";

export default async function ArticlePage({ params }) {
  const { id: postId } = await params;

  // Fetch the article
  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", postId)
    .eq("is_visible", true)
    .single();

  if (error || !post) {
    return <p>Article not found.</p>;
  }

  // Increment visit count
  await supabase
    .from("posts")
    .update({
      visit_count: post.visit_count + 1,
      last_visited: new Date().toISOString(),
    })
    .eq("id", postId);

  // Get current session
  const { data: { session } } = await supabase.auth.getSession();

  let canViewContent = false;

  if (session) {
    // Fetch user profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("subscription_status")
      .eq("id", session.user.id)
      .single();

    // Check if subscription is still active
    if (profile && profile.subscription_status) {
      const now = new Date();
      const expiry = new Date(profile.subscription_status);

      if (expiry > now) {
        canViewContent = true;
      }
    }
  }

  return (
    <div className="article-page">
      <h1>{post.title}</h1>
      <p className="meta">
        By {post.author} | {new Date(post.created_at).toLocaleDateString()}
      </p>
      {post.image && (
        <img src={post.image} alt={post.title} className="article-image" />
      )}

      {canViewContent ? (
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      ) : (
        <p style={{ fontWeight: "bold", color: "red" }}>
          Buy a subscription to read
        </p>
      )}
    </div>
  );
}

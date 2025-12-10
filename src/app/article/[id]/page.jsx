// src/app/article/[id]/page.jsx
import { supabase } from "../../../../lib/supabaseClient";

export default async function ArticlePage({ params }) {
  // Unwrap params if it's a promise
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

  // Update visit count and last_visited
  await supabase
    .from("posts")
    .update({
      visit_count: post.visit_count + 1,
      last_visited: new Date().toISOString(),
    })
    .eq("id", postId);

  return (
    <div className="article-page">
      <h1>{post.title}</h1>
      <p className="meta">
        By {post.author} | {new Date(post.created_at).toLocaleDateString()}
      </p>
      {post.image && (
        <img src={post.image} alt={post.title} className="article-image" />
      )}
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  );
}

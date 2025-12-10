// app/article/[id]/page.js
import { supabase } from "../../../lib/supabaseClient";

export default async function ArticlePage({ params }) {
  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", params.id)
    .eq("is_visible", true)
    .single();

  if (error || !post) {
    return <p>Article not found.</p>;
  }

  // Increment visit count and update last_visited
  await supabase
    .from("posts")
    .update({
      visit_count: post.visit_count + 1,
      last_visited: new Date().toISOString(),
    })
    .eq("id", params.id);

  return (
    <div className="article-page">
      <h1>{post.title}</h1>
      <p className="meta">
        By {post.author} | {new Date(post.created_at).toLocaleDateString()}
      </p>
      <img src={post.image} alt={post.title} className="article-image" />
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  );
}

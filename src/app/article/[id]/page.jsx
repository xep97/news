import ArticleClient from "./ArticleClient";
import { supabase } from "../../../../lib/supabaseClient";

export default async function ArticlePage({ params }) {
  const { id: postId } = await params;

  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", postId)
    .eq("is_visible", true)
    .single();

  if (error || !post) {
    return <p>Article not found.</p>;
  }

  return <ArticleClient post={post} />;
}

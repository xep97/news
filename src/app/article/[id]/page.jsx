import { supabase } from "../../../../lib/supabaseClient";
import { getHasActiveSubscription } from "../../../../lib/hasActiveSubscription";

export default async function ArticlePage({ params }) {
  const { id: postId } = await params; // unwrap the promise

  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("id", postId)
    .eq("is_visible", true)
    .single();

  if (!post) return <p>Article not found.</p>;

  const hasSubscription = await getHasActiveSubscription();
  console.log(hasSubscription);

  return (
    <div className="article-page">
      <h1>{post.title}</h1>
      {hasSubscription ? (
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      ) : (
        <p style={{ fontWeight: "bold", color: "red" }}>
          Buy a subscription to read
        </p>
      )}
    </div>
  );
}

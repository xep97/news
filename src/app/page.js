// app/page.js
import { supabase } from '../../lib/supabaseClient'
import Link from "next/link";

export default async function HomePage() {
  const { data: posts, error } = await supabase
    .from("posts")
    .select("id, title, image, created_at, author")
    .eq("is_visible", true)
    .order("created_at", { ascending: false })
    .limit(40);

  if (error) {
    return <p>Error loading posts: {error.message}</p>;
  }

  return (
    <div className="home-container">
      <h1>Latest News</h1>
      <div className="posts-grid">
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <img src={post.image} alt={post.title} className="post-image" />
            <Link href={`/article/${post.id}`}>
              <h2 className="post-title">{post.title}</h2>
            </Link>
            <p className="post-meta">
              By {post.author} | {new Date(post.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

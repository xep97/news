// app/page.js
import { supabase } from '../../lib/supabaseClient'
import Link from "next/link";
import Image from 'next/image';

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
      <header className='header'>
        <Image 
          src={`/cat_logo.png`}
          alt="logo"
          height={500} 
          width={500} 
        />
        <h1>Latest Meows</h1>
      </header>
      <div className="posts-grid">
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <Link href={`/article/${post.id}`}>
              <Image 
                src={`/${post.image}`} 
                alt={post.title} 
                height={220} 
                width={220}
                className='post-image'
              />
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

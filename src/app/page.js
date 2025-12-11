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
    <>
      <header className='header'>
        <img 
          src="/cat_logo.png"
          alt="logo"
          className='header-cat'
        />
      </header>
      
      <div className="posts-grid">
        {posts.map((post) => (
          <Link href={`/article/${post.id}`} key={post.id} className="post-card">
              <Image 
                src={`/${post.image}`} 
                alt={post.title} 
                height={220} 
                width={220}
                className='post-image'
              />
              <h3 className="post-title">{post.title}</h3>
              <p className="post-meta">
              By {post.author} | {new Date(post.created_at).toLocaleDateString()}
            </p>
          </Link>
        ))}
      </div>
    </>
  );
}

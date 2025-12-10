"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabaseClient";

export default function ContactPage() {
  const [category, setCategory] = useState("General");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    // Get logged in user
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setMessage("You must be signed in to send a message.");
      return;
    }

    const userId = session.user.id;
    const userEmail = session.user.email;

    // Insert into messages table
    const { error } = await supabase
      .from("messages")
      .insert([
        {
          author: userId,
          email: userEmail,
          category,
          content,
          read_status: "unread"
        }
      ]);

    if (error) {
      setMessage("Failed to send message.");
      console.error(error);
      return;
    }

    setMessage("Message sent!");
    setContent("");
    setCategory("General");
  }

  return (
    <div className="contact-page">
      <h1>Contact Us</h1>

      <form onSubmit={handleSubmit} className="contact-form">
        <label>Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option>General</option>
          <option>Billing</option>
          <option>Technical</option>
          <option>Subscription</option>
        </select>

        <label>Message</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your message here…"
          required
        />

        <button type="submit">Send Message</button>
      </form>

      {message && (
        <p style={{ marginTop: "1rem", fontWeight: "bold" }}>{message}</p>
      )}
    </div>
  );
}

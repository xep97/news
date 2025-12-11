"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabaseClient";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminAndLoadMessages();
  }, []);

  async function checkAdminAndLoadMessages() {
    // Get session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setLoading(false);
      return;
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", session.user.id)
      .single();

    if (!profile?.is_admin) {
      setLoading(false);
      return;
    }

    setIsAdmin(true);

    // Load messages
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) {
      setMessages(data);
    }

    setLoading(false);
  }

  async function markAsRead(id) {
    await supabase
      .from("messages")
      .update({ read_status: "read" })
      .eq("id", id);

    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === id ? { ...msg, read_status: "read" } : msg
      )
    );
  }

  async function deleteMessage(id) {
    await supabase
      .from("messages")
      .delete()
      .eq("id", id);

    setMessages((prev) => prev.filter((msg) => msg.id !== id));
  }

  if (loading) return <p>Loading…</p>;

  if (!isAdmin) {
    return <p style={{ color: "red", fontWeight: "bold" }}>Access denied</p>;
  }

  return (
    <div className="page">
      <h1>Admin: Messages</h1>

      {messages.length === 0 && <p>No messages yet.</p>}

      <div className="messages-list">
        {messages.map((msg) => (
          <div key={msg.id} className="message-card">
            <p><strong>Category:</strong> {msg.category}</p>
            <p><strong>Author ID:</strong> {msg.author}</p>
            <p><strong>Email:</strong> {msg.email}</p>
            <p><strong>Sent:</strong> {new Date(msg.created_at).toLocaleString()}</p>
            <p><strong>Status:</strong> {msg.read_status}</p>

            <p><strong>Message:</strong></p>
            <p>{msg.content}</p>

            <div className="actions">
                {msg.read_status !== "read" && (
                <button onClick={() => markAsRead(msg.id)}>Mark as read</button>
                )}
                <button
                onClick={() => deleteMessage(msg.id)}
                style={{ backgroundColor: "red", color: "white" }}
                >
                Delete
                </button>
            </div>
            </div>

        ))}
      </div>

      <style jsx>{`
        .message-card {
          padding: 1rem;
          border: 1px solid #ddd;
          border-radius: 6px;
          margin-bottom: 1rem;
        }
        .actions {
          margin-top: 10px;
          display: flex;
          gap: 10px;
        }
      `}</style>
    </div>
  );
}

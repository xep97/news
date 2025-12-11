import React from 'react'

export default function Header() {
  return (
    <div className='top'>
        <div className='logo'>
            <h1>Cat news</h1>
        </div>
        <nav className='nav'>
            <a href="/">Home</a>
            <a href="/dashboard">User account</a>
            <a href="/contact">Contact us</a>
            <a href="/admin/messages">Messages</a>
            <a href="/login">Log in</a>
            <a href="/signup">Sign up</a>
        </nav>
    </div>
  )
}

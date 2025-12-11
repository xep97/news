import React from 'react'
import Link from 'next/link'

export default function Header() {
  return (
    <div className='top'>
        <div className='wrapper'>
            <Link href="/" className='logo'>
                <h2>Daily Meows</h2>
            </Link>
            <nav className='nav'>
                <a href="/contact">Msg</a>
                <a href="/dashboard">User</a>
                <a href="/login">Login</a>
                <a href="/signup">Signup</a>
            </nav>
        </div>
    </div>
  )
}

import React from 'react'

export default function Header() {
  return (
    <>
        <header>
            <div>
                <h1>Cat news</h1>
            </div>
            <nav>
                <a href="/">Home</a>
                <a href="/dashboard">User account</a>
                <a href="/">Contact us</a>
                <a href="/">Log out</a>
            </nav>
        </header>
    </>
  )
}

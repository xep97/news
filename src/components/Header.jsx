"use client";
import React from 'react'
import Link from 'next/link'

import { useEffect, useState } from 'react'
import { getAuthStatus } from '../../lib/auth'





export default function Header() {
    const [auth, setAuth] = useState({ isSignedIn: false, user: null })

    useEffect(() => {
        getAuthStatus().then(setAuth)
    }, [])

    if (!auth.isSignedIn) {
        return <p>Not signed in</p>
    }

    return <p>Signed in as {auth.user.email}</p>


  
}

/*
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
    */
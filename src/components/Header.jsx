"use client";
import React from 'react'
import Link from 'next/link'

import { useEffect, useState } from 'react'
import { getAuthStatus } from '../../lib/auth'



let navExp;

export default function Header() {
    const [auth, setAuth] = useState({ isSignedIn: false, user: null })

    useEffect(() => {
        getAuthStatus().then(setAuth)
    }, [])

    if (!auth.isSignedIn) {
        navExp = (
            <>
                <a href='/login'>Login</a>
                <a href='/signup'>Signup</a>
            </>
        );
    } else {
        navExp = (
            <>
                <a href="/contact">Msg</a>
                <a href="/dashboard">User</a>
                <p>Signed in as {auth.user.email}</p>
            </>
        );
    }


    return (
        <div className='top'>
            <div className='wrapper'>
                <Link href="/" className='logo'>
                    <h2>Daily Meows</h2>
                </Link>
                <nav className='nav'>
                    {navExp}
                </nav>
            </div>
        </div>
    )
    
  
}



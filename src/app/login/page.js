"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabaseClient'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }

    const user = data?.user || data

    try {
      await supabase.from('profiles').update({ last_active: new Date().toISOString() }).eq('id', user?.id)
    } catch (err) {
      console.warn('Failed to update last_active', err)
    }

    setLoading(false)
    router.push('/dashboard')
  }

  return (
    <div className='page'>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" disabled={loading}>{loading ? 'Signing in…' : 'Log In'}</button>
        {error && <p style={{color: 'red'}}>{error}</p>}
      </form>
    </div>
  )
}

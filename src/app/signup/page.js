"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabaseClient'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    const user = data?.user || data

    try {
      await supabase.from('profiles').insert([
        {
          id: user?.id,
          email,
          name,
          subscription_status: 'free',
          created_date: new Date().toISOString(),
          last_active: new Date().toISOString(),
        },
      ])
    } catch (err) {
      console.warn('Profile insert error', err)
    }

    setLoading(false)
    router.push('/login')
  }

  return (
    <div className='page'>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required />
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" disabled={loading}>{loading ? 'Signing up…' : 'Sign Up'}</button>
        {error && <p style={{color: 'red'}}>{error}</p>}
      </form>
    </div>
  )
}

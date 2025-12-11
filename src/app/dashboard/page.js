"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabaseClient'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError) {
        setError(userError.message)
        setLoading(false)
        return
      }
      const currentUser = userData?.user
      if (!currentUser) {
        router.push('/login')
        return
      }
      if (mounted) setUser(currentUser)

      const { data, error } = await supabase.from('profiles').select('*').eq('id', currentUser.id).single()
      if (error) {
        setError(error.message)
      } else {
        setProfile(data)
      }
      setLoading(false)
    }
    load()
    return () => { mounted = false }
  }, [router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) return <div style={{maxWidth: 640, margin:'40px auto'}}>Loading...</div>
  if (error) return <div style={{maxWidth: 640, margin:'40px auto', color:'red'}}>Error: {error}</div>

  const displayName = profile?.name || user?.email || 'User'

  return (
    <div style={{maxWidth: 640, margin:'40px auto'}}>
      <h1>Welcome, {displayName}!</h1>
      <p><strong>Subscription ending:</strong> {profile?.subscription_status || 'Not active'}</p>
      <p><strong>Account created:</strong> {profile?.created_date ? new Date(profile.created_date).toLocaleString() : '—'}</p>
      <p><strong>Last active:</strong> {profile?.last_active ? new Date(profile.last_active).toLocaleString() : '—'}</p>
      <a href="/get-subscription">Get subscription</a>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  )
}

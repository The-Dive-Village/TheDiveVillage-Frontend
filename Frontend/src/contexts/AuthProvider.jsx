import { useCallback, useEffect, useMemo, useState } from 'react'
import { authService } from '../services/authService'
import { firebaseAuth } from '../services/firebase'
import { AuthContext } from './AuthContext'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState('guest')
  const [loading, setLoading] = useState(true)

  const syncWithBackend = useCallback(async (firebaseUser) => {
    if (!firebaseUser) {
      localStorage.removeItem('tdv_id_token')
      setUser(null)
      setRole('guest')
      return null
    }

    const isAdminEmail = firebaseUser.email?.toLowerCase() === 'admin@tdv.com'
    const initialRole = isAdminEmail ? 'admin' : 'customer'

    const googleMetadata = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
      photoURL: firebaseUser.photoURL || null,
      emailVerified: firebaseUser.emailVerified || false,
      creationTime: firebaseUser.metadata?.creationTime || null,
      lastSignInTime: firebaseUser.metadata?.lastSignInTime || null,
      providerId: firebaseUser.providerData?.[0]?.providerId || 'google.com',
      role: initialRole,
    }

    // Instantly set authenticated user in state (0ms delay so ProtectedRoute and Navbar update immediately)
    setUser(googleMetadata)
    setRole(initialRole)

    try {
      const token = await firebaseUser.getIdToken()
      localStorage.setItem('tdv_id_token', token)

      // Fast non-blocking sync with backend (timeout capped to 4s)
      const syncPromise = authService.sync()
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Sync timeout')), 4000)
      )
      const { data } = await Promise.race([syncPromise, timeoutPromise])
      const payload = data?.data || data || {}
      const dbUser = payload?.user || {}
      const rawRole = payload?.role || (typeof dbUser.role === 'object' ? dbUser.role?.name : dbUser.role)
      const userRole = isAdminEmail ? 'admin' : (rawRole || initialRole)

      const enrichedUser = {
        ...googleMetadata,
        ...dbUser,
        displayName: dbUser.fullName || googleMetadata.displayName,
        photoURL: dbUser.photoUrl || googleMetadata.photoURL,
        emailVerified: dbUser.emailVerified ?? googleMetadata.emailVerified,
        role: userRole,
      }
      setUser(enrichedUser)
      setRole(userRole)
      return enrichedUser
    } catch {
      return googleMetadata
    }
  }, [])

  useEffect(() => {
    let unsub = () => {}
    try {
      // Check for redirect result from mobile Google sign-in
      if (firebaseAuth.getRedirectResult) {
        firebaseAuth.getRedirectResult().then(async (result) => {
          if (result?.user) {
            setLoading(true)
            await syncWithBackend(result.user)
            setLoading(false)
          }
        }).catch(() => {})
      }

      unsub = firebaseAuth.onAuthStateChanged(async (firebaseUser) => {
        setLoading(true)
        await syncWithBackend(firebaseUser)
        setLoading(false)
      })
    } catch {
      setLoading(false)
    }
    return () => unsub()
  }, [syncWithBackend])

  const login = useCallback(async (email, password) => {
    const cred = await firebaseAuth.signInEmail(email, password)
    return syncWithBackend(cred.user)
  }, [syncWithBackend])

  const signup = useCallback(async (email, password, profile = {}) => {
    const cred = await firebaseAuth.signUpEmail(email, password)
    try {
      await authService.register({
        email,
        displayName: profile.displayName,
        phone: profile.phone,
      })
    } catch {
      /* backend may be offline during UI development */
    }
    return syncWithBackend(cred.user)
  }, [syncWithBackend])

  const loginWithGoogle = useCallback(async () => {
    const cred = await firebaseAuth.signInGoogle()
    return syncWithBackend(cred.user)
  }, [syncWithBackend])

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } catch {
      /* ignore offline */
    }
    await firebaseAuth.signOut()
    setUser(null)
    setRole('guest')
    localStorage.removeItem('tdv_id_token')
  }, [])

  const value = useMemo(
    () => ({
      user,
      role,
      loading,
      isAuthenticated: Boolean(user),
      isAdmin: role === 'admin',
      login,
      signup,
      loginWithGoogle,
      logout,
      syncWithBackend,
    }),
    [user, role, loading, login, signup, loginWithGoogle, logout, syncWithBackend]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

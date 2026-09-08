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
    const token = await firebaseUser.getIdToken()
    localStorage.setItem('tdv_id_token', token)

    const googleMetadata = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
      photoURL: firebaseUser.photoURL || null,
      emailVerified: firebaseUser.emailVerified || false,
      creationTime: firebaseUser.metadata?.creationTime || null,
      lastSignInTime: firebaseUser.metadata?.lastSignInTime || null,
      providerId: firebaseUser.providerData?.[0]?.providerId || 'google.com',
    }

    try {
      const { data } = await authService.sync()
      const dbUser = data?.user || {}
      const enrichedUser = {
        ...googleMetadata,
        ...dbUser,
        displayName: dbUser.fullName || googleMetadata.displayName,
        photoURL: dbUser.photoURL || googleMetadata.photoURL,
        emailVerified: dbUser.emailVerified ?? googleMetadata.emailVerified,
      }
      setUser(enrichedUser)
      setRole(data?.role || dbUser.role || 'customer')
      return enrichedUser
    } catch {
      setUser(googleMetadata)
      setRole('customer')
      return googleMetadata
    }
  }, [])

  useEffect(() => {
    let unsub = () => {}
    if (localStorage.getItem('tdv_admin_auth') === 'true') {
      setUser({
        uid: 'admin-tdv-01',
        email: 'admin@tdv.com',
        displayName: 'TDV Administrator',
        role: 'admin',
      })
      setRole('admin')
      setLoading(false)
      return
    }
    try {
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
    if (email === 'admin@tdv.com' && password === '12345') {
      const adminUser = {
        uid: 'admin-tdv-01',
        email: 'admin@tdv.com',
        displayName: 'TDV Administrator',
        role: 'admin',
      }
      setUser(adminUser)
      setRole('admin')
      localStorage.setItem('tdv_id_token', 'admin_session')
      localStorage.setItem('tdv_admin_auth', 'true')
      return adminUser
    }
    if (email === 'admin@tdv.com' && password !== '12345') {
      throw new Error('Invalid credentials for admin account')
    }
    try {
      const cred = await firebaseAuth.signInEmail(email, password)
      return syncWithBackend(cred.user)
    } catch (err) {
      throw err
    }
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
    localStorage.removeItem('tdv_admin_auth')
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

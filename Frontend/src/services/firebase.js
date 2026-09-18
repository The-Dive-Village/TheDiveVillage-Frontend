let app = null
let auth = null
let authModule = null

const DEFAULT_FIREBASE_CONFIG = {
  apiKey: 'AIzaSyC5-WeuVzMZxq5A31jMqoTq33TZH9Mx008',
  authDomain: 'dive-village-testing.firebaseapp.com',
  projectId: 'dive-village-testing',
  storageBucket: 'dive-village-testing.firebasestorage.app',
  messagingSenderId: '65243166255',
  appId: '1:65243166255:web:f4d281ac4e5bf9525c38da',
}

const firebaseConfig = {
  apiKey: (import.meta.env.VITE_FIREBASE_API_KEY || DEFAULT_FIREBASE_CONFIG.apiKey).trim(),
  authDomain: (import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || DEFAULT_FIREBASE_CONFIG.authDomain).trim(),
  projectId: (import.meta.env.VITE_FIREBASE_PROJECT_ID || DEFAULT_FIREBASE_CONFIG.projectId).trim(),
  storageBucket: (import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || DEFAULT_FIREBASE_CONFIG.storageBucket).trim(),
  messagingSenderId: (import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || DEFAULT_FIREBASE_CONFIG.messagingSenderId).trim(),
  appId: (import.meta.env.VITE_FIREBASE_APP_ID || DEFAULT_FIREBASE_CONFIG.appId).trim(),
}

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.apiKey !== 'placeholder' &&
    firebaseConfig.projectId
)

if (typeof window !== 'undefined' && import.meta.env.DEV) {
  console.log('[Firebase] Loaded Config:', {
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
    hostname: window.location.hostname,
    isConfigured: isFirebaseConfigured,
  })
}

async function getAuthModule() {
  if (!isFirebaseConfigured) return null
  if (auth && authModule) return { auth, app, authMod: authModule }
  const [{ initializeApp }, authMod] = await Promise.all([
    import('firebase/app'),
    import('firebase/auth'),
  ])
  app = initializeApp(firebaseConfig)
  auth = authMod.getAuth(app)
  authModule = authMod
  return { auth, app, authMod }
}

const handleAuthError = (err) => {
  if (err?.code === 'auth/unauthorized-domain' && typeof window !== 'undefined') {
    console.error(
      `[Firebase Auth Error] Unauthorized Domain: "${window.location.hostname}". ` +
      `Please add "${window.location.hostname}" to Firebase Console -> Authentication -> Settings -> Authorized domains.`
    )
  }
  throw err
}

export const firebaseAuth = {
  onAuthStateChanged: (cb) => {
    if (!isFirebaseConfigured) {
      cb(null)
      return () => {}
    }
    let unsub = () => {}
    getAuthModule().then(({ auth: a, authMod }) => {
      if (!a) {
        cb(null)
        return
      }
      unsub = authMod.onAuthStateChanged(a, cb)
    }).catch(() => cb(null))
    return () => unsub()
  },
  signInEmail: async (email, password) => {
    try {
      const { auth: a, authMod } = await getAuthModule()
      return await authMod.signInWithEmailAndPassword(a, email, password)
    } catch (err) {
      handleAuthError(err)
    }
  },
  signUpEmail: async (email, password) => {
    try {
      const { auth: a, authMod } = await getAuthModule()
      return await authMod.createUserWithEmailAndPassword(a, email, password)
    } catch (err) {
      handleAuthError(err)
    }
  },
  signInGoogle: async () => {
    try {
      const { auth: a, authMod } = await getAuthModule()
      const provider = new authMod.GoogleAuthProvider()
      return await authMod.signInWithPopup(a, provider)
    } catch (err) {
      handleAuthError(err)
    }
  },
  sendPasswordReset: async (email) => {
    try {
      const { auth: a, authMod } = await getAuthModule()
      return await authMod.sendPasswordResetEmail(a, email)
    } catch (err) {
      handleAuthError(err)
    }
  },
  signOut: async () => {
    if (!isFirebaseConfigured) return
    const { auth: a, authMod } = await getAuthModule()
    return authMod.signOut(a)
  },
}

export default { getAuthModule, isFirebaseConfigured }

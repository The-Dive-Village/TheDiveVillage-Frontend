let app = null
let auth = null
let authModule = null

const firebaseConfig = {
  apiKey: (import.meta.env.VITE_FIREBASE_API_KEY || '').trim(),
  authDomain: (import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '').trim(),
  projectId: (import.meta.env.VITE_FIREBASE_PROJECT_ID || '').trim(),
  storageBucket: (import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '').trim(),
  messagingSenderId: (import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '').trim(),
  appId: (import.meta.env.VITE_FIREBASE_APP_ID || '').trim(),
}

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.apiKey !== 'placeholder' &&
    firebaseConfig.projectId
)

if (import.meta.env.DEV) {
  console.log('[Firebase] Loaded Config:', {
    projectId: firebaseConfig.projectId,
    apiKeyLength: firebaseConfig.apiKey.length,
    apiKeyStart: firebaseConfig.apiKey.substring(0, 8) + '...',
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
    const { auth: a, authMod } = await getAuthModule()
    return authMod.signInWithEmailAndPassword(a, email, password)
  },
  signUpEmail: async (email, password) => {
    const { auth: a, authMod } = await getAuthModule()
    return authMod.createUserWithEmailAndPassword(a, email, password)
  },
  signInGoogle: async () => {
    const { auth: a, authMod } = await getAuthModule()
    const provider = new authMod.GoogleAuthProvider()
    return authMod.signInWithPopup(a, provider)
  },
  sendPasswordReset: async (email) => {
    const { auth: a, authMod } = await getAuthModule()
    return authMod.sendPasswordResetEmail(a, email)
  },
  signOut: async () => {
    if (!isFirebaseConfigured) return
    const { auth: a, authMod } = await getAuthModule()
    return authMod.signOut(a)
  },
}

export default { getAuthModule, isFirebaseConfigured }

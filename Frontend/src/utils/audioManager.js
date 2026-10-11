// Production CDN Audio URLs:
const CLOUDINARY_AUDIO_URL = 'https://res.cloudinary.com/qvbunv8y/video/upload/v1791685502/TDV-Media/Audio/Audio.mp3'

const AUDIO_SOURCES = [
  CLOUDINARY_AUDIO_URL,
].filter(Boolean)

class AudioManager {
  constructor() {
    this.audio = null
    this.isMuted = false
    this.listeners = new Set()
    this.hasUnlocked = false
    this.initialized = false
    this.currentSourceIndex = 0
    this.audioContext = null
    this.isBackgrounded = false
    this.wasPlayingBeforeBackground = false
    this.resumeGestureAttached = false
    this.onGestureResume = null

    if (typeof window !== 'undefined') {
      this.init()
    }
  }

  init() {
    if (this.initialized) return
    this.initialized = true

    // Check if user previously muted
    const storedMute = localStorage.getItem('tdv_audio_muted')
    if (storedMute !== null) {
      this.isMuted = storedMute === 'true'
    }

    // Check if initially hidden/backgrounded (e.g. loaded in a background tab)
    if (typeof document !== 'undefined' && document.hidden) {
      this.isBackgrounded = true
    }

    const audio = new Audio()
    audio.id = 'tdv-global-ambient-audio'
    audio.loop = true
    audio.preload = 'auto'
    audio.crossOrigin = 'anonymous'
    audio.volume = this.isMuted ? 0 : 0.5
    audio.muted = this.isMuted
    audio.playsInline = true
    audio.setAttribute('playsinline', '')
    audio.setAttribute('webkit-playsinline', '')

    if (AUDIO_SOURCES.length > 0) {
      audio.src = AUDIO_SOURCES[0]
    }

    // Auto-fallback if the current source fails to load
    audio.addEventListener('error', () => {
      if (this.currentSourceIndex < AUDIO_SOURCES.length - 1) {
        this.currentSourceIndex++
        console.warn(`[AudioManager] Switching audio source to fallback: ${AUDIO_SOURCES[this.currentSourceIndex]}`)
        audio.src = AUDIO_SOURCES[this.currentSourceIndex]
        audio.load()
        if (!this.isMuted && !this.isBackgrounded) {
          audio.play().catch(() => {})
        }
      }
    })

    this.audio = audio

    // Attach unlock handlers on any user interaction (pointerdown, touchstart, click, keydown, mousemove, scroll)
    const unlockEvents = [
      'pointerdown',
      'touchstart',
      'mousedown',
      'click',
      'keydown',
      'wheel',
      'scroll',
      'mousemove'
    ]

    const unlock = () => {
      if (this.isMuted || this.isBackgrounded) {
        if (this.isMuted) {
          unlockEvents.forEach((evt) => {
            window.removeEventListener(evt, unlock, true)
            document.removeEventListener(evt, unlock, true)
          })
        }
        return
      }

      // Resume Web Audio context if initialized
      if (this.audioContext && this.audioContext.state === 'suspended') {
        this.audioContext.resume().catch(() => {})
      }

      if (this.audio) {
        this.audio.muted = false
        this.audio.volume = 0.5
        const p = this.audio.play()
        if (p !== undefined) {
          p.then(() => {
            this.hasUnlocked = true
            this.notify()
            unlockEvents.forEach((evt) => {
              window.removeEventListener(evt, unlock, true)
              document.removeEventListener(evt, unlock, true)
            })
          }).catch(() => {
            // Keep listeners for subsequent user gestures
          })
        }
      }
    }

    this.unlockFn = unlock

    unlockEvents.forEach((evt) => {
      window.addEventListener(evt, unlock, { capture: true, passive: true })
      document.addEventListener(evt, unlock, { capture: true, passive: true })
    })

    window.addEventListener('tdv-unlock-audio', unlock)

    // Setup lifecycle listeners for tab switching, window switching, and app switching
    const handleVisibilityChange = () => {
      if (typeof document !== 'undefined' && document.hidden) {
        this.handleBackground()
      } else {
        this.handleForeground()
      }
    }

    const handleWindowBlur = (e) => {
      // Ignore blur events from inner elements (e.g. form fields)
      if (e && e.target && e.target !== window && e.target !== document) return
      this.handleBackground()
    }

    const handleWindowFocus = (e) => {
      // Ignore focus events from inner elements
      if (e && e.target && e.target !== window && e.target !== document) return
      this.handleForeground()
    }

    const handlePageHide = () => {
      this.handleBackground()
    }

    const handlePageShow = () => {
      this.handleForeground()
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('blur', handleWindowBlur)
    window.addEventListener('focus', handleWindowFocus)
    window.addEventListener('pagehide', handlePageHide)
    window.addEventListener('pageshow', handlePageShow)

    // Attempt direct autoplay on page load immediately if in foreground
    if (!this.isMuted && !this.isBackgrounded) {
      this.audio.volume = 0.5
      this.audio.muted = false
      const p = this.audio.play()
      if (p !== undefined) {
        p.then(() => {
          this.hasUnlocked = true
          this.notify()
        }).catch(() => {
          // If unmuted autoplay blocked by browser policy, play muted first so stream buffers
          this.audio.muted = true
          this.audio.play().then(() => {
            // Unmute on the next user event
          }).catch(() => {})
        })
      }
    } else if (!this.isMuted && this.isBackgrounded) {
      this.wasPlayingBeforeBackground = true
    }
  }

  handleBackground() {
    if (this.isBackgrounded) return
    this.isBackgrounded = true

    // Check if audio was playing or was actively unlocked to play
    const isPlaying = this.isPlaying()
    const shouldBePlaying = !this.isMuted && (this.hasUnlocked || isPlaying)
    this.wasPlayingBeforeBackground = isPlaying || shouldBePlaying

    // Immediately pause audio to stop playing in background
    if (this.audio) {
      try {
        this.audio.pause()
      } catch (e) {
        // ignore
      }
    }

    // Suspend audio context if running
    if (this.audioContext && this.audioContext.state === 'running') {
      this.audioContext.suspend().catch(() => {})
    }

    // Ensure any other audio elements on page are paused in background
    if (typeof document !== 'undefined') {
      try {
        document.querySelectorAll('audio').forEach((el) => {
          if (!el.paused) {
            el.pause()
          }
        })
      } catch (e) {
        // ignore
      }
    }

    this.notify()
  }

  handleForeground() {
    // If the tab is still hidden (e.g. background tab), do not resume
    if (typeof document !== 'undefined' && document.hidden) {
      return
    }

    if (!this.isBackgrounded) return
    this.isBackgrounded = false

    // Resume only if user has not explicitly muted and it was playing before
    if (!this.isMuted && this.wasPlayingBeforeBackground) {
      this.resumeAudio()
    }

    this.wasPlayingBeforeBackground = false
    this.notify()
  }

  resumeAudio() {
    if (this.isMuted || this.isBackgrounded) return

    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume().catch(() => {})
    }

    if (this.audio) {
      this.audio.muted = false
      this.audio.volume = 0.5
      const playPromise = this.audio.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            this.hasUnlocked = true
            this.notify()
          })
          .catch((err) => {
            console.warn('[AudioManager] Resume playback was blocked by browser policy:', err)
            // Browser policy may require a user gesture to resume audio
            this.setupResumeGestureListener()
          })
      }
    }
  }

  setupResumeGestureListener() {
    if (this.resumeGestureAttached) return
    this.resumeGestureAttached = true

    const onGesture = () => {
      this.removeResumeGestureListener()
      if (!this.isMuted && !this.isBackgrounded) {
        this.resumeAudio()
      }
    }

    this.onGestureResume = onGesture
    const gestureEvents = ['pointerdown', 'touchstart', 'mousedown', 'keydown', 'click']
    gestureEvents.forEach((evt) => {
      window.addEventListener(evt, onGesture, { capture: true, passive: true, once: true })
    })
  }

  removeResumeGestureListener() {
    if (!this.resumeGestureAttached) return
    this.resumeGestureAttached = false
    if (this.onGestureResume) {
      const gestureEvents = ['pointerdown', 'touchstart', 'mousedown', 'keydown', 'click']
      gestureEvents.forEach((evt) => {
        window.removeEventListener(evt, this.onGestureResume, true)
      })
      this.onGestureResume = null
    }
  }

  subscribe(callback) {
    this.listeners.add(callback)
    callback({ isMuted: this.isMuted, isPlaying: this.isPlaying() })
    return () => this.listeners.delete(callback)
  }

  notify() {
    const state = { isMuted: this.isMuted, isPlaying: this.isPlaying() }
    this.listeners.forEach((cb) => {
      try {
        cb(state)
      } catch (err) {
        console.error(err)
      }
    })
  }

  isPlaying() {
    return !!(this.audio && !this.audio.paused && !this.audio.muted && this.audio.volume > 0)
  }

  getIsMuted() {
    return this.isMuted
  }

  toggle() {
    if (this.isMuted) {
      this.unmute()
    } else {
      this.mute()
    }
  }

  mute() {
    this.isMuted = true
    this.wasPlayingBeforeBackground = false
    this.removeResumeGestureListener()
    localStorage.setItem('tdv_audio_muted', 'true')
    if (this.audio) {
      this.audio.muted = true
      this.audio.volume = 0
      this.audio.pause()
    }
    this.notify()
  }

  unmute() {
    this.isMuted = false
    this.removeResumeGestureListener()
    localStorage.setItem('tdv_audio_muted', 'false')
    if (this.isBackgrounded) {
      this.wasPlayingBeforeBackground = true
    } else if (this.audio) {
      this.audio.muted = false
      this.audio.volume = 0.5
      const p = this.audio.play()
      if (p !== undefined) {
        p.then(() => {
          this.hasUnlocked = true
          this.notify()
        }).catch((e) => {
          console.warn('[AudioManager] Unmute play blocked:', e)
          this.setupResumeGestureListener()
        })
      }
    }
    this.notify()
  }
}

export const globalAudio = new AudioManager()

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
    this.wasPlayingBeforeHidden = false
    this.unlockListenersAttached = false
    this.unlockFn = null

    if (typeof window !== 'undefined') {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.init())
      } else {
        this.init()
      }
    }
  }

  init() {
    if (this.initialized || typeof window === 'undefined') return
    this.initialized = true

    // Check user preference from localStorage
    const storedMute = localStorage.getItem('tdv_audio_muted')
    if (storedMute !== null) {
      this.isMuted = storedMute === 'true'
    }

    // Reuse existing DOM audio element or create and append to document.body
    let audio = document.getElementById('tdv-global-ambient-audio')
    if (!audio) {
      audio = document.createElement('audio')
      audio.id = 'tdv-global-ambient-audio'
      audio.loop = true
      audio.preload = 'auto'
      audio.crossOrigin = 'anonymous'
      audio.playsInline = true
      audio.setAttribute('playsinline', '')
      audio.setAttribute('webkit-playsinline', '')
      audio.style.cssText = 'display:none;position:fixed;pointer-events:none;'
      if (AUDIO_SOURCES.length > 0) {
        audio.src = AUDIO_SOURCES[0]
      }
      document.body.appendChild(audio)
    }

    audio.loop = true
    audio.playsInline = true
    audio.setAttribute('playsinline', '')
    audio.setAttribute('webkit-playsinline', '')

    if (this.isMuted) {
      audio.muted = true
      audio.volume = 0
    } else {
      audio.volume = 0.5
      // If audio element already started muted during index.html inline script, keep until unmuted
      audio.muted = audio.muted ?? false
    }

    if (!audio.src && AUDIO_SOURCES.length > 0) {
      audio.src = AUDIO_SOURCES[0]
    }

    // Auto-fallback if the current source fails to load
    audio.addEventListener('error', () => {
      if (this.currentSourceIndex < AUDIO_SOURCES.length - 1) {
        this.currentSourceIndex++
        console.warn(`[AudioManager] Switching audio source to fallback: ${AUDIO_SOURCES[this.currentSourceIndex]}`)
        audio.src = AUDIO_SOURCES[this.currentSourceIndex]
        audio.load()
        if (!this.isMuted && !document.hidden) {
          audio.play().catch(() => {})
        }
      }
    })

    this.audio = audio

    // ─────────────────────────────────────────────────────────────
    // User Gesture Unlock Handlers (Capture phase for instant unlock)
    // ─────────────────────────────────────────────────────────────
    const unlockEvents = [
      'pointerdown',
      'touchstart',
      'mousedown',
      'click',
      'keydown'
    ]

    const removeUnlockListeners = () => {
      if (!this.unlockListenersAttached) return
      this.unlockListenersAttached = false
      unlockEvents.forEach((evt) => {
        window.removeEventListener(evt, unlock, true)
        document.removeEventListener(evt, unlock, true)
      })
    }

    const unlock = () => {
      if (this.isMuted) {
        removeUnlockListeners()
        return
      }

      if (typeof document !== 'undefined' && document.hidden) {
        return
      }

      if (this.audio) {
        this.audio.muted = false
        this.audio.volume = 0.5
        const p = this.audio.play()
        if (p !== undefined) {
          p.then(() => {
            this.hasUnlocked = true
            this.notify()
            removeUnlockListeners()
          }).catch(() => {
            // Keep listeners if interaction was not recognized as activation by browser
          })
        } else {
          this.hasUnlocked = true
          this.notify()
          removeUnlockListeners()
        }
      }
    }

    this.unlockFn = unlock
    this.unlockListenersAttached = true

    unlockEvents.forEach((evt) => {
      window.addEventListener(evt, unlock, { capture: true, passive: true })
      document.addEventListener(evt, unlock, { capture: true, passive: true })
    })

    window.addEventListener('tdv-unlock-audio', unlock)

    // ─────────────────────────────────────────────────────────────
    // Desktop & Mobile Lifecycle Handlers (Pause & Resume)
    //
    // Covers:
    // 1. Desktop Tab Switch & Window Minimize: document.visibilitychange
    // 2. Desktop Window Switch / Click off website: window.blur & window.focus
    // 3. Mobile App Switch & Screen Lock: window.pagehide & window.pageshow
    // ─────────────────────────────────────────────────────────────
    const handleLeaveSite = () => {
      if (this.isMuted || !this.audio) return
      // If currently playing with audible sound, remember and pause
      if (!this.audio.paused && !this.audio.muted) {
        this.wasPlayingBeforeHidden = true
        this.audio.pause()
        this.audio.muted = true
        this.notify()
      }
    }

    const handleEnterSite = () => {
      if (this.isMuted || !this.audio) return
      // Don't resume if document is actually hidden in another tab
      if (typeof document !== 'undefined' && document.hidden) return

      if (this.wasPlayingBeforeHidden) {
        this.wasPlayingBeforeHidden = false
        this.audio.muted = false
        this.audio.volume = 0.5
        const p = this.audio.play()
        if (p !== undefined) {
          p.then(() => {
            this.hasUnlocked = true
            this.notify()
          }).catch((err) => {
            console.warn('[AudioManager] Resumption blocked by browser policy:', err)
            // Re-arm one-time unlock listener for the immediate next tap/click
            const resumeOnTouch = () => {
              if (!this.isMuted && this.audio && this.audio.paused && !document.hidden) {
                this.audio.muted = false
                this.audio.volume = 0.5
                this.audio.play().catch(() => {})
              }
              window.removeEventListener('pointerdown', resumeOnTouch)
              window.removeEventListener('touchstart', resumeOnTouch)
              window.removeEventListener('click', resumeOnTouch)
            }
            window.addEventListener('pointerdown', resumeOnTouch, { once: true, passive: true })
            window.addEventListener('touchstart', resumeOnTouch, { once: true, passive: true })
            window.addEventListener('click', resumeOnTouch, { once: true, passive: true })
          })
        }
      }
    }

    // 1. Tab visibility / window minimization
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        handleLeaveSite()
      } else {
        handleEnterSite()
      }
    })

    // 2. Desktop window focus & blur (User clicking off the website to another window/app)
    window.addEventListener('blur', () => {
      handleLeaveSite()
    })

    window.addEventListener('focus', () => {
      handleEnterSite()
    })

    // 3. Mobile device lifecycle (App switch & screen lock)
    window.addEventListener('pagehide', () => {
      handleLeaveSite()
    })

    window.addEventListener('pageshow', () => {
      handleEnterSite()
    })

    // ─────────────────────────────────────────────────────────────
    // Initial Autoplay Attempt on Page Load
    // ─────────────────────────────────────────────────────────────
    if (!this.isMuted && typeof document !== 'undefined' && !document.hidden) {
      this.audio.volume = 0.5
      this.audio.muted = false
      const p = this.audio.play()
      if (p !== undefined) {
        p.then(() => {
          this.hasUnlocked = true
          this.notify()
          removeUnlockListeners()
        }).catch(() => {
          // If browser policy restricts unmuted autoplay on initial load (e.g. Chrome with 0 MEI):
          // Immediately start muted playback so stream buffers and runs in the background
          this.audio.muted = true
          this.audio.play().then(() => {
            // Buffer ready, waits for unlock
          }).catch(() => {})
        })
      }
    }

    // Expose global instance for easy debugging and components
    window.__tdvGlobalAudio = this
    window.globalAudio = this
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
    this.wasPlayingBeforeHidden = false
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
    this.wasPlayingBeforeHidden = false
    localStorage.setItem('tdv_audio_muted', 'false')
    if (this.audio && typeof document !== 'undefined' && !document.hidden) {
      this.audio.muted = false
      this.audio.volume = 0.5
      const p = this.audio.play()
      if (p !== undefined) {
        p.then(() => {
          this.hasUnlocked = true
          this.notify()
        }).catch((e) => {
          console.warn('[AudioManager] Unmute play blocked:', e)
        })
      }
    }
    this.notify()
  }
}

export const globalAudio = new AudioManager()
export default globalAudio

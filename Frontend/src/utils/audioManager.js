import underwaterAudioFile from '../assets/Audio.mp3'

// Production CDN URL + Local Asset fallbacks:
const CLOUDINARY_AUDIO_URL = 'https://res.cloudinary.com/qvbunv8y/video/upload/v1791624383/TDV-Audio/ambient_underwater.mp3'

const AUDIO_SOURCES = [
  CLOUDINARY_AUDIO_URL,
  underwaterAudioFile,
  '/Audio.mp3'
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
        if (!this.isMuted) {
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
      if (this.isMuted) {
        unlockEvents.forEach((evt) => {
          window.removeEventListener(evt, unlock, true)
          document.removeEventListener(evt, unlock, true)
        })
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

    // Attempt direct autoplay on page load immediately
    if (!this.isMuted) {
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
    localStorage.setItem('tdv_audio_muted', 'false')
    if (this.audio) {
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

import underwaterAudioFile from '../assets/Audio.mp3'

class AudioManager {
  constructor() {
    this.audio = null
    this.isMuted = false
    this.listeners = new Set()
    this.hasUnlocked = false
    this.initialized = false

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

    // Create singleton audio element
    const audio = new Audio()
    audio.id = 'tdv-global-ambient-audio'
    audio.src = underwaterAudioFile || '/Audio.mp3'
    audio.loop = true
    audio.preload = 'auto'
    audio.volume = this.isMuted ? 0 : 0.5
    audio.muted = this.isMuted
    audio.playsInline = true
    audio.setAttribute('playsinline', '')
    audio.setAttribute('webkit-playsinline', '')
    this.audio = audio

    // Attach unlock handlers on interaction
    const unlockEvents = ['pointerdown', 'touchstart', 'mousedown', 'keydown', 'click']
    const unlock = () => {
      if (this.isMuted) {
        unlockEvents.forEach((evt) => {
          window.removeEventListener(evt, unlock, true)
          document.removeEventListener(evt, unlock, true)
        })
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
            unlockEvents.forEach((evt) => {
              window.removeEventListener(evt, unlock, true)
              document.removeEventListener(evt, unlock, true)
            })
          }).catch(() => {
            // Wait for next interaction
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

    // Attempt early autoplay (works on browsers with autoplay allowance)
    if (!this.isMuted) {
      this.audio.volume = 0.5
      this.audio.muted = false
      const p = this.audio.play()
      if (p !== undefined) {
        p.then(() => {
          this.hasUnlocked = true
          this.notify()
        }).catch(() => {
          // Blocked by autoplay policy; will unlock on first user gesture
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
          console.warn('Audio unmute play blocked:', e)
        })
      }
    }
    this.notify()
  }
}

export const globalAudio = new AudioManager()

import { useState, useEffect } from 'react'

export function useNightDive() {
  const [isNightDive, setIsNightDive] = useState(() => {
    if (typeof document !== 'undefined') {
      return document.body.classList.contains('night-dive')
    }
    return false
  })

  useEffect(() => {
    const updateTheme = () => {
      setIsNightDive(document.body.classList.contains('night-dive'))
    }

    const observer = new MutationObserver(updateTheme)
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] })
    updateTheme()

    return () => observer.disconnect()
  }, [])

  return isNightDive
}

export default useNightDive

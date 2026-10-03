import { useState, useEffect } from 'react'
import { motion } from '../lib/motion.js'

export default function MotionToggle() {
  const [off, setOff] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion:reduce)').matches) {
      setOff(true); motion.on = false
    }
  }, [])

  const toggle = () => {
    const v = !off
    setOff(v)
    motion.on = !v
  }

  return (
    <button className="mtoggle" onClick={toggle} aria-label="Toggle motion">
      <span className={'d' + (off ? ' off' : '')} />{off ? 'Paused' : 'Live'}
    </button>
  )
}

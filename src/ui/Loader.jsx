import { useEffect, useState } from 'react'

// Brief opening veil that lifts to reveal the field being born.
export default function Loader() {
  const [hidden, setHidden] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setHidden(true), 420)
    return () => clearTimeout(t)
  }, [])
  return (
    <div className={'veil' + (hidden ? ' gone' : '')}>
      <div className="veil-mark">Sphere<span className="ok">Code</span></div>
      <div className="veil-sub">Dimensions of Possibilities</div>
    </div>
  )
}

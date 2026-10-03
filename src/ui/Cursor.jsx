import { useEffect, useRef } from 'react'

export default function Cursor() {
  const ring = useRef(), dot = useRef()
  useEffect(() => {
    let rx = 0, ry = 0, mx = 0, my = 0, raf
    const move = (e) => {
      mx = e.clientX; my = e.clientY
      if (dot.current) dot.current.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`
    }
    const loop = () => {
      rx += (mx - rx) * 0.2; ry += (my - ry) * 0.2
      if (ring.current) ring.current.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`
      raf = requestAnimationFrame(loop)
    }
    window.addEventListener('mousemove', move); loop()
    const hot = () => ring.current && ring.current.classList.add('hot')
    const cold = () => ring.current && ring.current.classList.remove('hot')
    const bind = () => document.querySelectorAll('a,button,input,select,textarea,.cap-row,.wrow').forEach((el) => {
      el.addEventListener('mouseenter', hot); el.addEventListener('mouseleave', cold)
    })
    const tb = setTimeout(bind, 600)
    return () => { window.removeEventListener('mousemove', move); cancelAnimationFrame(raf); clearTimeout(tb) }
  }, [])
  return (<><div className="cur" ref={ring} /><div className="cur-dot" ref={dot} /></>)
}

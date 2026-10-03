import Site from './ui/Site.jsx'
import Cursor from './ui/Cursor.jsx'
import Loader from './ui/Loader.jsx'
import MotionToggle from './ui/MotionToggle.jsx'

export default function App() {
  return (
    <>
      {/* deep-dark atmosphere — blueprint grid + soft wash + grain + vignette */}
      <div className="bgwash" />
      <div className="gridbg" />
      <div className="grain" />
      <div className="vignette" />

      <Site />

      <Cursor />
      <MotionToggle />
      <Loader />
    </>
  )
}

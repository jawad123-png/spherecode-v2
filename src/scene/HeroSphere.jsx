import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { motion } from '../lib/motion.js'

const CYAN = '#37e0ff'
const VIOLET = '#8f7bff'
const SPARK = '#c7f7ff'

/* ---------- geometry helpers ---------- */
function fromPts(pts) { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3)); return g }
function globeGeo(r, lon, lat, seg) {
  const v = []
  const P = (az, pol) => [r * Math.sin(pol) * Math.cos(az), r * Math.cos(pol), r * Math.sin(pol) * Math.sin(az)]
  for (let i = 0; i < lon; i++) { const az = (i / lon) * Math.PI * 2; for (let j = 0; j < seg; j++) { v.push(...P(az, (j / seg) * Math.PI), ...P(az, ((j + 1) / seg) * Math.PI)) } }
  for (let i = 1; i < lat; i++) { const pol = (i / lat) * Math.PI; for (let j = 0; j < seg; j++) { v.push(...P((j / seg) * Math.PI * 2, pol), ...P(((j + 1) / seg) * Math.PI * 2, pol)) } }
  return fromPts(v)
}
function fibPts(r, n) {
  const out = [], g = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < n; i++) { const y = 1 - (i / (n - 1)) * 2, rad = Math.sqrt(1 - y * y), th = g * i; out.push(new THREE.Vector3(Math.cos(th) * rad * r, y * r, Math.sin(th) * rad * r)) }
  return out
}
function dotGeo(r, n) { const p = fibPts(r, n).flatMap((v) => [v.x, v.y, v.z]); return fromPts(p) }
/* great-circle arc between two surface points, lifted above the sphere */
function slerpArc(a, b, r, lift, seg) {
  const va = a.clone().normalize(), vb = b.clone().normalize()
  const om = Math.acos(THREE.MathUtils.clamp(va.dot(vb), -1, 1)), so = Math.sin(om) || 1e-5
  const pts = []
  for (let j = 0; j <= seg; j++) {
    const t = j / seg
    const v = va.clone().multiplyScalar(Math.sin((1 - t) * om) / so).add(vb.clone().multiplyScalar(Math.sin(t * om) / so))
    v.multiplyScalar(r * (1 + lift * Math.sin(t * Math.PI)))
    pts.push(v)
  }
  return pts
}

/* ---------- tiny wireframe site/store window (billboarded) ---------- */
const CW = 1.04, CH = 0.7, BAR = CH / 2 - 0.13
const CARD_RECT = fromPts([-CW / 2, CH / 2, 0, CW / 2, CH / 2, 0, CW / 2, -CH / 2, 0, -CW / 2, -CH / 2, 0])
const CARD_DETAIL = fromPts([
  -CW / 2, BAR, 0, CW / 2, BAR, 0,
  -CW / 2 + 0.1, -0.02, 0, CW / 2 - 0.3, -0.02, 0,
  -CW / 2 + 0.1, -0.16, 0, CW / 2 - 0.14, -0.16, 0,
])
const CARD_DOTS = fromPts([-CW / 2 + 0.08, CH / 2 - 0.065, 0, -CW / 2 + 0.15, CH / 2 - 0.065, 0, -CW / 2 + 0.22, CH / 2 - 0.065, 0])
function SiteCard({ color }) {
  return (
    <group>
      <lineLoop geometry={CARD_RECT}><lineBasicMaterial color={color} transparent opacity={0.9} /></lineLoop>
      <lineSegments geometry={CARD_DETAIL}><lineBasicMaterial color={color} transparent opacity={0.6} /></lineSegments>
      <points geometry={CARD_DOTS}><pointsMaterial color={color} size={0.045} sizeAttenuation transparent opacity={0.95} /></points>
      <mesh position={[0.06, -0.1, -0.002]}><planeGeometry args={[CW - 0.2, 0.24]} /><meshBasicMaterial color={color} transparent opacity={0.08} /></mesh>
    </group>
  )
}

function Scene() {
  const tiltGrp = useRef(), spinGrp = useRef(), ringGrp = useRef(), orbitGrp = useRef()
  const cards = useRef([])
  const target = useRef({ x: 0, y: 0 })

  const mob = typeof window !== 'undefined' && window.matchMedia('(max-width:760px)').matches
  const geo = useMemo(() => ({
    globe: globeGeo(2.3, mob ? 18 : 22, mob ? 11 : 14, mob ? 34 : 44),
    inner: new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(1.45, 1)),
    dots: dotGeo(2.42, mob ? 230 : 420),
    ring: new THREE.TorusGeometry(3.05, 0.007, 8, 160),
    ring2: new THREE.TorusGeometry(3.55, 0.005, 8, 180),
  }), [mob])

  /* live network: cities + arcs on the globe surface */
  const net = useMemo(() => {
    const R = 2.31
    const cities = fibPts(R, 17)
    const pairs = [[0, 7], [1, 10], [3, 13], [5, 15], [8, 2], [11, 4], [14, 6], [12, 16], [9, 3], [6, 13]]
    const arcs = pairs.map(([i, j]) => slerpArc(cities[i], cities[j], R, 0.3, 46))
    const seg = []
    arcs.forEach((a) => { for (let k = 0; k < a.length - 1; k++) seg.push(a[k].x, a[k].y, a[k].z, a[k + 1].x, a[k + 1].y, a[k + 1].z) })
    return { arcs, arcGeo: fromPts(seg), cityGeo: fromPts(cities.flatMap((c) => [c.x, c.y, c.z])) }
  }, [])

  /* orbiting site windows + wires to the core */
  const { nodes, links } = useMemo(() => {
    const R = 3.5, N = 5, nodes = [], link = []
    for (let i = 0; i < N; i++) {
      const a = (i / N) * Math.PI * 2
      const p = new THREE.Vector3(Math.cos(a) * R, Math.sin(a * 1.3) * 0.85, Math.sin(a) * R)
      nodes.push({ p: [p.x, p.y, p.z], v: p, color: i % 3 === 1 ? VIOLET : CYAN })
      link.push(0, 0, 0, p.x, p.y, p.z)
    }
    return { nodes, links: fromPts(link) }
  }, [])

  /* traveling light pulses (one per arc + one per link) */
  const arcPulse = useMemo(() => fromPts(new Array(net.arcs.length * 3).fill(0)), [net])
  const linkPulse = useMemo(() => fromPts(new Array(nodes.length * 3).fill(0)), [nodes])
  const arcPh = useRef(net.arcs.map((_, i) => i / net.arcs.length))
  const linkPh = useRef(nodes.map((_, i) => i / nodes.length))

  useEffect(() => {
    const h = (e) => { target.current.x = e.clientX / window.innerWidth - 0.5; target.current.y = e.clientY / window.innerHeight - 0.5 }
    const t = (e) => { const p = e.touches[0]; if (p) { target.current.x = p.clientX / window.innerWidth - 0.5; target.current.y = p.clientY / window.innerHeight - 0.5 } }
    window.addEventListener('mousemove', h)
    window.addEventListener('touchmove', t, { passive: true })
    return () => { window.removeEventListener('mousemove', h); window.removeEventListener('touchmove', t) }
  }, [])

  useFrame((state, dt) => {
    const d = Math.min(dt, 0.05)
    if (motion.on) {
      if (spinGrp.current) spinGrp.current.rotation.y += d * 0.12
      if (ringGrp.current) { ringGrp.current.rotation.z += d * 0.2; ringGrp.current.rotation.x = 1.15 }
      if (orbitGrp.current) orbitGrp.current.rotation.y -= d * 0.15
    }
    if (tiltGrp.current) {
      tiltGrp.current.rotation.y += (target.current.x * 0.55 - tiltGrp.current.rotation.y) * 0.05
      tiltGrp.current.rotation.x += (target.current.y * 0.45 - tiltGrp.current.rotation.x) * 0.05
      tiltGrp.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 0.7) * 0.014)
    }
    for (const c of cards.current) if (c) c.lookAt(state.camera.position)

    // advance + place arc pulses
    const ap = arcPulse.attributes.position.array
    net.arcs.forEach((arc, i) => {
      arcPh.current[i] = (arcPh.current[i] + d * (0.14 + (i % 3) * 0.03)) % 1
      const f = arcPh.current[i] * (arc.length - 1), k = Math.floor(f), fr = f - k
      const p0 = arc[k], p1 = arc[Math.min(k + 1, arc.length - 1)]
      ap[i * 3] = p0.x + (p1.x - p0.x) * fr; ap[i * 3 + 1] = p0.y + (p1.y - p0.y) * fr; ap[i * 3 + 2] = p0.z + (p1.z - p0.z) * fr
    })
    arcPulse.attributes.position.needsUpdate = true
    // link pulses (core → site window)
    const lp = linkPulse.attributes.position.array
    nodes.forEach((n, i) => {
      linkPh.current[i] = (linkPh.current[i] + d * 0.4) % 1
      const t = linkPh.current[i]
      lp[i * 3] = n.v.x * t; lp[i * 3 + 1] = n.v.y * t; lp[i * 3 + 2] = n.v.z * t
    })
    linkPulse.attributes.position.needsUpdate = true
  })

  return (
    <group ref={tiltGrp}>
      <group ref={spinGrp}>
        <lineSegments geometry={geo.globe}><lineBasicMaterial color={CYAN} transparent opacity={0.28} /></lineSegments>
        <points geometry={geo.dots}><pointsMaterial color={CYAN} size={0.04} sizeAttenuation transparent opacity={0.7} /></points>
        <lineSegments geometry={geo.inner}><lineBasicMaterial color={VIOLET} transparent opacity={0.26} /></lineSegments>

        {/* live network */}
        <lineSegments geometry={net.arcGeo}><lineBasicMaterial color={CYAN} transparent opacity={0.28} /></lineSegments>
        <points geometry={net.cityGeo}><pointsMaterial color={SPARK} size={0.19} sizeAttenuation transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} /></points>
        <points geometry={net.cityGeo}><pointsMaterial color={SPARK} size={0.075} sizeAttenuation transparent opacity={1} depthWrite={false} /></points>
        <points geometry={arcPulse}><pointsMaterial color={SPARK} size={0.2} sizeAttenuation transparent opacity={0.95} blending={THREE.AdditiveBlending} depthWrite={false} /></points>
      </group>

      <group ref={ringGrp}>
        <mesh geometry={geo.ring}><meshBasicMaterial color={CYAN} transparent opacity={0.5} /></mesh>
        <mesh geometry={geo.ring2} rotation={[0.7, 0.4, 0]}><meshBasicMaterial color={VIOLET} transparent opacity={0.3} /></mesh>
      </group>

      {/* orbiting sites/stores/apps */}
      <group ref={orbitGrp} rotation={[0.5, 0, 0]}>
        <lineSegments geometry={links}><lineBasicMaterial color={CYAN} transparent opacity={0.15} /></lineSegments>
        <points geometry={linkPulse}><pointsMaterial color={SPARK} size={0.16} sizeAttenuation transparent opacity={0.95} blending={THREE.AdditiveBlending} depthWrite={false} /></points>
        {nodes.map((n, i) => (
          <group key={i} ref={(el) => (cards.current[i] = el)} position={n.p}>
            <SiteCard color={n.color} />
          </group>
        ))}
      </group>

      <mesh><sphereGeometry args={[0.055, 16, 16]} /><meshBasicMaterial color={SPARK} /></mesh>
    </group>
  )
}

export default function HeroSphere() {
  return (
    <Canvas
      dpr={[1, 2]}
      style={{ pointerEvents: 'none' }}
      camera={{ fov: 42, position: [0, 0, 7.4], near: 0.1, far: 50 }}
      gl={{ antialias: true, alpha: true }}
    >
      <Scene />
    </Canvas>
  )
}

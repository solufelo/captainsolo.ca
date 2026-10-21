import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

const MODEL = '/models/planet.glb'
// Resting tilt so the ring reads as an orbit rather than a flat hoop.
const TILT_X = 0.28
const TILT_Z = -0.18

// Flat colours per theme, as on the old site: slate planet, blue ring and moon.
const palette = {
  light: { planet: '#475569', ring: '#2563eb', moon: '#2563eb' },
  dark: { planet: '#cbd5e1', ring: '#4f86ff', moon: '#00d4ff' },
}

type Theme = keyof typeof palette

function useTheme(): Theme {
  const read = () => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light')
  const [theme, setTheme] = useState<Theme>(read)
  useEffect(() => {
    const update = () => setTheme(read())
    window.addEventListener('themechange', update)
    return () => window.removeEventListener('themechange', update)
  }, [])
  return theme
}

function Model({ theme, still }: { theme: Theme; still: boolean }) {
  // Second arg false: never fetch the Draco decoder from a CDN; the model uses meshopt, which decodes locally.
  const { scene } = useGLTF(MODEL, false, true)
  const group = useRef<THREE.Group>(null)
  const pointer = useRef({ x: 0, y: 0 })

  const materials = useMemo(
    () => ({
      planet: new THREE.MeshStandardMaterial({ roughness: 0.85, metalness: 0.05 }),
      ring: new THREE.MeshStandardMaterial({ roughness: 0.5, metalness: 0.2 }),
      moon: new THREE.MeshStandardMaterial({ roughness: 0.6, metalness: 0.1 }),
    }),
    [],
  )

  useEffect(() => {
    const c = palette[theme]
    materials.planet.color.set(c.planet)
    materials.ring.color.set(c.ring)
    materials.moon.color.set(c.moon)
  }, [theme, materials])

  useEffect(() => {
    scene.traverse((o) => {
      if (!(o as THREE.Mesh).isMesh) return
      const name = o.name.toLowerCase()
      ;(o as THREE.Mesh).material = name.includes('ring') || name.includes('circle') ? materials.ring : name === 'sphere' ? materials.planet : materials.moon
    })
  }, [scene, materials])

  useEffect(() => {
    const move = (e: PointerEvent) => {
      pointer.current = { x: (e.clientX / innerWidth) * 2 - 1, y: (e.clientY / innerHeight) * 2 - 1 }
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [])

  useFrame((state, delta) => {
    const g = group.current
    if (!g || still) return
    g.rotation.y += delta * 0.12
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, TILT_X + pointer.current.y * 0.18, 3, delta)
    g.rotation.z = THREE.MathUtils.damp(g.rotation.z, TILT_Z - pointer.current.x * 0.12, 3, delta)
    g.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.06
  })

  return (
    <group ref={group} rotation={[TILT_X, 0, TILT_Z]}>
      <primitive object={scene} />
    </group>
  )
}

export default function Planet({ onReady }: { onReady?: () => void }) {
  const theme = useTheme()
  const host = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)
  const still = useMemo(() => matchMedia('(prefers-reduced-motion: reduce)').matches, [])

  // Stop rendering when the hero is scrolled away: no GPU work while reading the page.
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting))
    if (host.current) io.observe(host.current)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={host} className="planet-canvas">
      {/* flat = no filmic tone mapping, which washed the brand blues out to white. */}
      <Canvas
        flat
        frameloop={visible && !still ? 'always' : 'demand'}
        dpr={[1, 2]}
        // Model spans about ±2.4 × ±1.7 units; at z=10 the ring stays inside the square canvas while it spins.
        camera={{ position: [0, 0.6, 10], fov: 35 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
        onCreated={() => onReady?.()}
      >
        <ambientLight intensity={theme === 'dark' ? 0.45 : 0.75} />
        <directionalLight position={[4, 5, 6]} intensity={theme === 'dark' ? 1.5 : 1.7} />
        <directionalLight position={[-6, -2, -4]} intensity={0.5} color={theme === 'dark' ? '#4f86ff' : '#93b4ff'} />
        <Model theme={theme} still={still} />
      </Canvas>
    </div>
  )
}

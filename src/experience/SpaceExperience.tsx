import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { createAstronaut } from './astronaut'
import { AdaptiveQuality, QUALITY_SETTINGS, type QualityChoice, type QualityTier } from './performance'

export type ExperienceStatus = 'loading' | 'ready' | 'fallback'
export interface SpaceExperienceProps {
  reducedMotion: boolean
  paused: boolean
  quality: QualityChoice
  onStatus?: (status: ExperienceStatus) => void
  onTier?: (tier: string) => void
}
export interface ExperienceDiagnostics {
  status: ExperienceStatus | 'disposed'
  tier: QualityTier
  state: 'INTRO' | 'IDLE' | 'LOOK_AT_POINTER' | 'SUSPENDED' | 'FALLBACK'
  renderer: string
  frames: number
  frameTimes: number[]
  renderCPUms: number
  drawCalls: number
  triangles: number
  camera: { x: number; y: number; z: number }
  astronaut: { x: number; y: number; z: number; rotationY: number }
  reducedMotion: boolean
  active: boolean
}
declare global { interface Window { __deepCodeExperience?: ExperienceDiagnostics } }

const TAU = Math.PI * 2
const damp = (current: number, target: number, lambda: number, dt: number) =>
  THREE.MathUtils.lerp(current, target, 1 - Math.exp(-lambda * dt))

function disposeTree(root: THREE.Object3D) {
  const geometries = new Set<THREE.BufferGeometry>()
  const materials = new Set<THREE.Material>()
  root.traverse(object => {
    if (object instanceof THREE.Mesh || object instanceof THREE.Points || object instanceof THREE.Line) {
      geometries.add(object.geometry)
      const list = Array.isArray(object.material) ? object.material : [object.material]
      list.forEach(material => materials.add(material))
    }
  })
  geometries.forEach(geometry => geometry.dispose())
  materials.forEach(material => material.dispose())
}

function studioEnvironment(renderer: THREE.WebGLRenderer) {
  const studio = new THREE.Scene()
  studio.background = new THREE.Color('#343c44')
  const makePanel = (color: string, intensity: number, position: [number, number, number], scale: [number, number, number]) => {
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(intensity), side: THREE.DoubleSide }))
    panel.position.set(...position); panel.scale.set(...scale); panel.lookAt(0, 0, 0); studio.add(panel)
  }
  makePanel('#e6f1fa', 3.5, [-3, 4, 3], [3, 6, 1])
  makePanel('#ff8b4d', 2.3, [4, 1, -2], [2, 6, 1])
  makePanel('#e8edf0', 2, [0, 5, -1], [6, 1, 1])
  makePanel('#9eb5d4', 1.2, [2, -2, 4], [.7, 5, 1])
  const generator = new THREE.PMREMGenerator(renderer)
  const target = generator.fromScene(studio, .05, .1, 40)
  generator.dispose(); disposeTree(studio)
  return target
}

function stars() {
  let seed = 49231
  const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646 }
  const positions = new Float32Array(960 * 3)
  for (let i = 0; i < 960; i++) {
    positions[i * 3] = (random() - .5) * 35
    positions[i * 3 + 1] = (random() - .5) * 22
    positions[i * 3 + 2] = -5 - random() * 15
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  return new THREE.Points(geometry, new THREE.PointsMaterial({ color: '#c5d6df', size: .025, transparent: true, opacity: .7, sizeAttenuation: true, depthWrite: false }))
}

/** The renderer owns the camera and all scene transforms. UI remains ordinary HTML. */
export default function SpaceExperience(props: SpaceExperienceProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const propsRef = useRef(props)
  const refreshRef = useRef<(() => void) | null>(null)
  propsRef.current = props
  const explicitFallback = props.quality === 'FALLBACK'

  useEffect(() => { refreshRef.current?.() }, [props.paused, props.reducedMotion, props.quality])
  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    const diagnostic: ExperienceDiagnostics = {
      status: 'loading', tier: 'BALANCED', state: 'INTRO', renderer: 'unavailable', frames: 0,
      frameTimes: [], renderCPUms: 0, drawCalls: 0, triangles: 0, camera: { x: 0, y: 0, z: 0 },
      astronaut: { x: 0, y: 0, z: 0, rotationY: 0 }, reducedMotion: propsRef.current.reducedMotion, active: false,
    }
    window.__deepCodeExperience = diagnostic
    propsRef.current.onStatus?.('loading')
    if (explicitFallback) {
      diagnostic.status = 'fallback'; diagnostic.state = 'FALLBACK'; diagnostic.tier = 'FALLBACK'
      propsRef.current.onTier?.('FALLBACK'); propsRef.current.onStatus?.('fallback')
      return
    }
    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' })
    } catch {
      diagnostic.status = 'fallback'; diagnostic.state = 'FALLBACK'; diagnostic.tier = 'FALLBACK'
      propsRef.current.onStatus?.('fallback'); propsRef.current.onTier?.('FALLBACK')
      return
    }
    renderer.setClearColor(0x000000, 0)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    renderer.debug.onShaderError = () => { failExperience() }
    const canvas = renderer.domElement
    canvas.dataset.testid = 'space-canvas'
    canvas.setAttribute('aria-hidden', 'true')
    canvas.style.width = '100%'; canvas.style.height = '100%'; canvas.style.display = 'block'
    host.appendChild(canvas)
    const gl = renderer.getContext()
    const debug = gl.getExtension('WEBGL_debug_renderer_info')
    diagnostic.renderer = debug ? String(gl.getParameter(debug.UNMASKED_RENDERER_WEBGL)) : String(gl.getParameter(gl.RENDERER))

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(36, 1, .1, 100)
    let environment: THREE.WebGLRenderTarget
    try { environment = studioEnvironment(renderer) } catch {
      renderer.dispose(); canvas.remove()
      diagnostic.status = 'fallback'; diagnostic.state = 'FALLBACK'; diagnostic.tier = 'FALLBACK'
      propsRef.current.onStatus?.('fallback'); propsRef.current.onTier?.('FALLBACK')
      return
    }
    scene.environment = environment.texture
    scene.environmentIntensity = .8
    scene.add(new THREE.HemisphereLight('#d6e4f1', '#1b1715', 1.8))
    const key = new THREE.DirectionalLight('#e9f0f3', 5.5); key.position.set(-4, 6, 6); scene.add(key)
    const fill = new THREE.DirectionalLight('#8fa8c0', 1.7); fill.position.set(4, 0, 4); scene.add(fill)
    const rim = new THREE.DirectionalLight('#ff7841', 7); rim.position.set(4, 3, -3); scene.add(rim)
    const lower = new THREE.DirectionalLight('#c7d7ee', .8); lower.position.set(-3, -4, 2); scene.add(lower)
    const starField = stars(); scene.add(starField)
    const orbital = new THREE.Group(); scene.add(orbital)
    for (let i = 0; i < 3; i++) {
      const vertices: THREE.Vector3[] = []
      const radius = 3.6 + i * .13
      for (let j = 0; j < 180; j++) vertices.push(new THREE.Vector3(Math.cos(j / 180 * TAU) * radius, Math.sin(j / 180 * TAU) * radius, 0))
      const line = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(vertices), new THREE.LineBasicMaterial({ color: i === 1 ? '#ff743d' : '#69747b', transparent: true, opacity: i === 1 ? .24 : .12, depthWrite: false }))
      orbital.add(line)
    }
    orbital.position.set(2, .15, -3.3); orbital.rotation.set(.2, -.28, -.3)
    const planet = new THREE.Mesh(new THREE.SphereGeometry(4.4, 64, 32), new THREE.MeshStandardMaterial({ color: '#151b20', roughness: .97, metalness: .15 }))
    planet.position.set(2, -6.5, -6); scene.add(planet)

    let tier: Exclude<QualityTier, 'FALLBACK'> = propsRef.current.quality === 'auto'
      ? (/swiftshader|llvmpipe|software/i.test(diagnostic.renderer) ? 'LOW' : window.innerWidth < 700 ? 'BALANCED' : 'HIGH')
      : propsRef.current.quality as Exclude<QualityTier, 'FALLBACK'>
    const adaptation = new AdaptiveQuality(tier)
    let astronaut = createAstronaut(tier === 'LOW' ? 'low' : 'high')
    scene.add(astronaut.root)
    let previousChoice = propsRef.current.quality
    let rootBaseX = 1.9
    let isMobile = false
    let frame = 0
    let active = true
    let lost = false
    let disposed = false
    let inView = true
    let previousTime = performance.now()
    let elapsed = 0
    let smoothX = 0, smoothY = 0, scroll = 0
    const pointer = { x: 0, y: 0, inside: false }
    const target = new THREE.Vector3()
    const armBase = { left: astronaut.leftArm.rotation.z, right: astronaut.rightArm.rotation.z }

    function applyTier(next: Exclude<QualityTier, 'FALLBACK'>) {
      const lowChanged = (next === 'LOW') !== (tier === 'LOW')
      tier = next
      adaptation.tier = tier
      if (lowChanged) {
        scene.remove(astronaut.root); astronaut.dispose()
        astronaut = createAstronaut(tier === 'LOW' ? 'low' : 'high'); scene.add(astronaut.root)
        armBase.left = astronaut.leftArm.rotation.z; armBase.right = astronaut.rightArm.rotation.z
      }
      diagnostic.tier = tier
      starField.geometry.setDrawRange(0, QUALITY_SETTINGS[tier].particles)
      orbital.visible = tier !== 'LOW'
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, QUALITY_SETTINGS[tier].dpr))
      propsRef.current.onTier?.(tier)
      resize()
    }
    function resize() {
      if (disposed || lost) return
      const width = host!.clientWidth, height = host!.clientHeight
      if (!width || !height) return
      isMobile = width < 760
      rootBaseX = isMobile ? .08 : (width / height > 2 ? 2.65 : 1.95)
      camera.aspect = width / height
      camera.fov = isMobile ? 40 : 36
      camera.updateProjectionMatrix()
      renderer.setSize(width, height, false)
      if (!active || propsRef.current.reducedMotion || propsRef.current.paused) render(0)
    }
    function render(dt: number) {
      if (disposed || lost) return
      const settings = propsRef.current
      const still = settings.reducedMotion || settings.paused
      const speed = still ? 0 : elapsed
      const movementDt = dt || 1 / 60
      smoothX = damp(smoothX, still ? 0 : pointer.x, 3.2, movementDt)
      smoothY = damp(smoothY, still ? 0 : pointer.y, 3.2, movementDt)
      const rect = host!.getBoundingClientRect()
      const targetScroll = Math.max(0, Math.min(1, -rect.top / Math.max(rect.height, 1)))
      scroll = damp(scroll, settings.reducedMotion ? 0 : targetScroll, 4, movementDt)
      const intro = settings.reducedMotion ? 1 : THREE.MathUtils.smoothstep(elapsed, 0, 1.7)
      astronaut.root.position.set(rootBaseX + smoothX * .1 + scroll * .35, .1 + (1 - intro) * -.36 + Math.sin(speed * .6) * .055 + scroll * .3, 0)
      astronaut.root.scale.setScalar(isMobile ? .94 : .88)
      astronaut.root.rotation.set(.055 + smoothY * .025, -.28 + smoothX * .09, -.13 + Math.sin(speed * .23) * .02 - scroll * .11)
      astronaut.head.rotation.y = smoothX * .15
      astronaut.head.rotation.x = smoothY * .06
      astronaut.leftArm.rotation.z = armBase.left + Math.sin(speed * .7) * .025
      astronaut.rightArm.rotation.z = armBase.right + Math.sin(speed * .7 + 2) * .025
      camera.position.set(smoothX * .14, .35 + smoothY * .09 - scroll * .12, isMobile ? 9.2 : 9.4 - intro * .12 + scroll * .2)
      target.set(isMobile ? .08 : .15, .35, 0); camera.lookAt(target)
      starField.rotation.y = speed * .002
      orbital.rotation.z = -.3 + speed * .008
      const start = performance.now()
      try { renderer.render(scene, camera) } catch { failExperience(); return }
      diagnostic.renderCPUms = performance.now() - start
      diagnostic.frames++
      diagnostic.drawCalls = renderer.info.render.calls
      diagnostic.triangles = renderer.info.render.triangles
      diagnostic.camera = { x: camera.position.x, y: camera.position.y, z: camera.position.z }
      diagnostic.astronaut = { x: astronaut.root.position.x, y: astronaut.root.position.y, z: astronaut.root.position.z, rotationY: astronaut.root.rotation.y }
      diagnostic.reducedMotion = settings.reducedMotion
      diagnostic.state = !active ? 'SUSPENDED' : elapsed < 1.7 && !still ? 'INTRO' : pointer.inside && !still ? 'LOOK_AT_POINTER' : 'IDLE'
    }
    function tick(now: number) {
      if (!active || disposed || lost) return
      const interval = Math.max(0, now - previousTime)
      const dt = Math.min(interval / 1000, .05)
      previousTime = now
      elapsed += dt
      diagnostic.frameTimes.push(interval)
      if (diagnostic.frameTimes.length > 180) diagnostic.frameTimes.shift()
      render(dt)
      if (propsRef.current.quality === 'auto' && elapsed > 2) {
        const next = adaptation.sample(interval, Math.min(interval / 1000, .25))
        if (next && next !== 'FALLBACK') applyTier(next)
      }
      frame = requestAnimationFrame(tick)
    }
    function refresh() {
      if (disposed || lost) return
      const choice = propsRef.current.quality
      if (choice !== previousChoice) {
        adaptation.reset()
        if (choice === 'auto' && /swiftshader|llvmpipe|software/i.test(diagnostic.renderer)) applyTier('LOW')
        previousChoice = choice
      }
      if (choice !== 'auto' && choice !== 'FALLBACK' && choice !== tier) applyTier(choice)
      const shouldRun = inView && !document.hidden && !propsRef.current.paused && !propsRef.current.reducedMotion
      if (shouldRun && !active) {
        active = true; adaptation.reset(); previousTime = performance.now(); frame = requestAnimationFrame(tick)
      } else if (!shouldRun && active) { active = false; cancelAnimationFrame(frame) }
      diagnostic.active = active
      render(0)
    }
    function move(event: PointerEvent) {
      if (event.pointerType === 'touch') return
      const rect = host!.getBoundingClientRect()
      pointer.x = THREE.MathUtils.clamp((event.clientX - rect.left) / rect.width * 2 - 1, -1, 1)
      pointer.y = THREE.MathUtils.clamp((event.clientY - rect.top) / rect.height * 2 - 1, -1, 1)
      pointer.inside = event.clientY >= rect.top && event.clientY <= rect.bottom
    }
    function leave(event?: Event) {
      if (event?.type === 'pointerout' && (event as PointerEvent).relatedTarget) return
      pointer.x = pointer.y = 0; pointer.inside = false
    }
    function failExperience() {
      lost = true; active = false; cancelAnimationFrame(frame)
      diagnostic.status = 'fallback'; diagnostic.tier = 'FALLBACK'; diagnostic.state = 'FALLBACK'; diagnostic.active = false
      propsRef.current.onStatus?.('fallback'); propsRef.current.onTier?.('FALLBACK')
    }
    function contextLost(event: Event) { event.preventDefault(); failExperience() }
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(host)
    const visibilityObserver = new IntersectionObserver(entries => {
      // Saída e reentrada podem vir no mesmo lote; o último registro é o estado atual.
      for (const entry of entries) if (entry.target === host) inView = entry.isIntersecting
      refresh()
    }, { rootMargin: '80px' })
    visibilityObserver.observe(host)
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerout', leave)
    window.addEventListener('blur', leave)
    document.addEventListener('visibilitychange', refresh)
    canvas.addEventListener('webglcontextlost', contextLost)
    refreshRef.current = refresh
    applyTier(tier)
    render(0)
    if (!lost) {
      diagnostic.status = 'ready'
      propsRef.current.onStatus?.('ready')
      active = false; refresh()
    }
    return () => {
      disposed = true; active = false; cancelAnimationFrame(frame); refreshRef.current = null
      resizeObserver.disconnect(); visibilityObserver.disconnect()
      window.removeEventListener('pointermove', move); window.removeEventListener('pointerout', leave); window.removeEventListener('blur', leave)
      document.removeEventListener('visibilitychange', refresh)
      canvas.removeEventListener('webglcontextlost', contextLost)
      scene.remove(astronaut.root); astronaut.dispose()
      disposeTree(scene); environment.dispose(); renderer.dispose(); canvas.remove()
      if (!lost) diagnostic.status = 'disposed'
      diagnostic.active = false
    }
  }, [explicitFallback])

  return <div ref={hostRef} style={{ width: '100%', height: '100%' }} data-experience-host aria-hidden="true" />
}

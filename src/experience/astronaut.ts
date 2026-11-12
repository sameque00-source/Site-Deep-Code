import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

/** Original, procedural flight-suit study. Production character art remains a separate asset milestone. */
export function createAstronaut(detail: 'high' | 'low' = 'high') {
  const root = new THREE.Group();
  root.name = 'Deep Code / original exploration suit prototype';
  const body = new THREE.Group();
  const head = new THREE.Group();
  const leftArm = new THREE.Group();
  const rightArm = new THREE.Group();
  head.position.set(0, 2.2, 0);
  leftArm.position.set(-.73, 1.37, 0);
  rightArm.position.set(.73, 1.37, 0);
  leftArm.rotation.set(-.12, .08, -.24);
  rightArm.rotation.set(-.25, -.14, .34);
  root.add(body, head, leftArm, rightArm);
  const segments = detail === 'high' ? 32 : 16;
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  const material = (color: string, roughness: number, metalness = 0) => {
    const m = new THREE.MeshStandardMaterial({ color, roughness, metalness });
    materials.add(m);
    return m;
  };
  const ceramic = material('#c8ccc6', .36, .23);
  const lightCeramic = material('#e3e5de', .31, .2);
  const dark = material('#232b2e', .77, .12);
  const graphite = material('#424b4b', .42, .45);
  const metal = material('#858e8b', .26, .8);
  const orange = material('#ed6839', .46, .22);
  const visor = new THREE.MeshPhysicalMaterial({ color: '#080e12', metalness: 1, roughness: .12,
    clearcoat: 1, clearcoatRoughness: .08, envMapIntensity: 2.25 });
  materials.add(visor);
  const signal = new THREE.MeshStandardMaterial({ color: '#ff9f62', emissive: '#ff6b35', emissiveIntensity: 1.8, roughness: .35 });
  materials.add(signal);

  function keep<T extends THREE.BufferGeometry>(g: T): T { geometries.add(g); return g; }
  function mesh(group: THREE.Group, geometry: THREE.BufferGeometry, m: THREE.Material,
    position: [number, number, number] = [0, 0, 0], rotation?: [number, number, number], scale?: [number, number, number]) {
    const object = new THREE.Mesh(geometry, m);
    object.position.set(...position);
    if (rotation) object.rotation.set(...rotation);
    if (scale) object.scale.set(...scale);
    group.add(object);
    return object;
  }
  const sphere = keep(new THREE.SphereGeometry(1, segments, Math.max(12, segments / 2)));
  const cube = keep(new THREE.BoxGeometry(1, 1, 1));
  function box(group: THREE.Group, m: THREE.Material, p: [number, number, number], s: [number, number, number], rotation?: [number, number, number]) {
    return mesh(group, cube, m, p, rotation, s);
  }
  function roundBox(w: number, h: number, d: number, r: number) {
    const shape = new THREE.Shape();
    shape.moveTo(-w / 2 + r, -h / 2);
    shape.lineTo(w / 2 - r, -h / 2);
    shape.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
    shape.lineTo(w / 2, h / 2 - r);
    shape.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
    shape.lineTo(-w / 2 + r, h / 2);
    shape.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
    shape.lineTo(-w / 2, -h / 2 + r);
    shape.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
    const g = new THREE.ExtrudeGeometry(shape, { depth: d, bevelEnabled: true,
      bevelThickness: .018, bevelSize: .018, bevelSegments: 2, curveSegments: detail === 'high' ? 5 : 3 });
    g.translate(0, 0, -d / 2);
    return keep(g);
  }
  /** Elliptic fabric loft with deliberately shaped shoulder/knee volumes, no external model. */
  function loft(profiles: [number, number, number, number?][]) {
    const positions: number[] = [], uv: number[] = [], indices: number[] = [];
    for (let ring = 0; ring < profiles.length; ring++) {
      const [y, rx, rz, offset = 0] = profiles[ring];
      for (let s = 0; s <= segments; s++) {
        const a = s / segments * Math.PI * 2;
        positions.push(Math.cos(a) * rx, y, Math.sin(a) * rz + offset);
        uv.push(s / segments, ring / (profiles.length - 1));
        if (ring && s) {
          const b = ring * (segments + 1) + s;
          if (profiles[profiles.length - 1][0] > profiles[0][0]) {
            indices.push(b - segments - 2, b - 1, b, b - segments - 2, b, b - segments - 1);
          } else {
            indices.push(b - segments - 2, b, b - 1, b - segments - 2, b - segments - 1, b);
          }
        }
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    g.setIndex(indices); g.computeVertexNormals();
    return keep(g);
  }
  function ring(group: THREE.Group, radius: number, tube: number, m: THREE.Material,
    p: [number, number, number], rotation: [number, number, number] = [Math.PI / 2, 0, 0], scale?: [number, number, number]) {
    const geometry = keep(new THREE.TorusGeometry(radius, tube, detail === 'high' ? 8 : 5, segments));
    return mesh(group, geometry, m, p, rotation, scale);
  }

  // Sculpted pressure garment, protective shell and asymmetric service backpack.
  mesh(body, loft([[-.35, .44, .29], [-.1, .53, .34], [.15, .53, .33], [.7, .64, .37],
    [1.2, .68, .37], [1.43, .59, .31], [1.6, .36, .26]]), ceramic);
  mesh(body, sphere, dark, [0, -.25, 0], undefined, [.55, .38, .33]);
  mesh(body, roundBox(.93, 1.43, .48, .14), graphite, [0, .91, -.43]);
  mesh(body, roundBox(.7, .99, .16, .1), ceramic, [0, 1.03, -.73]);
  box(body, orange, [-.36, 1.05, -.72], [.065, .83, .05]);
  box(body, dark, [.35, .81, -.73], [.08, .62, .07]);
  for (let i = 0; i < 4; i++) box(body, dark, [0, .48 + i * .11, -.83], [.43, .035, .015]);
  // Torso harness, belt and pressure collar.
  for (const side of [-1, 1]) {
    box(body, dark, [side * .46, .83, .34], [.105, 1.36, .055], [0, 0, side * -.055]);
    box(body, orange, [side * .46, 1.34, .38], [.115, .21, .055]);
    mesh(body, roundBox(.16, .2, .06, .025), metal, [side * .46, .35, .4]);
    ring(body, .2, .026, graphite, [side * .51, -.02, .25], [Math.PI / 2, 0, 0], [1, 1, .8]);
  }
  ring(body, .34, .10, dark, [0, 1.58, 0], [Math.PI / 2, 0, 0], [1, 1, .8]);
  ring(body, .35, .035, orange, [0, 1.69, 0], [Math.PI / 2, 0, 0], [1, 1, .8]);
  ring(body, .52, .06, graphite, [0, -.06, 0], [Math.PI / 2, 0, 0], [1, .65, 1]);
  box(body, orange, [0, -.04, .355], [.73, .09, .055]);
  mesh(body, roundBox(.22, .16, .08, .025), metal, [0, -.04, .42]);

  // Front life-support panel with inset electronics, illuminated status and captive fasteners.
  mesh(body, roundBox(.98, .76, .13, .08), dark, [0, .91, .425]);
  mesh(body, roundBox(.86, .66, .08, .055), lightCeramic, [0, .94, .51]);
  mesh(body, roundBox(.42, .27, .025, .025), graphite, [-.15, 1.04, .565]);
  box(body, signal, [-.28, 1.1, .584], [.15, .018, .014]);
  box(body, metal, [-.18, 1.025, .587], [.30, .012, .01]);
  box(body, orange, [.245, 1.10, .575], [.13, .12, .025]);
  for (let i = 0; i < 3; i++) {
    mesh(body, sphere, i === 0 ? signal : graphite, [.21, .94 - i * .105, .58], undefined, [.035, .035, .018]);
    box(body, dark, [-.17 + i * .12, .73, .57], [.07, .085, .025]);
  }
  for (const x of [-.36, .36]) for (const y of [.69, 1.19]) {
    mesh(body, sphere, metal, [x, y, .572], undefined, [.022, .022, .014]);
  }

  // Helmet: ceramic shell, optical dome, gasket, flush side service ports, crown strip.
  mesh(head, sphere, ceramic, [0, 0, 0], undefined, [.66, .69, .59]);
  mesh(head, sphere, dark, [0, -.01, .13], undefined, [.635, .625, .59]);
  const lens = keep(new THREE.SphereGeometry(1, segments, Math.max(16, segments / 2), 0, Math.PI, .24, Math.PI - .47));
  mesh(head, lens, visor, [0, 0, .18], undefined, [.605, .575, .57]);
  ring(head, .61, .04, metal, [0, -.005, .375], [0, 0, 0], [1, .98, 1]);
  ring(head, .573, .025, dark, [0, -.005, .419], [0, 0, 0], [1, .98, 1]);
  mesh(head, roundBox(.18, .13, .065, .03), lightCeramic, [0, -.57, .41]);
  box(head, signal, [0, -.567, .453], [.06, .018, .014]);
  box(head, lightCeramic, [0, .637, -.02], [.13, .07, .54]);
  for (const side of [-1, 1]) {
    const port = keep(new THREE.CylinderGeometry(.19, .19, .08, segments));
    mesh(head, port, metal, [side * .65, -.02, .01], [0, 0, Math.PI / 2]);
    mesh(head, keep(new THREE.CylinderGeometry(.135, .135, .096, segments)), graphite,
      [side * .69, -.02, .01], [0, 0, Math.PI / 2]);
    box(head, orange, [side * .74, -.02, .03], [.025, .10, .11]);
    box(head, lightCeramic, [side * .48, .46, .25], [.19, .10, .16], [0, 0, side * -.42]);
  }

  for (const [arm, side] of [[leftArm, -1], [rightArm, 1]] as const) {
    mesh(arm, sphere, graphite, [0, -.03, 0], undefined, [.29, .30, .29]);
    mesh(arm, sphere, lightCeramic, [side * .04, -.08, -.005], undefined, [.31, .28, .28]);
    mesh(arm, loft([[-.1, .235, .22], [-.3, .25, .24], [-.55, .22, .23], [-.76, .19, .19]]), ceramic);
    for (let i = 0; i < 3; i++) ring(arm, .206 + i * .007, .018, graphite, [0, -.52 - i * .075, 0]);
    mesh(arm, sphere, dark, [0, -.83, .01], undefined, [.215, .23, .22]);
    mesh(arm, loft([[-.82, .19, .195, .015], [-1.02, .225, .22, .04], [-1.30, .20, .20, .08],
      [-1.47, .155, .16, .11]]), ceramic);
    mesh(arm, roundBox(.25, .35, .055, .04), graphite, [0, -1.17, .26]);
    box(arm, orange, [0, -1.14, .3], [.15, .025, .025]);
    ring(arm, .168, .055, graphite, [0, -1.49, .11]);
    ring(arm, .169, .023, orange, [0, -1.52, .11]);
    mesh(arm, sphere, dark, [0, -1.68, .13], undefined, [.17, .22, .14]);
    mesh(arm, sphere, ceramic, [0, -1.67, .20], undefined, [.16, .19, .07]);
    for (let i = 0; i < 4; i++) {
      mesh(arm, sphere, graphite, [-.105 + i * .065, -1.87 + Math.abs(1.5 - i) * .015, .17],
        [0, 0, .06 * side], [.041, .13 - Math.abs(1.5 - i) * .018, .049]);
    }
    mesh(arm, sphere, dark, [-side * .17, -1.71, .21], [0, 0, side * .38], [.07, .13, .07]);
  }

  // Articulated-looking tailored legs with kneecaps, gaiters and toe guards.
  for (const side of [-1, 1]) {
    const leg = new THREE.Group();
    leg.position.set(side * .34, -.35, 0);
    leg.rotation.z = side * .075;
    mesh(leg, loft([[0, .255, .26], [-.25, .275, .27], [-.60, .24, .24, .025], [-.82, .205, .22, .07]]), ceramic);
    mesh(leg, sphere, dark, [0, -.91, .085], undefined, [.225, .25, .225]);
    mesh(leg, roundBox(.32, .35, .10, .075), graphite, [0, -.9, .29]);
    box(leg, orange, [0, -.92, .35], [.22, .032, .014]);
    mesh(leg, loft([[-.97, .205, .20, .08], [-1.16, .225, .215, .05], [-1.45, .19, .19], [-1.64, .17, .17]]), ceramic);
    for (let i = 0; i < 3; i++) ring(leg, .182 + i * .007, .018, graphite, [0, -1.39 - i * .07, .01]);
    ring(leg, .179, .052, dark, [0, -1.64, 0]);
    mesh(leg, roundBox(.41, .38, .69, .07), graphite, [0, -1.89, .17]);
    mesh(leg, roundBox(.39, .20, .38, .07), ceramic, [0, -1.84, .38]);
    box(leg, dark, [0, -2.10, .17], [.44, .10, .74]);
    box(leg, orange, [0, -2.05, .49], [.28, .035, .04]);
    for (let i = 0; i < 3; i++) box(leg, metal, [0, -1.74, .30 + i * .065], [.29, .025, .025]);
    // Bake fixed leg pose into the static body batch.
    leg.updateMatrix();
    for (const child of [...leg.children]) {
      child.updateMatrix(); child.applyMatrix4(leg.matrix); body.add(child);
    }
  }

  // One draw call per material per independently animated part.
  for (const group of [body, head, leftArm, rightArm]) {
    const batches = new Map<THREE.Material, THREE.Mesh[]>();
    for (const child of group.children) if (child instanceof THREE.Mesh && !Array.isArray(child.material)) {
      const list = batches.get(child.material) || []; list.push(child); batches.set(child.material, list);
    }
    for (const [m, objects] of batches) {
      const parts = objects.map(o => {
        o.updateMatrix();
        const clone = o.geometry.clone().applyMatrix4(o.matrix);
        if (!clone.index) return clone;
        const unindexed = clone.toNonIndexed(); clone.dispose(); return unindexed;
      });
      const merged = mergeGeometries(parts, false);
      parts.forEach(p => p.dispose());
      if (!merged) continue;
      keep(merged);
      objects.forEach(o => group.remove(o));
      group.add(new THREE.Mesh(merged, m));
    }
  }
  root.userData.assetStatus = 'original-procedural-prototype';
  const baseLeft = leftArm.rotation.clone(), baseRight = rightArm.rotation.clone();
  leftArm.userData.baseRotation = baseLeft;
  rightArm.userData.baseRotation = baseRight;
  return { root, head, leftArm, rightArm, dispose: () => {
    geometries.forEach(g => g.dispose()); materials.forEach(m => m.dispose());
    geometries.clear(); materials.clear();
  } };
}

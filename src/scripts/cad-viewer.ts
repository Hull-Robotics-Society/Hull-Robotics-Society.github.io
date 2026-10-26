import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { CadPart } from '../lib/site';

interface Loaded {
    geo: THREE.BufferGeometry;
    size: THREE.Vector3;
}

const cache = new Map<string, Promise<Loaded>>();
const cssVar = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

/** Download and centre an STL file once; later calls share the result. */
function loadPart(part: CadPart): Promise<Loaded> {
    if (!cache.has(part.raw)) {
        cache.set(part.raw, fetch(part.raw)
            .then(r => {
                if (!r.ok) throw new Error(`${r.status} ${part.file}`);
                return r.arrayBuffer();
            })
            .then(buf => {
                const geo = new STLLoader().parse(buf);
                geo.computeVertexNormals();
                geo.center();
                geo.computeBoundingBox();
                const size = new THREE.Vector3();
                geo.boundingBox!.getSize(size);
                return { geo, size };
            }));
    }
    return cache.get(part.raw)!;
}

/** Camera position that fits a part of the given size into view. */
function framing(cam: THREE.PerspectiveCamera, size: THREE.Vector3) {
    const r = size.length() / 2;
    const dist = (r / Math.sin(THREE.MathUtils.degToRad(cam.fov / 2))) * 1.05;
    return { r, dist, pos: new THREE.Vector3(dist * 0.6, dist * 0.45, dist * 0.65) };
}

function lights(scene: THREE.Scene, cam: THREE.Camera) {
    scene.add(new THREE.HemisphereLight(0xffffff, 0x445555, 0.9 * Math.PI));
    const key = new THREE.DirectionalLight(0xffffff, 0.8 * Math.PI);
    key.position.set(1, 2, 1.5);
    cam.add(key);
    scene.add(cam);
}

/** Render a small preview of every part into the tray. */
async function thumbnails(parts: CadPart[], tray: HTMLElement) {
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(2);
    renderer.setSize(148, 111, false);
    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(35, 4 / 3, 1, 20000);
    lights(scene, cam);
    const material = new THREE.MeshStandardMaterial({ metalness: 0.1, roughness: 0.55, color: cssVar('--accent') });

    for (const part of parts) {
        try {
            const { geo, size } = await loadPart(part);
            const mesh = new THREE.Mesh(geo, material);
            scene.add(mesh);
            cam.position.copy(framing(cam, size).pos).multiplyScalar(0.92);
            cam.lookAt(0, 0, 0);
            renderer.render(scene, cam);
            const img = new Image();
            img.alt = '';
            img.src = renderer.domElement.toDataURL('image/png');
            tray.querySelector(`[data-part="${part.id}"] .thumb`)?.replaceChildren(img);
            scene.remove(mesh);
        } catch {
            // the tray keeps its placeholder
        }
    }
    renderer.dispose();
    renderer.forceContextLoss();
}

/**
 * Turn a `.cad` block rendered by CadViewer.astro into a live viewer.
 *
 * Parameters:
 *     host: element carrying the parts list in data-cad
 */
export function mountCad(host: HTMLElement) {
    const parts = JSON.parse(host.dataset.cad!) as CadPart[];
    const byId = new Map(parts.map(p => [p.id, p]));
    const q = <T extends HTMLElement>(r: string) => host.querySelector<T>(`[data-r="${r}"]`)!;
    const stage = host.querySelector<HTMLElement>('.cad-stage')!;
    const status = host.querySelector<HTMLElement>('.cad-status')!;
    const tray = q('tray');
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    stage.prepend(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 1, 20000);
    lights(scene, camera);
    const material = new THREE.MeshStandardMaterial({ metalness: 0.1, roughness: 0.55 });
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = false;

    let mesh: THREE.Mesh | null = null;
    let edges: THREE.LineSegments | null = null;
    let home = new THREE.Vector3();
    let spin = !reduce;
    let wire = false;

    const paint = () => {
        material.color.set(cssVar('--accent'));
        if (edges) (edges.material as THREE.LineBasicMaterial).color.set(cssVar('--fg'));
    };
    const setSpin = (on: boolean) => { spin = on; q('spin').setAttribute('aria-pressed', String(on)); };
    const setWire = (on: boolean) => {
        wire = on;
        material.wireframe = on;
        if (edges) edges.visible = !on;
        q('wire').setAttribute('aria-pressed', String(on));
    };

    async function show(id: string) {
        const part = byId.get(id)!;
        q('name').textContent = part.name;
        q<HTMLAnchorElement>('dl').href = part.blob;
        status.hidden = false;
        status.textContent = 'Loading part…';
        try {
            const { geo, size } = await loadPart(part);
            if (mesh) scene.remove(mesh);
            edges?.geometry.dispose();
            mesh = new THREE.Mesh(geo, material);
            edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo, 25), new THREE.LineBasicMaterial({ transparent: true, opacity: 0.35 }));
            mesh.add(edges);
            scene.add(mesh);
            paint();
            setWire(wire);
            const f = framing(camera, size);
            home = f.pos;
            camera.position.copy(home);
            controls.target.set(0, 0, 0);
            controls.minDistance = f.r * 0.6;
            controls.maxDistance = f.dist * 3;
            q('dims').textContent = `${part.file} · ${[size.x, size.z, size.y].map(v => Math.round(v)).join(' × ')} mm`;
            status.hidden = true;
        } catch {
            status.textContent = 'This part could not be loaded.';
        }
    }

    function resize() {
        const w = stage.clientWidth;
        const h = stage.clientHeight;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    }

    controls.addEventListener('start', () => setSpin(false));
    new ResizeObserver(resize).observe(stage);
    new MutationObserver(paint).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    resize();
    setSpin(spin);

    tray.addEventListener('click', e => {
        const b = (e.target as HTMLElement).closest('button');
        if (!b) return;
        tray.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
        show(b.dataset.part!);
    });
    host.querySelector('[data-r="groups"]')?.addEventListener('click', e => {
        const b = (e.target as HTMLElement).closest('button');
        if (!b) return;
        b.parentElement!.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
        tray.querySelectorAll<HTMLButtonElement>('button').forEach(x => {
            x.hidden = b.dataset.g !== 'All' && byId.get(x.dataset.part!)!.group !== b.dataset.g;
        });
    });
    q('spin').addEventListener('click', () => setSpin(!spin));
    q('wire').addEventListener('click', () => setWire(!wire));
    q('zin').addEventListener('click', () => camera.position.sub(controls.target).multiplyScalar(0.8).add(controls.target));
    q('zout').addEventListener('click', () => camera.position.sub(controls.target).multiplyScalar(1.25).add(controls.target));
    q('reset').addEventListener('click', () => {
        camera.position.copy(home);
        controls.target.set(0, 0, 0);
        mesh?.rotation.set(0, 0, 0);
    });

    renderer.setAnimationLoop(() => {
        if (!stage.offsetParent) return;
        if (spin && mesh) mesh.rotation.y += 0.004;
        controls.update();
        renderer.render(scene, camera);
    });

    show(parts[0].id).then(() => thumbnails(parts, tray));
}

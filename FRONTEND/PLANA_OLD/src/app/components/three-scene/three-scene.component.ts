import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'app-three-scene',
    standalone: true,
    templateUrl: './three-scene.component.html',
    styleUrls: ['./three-scene.component.css']
})
export class ThreeSceneComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

    private scene!: THREE.Scene;
    private camera!: THREE.PerspectiveCamera;
    private renderer!: THREE.WebGLRenderer;
    private geometry!: THREE.Object3D;
    private animationId: number = 0;
    private mouse = { x: 0, y: 0 };
    private targetRotation = { x: 0, y: 0 };

    constructor() { }

    ngOnInit(): void {
        // Mouse movement listener for parallax effect
        window.addEventListener('mousemove', this.onMouseMove.bind(this));
    }

    ngAfterViewInit(): void {
        this.initThreeJS();
        this.createGeometry();
        this.animate();
        this.handleResize();
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    ngOnDestroy(): void {
        window.removeEventListener('mousemove', this.onMouseMove.bind(this));
        window.removeEventListener('resize', this.handleResize.bind(this));
        cancelAnimationFrame(this.animationId);

        // Cleanup Three.js resources
        if (this.renderer) {
            this.renderer.dispose();
        }
        if (this.geometry) {
            this.scene.remove(this.geometry);
        }
    }

    private initThreeJS(): void {
        // Scene setup
        this.scene = new THREE.Scene();

        // Camera setup
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 5;

        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvasRef.nativeElement,
            alpha: true,
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    private createGeometry(): void {
        // Create a mesmerizing low-poly crystal structure
        const group = new THREE.Group();

        // Main crystal geometry
        const crystalGeometry = new THREE.IcosahedronGeometry(1.5, 0);
        const crystalMaterial = new THREE.MeshPhongMaterial({
            color: 0x36c2ce,
            emissive: 0x112233,
            shininess: 100,
            flatShading: true,
            transparent: true,
            opacity: 0.8
        });
        const crystal = new THREE.Mesh(crystalGeometry, crystalMaterial);
        group.add(crystal);

        // Wireframe overlay for extra depth
        const wireframeGeometry = new THREE.IcosahedronGeometry(1.52, 0);
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0x49ccab,
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });
        const wireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
        group.add(wireframe);

        // Add particles around the crystal
        this.createParticles(group);

        // Add lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0x36c2ce, 1, 100);
        pointLight.position.set(5, 5, 5);
        this.scene.add(pointLight);

        const pointLight2 = new THREE.PointLight(0x49ccab, 0.8, 100);
        pointLight2.position.set(-5, -5, 5);
        this.scene.add(pointLight2);

        this.geometry = group;
        this.scene.add(this.geometry);
    }

    private createParticles(group: THREE.Group): void {
        const particleCount = 100;
        const particleGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
            const radius = 2.5 + Math.random() * 2;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;

            positions[i] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i + 2] = radius * Math.cos(phi);
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const particleMaterial = new THREE.PointsMaterial({
            color: 0x36c2ce,
            size: 0.05,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });

        const particles = new THREE.Points(particleGeometry, particleMaterial);
        group.add(particles);
    }

    private animate(): void {
        this.animationId = requestAnimationFrame(() => this.animate());

        // Smooth rotation with mouse parallax
        this.targetRotation.x = this.mouse.y * 0.3;
        this.targetRotation.y = this.mouse.x * 0.3;

        if (this.geometry) {
            // Lerp for smooth rotation
            this.geometry.rotation.x += (this.targetRotation.x - this.geometry.rotation.x) * 0.05;
            this.geometry.rotation.y += (this.targetRotation.y - this.geometry.rotation.y) * 0.05;

            // Continuous slow rotation
            this.geometry.rotation.y += 0.001;
            this.geometry.rotation.x += 0.0005;
        }

        this.renderer.render(this.scene, this.camera);
    }

    private onMouseMove(event: MouseEvent): void {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    private handleResize(): void {
        if (this.camera && this.renderer) {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }
    }

    // Public method to control camera position from parent component (for GSAP animations)
    public setCameraPosition(x: number, y: number, z: number): void {
        if (this.camera) {
            this.camera.position.set(x, y, z);
        }
    }

    // Public method to control geometry position from parent component
    public setGeometryPosition(x: number, y: number, z: number): void {
        if (this.geometry) {
            this.geometry.position.set(x, y, z);
        }
    }

    // Get camera for GSAP animations
    public getCamera(): THREE.PerspectiveCamera {
        return this.camera;
    }

    // Get geometry for GSAP animations
    public getGeometry(): THREE.Object3D {
        return this.geometry;
    }
}

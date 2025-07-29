import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { gsap } from 'gsap';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
    antialias: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.z = 10;

// Post-processing
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.5,
    0.4,
    0.85
);
composer.addPass(renderPass);
composer.addPass(bloomPass);

// Create neural network visualization
const neuralGeometry = new THREE.BufferGeometry();
const neuralCount = 100;
const neuralPositions = new Float32Array(neuralCount * 3);
const neuralConnections = [];

for (let i = 0; i < neuralCount; i++) {
    neuralPositions[i * 3] = (Math.random() - 0.5) * 20;
    neuralPositions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    neuralPositions[i * 3 + 2] = (Math.random() - 0.5) * 20;
}

neuralGeometry.setAttribute('position', new THREE.BufferAttribute(neuralPositions, 3));

// Create connections between nearby nodes
for (let i = 0; i < neuralCount; i++) {
    for (let j = i + 1; j < neuralCount; j++) {
        const distance = Math.sqrt(
            Math.pow(neuralPositions[i * 3] - neuralPositions[j * 3], 2) +
            Math.pow(neuralPositions[i * 3 + 1] - neuralPositions[j * 3 + 1], 2) +
            Math.pow(neuralPositions[i * 3 + 2] - neuralPositions[j * 3 + 2], 2)
        );
        
        if (distance < 5) {
            neuralConnections.push({
                start: i,
                end: j,
                active: false,
                geometry: new THREE.BufferGeometry().setFromPoints([
                    new THREE.Vector3(
                        neuralPositions[i * 3],
                        neuralPositions[i * 3 + 1],
                        neuralPositions[i * 3 + 2]
                    ),
                    new THREE.Vector3(
                        neuralPositions[j * 3],
                        neuralPositions[j * 3 + 1],
                        neuralPositions[j * 3 + 2]
                    )
                ]),
                line: null
            });
        }
    }
}

// Create materials
const nodeMaterial = new THREE.PointsMaterial({
    color: 0x00ff9d,
    size: 0.1,
    transparent: true,
    opacity: 0.8
});

const connectionMaterial = new THREE.LineBasicMaterial({
    color: 0x00ff9d,
    transparent: true,
    opacity: 0.2
});

const activeConnectionMaterial = new THREE.LineBasicMaterial({
    color: 0x00ff9d,
    transparent: true,
    opacity: 0.8
});

// Create meshes
const nodes = new THREE.Points(neuralGeometry, nodeMaterial);
scene.add(nodes);

neuralConnections.forEach(connection => {
    const line = new THREE.Line(connection.geometry, connectionMaterial);
    connection.line = line;
    scene.add(line);
});

// Create main sphere
const sphereGeometry = new THREE.IcosahedronGeometry(2, 2);
const sphereMaterial = new THREE.MeshPhongMaterial({
    color: 0x0088ff,
    emissive: 0x0088ff,
    emissiveIntensity: 0.5,
    transparent: true,
    opacity: 0.6,
    wireframe: true
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.z = -10;
scene.add(sphere);

// Lighting
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// UI Elements
const systemStatus = document.querySelector('.status-value');
const progressBar = document.querySelector('.progress');
const neuralLoad = document.querySelector('.data-value');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const strengthBars = document.querySelectorAll('.strength-bar');

// Update system status
function updateStatus(text, progress = 0) {
    systemStatus.textContent = text;
    gsap.to(progressBar, {
        width: `${progress}%`,
        duration: 0.5
    });
}

// Password strength indicator
function updatePasswordStrength(password) {
    const strength = calculatePasswordStrength(password);
    strengthBars.forEach((bar, index) => {
        bar.style.background = index < strength 
            ? getStrengthColor(strength)
            : 'rgba(255, 255, 255, 0.1)';
    });
}

function calculatePasswordStrength(password) {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    return strength;
}

function getStrengthColor(strength) {
    switch(strength) {
        case 1: return '#ff3e3e';
        case 2: return '#ffb700';
        case 3: return '#00ff9d';
        default: return '#ff3e3e';
    }
}

// Email validation
function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValid = emailRegex.test(email);
    const checkmark = emailInput.parentElement.querySelector('.input-validation');
    checkmark.style.opacity = isValid ? '1' : '0';
    return isValid;
}

// Neural network animation
let time = 0;
function activateRandomConnections() {
    neuralConnections.forEach(connection => {
        if (Math.random() < 0.01) {
            connection.active = true;
            connection.line.material = activeConnectionMaterial;
            gsap.to(connection.line.material, {
                opacity: 0.2,
                duration: 1,
                onComplete: () => {
                    connection.active = false;
                    connection.line.material = connectionMaterial;
                }
            });
        }
    });
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    time += 0.01;

    // Rotate neural network
    nodes.rotation.y += 0.001;
    neuralConnections.forEach(connection => {
        connection.line.rotation.y += 0.001;
    });

    // Pulse sphere
    sphere.scale.x = 1 + Math.sin(time) * 0.1;
    sphere.scale.y = 1 + Math.sin(time) * 0.1;
    sphere.scale.z = 1 + Math.sin(time) * 0.1;

    // Update neural load
    const load = Math.abs(Math.sin(time)) * 100;
    neuralLoad.textContent = `${Math.round(load)}%`;

    // Activate random neural connections
    activateRandomConnections();

    composer.render();
}

// Event listeners
emailInput.addEventListener('input', (e) => {
    validateEmail(e.target.value);
    updateStatus('Validating Neural ID', 30);
});

passwordInput.addEventListener('input', (e) => {
    updatePasswordStrength(e.target.value);
    updateStatus('Analyzing Neural Key', 60);
});

passwordInput.addEventListener('focus', () => {
    updateStatus('Secure Channel Active', 80);
    gsap.to(sphereMaterial, {
        duration: 1,
        emissive: new THREE.Color(0xff8800),
        color: new THREE.Color(0xff8800)
    });
    gsap.to(sphere.rotation, {
        duration: 2,
        x: Math.PI * 2,
        ease: 'power2.inOut'
    });
});

passwordInput.addEventListener('blur', () => {
    updateStatus('Channel Secured', 90);
    gsap.to(sphereMaterial, {
        duration: 1,
        emissive: new THREE.Color(0x0088ff),
        color: new THREE.Color(0x0088ff)
    });
});

// Form submission
const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = emailInput.value;
    const password = passwordInput.value;
    
    if (!validateEmail(email)) {
        updateStatus('Invalid Neural ID Format', 20);
        gsap.to(sphere.position, {
            duration: 0.1,
            x: '+=0.1',
            yoyo: true,
            repeat: 5
        });
        return;
    }
    
    updateStatus('Establishing Neural Link', 95);

    // Success animation
    gsap.timeline()
        .to(camera, {
            fov: 75,
            duration: 1,
            onUpdate: () => camera.updateProjectionMatrix()
        })
        .to(sphere.position, {
            z: -2,
            duration: 1
        }, 0)
        .to(sphere.rotation, {
            x: Math.PI * 4,
            y: Math.PI * 4,
            duration: 2,
            ease: 'power2.inOut'
        }, 0)
        .to('.login-card', {
            opacity: 0,
            scale: 0.8,
            duration: 0.5,
            ease: 'power2.in'
        }, 0.5)
        .to(nodes.material, {
            opacity: 0,
            duration: 0.5
        }, 0)
        .to(connectionMaterial, {
            opacity: 0,
            duration: 0.5
        }, 0)
        .add(() => {
            updateStatus('Neural Link Established', 100);
        });
});

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
});

// Initialize
updateStatus('System Initializing', 10);
animate(); 
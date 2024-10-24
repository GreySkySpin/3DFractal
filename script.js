let radiusDecreaseRate = 0.8; // Default
let zDecreaseRate = 0.6;      // Default

document.getElementById('radius-slider').addEventListener('input', function () {
    radiusDecreaseRate = parseFloat(this.value);
    document.getElementById('radius-value').innerText = this.value;
    updateVisualization();
});

document.getElementById('z-slider').addEventListener('input', function () {
    zDecreaseRate = parseFloat(this.value);
    document.getElementById('z-value').innerText = this.value;
    updateVisualization();
});

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
camera.position.set(0, 0, 5);
controls.update();

let nodes = []; // To store the nodes and lines for updating

function addSnowflakeCluster(center, level, maxLevel) {
    if (level > maxLevel) return;

    const baseRadius = 1;
    const radius = baseRadius * Math.pow(radiusDecreaseRate, level); // Adjust radius dynamically

    for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const x = center.position.x + radius * Math.cos(angle);
        const y = center.position.y + radius * Math.sin(angle);
        const z = -0.5 * Math.pow(level * zDecreaseRate, 2); // Adjust z dynamically

        const newNode = new THREE.Mesh(
            new THREE.SphereGeometry(0.1, 16, 16),
            new THREE.MeshBasicMaterial({ color: 0x00ff00 })
        );
        newNode.position.set(x, y, z);
        scene.add(newNode);
        nodes.push(newNode);

        const geometry = new THREE.BufferGeometry().setFromPoints([center.position, newNode.position]);
        const material = new THREE.LineBasicMaterial({ color: 0xffffff });
        const line = new THREE.Line(geometry, material);
        scene.add(line);
        nodes.push(line);

        addSnowflakeCluster(newNode, level + 1, maxLevel);
    }
}

function updateVisualization() {
    // Remove old nodes and lines
    nodes.forEach(node => scene.remove(node));
    nodes = [];

    // Create new center node and rebuild the snowflake
    const centerNode = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 32, 32),
        new THREE.MeshBasicMaterial({ color: 0x0000ff })
    );
    scene.add(centerNode);
    nodes.push(centerNode);

    addSnowflakeCluster(centerNode, 1, 3); // Adjust maxLevel if needed
}

updateVisualization(); // Initial render

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

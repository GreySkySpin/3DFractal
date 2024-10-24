// script.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('visualization').appendChild(renderer.domElement);

// Create the center node
const centerNode = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0x0000ff })
);
scene.add(centerNode);

// Function to add snowflake clusters
function addSnowflakeCluster(center, level, maxLevel) {
    if (level > maxLevel) return;

    for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const radius = 1 + level * 0.5;
        const x = center.position.x + radius * Math.cos(angle);
        const y = center.position.y + radius * Math.sin(angle);
        const z = center.position.z + (Math.random() - 0.5); // Random z-offset

        const newNode = new THREE.Mesh(
            new THREE.SphereGeometry(0.1, 16, 16),
            new THREE.MeshBasicMaterial({ color: 0x00ff00 })
        );
        newNode.position.set(x, y, z);
        scene.add(newNode);

        // Add edges (lines) if desired
        const geometry = new THREE.BufferGeometry().setFromPoints([center.position, newNode.position]);
        const material = new THREE.LineBasicMaterial({ color: 0x000000 });
        const line = new THREE.Line(geometry, material);
        scene.add(line);

        // Recursively add smaller clusters
        addSnowflakeCluster(newNode, level + 1, maxLevel);
    }
}

// Add the snowflake cluster
const maxLevel = 2; // Adjust for more levels
addSnowflakeCluster(centerNode, 1, maxLevel);

// Camera positioning
camera.position.z = 5;

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

// Checkbox functionality
document.getElementById('toggle-grid-labels').addEventListener('change', function (e) {
    if (e.target.checked) {
        // Show grid and labels (You can implement specific logic here)
    } else {
        // Hide grid and labels
    }
});

document.getElementById('toggle-tooltip').addEventListener('change', function (e) {
    if (e.target.checked) {
        // Show tooltips (You can implement specific logic here)
    } else {
        // Hide tooltips
    }
});

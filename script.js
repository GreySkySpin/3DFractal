document.addEventListener("DOMContentLoaded", function () {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('visualisation').appendChild(renderer.domElement);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);

    // Initial parameters
    let radiusMultiplier = 1;
    let zMultiplier = 1;
    let radiusVariation = 0.5; // Variation factor for radius
    let zVariation = 0.5; // Variation factor for z-axis
    const minRadius = 0.3; // Minimum radius to prevent nodes from crowding

    // Create the center node
    const centerNode = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 32, 32),
        new THREE.MeshBasicMaterial({ color: 0x0000ff })
    );
    scene.add(centerNode);

    // Function to clear previous nodes and lines
    function clearScene() {
        while (scene.children.length > 1) { // Keep camera in place
            const object = scene.children[1];
            scene.remove(object);
        }
    }

    // Function to add snowflake clusters
    function addSnowflakeCluster(center, level, maxLevel) {
        if (level > maxLevel) return;

        const baseRadius = 1 * radiusMultiplier; // Initial base radius
        const radius = Math.max(minRadius, baseRadius * Math.pow((1 - radiusVariation), level)); // Adjust radius based on variation

        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3; // Angle for spacing nodes
            const x = center.position.x + radius * Math.cos(angle);
            const y = center.position.y + radius * Math.sin(angle);
            const z = -0.5 * level * level * zMultiplier * (1 - (zVariation * level)); // Adjust z dynamically

            const newNode = new THREE.Mesh(
                new THREE.SphereGeometry(0.1, 16, 16),
                new THREE.MeshBasicMaterial({ color: 0x00ff00 })
            );
            newNode.position.set(x, y, z);
            scene.add(newNode);

            const geometry = new THREE.BufferGeometry().setFromPoints([center.position, newNode.position]);
            const material = new THREE.LineBasicMaterial({ color: 0xffffff });
            const line = new THREE.Line(geometry, material);
            scene.add(line);

            // Recursively add smaller clusters
            addSnowflakeCluster(newNode, level + 1, maxLevel);
        }
    }

    // Function to update the scene when sliders are changed
    function updateScene() {
        clearScene();
        addSnowflakeCluster(centerNode, 0, 2); // Regenerate the snowflake structure
    }

    // Event listeners for sliders
    document.getElementById('radius').addEventListener('input', function (e) {
        radiusMultiplier = parseFloat(e.target.value);
        document.getElementById('radius-value').textContent = radiusMultiplier;
        updateScene();
    });

    document.getElementById('z-factor').addEventListener('input', function (e) {
        zMultiplier = parseFloat(e.target.value);
        document.getElementById('z-value').textContent = zMultiplier;
        updateScene();
    });

    document.getElementById('radius-variation').addEventListener('input', function (e) {
        radiusVariation = parseFloat(e.target.value);
        document.getElementById('radius-variation-value').textContent = radiusVariation;
        updateScene();
    });

    document.getElementById('z-variation').addEventListener('input', function (e) {
        zVariation = parseFloat(e.target.value);
        document.getElementById('z-variation-value').textContent = zVariation;
        updateScene();
    });

    // Initial setup
    camera.position.z = 5;
    addSnowflakeCluster(centerNode, 0, 2); // Initial structure

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }

    animate();
});

document.addEventListener("DOMContentLoaded", function () {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('visualisation').appendChild(renderer.domElement);

    // Add OrbitControls for interaction
    const controls = new THREE.OrbitControls(camera, renderer.domElement);

    // Create the center node (Blue)
    const centerNode = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 32, 32),
        new THREE.MeshBasicMaterial({ color: 0x0000ff })
    );
    scene.add(centerNode);

    // Function to add snowflake clusters
    function addSnowflakeCluster(center, level, maxLevel) {
        if (level > maxLevel) return;

        // Adjust radius to group nodes closer together based on level
        const baseRadius = 1; // Base radius for level 1
        const radius = baseRadius * (1 - level * 0.1); // Reduce radius as level increases

        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3; // Angle for spacing nodes

            // Adjust x and y coordinates based on radius
            const x = center.position.x + radius * Math.cos(angle);
            const y = center.position.y + radius * Math.sin(angle);

            // Adjust z position to control how steep the nodes descend
            let z = -0.5 * level * level; // Quadratic decrease in z with level
            if (level > 1) {
                z *= 0.7; // Make z flatten slightly as we move outward
            }

            const newNode = new THREE.Mesh(
                new THREE.SphereGeometry(0.1, 16, 16),
                new THREE.MeshBasicMaterial({ color: 0x00ff00 })
            );
            newNode.position.set(x, y, z);
            scene.add(newNode);

            // Add edges (lines) to connect to the center
            const geometry = new THREE.BufferGeometry().setFromPoints([center.position, newNode.position]);
            const material = new THREE.LineBasicMaterial({ color: 0xffffff }); // Set color to white
            const line = new THREE.Line(geometry, material);
            scene.add(line);

            // Recursively add smaller clusters
            addSnowflakeCluster(newNode, level + 1, maxLevel);
        }
    }

    // Add initial snowflake clusters
    addSnowflakeCluster(centerNode, 0, 2); // Start from the center node

    // Set camera position
    camera.position.z = 5;

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        controls.update(); // Only required if controls.enableDamping = true, or if controls.autoRotate = true
        renderer.render(scene, camera);
    }

    animate();

    // Checkbox functionality
    document.getElementById('toggle-grid-labels').addEventListener('change', function (e) {
        if (e.target.checked) {
            // Logic to show grid and labels
            console.log("Show Grid and Labels");
        } else {
            // Logic to hide grid and labels
            console.log("Hide Grid and Labels");
        }
    });

    document.getElementById('toggle-tooltip').addEventListener('change', function (e) {
        if (e.target.checked) {
            // Logic to show tooltips
            console.log("Show Tooltips");
        } else {
            // Logic to hide tooltips
            console.log("Hide Tooltips");
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('visualisation').appendChild(renderer.domElement);

    // Add OrbitControls for interaction
    const controls = new THREE.OrbitControls(camera, renderer.domElement);

    // Create the center node
    const centerNode = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 32, 32),
        new THREE.MeshBasicMaterial({ color: 0x0000ff })
    );
    scene.add(centerNode);

    // Use a sine function to create a "tent" effect
        const z = Math.sin(angle) * 0.5; // Adjust the height as needed

    // Add the snowflake cluster
    const maxLevel = 2; // Adjust for more levels
    addSnowflakeCluster(centerNode, 1, maxLevel);

    // Camera positioning
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
            // Logic to show grid and labels (you may need to implement this)
            console.log("Show Grid and Labels");
        } else {
            // Logic to hide grid and labels
            console.log("Hide Grid and Labels");
        }
    });

    document.getElementById('toggle-tooltip').addEventListener('change', function (e) {
        if (e.target.checked) {
            // Logic to show tooltips (you may need to implement this)
            console.log("Show Tooltips");
        } else {
            // Logic to hide tooltips
            console.log("Hide Tooltips");
        }
    });
});

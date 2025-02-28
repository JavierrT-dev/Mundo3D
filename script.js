let scene, camera, renderer, controls, model;

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeeeeee);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 10);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth * 0.8, window.innerHeight * 0.7);
    document.getElementById("container").appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
    scene.add(light);

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

document.getElementById('fileInput').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const fileName = file.name.toLowerCase();

        if (fileName.endsWith(".obj")) {
            loadOBJ(e.target.result);
        } else if (fileName.endsWith(".stl")) {
            loadSTL(e.target.result);
        } else {
            alert("Formato no compatible. Solo se admiten .OBJ y .STL");
        }
    };

    reader.readAsText(file);
});

function loadOBJ(data) {
    const objLoader = new THREE.OBJLoader();
    const object = objLoader.parse(data);

    updateModel(object);
}

function loadSTL(data) {
    const stlLoader = new THREE.STLLoader();
    const geometry = stlLoader.parse(data);

    const material = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
    const mesh = new THREE.Mesh(geometry, material);

    updateModel(mesh);
}

function updateModel(object) {
    if (model) {
        scene.remove(model);
    }

    model = object;
    scene.add(model);

    model.scale.set(1, 1, 1);
    model.position.set(0, -1, 0);

    let verticesCount = 0;
    
    model.traverse((child) => {
        if (child.isMesh) {
            verticesCount += child.geometry.attributes?.position?.count || 0;
        }
    });

    let price = (verticesCount * 0.01).toFixed(2);

    document.getElementById('verticesCount').innerText = verticesCount;
    document.getElementById('price').innerText = price;
}

init();

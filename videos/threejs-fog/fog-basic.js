// init method for the video
VIDEO.init = function(sm, scene, camera){
    var fogColor = new THREE.Color('white');
    scene.background = fogColor;
    scene.fog = new THREE.Fog(fogColor, 0.25, 15);
    // CAMERA
    camera.position.set(0, 3, 8);
    camera.lookAt(0, 0, 0);
    // GRID HELPER
    scene.add(new THREE.GridHelper(8, 8));
    // MESH
    let mesh = scene.userData.mesh = new THREE.Mesh(
        new THREE.SphereGeometry(1, 30, 30),
        new THREE.MeshStandardMaterial({
            color: new THREE.Color('red')
        }));
    scene.add(mesh);
    let floor = scene.userData.floor = new THREE.Mesh(
        new THREE.BoxGeometry(30, 30, 1),
        new THREE.MeshStandardMaterial({
            color: new THREE.Color('green')
        }));
    floor.rotation.x = 1.57;
    scene.add(floor);
    // LIGHT
    let light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(8, 2, -1).normalize();
    scene.add(light);
};

// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
    let mesh = scene.userData.mesh;
    mesh.position.y = 1.5;
    mesh.position.z = -8 + 11 * sm.bias;
};


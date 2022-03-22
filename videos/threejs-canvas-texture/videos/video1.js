// 
VIDEO.scripts = [
   '../../../js/canvas.js',
   '../../../js/canvas-text-cube.js',
   '../../../js/sequences.js'
];

// init method for the video
VIDEO.init = function(sm, scene, camera){

    // SPHERE MESH
    let sphere = scene.userData.sphere = new THREE.Mesh(
        new THREE.SphereGeometry(1, 30, 30),
        new THREE.MeshStandardMaterial({
            emissive: new THREE.Color('red')
        }));
    sphere.position.y = 1.5;
    scene.add(sphere);

};

// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){

};


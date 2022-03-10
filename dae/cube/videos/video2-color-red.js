
VIDEO.daePaths = [
  '../cube-color-red.dae'
];

VIDEO.init = function(sm, scene, camera){
    // CAMERA
    camera.position.set(-3, 3, -5);
    camera.lookAt(0,0,0)

    // LIGHT
    let light = scene.userData.light = new THREE.Mesh(
        new THREE.SphereGeometry(0.25, 20, 20),
        new THREE.MeshStandardMaterial({
            emissive: 0xffffff
        }));
    light.add(new THREE.PointLight(0xdfdfdf, 0.8));
    light.position.set(-80, 150, -50);
    scene.add(light);

    let cube = scene.userData.cube = utils.DAE.getMesh( VIDEO.daeResults[0] );
    scene.add(cube);

};

VIDEO.update = function(sm, scene, camera, per, bias){
    let cube = scene.userData.cube;
    cube.rotation.y = Math.PI * 2 * sm.per;
};


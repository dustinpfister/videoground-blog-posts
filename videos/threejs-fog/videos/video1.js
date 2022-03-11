// 
VIDEO.scripts = [
   '../../../js/canvas.js',
   '../../../js/canvas-text-cube.js',
   '../../../js/sequences.js'
];


var cameraPos = function(camera, per){
    var radian = Math.PI * 2 * per,
    x = Math.cos(radian) * 8,
    z = Math.sin(radian) * 8;
    camera.position.set(x, 3, z);
};

// init method for the video
VIDEO.init = function(sm, scene, camera){

    // FOG AND BACKGROUND
    var fogColor = new THREE.Color('white');
    scene.background = fogColor;
    scene.fog = new THREE.Fog(fogColor, 0.25, 1);

    // TEXT CUBE
    var textCube = CanvasTextCube.create();
    textCube.position.set(0,1,0);
    scene.add(textCube);

    // SPHERE MESH
    let sphere = scene.userData.sphere = new THREE.Mesh(
        new THREE.SphereGeometry(1, 30, 30),
        new THREE.MeshStandardMaterial({
            color: new THREE.Color('red')
        }));
    sphere.position.y = 1.5;
    scene.add(sphere);

    // FLOOR MESH
    let floor_canvasObj = CanvasMod.createCanvasObject()
    floor_canvasObj.draw({drawMethod: 'randomGrid', gridWidth:30, gridHeight:30, gRange:[128, 255]});
    let floor = scene.userData.floor = new THREE.Mesh(
        new THREE.BoxGeometry(30, 30, 1),
        new THREE.MeshStandardMaterial({
            color: new THREE.Color('white'),
            map: floor_canvasObj.texture
        }));
    floor.rotation.x = 1.57;
    scene.add(floor);

    // LIGHT
    let light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(8, 2, -1).normalize();
    scene.add(light);

    // SET UP SEQ OBJECT
    sm.seq = Sequences.create({
        sm: sm,
        part : [
            {
                per: 0,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    scene.fog.far = 1 + 40 * partPer;
                }
            },
            {
                per: 0.33,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    cameraPos(camera, partPer);
                }
            },
            {
                per: 0.66,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    scene.fog.far = 41 - 40 * partPer;
                }
            }
        ]
    });

};

// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){

    // default position of camera
    cameraPos(camera, 0);

    // sequences
    Sequences.update(sm.seq, sm);

    // have camera always look at center
    camera.lookAt(0, 0, 0);
};


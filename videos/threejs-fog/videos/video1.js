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
    var textCube = scene.userData.textCube = CanvasTextCube.create({
        width: 128,
        height: 128,
        lineWidth: 7,
        lineColor: 'rgba(0,100,128,0.8)',
        lineCount: 9,
        lines: [
            ['Fog', 64, 20, 22, 'white'],
            ['in Three.js.', 64, 45, 22, 'white'],
            ['( r135 03/11/2022 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);

    // SPHERE MESH
    let sphere = scene.userData.sphere = new THREE.Mesh(
        new THREE.SphereGeometry(1, 30, 30),
        new THREE.MeshStandardMaterial({
            color: new THREE.Color('red')
        }));
    sphere.position.y = 1.5;
    scene.add(sphere);

    // SPHERE MESH
    var box = scene.userData.box = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshStandardMaterial({
            color: new THREE.Color('cyan')
        }));
    box.position.set(5, 1.5, 1);
    scene.add(box);

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
                    scene.fog.far = 1
                    textCube.position.set(6, 2.4, 0);
                }
            },
            {
                per: 0.1,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    scene.fog.far = 1;
                    textCube.position.set(6, 2.4 + 5 * partPer, 0);
                    textCube.rotation.y = Math.PI * 2 * partPer;
                }
            },
            {
                per: 0.25,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    scene.fog.far = 1 + 40 * partPer;
                }
            },
            {
                per: 0.5,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    scene.fog.far = 41 - 40 * partBias;
                    cameraPos(camera, partPer);
                }
            },
            {
                per: 0.75,
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

    var textCube = scene.userData.textCube;

    // default position of camera
    cameraPos(camera, 0);

    textCube.rotation.y = 0;
    textCube.position.set(6, 2.4 + 5, 0);

    // sequences
    Sequences.update(sm.seq, sm);

    // have camera always look at center
    camera.lookAt(0, 0, 0);
};


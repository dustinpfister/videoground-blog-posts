// video1 for threejs-examples-backyad

VIDEO.scripts = [
   '../../../js/canvas.js',
   '../../../js/canvas-text-cube.js',
   '../../../js/sequences.js',
   'canvas_texture.js',
   'guy.js',
   'hamster_wheel.js',
   'house.js'
];


// init method for the video
VIDEO.init = function(sm, scene, camera){
 
    // BACKGROUND
    scene.background = new THREE.Color('#2a2a2a');
    scene.add( new THREE.GridHelper(10, 10) );
 
    // TEXT CUBE
    var textCube = scene.userData.textCube = CanvasTextCube.create({
        width: 128,
        height: 128,
        lineWidth: 7,
        lineColor: 'rgba(0,100,128,0.8)',
        lineCount: 9,
        lines: [
            ['Backyard Scene', 64, 17, 15, 'white'],
            ['Project Example', 64, 32, 15, 'white'],
            ['in Three.js.', 64, 47, 15, 'white'],
            ['( r135 04/26/2022 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);


// HOUSE
var house = HouseMod.create();
house.position.set(-2, 1.05, 0);
scene.add(house);

// GROUND
var materials = {
    ground: [
        new THREE.MeshStandardMaterial({
            color: 0x00ff00,
            map: canvasTextureMod.randomGrid(['0', 'r1', '0'], 96, 96, 220),
            side: THREE.DoubleSide
        }),
        new THREE.MeshStandardMaterial({
            color: 0xffaa00,
            map: canvasTextureMod.randomGrid(['r1', 'r1', '0'], 64, 96, 220),
            side: THREE.DoubleSide
        })
    ]
};
var ground = new THREE.Mesh(new THREE.BoxGeometry(14, 14, 1.25), materials.ground);
ground.position.set(0, -0.575, 0);
ground.rotation.set(-Math.PI / 2, 0, 0);
ground.geometry.groups.forEach(function (face) {
    face.materialIndex = 1;
});
ground.geometry.groups[4].materialIndex = 0;
scene.add(ground);

// WHEEL
var wheel = scene.userData.wheel = WheelMod.create();
wheel.group.scale.set(0.5, 0.5, 0.5);
wheel.group.position.set(2, 1.5, 2);
scene.add(wheel.group);
// GUY
var guy = scene.userData.guy = GuyMod.create();
guy.group.scale.set(0.25, 0.25, 0.25);
guy.group.position.set(0, 0.8, 5.5);
scene.add(guy.group);

// sun
var sunTexture = canvasTextureMod.randomGrid(['r1', 'r1', '0']);
var sun = new THREE.Mesh(
        new THREE.SphereGeometry(1, 20, 20),
        new THREE.MeshStandardMaterial({
            emissive: 'white',
            emissiveMap: sunTexture
        }));
sun.add(new THREE.PointLight(0xffffff, 1));
sun.position.set(0, 8, 0);
scene.add(sun);

// add AmbientLight
var ambientLight = new THREE.AmbientLight(0xffffff);
ambientLight.intensity = 0.3;
scene.add(ambientLight);


    // SET UP SEQ OBJECT
    sm.seq = Sequences.create({
        sm: sm,
        part : [
            {
                per: 0,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // text cube
                    textCube.visible = true;
                    // camera
                    camera.position.set(10, 2, 0);
                    camera.lookAt(0, 0, 0);

                }
            },
            {
                per: 0.10,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // move up text cube
                    textCube.visible = true;
                    textCube.position.set(8, 1.7 + 1.5 * partPer, 0);
                    textCube.rotation.y = Math.PI * 2 * partPer;
                    // camera
                    camera.position.set(10, 2, 0);
                    camera.lookAt(0, 0, 0);
                }
            },
            // sq1 - move camera to upper corner 10, 10, 10
            {
                per: 0.15,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                     // camera
                    camera.position.set(12, 2 + 10 * partPer, 12 * partPer);
                    camera.lookAt(0, -3 * partPer, 0);
                }
            },
            {
                per: 0.25,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                     // camera
                    camera.position.set(12, 12, 12);
                    camera.lookAt(0, -3, 0);
                }
            },
            {
                per: 0.50,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                     // camera
                    camera.position.set(12 - 24 * partPer, 12, 12);
                    camera.lookAt(0, -3, 0);
                }
            }
        ]
    });
};

// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
    var textCube = scene.userData.textCube;
    textCube.rotation.y = 0;
    textCube.position.set(8, 1.7, 0);
    textCube.visible = false;

    // wheel
    var wheel = scene.userData.wheel;
    var r = Math.PI * 2  * 8 * per;
    wheel.wheel.rotation.z = r;

    // guy
    var guy = scene.userData.guy;
    GuyMod.walk(guy, per, 32);
    var r = Math.PI * 2 * per * -1;
    guy.group.position.set(Math.cos(r) * 5, 0.8, Math.sin(r) * 5);
    guy.group.lookAt(Math.cos(r - 0.5) * 5, 0.8, Math.sin(r - 0.5) * 5);

    // sequences
    Sequences.update(sm.seq, sm);

};

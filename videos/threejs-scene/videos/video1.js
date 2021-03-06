// video1 for threejs-scene
VIDEO.scripts = [
   '../../../js/canvas.js',
   '../../../js/canvas-text-cube.js',
   '../../../js/sequences.js'
];
 
// init method for the video
VIDEO.init = function(sm, scene, camera){
 
    // BACKGROUND
    //scene.background = new THREE.Color('#2a2a2a');

    // GRID
    scene.add( new THREE.GridHelper(10, 10, '#ffffff', '#00afaf') );
 
    // TEXT CUBE
    var textCube = scene.userData.textCube = CanvasTextCube.create({
        width: 128,
        height: 128,
        lineWidth: 7,
        lineColor: 'rgba(0,100,128,0.8)',
        lineCount: 9,
        lines: [
            ['Scene Object', 64, 20, 16, 'white'],
            ['in Three.js.', 64, 45, 16, 'white'],
            ['( r135 04/22/2022 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);

    // LIGHT
    var lightSphere = scene.userData.lightSphere = new THREE.Mesh( 
        new THREE.SphereGeometry(0.1, 30, 30), 
        new THREE.MeshBasicMaterial( { color: 0xffffff } ) );
    lightSphere.add(new THREE.PointLight(0xffffff, 1));
    scene.add(lightSphere);

    // mesh 1
    var mesh1 = new THREE.Mesh( new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({
        color: 0xff0000
    }));
    mesh1.position.set(0, 0.5, 0)
    scene.add(mesh1);

    // mesh 2
    var mesh2 = new THREE.Mesh( new THREE.SphereGeometry(1, 20, 20), new THREE.MeshStandardMaterial({
        color: 0x00ff00
    }));
    mesh2.position.set(-4, 1.0, 4);
    scene.add(mesh2);

    // mesh 3
    var mesh3 = new THREE.Mesh( new THREE.ConeGeometry(1, 2, 20, 20), new THREE.MeshStandardMaterial({
        color: 0x0000ff
    }));
    mesh3.position.set(-4, 1.0, -4);
    scene.add(mesh3);
 
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
                    textCube.position.set(6, 0.8, 0);
                    // camera
                    camera.position.set(8, 1, 0);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                per: 0.10,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // move up text cube
                    textCube.visible = true;
                    textCube.position.set(6, 0.8 + 2.2 * partPer, 0);
                    textCube.rotation.y = Math.PI * 2 * partPer;
                    // camera
                    camera.position.set(8, 1, 0);
                    camera.lookAt(0, 0, 0);
                }
            },
            // sq1 - move camera
            {
                per: 0.15,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    camera.position.set(8, 1 + 3 * partPer, -5 * partPer);
                    camera.lookAt(0, 0, 0);
                }
            },
            // sq2 - background color
            {
                per: 0.20,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    camera.position.set(8, 4, -5);
                    camera.lookAt(0, 0, 0);
                    // bg
                    scene.background = new THREE.Color(0.2, 0.2 + 0.8 * partBias, 0.2);       
                }
            },
            // sq3 - fog
            {
                per: 0.40,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    camera.position.set(8 - 16 * partPer, 4, -5 - 3 * partPer);
                    camera.lookAt(0, 0, 0);
                    // fog
                    scene.fog = new THREE.FogExp2(new THREE.Color(0.2, 0.2, 0.2), 0.50 * partBias);   
                }
            },
            // sq4 - material override
            {
                per: 0.60,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    camera.position.set(-8, 4, -8);
                    camera.lookAt(0, 0, 0);
                    // mr
                    scene.overrideMaterial = new THREE.MeshNormalMaterial();
                }
            },
            // sq5 - object3d
            {
                per: 0.80,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    camera.position.set(-8, 4, -8);
                    camera.lookAt(0, 0, 0);
                    // object3d
                    scene.rotation.set(
                        0, 
                        Math.PI / 180 * 45 * partPer,
                        Math.PI * 2 * partPer);
                    scene.position.set(
                        1 * partBias,
                        0.5 * partBias,
                        0);
                    scene.scale.set(1 + 1 * partBias, 1 + 1 * partBias, 1 + 1 * partBias);
                }
            },
            // sq6 - object3d - end
            {
                per: 0.98,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    camera.position.set(-8, 4, -8);
                    camera.lookAt(0, 0, 0);
                    // object3d
                    scene.rotation.set(
                        0, 
                        Math.PI / 180 * 45,
                        Math.PI * 2);
                    scene.position.set(
                        0,
                        0,
                        0);
                    scene.scale.set(1 - 1 * partPer, 1 - 1 * partPer, 1 - 1 * partPer);
                }
            }               
        ]
    });
};

// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
    var textCube = scene.userData.textCube;
    textCube.rotation.y = 0;
    textCube.position.set(8, 1, 0);
    textCube.visible = false;

    // default scene values
    var bgColor = new THREE.Color(0.2, 0.2, 0.2);
    scene.background = bgColor;
    scene.fog = new THREE.FogExp2(bgColor, 0.0);
    scene.overrideMaterial = null;
    scene.position.set(0, 0, 0);
    scene.rotation.set(0, 0, 0);
    scene.scale.set(1, 1, 1);

    // move light
    var lightSphere = scene.userData.lightSphere;
    var r =  Math.PI * 4 * per, 
    x = Math.cos(r) * 5,
    z = Math.sin(r) * 5;
    lightSphere.position.set(x, 2, z);
    // sequences
    Sequences.update(sm.seq, sm);
};


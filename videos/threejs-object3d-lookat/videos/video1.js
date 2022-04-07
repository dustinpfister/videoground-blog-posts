// scripts
VIDEO.scripts = [
   '../../../js/canvas.js',
   '../../../js/canvas-text-cube.js',
   '../../../js/sequences.js'
];
 
// init method for the video
VIDEO.init = function(sm, scene, camera){
 
    // BACKGROUND
    scene.background = new THREE.Color('#2a2a2a');
    scene.add( new THREE.GridHelper(10, 10, '#ffffff', '#00afaf') );
 
    // LIGHT
    var dl = new THREE.DirectionalLight(0xffffff, 1);
    dl.position.set(1, 1, 1);
    scene.add(dl);

    // TEXT CUBE
    var textCube = scene.userData.textCube = CanvasTextCube.create({
        width: 128,
        height: 128,
        lineWidth: 7,
        lineColor: 'rgba(0,100,128,0.8)',
        lineCount: 9,
        lines: [
            ['Object3D.lookAt', 64, 20, 16, 'white'],
            ['in Three.js.', 64, 45, 16, 'white'],
            ['( r135 04/07/2022 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);
 
    // DEMO GROUP
    var demoGroup = new THREE.Group();
    scene.add(demoGroup);
    var sphere = new THREE.Mesh( 
        new THREE.SphereGeometry(0.25, 30, 30), 
        new THREE.MeshStandardMaterial({
            color: new THREE.Color('blue')
        })
    );
    demoGroup.add(sphere);

    // CONE GROUP
    var coneGroup = new THREE.Group();
    demoGroup.add(coneGroup);
    var coneMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color('cyan')
    });
    // [ [[x, y, z], coneLength], ... ]
    var coneDataArray = [],
    len = 8,
    i = 0, x, y, z, radian, radius = 3;
    while(i < len){
        radian = Math.PI * 2 / len * i;
        x = Math.cos(radian) * radius;
        y = 0;
        z = Math.sin(radian) * radius;
        coneDataArray.push([[ x, y, z], 2]);
        i += 1;
    }
    coneDataArray.forEach(function(coneData){
        var cone = new THREE.Mesh( new THREE.ConeGeometry(0.5, coneData[1], 30, 30), coneMaterial);
        cone.geometry.rotateX(1.57);
        cone.position.fromArray(coneData[0]);
        cone.position.y += coneData[1] / 2 - 0.8;
        coneGroup.add(cone);
    });

    // ALL LOOK HELPER
    var allLook = function(group, target){
        var v = new THREE.Vector3();
        target.getWorldPosition(v);
        group.children.forEach(function(child){
            child.lookAt(v);
        });
    };
    allLook(coneGroup, sphere);
  

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
                    // sphere and cones
                    sphere.position.y = 0;
                    allLook(coneGroup, sphere);
                    // demo group
                    demoGroup.rotation.set(0, Math.PI / 180 * 22.5, 0);
                }
            },
            {
                per: 0.10,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // move up text cube
                    textCube.visible = true;
                    textCube.position.set(6, 1 + 2 * partPer, 0);
                    textCube.rotation.y = Math.PI * 2 * partPer;
                    // camera
                    camera.position.set(8, 1, 0);
                    camera.lookAt(0, 0, 0);
                    // sphere and cones
                    sphere.position.y = 0;
                    allLook(coneGroup, sphere);
                    // demo group
                    demoGroup.rotation.set(0, Math.PI / 180 * 22.5, 0);
                }
            },
            {
                per: 0.20,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // sphere and cones
                    sphere.position.y = 2 * partPer;
                    allLook(coneGroup, sphere);
                    // demo group
                    demoGroup.rotation.set(0, Math.PI / 180 * 22.5, 0);
                }
            },
            {
                per: 0.30,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // sphere and cones
                    sphere.position.y = 2 - 4 * partPer;
                    allLook(coneGroup, sphere);
                    // demo group
                    demoGroup.rotation.set(0, Math.PI / 180 * 22.5, 0);
                }
            },
            {
                per: 0.50,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // sphere and cones
                    sphere.position.y = -2 + 16 * partPer;
                    allLook(coneGroup, sphere);
                    // demo group
                    demoGroup.rotation.set(
                        Math.PI / 180 * 45 * partPer, 
                        Math.PI / 180 * 22.5,
                        Math.PI / 180 * 90 * partPer);
                }
            }
        ]
    });
};

// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
    var textCube = scene.userData.textCube;
    textCube.rotation.y = 0;
    textCube.position.set(6, 0, 0);
    textCube.visible = false;
    // sequences
    Sequences.update(sm.seq, sm);
};


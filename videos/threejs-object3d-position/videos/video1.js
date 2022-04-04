// scripts
VIDEO.scripts = [
   '../../../js/canvas-text-cube.js',
   '../../../js/sequences.js'
];
 
// init method for the video
VIDEO.init = function(sm, scene, camera){
 
    scene.background = new THREE.Color('#202020');
    scene.add( new THREE.GridHelper(10, 10, 0x00ff00, 0xffffff));
 
    // TEXT CUBE
    var textCube = scene.userData.textCube = CanvasTextCube.create({
        width: 128,
        height: 128,
        lineWidth: 7,
        lineColor: 'rgba(0,100,128,0.8)',
        lineCount: 9,
        lines: [
            ['Object3d Position', 64, 20, 16, 'white'],
            ['in Three.js.', 64, 45, 16, 'white'],
            ['( r135 04/04/2022 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    textCube.material.transparent = true;
    textCube.material.opacity = 0.5;
    scene.add(textCube);
 
    // a single lone cube
    var cube1 = scene.userData.cube1 = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshNormalMaterial({
            transparent: true,
            opacity: 0.5
        }));
    scene.add(cube1);

    var group1 = scene.userData.group1 = new THREE.Group();
    var i = 0, h = 5, len = 30, radian, radius, x, y, z;
    while(i < len){
        var mesh = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 0.5, 0.5),
            new THREE.MeshNormalMaterial({
            transparent: true,
            opacity: 0.5
            })
        );
        radian = Math.PI * 2 * 4 / len * i;
        radius = 1;
        x = Math.cos(radian) * radius;
        y = h / 2 * -1 + h * ( i / len);
        z = Math.sin(radian) * radius;
        // SETTING THE POSITION OF JUST THIS MESH
        mesh.position.set(x, y, z);
        mesh.lookAt(0, 0, 0);
        group1.add(mesh);
        i += 1;
    }
    scene.add(group1);
 
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
                    // cube1
                    cube1.material.opacity = 1;
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
                    // cube1
                    cube1.material.opacity = 1;
                }
            },
            // moving a single lone cube
            {
                per: 0.20,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // cube1
                    cube1.material.opacity = 1;
                    var radian = Math.PI * 2 * partPer,
                    radius = 5 * partPer,
                    p = partPer * 8 % 1,
                    b = 1 - Math.abs(p - 0.5) / 0.5,
                    x = Math.cos(radian) * radius,
                    y = -0.5 + 1 * b,
                    z = Math.sin(radian) * radius;
                    cube1.position.set(x, y, z);
                    // group1
                    group1.children.forEach(function(mesh){
                        mesh.material.opacity = 1 * partPer;
                    });
                    // camera
                    camera.position.set(8, 1, 0);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                per: 0.40,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // group1
                    group1.children.forEach(function(mesh){
                        mesh.material.opacity = 1;
                    });
                    // cube1
                    cube1.material.opacity = 1 - 1 * partPer;
                    cube1.position.z += 2 * partPer;
                    // camera
                    camera.position.set(8 + 5 * partPer, 1 + 4 * partPer,  0);
                    camera.lookAt(0, 0, 0);
                }
            }
        ]
    });
};

// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
    var textCube = scene.userData.textCube;
    let cube1 = scene.userData.cube1;
    let group1 = scene.userData.group1;
    textCube.rotation.y = 0;
    textCube.position.set(6, 0, 0);
    textCube.visible = false;
 
    cube1.material.opacity = 0;
    group1.children.forEach(function(mesh){
        mesh.material.opacity = 1;
    });

    // cube1
    // sequences
    Sequences.update(sm.seq, sm);
};


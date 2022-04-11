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
 
    // TEXT CUBE
    var textCube = scene.userData.textCube = CanvasTextCube.create({
        width: 128,
        height: 128,
        lineWidth: 7,
        lineColor: 'rgba(0,100,128,0.8)',
        lineCount: 9,
        lines: [
            ['Object3D.scale', 64, 20, 16, 'white'],
            ['in Three.js.', 64, 45, 16, 'white'],
            ['( r135 04/11/2022 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);
 
    // MESH OBJECTS
    var demoGroup = scene.userData.demoGroup = new THREE.Group();
    scene.add(demoGroup);
    var i = 0, len = 5;
    while(i < len){
        var material = new THREE.MeshNormalMaterial({
            transparent: true,
            opacity: 0.2
        });
        var mesh = new THREE.Mesh( new THREE.BoxGeometry(1,1,1), material );
        demoGroup.add(mesh);
        i += 1;
    }

    var demoGroupInit = function(demoGroup, forMesh){
        forMesh = forMesh || function(){};
        var len = demoGroup.children.length; 
        demoGroup.children.forEach(function(mesh, i){
            mesh.material.opacity = 0.0;
            mesh.position.x = 0;
            mesh.position.z = -5 + 10 * (i / (len -1 ));
            mesh.scale.set(1, 1, 1);
            forMesh(mesh, i);
        });
    };


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
                    // demoGroup
                    demoGroupInit(demoGroup);
                    var mesh = demoGroup.children[2];
                    mesh.material.opacity = 1;
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
                    // demoGroup
                    demoGroupInit(demoGroup);
                    var mesh = demoGroup.children[2];
                    mesh.material.opacity = 1;
                }
            },
            // sq1 - single mesh object scales up and down, camera changes position, and 
            // all other mesh objects become visable by end of sequence
            {
                per: 0.15,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    camera.position.set(8, 1 + 7 * partPer, 8 * partPer);
                    camera.lookAt(0, 0, 0);
                    // demoGroup - init with opacity going up to 1 for all mesh objects
                    demoGroupInit(demoGroup, function(mesh, i){
                        mesh.material.opacity = partPer;
                    });
                    // mesh 2 stays at 1, and scales up and down alone
                    var mesh = demoGroup.children[2];
                    mesh.material.opacity = 1;
                    mesh.scale.multiplyScalar(1 + 3 * partBias);
                }
            },
            // sq2 - move, rotate, and scale all cubes togetaher
            {
                per: 0.50,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    camera.position.set(10, 6, 10);
                    camera.lookAt(0, 0, 0);
                    // demoGroup - init with opacity going up to 1 for all mesh objects
                    demoGroupInit(demoGroup, function(mesh, i){
                        mesh.material.opacity = 1;

// POSITION FOR EACH MESH
var orderPer = i / (len -1 ),
orderBias = 1 - Math.abs(0.5 - orderPer) / 0.5;
var radian = Math.PI * 0.5 + (-Math.PI + Math.PI * orderBias) * partPer,
radius = 5 - 10 * orderPer;
mesh.position.x = Math.cos(radian) * radius;
mesh.position.z = Math.sin(radian) * radius;

// Scale for each mesh
var scalar = 1 + (2 * partPer) * orderPer;
mesh.scale.multiplyScalar(scalar);

                    });
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
    // sequences
    Sequences.update(sm.seq, sm);
};


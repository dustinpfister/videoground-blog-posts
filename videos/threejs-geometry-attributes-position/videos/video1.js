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
    var grid = scene.userData.grid = new THREE.GridHelper(10, 10, '#ffffff', '#00afaf');
    scene.add( grid );
 
    // TEXT CUBE
    var textCube = scene.userData.textCube = CanvasTextCube.create({
        width: 128,
        height: 128,
        lineWidth: 7,
        lineColor: 'rgba(0,100,128,0.8)',
        lineCount: 9,
        lines: [
            ['Position Attribute of', 64, 17, 14, 'white'],
            ['Bufer Geometry', 64, 32, 14, 'white'],
            ['in Three.js.', 64, 47, 14, 'white'],
            ['( r135 04/13/2022 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);

    var cube = scene.userData.cube = new THREE.Mesh(
        new THREE.BoxGeometry(2.0, 2.0, 2.0),
        new THREE.MeshNormalMaterial({
            side: THREE.DoubleSide
        })
    );
    var pos = cube.geometry.getAttribute('position');
    //var norm = cube.geometry.getAttribute('normal');
    cube.userData.posHome = pos.clone();
    scene.add(cube);


    var posVectors = cube.userData.posVectors = [];
    var v = 0;
    while(v < pos.count){
        //console.log(v, pos.array[v], pos.array[v + 1], pos.array[v + 2]);
        posVectors.push(new THREE.Vector3(
            pos.array[v], pos.array[v + 1], pos.array[v + 2]
        ));
        v += 1;
    }
console.log(posVectors);
// for each face
    var face = cube.userData.face = [];
    var i = 0, len = 6;
    while(i < len){
        var vectors = posVectors.slice(i,  i + 4);
        face.push({
           si: i,
           ei: i + 4,
           vectors: vectors
        });
        i += 1;
    }
    console.log(face);
    


    //console.log('pos', pos);
    //console.log('norm', norm);
    //console.log('groups', cube.geometry.groups)

//console.log( pos.array.slice(0, 3 * 6) );



//    var v = 0;
//    while(v < pos.count){
//        console.log(v, pos.array[v], pos.array[v + 1], pos.array[v + 2]);
//        v += 1;
//    }


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
                    textCube.position.set(6, 1 + 2 * partPer, 0);
                    textCube.rotation.y = Math.PI * 2 * partPer;
                    // camera
                    camera.position.set(8, 1, 0);
                    camera.lookAt(0, 0, 0);
                }
            },
            // sq1 - 
            {
                per: 0.15,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    camera.position.set(8 + 2 * partPer, 1 + 5 * partPer, 10 * partPer);
                    camera.lookAt(0, 0, 0);
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

    var cube = scene.userData.cube;
    var posHome = cube.userData.posHome;
    var pos = cube.geometry.getAttribute('position');
    var norm = cube.geometry.getAttribute('normal');

    var v = 0;
    while(v < pos.count){
        var vecNorm = new THREE.Vector3(norm.array[v], norm.array[v + 1], norm.array[v + 2]);
        var vecPosHome = new THREE.Vector3(posHome.array[v], posHome.array[v + 1], posHome.array[v + 2]);

pos.array[v] = vecPosHome.x + vecNorm.x * 2 * bias;


        v += 1;
    }
pos.needsUpdate = true;

    // sequences
    Sequences.update(sm.seq, sm);

};


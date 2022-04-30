// video1 for threejs-object3d-traverse
 
// scripts
VIDEO.scripts = [
   '../../../js/canvas.js',
   '../../../js/canvas-text-cube.js',
   '../../../js/sequences.js'
];
// init
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
            ['Object3d traverse', 64, 17, 14, 'white'],
            ['method', 64, 32, 14, 'white'],
            ['in threejs', 64, 47, 14, 'white'],
            ['( r135 04/30/2022 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);

    var dl = new THREE.DirectionalLight(0xffffff, 1);
    dl.position.set(3, 10, 3);
    scene.add(dl);

    // ADDING A GROUP OF MESH OBJECTS
    var group = new THREE.Group();
    var i = 20;
    while(i--){
        group.add( new THREE.Mesh( new THREE.BoxGeometry(1,1, 1), new THREE.MeshStandardMaterial({
            color: 0xffffff
        }) ));
    }
    scene.add( group );

    // TRAVERSING ALL OBJECTS IN THE SCENE
    scene.traverse(function(obj){
        if(obj.type === 'GridHelper'){
            obj.material.color = new THREE.Color(0, 1, 0);
        }
        if(obj.type === 'Mesh'){
            obj.position.x = -5 + Math.floor(10 * THREE.MathUtils.seededRandom());
            obj.position.z = -5 + Math.floor(10 * THREE.MathUtils.seededRandom());
            obj.rotation.y = Math.PI * 2 * THREE.MathUtils.seededRandom();
        }
        if(obj.type === 'Group'){
            var len = obj.children.length;
            obj.children.forEach(function(child, i){
                child.position.y = -5 + Math.floor( 10 * (i / len) );
                var s = 0.25 + 1.75 * (1 - i / len);
                child.scale.set(s, s, s);
            });
        }
    });


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
                    textCube.material.opacity = 1.0;
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
                    textCube.position.set(6, 0.8 + 1 * partPer, 0);
                    textCube.rotation.y = Math.PI * 2 * partPer;
                    textCube.material.opacity = 1.0 - partPer;
                    // camera
                    camera.position.set(8, 1, 0);
                    camera.lookAt(0, 0, 0);
                }
            },
            // sq1 - move camera to 10, 10, 10
            {
                per: 0.15,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    camera.position.set(8 + 2 * partPer , 1 + 9 * partPer, 10 * partPer);
                    camera.lookAt(0, 0, 0);
                }
            },
            // sq2 - color for each mesh
            {
                per: 0.25,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    camera.position.set(10 - 20 * partPer, 10, 10 + 5 * partPer);
                    camera.lookAt(0, 0, 0);
                    scene.traverse(function(obj){
                        if(obj.type === 'Group'){
                            var len = obj.children.length;
                            obj.children.forEach(function(child, i){
                                var current = Math.floor(len * partPer);
                                // default red
                                child.material.color = new THREE.Color(1, 0, 0);
                                if(i === current){
                                    child.material.color = new THREE.Color(0, 1, 0);
                                }
                
                            });
                        }
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
    textCube.position.set(8, 0.8, 0);
    textCube.visible = false;
    textCube.material.transparent = true;
    textCube.material.opacity = 0.0;


    scene.traverse(function(obj){

        if(obj.type === 'Mesh'){
            if(obj != scene.userData.textCube){
                obj.material.color = new THREE.Color(1, 0, 0);
            } 
        }
        if(obj.type === 'Group'){
            var len = obj.children.length;
            obj.children.forEach(function(child, i){
                child.rotation.y = Math.PI * 2 * (1 + 5 * (i / len)) * per;
            });
            obj.rotation.x = Math.PI / 180 * 45 * per;
        }
    });

    // sequences
    Sequences.update(sm.seq, sm);
};


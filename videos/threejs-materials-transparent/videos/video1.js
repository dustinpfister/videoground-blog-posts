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
            ['Transparent', 64, 17, 16, 'white'],
            ['Materials', 64, 32, 16, 'white'],
            ['in Three.js.', 64, 47, 16, 'white'],
            ['( r135 04/13/2022 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);
 
    var demoMod = {};

    // create a new demo group object
    demoMod.createGroup = function(){
        var demoGroup = scene.userData.demoGroup = new THREE.Group();
        scene.add(demoGroup);
        var i = 0, len = 10;
        while(i < len){
            var material = new THREE.MeshNormalMaterial({
                transparent: true,
                opacity: 0.2
            });
            var mesh = new THREE.Mesh( new THREE.BoxGeometry(1,1,1), material );
            demoGroup.add(mesh);
            i += 1;
        }
        return demoGroup;
    };

    // update a demoGroup object
    demoMod.updateGroup = function(demoGroup, loopPer, forMesh){
        forMesh = forMesh || function(){};
        var len = demoGroup.children.length;
        // for each child in the group
        demoGroup.children.forEach(function(mesh, i){
            // default values for demo group
            mesh.material.opacity = 1.0;
            mesh.position.x = 0;
            mesh.position.z = 5 - 10 * (i / (len -1 ));
            mesh.scale.set(1, 1, 1);
            mesh.rotation.set(0, 0, 0);
            // call for mesh method for the current mesh
            forMesh(mesh, i, len, demoGroup, loopPer);
        });
        // values for the group as a whole
        demoGroup.position.set(0, 0, 0);
        demoGroup.rotation.set(0, 0, 0);
    };


    // create a demo group with the demoMod method
    var demoGroup = demoMod.createGroup();


    demoMod.updateGroup(demoGroup, 0, function(mesh, i, len, group, loopPer){
       
      
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
                    demoMod.updateGroup(demoGroup, partPer, function(mesh, i, len, group, loopPer){

                        var zDelta = 10 * loopPer * -1;
                        mesh.position.z += zDelta;

/*
                        var orderPer = i / (len - 1),
                        orderBias = 1 - Math.abs(orderPer - 0.5) / 0.5;
                        mesh.material.opacity = 1 * orderBias;
*/
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


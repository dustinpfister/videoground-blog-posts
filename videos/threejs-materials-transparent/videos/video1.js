// video1 for threejs-materials-transparent
// scripts
VIDEO.scripts = [
   '../../../js/canvas.js',
   '../../../js/canvas-text-cube.js',
   '../../../js/sequences.js'
];
 

var demoMod = {};

    // create a new demo group object
    demoMod.createGroup = function(){
        var demoGroup = new THREE.Group();
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
            ['Transparent', 64, 17, 16, 'white'],
            ['Materials', 64, 32, 16, 'white'],
            ['in Three.js.', 64, 47, 16, 'white'],
            ['( r135 04/13/2022 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);
 
    


    // create a demo group with the demoMod method
    var demoGroup = scene.userData.demoGroup = demoMod.createGroup();
    scene.add(demoGroup);

    var demoGroup2 = scene.userData.demoGroup2 = demoMod.createGroup();
    demoGroup2.rotation.set(1,0,0);
    scene.add(demoGroup2);

    //demoMod.updateGroup(demoGroup, 0, function(mesh, i, len, group, loopPer){});


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

    // sequences
    Sequences.update(sm.seq, sm);

    // update demogroup
    demoMod.updateGroup(scene.userData.demoGroup, per, function(mesh, i, len, group, loopPer){
        // adjust posiitons
        var zDelta = 10 * loopPer * -1;
        mesh.position.z += zDelta;
        mesh.position.z = THREE.MathUtils.euclideanModulo(mesh.position.z + 5, 10) - 5;
        var xDelta = 3.5 + Math.pow(8, Math.abs(mesh.position.z / 5) ) * -1;
        mesh.position.x += xDelta;
        mesh.position.x = THREE.MathUtils.euclideanModulo(mesh.position.x + 5, 10) - 5;
        // set opacity based on distance
        var d = mesh.position.distanceTo( new THREE.Vector3(0, 0, 0) );
        var dPer = d / 5;
        dPer = dPer > 1 ? 1 : dPer;
        mesh.material.opacity = 1 - dPer;
        // look at center
        mesh.lookAt(scene.userData.demoGroup.position);
        mesh.rotation.y += Math.PI / 180 * 45;
    });

    // update demogroup2
    demoMod.updateGroup(scene.userData.demoGroup2, per, function(mesh, i, len, group, loopPer){
        // adjust posiitons
        var zDelta = 10 * loopPer * -1;
        mesh.position.z += zDelta;
        mesh.position.z = THREE.MathUtils.euclideanModulo(mesh.position.z + 5, 10) - 5;

        // set opacity based on distance
        var d = mesh.position.distanceTo( new THREE.Vector3(0, 0, 0) );
        var dPer = d / 4;
        dPer = dPer > 1 ? 1 : dPer;
        mesh.material.opacity = 1 - dPer;
    });
    scene.userData.demoGroup2.rotation.set(1.57, (Math.PI / 180 * 45) * per,0);

    // grid effect
    var grid = scene.userData.grid;
    grid.material.transparent = true;
    grid.material.opacity = 1 - per;
    grid.visible = true;
    if( parseFloat(grid.material.opacity) < 0.1){
        grid.visible = false;
    }

};


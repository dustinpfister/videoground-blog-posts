// video1 for threejs-grid-helper
 
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
 
    // TEXT CUBE
    var textCube = scene.userData.textCube = CanvasTextCube.create({
        width: 128,
        height: 128,
        lineWidth: 7,
        lineColor: 'rgba(0,100,128,0.8)',
        lineCount: 9,
        lines: [
            ['Grid Helper', 64, 17, 14, 'white'],
            ['Objects in', 64, 32, 14, 'white'],
            ['threejs', 64, 47, 14, 'white'],
            ['( r135 05/11/2022 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);

    // GRID HELPERS
    var i = 0, len = 3,
    helpers = new THREE.Group();
    while(i < len){
        var grid = scene.userData.grid = new THREE.GridHelper(10, 10, '#8f8f8f', '#ffffff');
        grid.material.linewidth = 3;
        helpers.add( grid );
        i += 1;
    }
    scene.add(helpers);

    var helpersDefault = function(helper, i, arr){
        helper.scale.set(0, 0, 0);
        helper.rotation.set(0, 0, 0);
        helper.material.color = new THREE.Color('lime');
        if(i === 1){
            helper.rotation.x = Math.PI * 0.5;
            helper.material.color = new THREE.Color('blue');
        }
        if(i === 2){
            helper.rotation.z = Math.PI * 0.5;

            helper.material.color = new THREE.Color('red');
        }
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
                    textCube.material.opacity = 1.0;
                    // helpers
                    helpers.children.forEach(function(helper, i, arr){
                        helpersDefault(helper, i, arr);
                    });
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
                    // helpers
                    helpers.children.forEach(function(helper, i, arr){
                        helpersDefault(helper, i, arr);
                    });
                    // camera
                    camera.position.set(8, 1, 0);
                    camera.lookAt(0, 0, 0);
                }
            },
            // sq1 - scale up one
            {
                per: 0.15,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // helpers
                    helpers.children.forEach(function(helper, i, arr){
                        helpersDefault(helper, i, arr);
                    });
                    var s = partPer;
                    helpers.children[0].scale.set(s, s, s);
                    // camera
                    camera.position.set(8, 1 + 5 * partPer, 0);
                    camera.lookAt(0, 0, 0);
                }
            },
            // sq2 - scale up two more
            {
                per: 0.25,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // helpers
                    helpers.children.forEach(function(helper, i, arr){
                        helpersDefault(helper, i, arr);
                        var s = partPer;
                        helper.scale.set(s, s, s);
                    });
                    var s = 1;
                    helpers.children[0].scale.set(s, s, s);
                    // camera
                    camera.position.set(8, 6 + 2 * partPer, 8 * partPer);
                    camera.lookAt(0, 0, 0);
                }
            },
            // sq3 - move camera
            {
                per: 0.35,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // helpers
                    helpers.children.forEach(function(helper, i, arr){
                        helpersDefault(helper, i, arr);
                        var s = 1;
                        helper.scale.set(1, 1, 1);
                    });
                    // camera
                    var vOld = new THREE.Vector3(8, 8, 8);
                    var vNew = new THREE.Vector3(-8, -8, 8 );
                    camera.position.copy(vOld).lerp(vNew, partPer)

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
    textCube.position.set(6, 0.8, 0);
    textCube.visible = false;
    textCube.material.transparent = true;
    textCube.material.opacity = 0.0;
    // sequences
    Sequences.update(sm.seq, sm);
};


// video1 for threejs-light
 
// scripts
VIDEO.scripts = [
   '../../../js/canvas.js',
   '../../../js/canvas-text-cube.js',
   '../../../js/sequences-hooks-r1.js'
];
// init
VIDEO.init = function(sm, scene, camera){
 
    // BACKGROUND
    scene.background = new THREE.Color('#2a2a2a');

    // GRID
    var grid = scene.userData.grid = new THREE.GridHelper(10, 10, '#ffffff', '#00afaf');
    grid.material.linewidth = 3;
    scene.add( grid );
 
    // TEXT CUBE
    var textCube = scene.userData.textCube = CanvasTextCube.create({
        width: 128,
        height: 128,
        lineWidth: 7,
        lineColor: 'rgba(0,100,128,0.8)',
        lineCount: 9,
        lines: [
            ['Light', 64, 17, 14, 'white'],
            ['in', 64, 32, 14, 'white'],
            ['threejs', 64, 47, 14, 'white'],
            ['( r135 05/15/2022 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);

    // LIGHTS
    var ambient = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambient);
    var dl = new THREE.DirectionalLight(0xffffff, 1);
    scene.add(dl);
    var pl = new THREE.PointLight(0xffffff, 1);
    scene.add(pl);
    pl.add( new THREE.PointLightHelper(pl) );

    // POINT LIGHT HELPER
    var setPointLightPos = function(per){
        var r = Math.PI * 2 * per;
        var x = Math.cos(r) * 2,
        z = Math.sin(r) * 2;
        pl.position.set(x, 0, z);   
    };

    // MESH OBJECTS
    var cube = new THREE.Mesh(new THREE.BoxGeometry(2,2,2), new THREE.MeshStandardMaterial({color: 0xffffff}));
    scene.add(cube);


    // A SEQ FOR TEXT CUBE
    var seq_textcube = seqHooks.create({
        setPerValues: false,
        fps: 30,
        beforeObjects: function(seq){
            var textCube = scene.userData.textCube;
            textCube.rotation.y = 0;
            textCube.position.set(6, 0.8, 0);
            textCube.visible = false;
            textCube.material.transparent = true;
            textCube.material.opacity = 0.0;
        },
        objects: [
            {
                per: 0,
                update: function(seq, partPer, partBias){
                    // text cube
                    textCube.visible = true;
                    textCube.position.set(6, 0.8, 0);
                    textCube.material.opacity = 1.0;
                }
            },
            {
                per: 0.75,
                update: function(seq, partPer, partBias){
                    // move up text cube
                    textCube.visible = true;
                    textCube.position.set(6, 0.8 + 1 * partPer, 0);
                    textCube.rotation.y = Math.PI * 2 * partPer;
                    textCube.material.opacity = 1.0 - partPer;
                }
            }
        ]
    });

    // A MAIN SEQ OBJECT
    var seq = scene.userData.seq = seqHooks.create({
        fps: 30,
        beforeObjects: function(seq){
            ambient.intensity = 0.1;
            dl.intensity = 0;
            dl.position.set(0, 1, 0);
            pl.intensity = 0;
            //pl.position.set(4, 0, 0);
            setPointLightPos(0);
            textCube.visible = false;
            camera.position.set(8, 1, 0);
        },
        afterObjects: function(seq){
        },
        objects: [
            {
                secs: 3,
                update: function(seq, partPer, partBias){
                    // textcube
                    if(seq.partFrame < seq.partFrameMax){
                        seqHooks.setFrame(seq_textcube, seq.partFrame, seq.partFrameMax);
                    }
                    // light
                    ambient.intensity = 0;
                    // camera
                    camera.lookAt(0, 0, 0);
                }
            },
            {   // sq1 - ambient light goes from 0 to 1
                secs: 7,
                update: function(seq, partPer, partBias){
                    // light
                    ambient.intensity = partPer;
                    // camera
                    camera.position.set(8, 1 + 7 * partPer, 8 * partPer);
                    camera.lookAt(0, 0, 0);
                }
            },
            {   // sq2 - ambient light goes back down to 0.1
                secs: 3,
                update: function(seq, partPer, partBias){
                    // light
                    ambient.intensity = 1 - 0.9 * partPer;
                    // camera
                    camera.position.set(8, 8, 8);
                    camera.lookAt(0, 0, 0);
                }
            },
            {   // sq3 - dl intensity goes up
                secs: 3,
                update: function(seq, partPer, partBias){
                    // light
                    dl.intensity = partPer;
                    // camera
                    camera.position.set(8, 8, 8);
                    camera.lookAt(0, 0, 0);
                }
            },
            {   // sq4 - dl posiiton change
                secs: 5,
                update: function(seq, partPer, partBias){
                    // light
                    dl.intensity = 1;
                    var r = Math.PI * 6 * partPer;
                    var x = Math.cos(r) * 3 * partBias,
                    z = Math.sin(r) * 3 * partBias
                    dl.position.set(x, 1, z);
                    // camera
                    camera.position.set(8, 8, 8);
                    camera.lookAt(0, 0, 0);
                }
            },
            {   // sq5 - dl intensity back down, point light up
                secs: 3,
                update: function(seq, partPer, partBias){
                    // light
                    dl.intensity = 1 - partPer;
                    pl.intensity = partPer;
                    // camera
                    camera.position.set(8, 8, 8);
                    camera.lookAt(0, 0, 0);
                }
            },
            {   // sq6 - move pl
                secs: 6,
                update: function(seq, partPer, partBias){
                    // light
                    pl.intensity = 1;
                    setPointLightPos(partPer);                  
                    // camera
                    camera.position.set(8, 8, 8);
                    camera.lookAt(0, 0, 0);
                }
            }
        ]
    });

    console.log('frameMax for main seq: ' + seq.frameMax);
    sm.frameMax = seq.frameMax;

};

// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
    var seq = scene.userData.seq;
    seqHooks.setFrame(seq, sm.frame, sm.frameMax);

};


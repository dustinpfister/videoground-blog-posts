// video1 for threejs-buffer-geometry-loader
 
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
            ['Buffer Geometry Loader', 64, 17, 11, 'white'],
            ['in', 64, 32, 10, 'white'],
            ['threejs', 64, 47, 10, 'white'],
            ['( r140 dd/mm/yyyy )', 64, 70, 10, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);

    // LIGHT
    var dl = new THREE.DirectionalLight(0xffffff, 1);
    dl.position.set(3, 1, 2);
    scene.add(dl);
    var al = new THREE.AmbientLight(0xffffff, 0.15);
    scene.add(al);

    // MESH1
    var mesh1; // to be loaded with buffer Geomerty loader at bottom of VIDEO.init

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
            // defaults for mesh1
            mesh1.scale.set(0.5, 0.5, 0.5);
            mesh1.rotation.x = Math.PI * 1.5;
            mesh1.rotation.z = Math.PI;

            mesh1.position.set(0, 2, 0);

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
                    // camera
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 2,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(8 - 1 * partPer, 1 + 6 * partPer, 7 * partPer);
                    var v1 = new THREE.Vector3();
                    var v2 = mesh1.position.clone();
                    camera.lookAt( v1.clone().lerp(v2, partPer) );
                }
            },
            {
                secs: 5,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(7, 7, 7);
                    camera.lookAt( mesh1.position );
                }
            },
            {
                secs: 5,
                update: function(seq, partPer, partBias){
                    // camera
                    var v3 = mesh1.position.clone();
                    v3.y = 7;
                    var d = camera.position.distanceTo( v3 );
                    var r = Math.PI * 0.25 + Math.PI * 2 * partPer;
                    var x = Math.cos(r) * d,
                    z = Math.sin(r) * d;
                    camera.position.set(x, 7, z);
                    camera.lookAt( mesh1.position );

                }
            },
            {
                secs: 3,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(7, 7, 7);
                    camera.lookAt( mesh1.position );
                }
            },
        ]
    });

    console.log('frameMax for main seq: ' + seq.frameMax);
    sm.frameMax = seq.frameMax;

    // using BUFFER Geometry Loader
    return new Promise(function(resolve, reject){
        const loader = new THREE.BufferGeometryLoader();
        // load a resource
        loader.load(
            // resource URL
             //'json/foo.json',
             videoAPI.pathJoin(sm.filePath, '../../../json/box-house-1/box-house-1-solid.json' ),

             // onLoad callback
             function ( geometry ) {
                  resolve(geometry);
             },
             // onProgress callback
             function ( xhr ) {
                 console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
             },
             // onError callback
             function ( err ) {
                 reject(err)
             }
        );
    }).catch(function(err){
 
        console.log(err.message); // failed to fetch message
        console.log(videoAPI);
 
    }).then(function(geometry){
 
        mesh1 = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());
        scene.add(mesh1);
 
    });
 
};

// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
    var seq = scene.userData.seq;
    seqHooks.setFrame(seq, sm.frame, sm.frameMax);

};


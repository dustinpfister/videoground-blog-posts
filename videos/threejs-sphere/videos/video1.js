// video1 for threejs-sphere
 
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
            ['Sphere', 64, 17, 14, 'white'],
            ['Geometry', 64, 32, 14, 'white'],
            ['in threejs', 64, 47, 14, 'white'],
            ['( r135 05/13/2022 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);

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

    // ---------- ----------
    // LIGHT
    // ---------- ----------
    var light = new THREE.PointLight(0xffffff, 0.9); // point light
    light.position.set(1, 3, 7);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xafafaf, 0.25));

    // ---------- ----------
    // MESH OBJECTS USING SPHERE GEOMERTY
    // ---------- ----------
    var sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 30,30), new THREE.MeshStandardMaterial());
    scene.add(sphere);
    var sphere2 = new THREE.Mesh(new THREE.SphereGeometry(0.1, 30,30), new THREE.MeshStandardMaterial({color: 0xff0000}));
    scene.add(sphere2);

    // ---------- ----------
    // Vector3
    // ---------- ----------
    // using apply Euler method to change direction and length
    var setMeshPos = function(mesh, deg1, deg2, vecLength){
        deg1 = deg1 === undefined ? 0 : deg1;
        deh2 = deg2 === undefined ? 0 : deg2;
        vecLength = vecLength === undefined ? 1.1: vecLength;
        var homeVec = new THREE.Vector3(vecLength, 0, 0);
        var a = THREE.MathUtils.degToRad(deg1),
        b = THREE.MathUtils.degToRad(deg2);
        mesh.position.copy(homeVec).applyEuler( new THREE.Euler(0, a, b) );
    };

    // A MAIN SEQ OBJECT
    var seq = scene.userData.seq = seqHooks.create({
        fps: 30,
        beforeObjects: function(seq){
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
                    // sphere2 positon
                    setMeshPos(sphere2, 360 * seq.per, 0, 1.1);
                }
            },
            {
                secs: 7,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(8 - 6 * partPer, 2 * partPer, 2 * partPer);
                    camera.lookAt(0, 0, 0);
                    // sphere2 positon
                    setMeshPos(sphere2, 360 * seq.per, 0, 1.1);
                }
            },
            {
                secs: 20,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(2, 2, 2);
                    camera.lookAt(0, 0, 0);
                    // sphere2 positon
                    setMeshPos(sphere2, 360 * 4 * seq.per, 0, 1.1);
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


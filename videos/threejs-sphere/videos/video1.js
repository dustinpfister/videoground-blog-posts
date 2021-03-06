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
    var grid = scene.userData.grid = new THREE.GridHelper(10, 10, '#ffffff', '#afaf00');
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
    // SPHERE MESH OBJECT WITH ARRAY OF MATERIALS
    // ---------- ----------
    var geometry = new THREE.SphereGeometry(1, 15, 15);
    var position = geometry.attributes.position,
    //len = position.array.length * 2, //!!! this is not a good way to get len it would seem
    len = Math.floor(position.count * 5), // this seems to work for now, but I should still look into this more
    mi = 0,
    i = 0;
    // looking at the state of things here
    len = 1259;
    while (i < len) {
        mi = i / 3 % 4;
        geometry.addGroup(i, 3, mi);
        i += 3;
    }
    var sphere = new THREE.Mesh(geometry, [
        new THREE.MeshPhongMaterial({
            color: 0x880000,
            emissive: 0x181818
        }),
        new THREE.MeshPhongMaterial({
            color: 0x00ff00,
            emissive: 0x1f1f1f
        }),
        new THREE.MeshPhongMaterial({
            color: 0x008800,
            emissive: 0x181818
        }),
        new THREE.MeshPhongMaterial({
            color: 0xff0000,
            emissive: 0x1f1f1f
        })
    ]);
    scene.add(sphere);
    // ---------- ----------
    // ADDITIONAL SPHERE MESH OBJECTS
    // ---------- ----------
    var sphere2 = new THREE.Mesh(
        new THREE.SphereGeometry(0.25, 30,30),
        new THREE.MeshStandardMaterial({color: 0x00ffff}));
    scene.add(sphere2);

    // ---------- ----------
    // Vector3
    // ---------- ----------
    // using apply Euler method to change direction and length
    var setMeshPos = function(mesh, deg1, deg2, vecLength){
        deg1 = deg1 === undefined ? 0 : deg1;
        deh2 = deg2 === undefined ? 0 : deg2;
        vecLength = vecLength === undefined ? 1.25: vecLength;
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
                    setMeshPos(sphere2, 360 * partPer, 0, 1.25);
                }
            },
            {
                secs: 7,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(8 - 6 * partPer, 1 + 1 * partPer, 2 * partPer);
                    camera.lookAt(0, 0, 0);
                    // sphere2 positon
                    setMeshPos(sphere2, 360 * partPer, 45 * partPer, 1.25);
                }
            },
            {
                secs: 5,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(2, 2, 2);
                    camera.lookAt(0, 0, 0);
                    // sphere2 positon
                    setMeshPos(sphere2, 0, 45 - 90 * partPer, 1.25);
                }
            },
            {
                secs: 5,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(2 + 2 * partPer, 2, 2 + 2 * partPer);
                    camera.lookAt(0, 0, 0);
                    // sphere2 positon
                    setMeshPos(sphere2, 360 - 90 * partPer, -45 + 45 * partPer, 1.25);
                }
            },
            {
                secs: 7,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(4 + 4 * partPer, 2, 4);
                    camera.lookAt(0, 0, 0);
                    // sphere2 positon
                    setMeshPos(sphere2, 270, 0, 1.25 + 3 * partPer);
                }
            },
            {
                secs: 3,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(8, 2, 4);
                    camera.lookAt(0, 0, 0);
                    // sphere2 positon
                    setMeshPos(sphere2, 270, 360 * partPer, 4.25 - 3 * partBias);
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


// video1 for threejs-vector3-normalize
 
// scripts
VIDEO.scripts = [
   '../../../js/canvas/r0/canvas.js',
   '../../../js/canvas-text-cube/r0/canvas-text-cube.js',
   '../../../js/sequences-hooks/r1/sequences-hooks.js'
];
// init
VIDEO.init = function(sm, scene, camera){
     //-------- ----------
    // HELPERS
    //-------- ----------
    // create capsule group
    var createCapsuleGroup = function(opt){
        opt = opt || {};
        opt.data = opt.data || [];
        var group = new THREE.Group();
        opt.data.forEach(function(opt, i, arr){
            // create a normalize vector based on the given options for x, y, and z
            // then apply the unit length option using multiplyScalar
            var v = new THREE.Vector3(opt.x, opt.y, opt.z).normalize().multiplyScalar(opt.ul);
            // UNIT LENGTH ( or distance to 0,0,0 ) can be used to 
            // set length attribute of capsule geometry based mesh object
            var geo = new THREE.CapsuleGeometry( 0.1, v.length(), 30, 30 );
            // translate geometry on y by half the vector length
            // also rotate on x by half of unit length
            geo.translate(0, v.length() / 2, 0);
            geo.rotateX(Math.PI * 0.5);
            // creating mesh object
            var mesh = new THREE.Mesh(geo, new THREE.MeshNormalMaterial({ transparent: true, opacity: 0.6}));
            // copy vector to position of mesh object
            // and have the mesh look at the origin
            mesh.position.copy(v);
            mesh.lookAt(0, 0, 0);
            group.add(mesh);
        });
        return group;
    };
    // set to group helper
    var setToGroup = function(groups, mesh, groupIndex, capsuleIndex, alpha){
        var v = new THREE.Vector3();
        var g = groups.children[groupIndex];
        g.children[capsuleIndex].getWorldPosition(v);
        var origin = g.position.clone();
        mesh.position.copy( origin.clone().lerp(v, alpha) );
        mesh.lookAt(g.position);
    };

    //-------- ----------
    // ADD MESH OBJECTS
    //-------- ----------
    // create groups
    var groups = new THREE.Group();
    scene.add(groups);
    // group index 0
    var g = createCapsuleGroup({
        data: [
            {x: 0, y: 1, z: 0, ul: 3},
            {x: 1, y: 0, z: 0, ul: 5},
            {x: 0, y: 0, z: 1, ul: 5},
            {x: 1, y: 1, z: 1, ul: 2},
            {x: -1, y: 0, z: -1, ul: 5},
            {x: -1, y: -1, z: 1, ul: 4}
        ]
    });
    groups.add(g);
    // group index 1
    var g = createCapsuleGroup({
        data: [
            {x: 0, y: 1, z: 0, ul: 4},
            {x: 1, y: 0, z: -1, ul: 3},
            {x: -5, y: 0, z: 0, ul: 3}
        ]
    });
    g.position.set(-4, 0, -5);
    groups.add(g);
    // MESH OBJECT
    var s = 1.0;
    var mesh1 = new THREE.Mesh(new THREE.BoxGeometry(s, s, s), new THREE.MeshNormalMaterial());
    scene.add(mesh1);
    var mesh2 = new THREE.Mesh(new THREE.SphereGeometry(s / 2, 30, 30), new THREE.MeshNormalMaterial());
    scene.add(mesh2);
    var mesh3 = new THREE.Mesh(new THREE.ConeGeometry(s / 2, s * 2, 30, 30), new THREE.MeshNormalMaterial());
    mesh3.geometry.rotateX(Math.PI * 1.5);
    scene.add(mesh3);

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
            ['Normalizing Vector3', 64, 17, 13, 'white'],
            ['instances in', 64, 32, 13, 'white'],
            ['threejs', 64, 47, 13, 'white'],
            ['( r140 08/24/2022 )', 64, 70, 12, 'gray'],
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

                    setToGroup(groups, mesh1, 0, 0, 1);
                    setToGroup(groups, mesh2, 1, 1, 1);
                    setToGroup(groups, mesh3, 0, 5, 1);

                }
            },
            {
                secs: 5,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(8, 1 + 7 * partPer, 8 * partPer);
                    camera.lookAt(0, 0, 0);

                    setToGroup(groups, mesh1, 0, 0, 1 - 0.95 * partPer);
                    setToGroup(groups, mesh2, 1, 1, 1 - 0.95 * partPer);
                    setToGroup(groups, mesh3, 0, 5, 1 - 0.50 * partPer);

                }
            },
            {
                secs: 5,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(8, 8, 8);
                    camera.lookAt(0, 0, 0);
                    var b = seq.getSinBias(2),
                    b2 = seq.getSinBias(3);
                    setToGroup(groups, mesh1, 0, 0, 0.05 + 0.95 * b);
                    setToGroup(groups, mesh2, 1, 1, 0.05 + 0.95 * partPer);
                    setToGroup(groups, mesh3, 0, 5, 0.50 + 0.5 * b2);
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


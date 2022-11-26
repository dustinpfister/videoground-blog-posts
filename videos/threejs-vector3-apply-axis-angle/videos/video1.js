// video1 for threejs-vector3-apply-axis-angle

// scripts
VIDEO.scripts = [
   '../../../js/sequences-hooks/r2/sequences-hooks.js',
   '../../../js/canvas/r1/canvas.js',
   '../../../js/canvas-text-cube/r1/canvas-text-cube.js',
   '../../../js/curve/r0/curve.js'
];
// init
VIDEO.init = function(sm, scene, camera){
    // ---------- ---------- ----------
    // HELPERS
    // ---------- ---------- ----------
    // make a single mesh object
    const makeMesh = () => {
        const mesh = new THREE.Mesh(
            new THREE.ConeGeometry(0.5, 1, 30, 30),
            new THREE.MeshNormalMaterial());
        mesh.geometry.rotateX(Math.PI * 0.5);
        mesh.position.set(1, 0, 1);
        return mesh;
    };
    // update a group by an alpha value
    const updateGroup = (group, alpha) => {
        const len = group.children.length;
        const gud = group.userData;
        group.children.forEach( (mesh, i) => {
            const v = gud.v;
            const degree = gud.angle / len * i * alpha;
            mesh.position.set(1, 0, 0).applyAxisAngle(v.normalize(), Math.PI / 180 * degree).multiplyScalar(gud.unitLen);
            mesh.lookAt(0, 0, 0);
        });
    };
    // make a group of mesh objects
    const makeGroup = (opt) => {
        opt = opt || {};
        opt.count = opt.count === undefined ? 10 : opt.count;
        const group = new THREE.Group();
        const gud = group.userData;
        gud.v = opt.v || new THREE.Vector3(0, 1, 0);
        gud.angle = opt.angle === undefined ? 360 : opt.angle;
        gud.unitLen = opt.unitLen === undefined ? 1 : opt.unitLen;
        let i = 0;
        while(i < opt.count){
            group.add( makeMesh() );
            i += 1;
        }
        updateGroup(group, 1);
        return group;
    };
    // ---------- ---------- ----------
    // GROUP
    // ---------- ---------- ----------
    const group1 = makeGroup( { count: 10, angle: 360, v: new THREE.Vector3(0, 1, 0), unitLen: 5 } );
    scene.add(group1);
    const group2 = makeGroup( { count: 10, angle: 270, v: new THREE.Vector3(0, 1, 1), unitLen: 5  } );
    scene.add(group2);
    const group3 = makeGroup( { count: 10, angle: 360, v: new THREE.Vector3(1, 1, 0), unitLen: 5  } );
    scene.add(group3);
    //-------- ----------
    // BACKGROUND
    //-------- ----------
    scene.background = new THREE.Color('#2a2a2a');
    //-------- ----------
    // GRID
    //-------- ----------
    const grid = scene.userData.grid = new THREE.GridHelper(10, 10, '#ffffff', '#00afaf');
    grid.material.linewidth = 3;
    scene.add( grid );
    //-------- ----------
    // TEXT CUBE
    //-------- ----------
    const textCube = scene.userData.textCube = CanvasTextCube.create({
        bg: '#000000',
        size: 128,
        lineWidth: 7,
        lineColor: 'rgba(0,100,0,0.8)',
        lineCount: 9,
        lines: [
            ['Vector3 apply', 64, 17, 14, 'white'],
            ['Axis Angle', 64, 32, 14, 'white'],
            ['Method', 64, 47, 14, 'white'],
            ['( r140 11/26/2022 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);
    // A SEQ FOR TEXT CUBE
    const seq_textcube = seqHooks.create({
        setPerValues: false,
        fps: 30,
        beforeObjects: function(seq){
            const textCube = scene.userData.textCube;
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
    //-------- ----------
    // A MAIN SEQ OBJECT
    //-------- ----------
/*
    const v3Array_campos = QBV3Array([
        [8,8,8, 7,-2,-7,    2,0,0,      20],
        [7,-2,-7, -8,4,0,   0,0,0,      25],
        [-8,4,0, 8,8,8,     0,0,0,      50]
    ]);
    // PATH DEBUG POINTS
    const points_debug = new THREE.Points(
        new THREE.BufferGeometry().setFromPoints(v3Array_campos),
        new THREE.PointsMaterial({size: 0.25, color: new THREE.Color(0,1,0)})
    );
    scene.add(points_debug);
*/
    // start options for main seq object
    const opt_seq = {
        fps: 30,
        beforeObjects: function(seq){
            textCube.visible = false;
            camera.position.set(8, 1, 0);
            camera.zoom = 1;
            // update groups
            const a2 = seq.getSinBias(4, false);
            updateGroup(group1, a2);
            updateGroup(group2, a2);
            updateGroup(group3, a2);
        },
        afterObjects: function(seq){
            camera.updateProjectionMatrix();
        },
        objects: []
    };
    // SEQ 0 - ...
    opt_seq.objects[0] = {
        secs: 3,
        update: function(seq, partPer, partBias){
            // textcube
            if(seq.partFrame < seq.partFrameMax){
               seqHooks.setFrame(seq_textcube, seq.partFrame, seq.partFrameMax);
            }
            // camera
            //camera.position.set(5, 18, 14);
            camera.lookAt(0, 0, 0);
        }
     };
    // SEQ 1 - ...
    opt_seq.objects[1] = {
        secs: 27,
        update: function(seq, partPer, partBias){
            // camera
            const v1 = new THREE.Vector3(8, 1, 0);
            const v2 = new THREE.Vector3(8, 8, 8);
            camera.position.copy( v1.lerp(v2, partPer) );
            camera.lookAt(0, 0, 0);
        }
    };
/*
    // SEQ 2 - ...
    opt_seq.objects[2] = {
        secs: 5,
        v3Paths: [
            { key: 'campos', array: v3Array_campos, lerp: true }
        ],
        update: function(seq, partPer, partBias){
            // camera
            seq.copyPos('campos', camera);
            camera.lookAt(0, 0, 0);
        }
    };
*/
    const seq = scene.userData.seq = seqHooks.create(opt_seq);
    console.log('frameMax for main seq: ' + seq.frameMax);
    sm.frameMax = seq.frameMax;
};
// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
    const seq = scene.userData.seq;
    seqHooks.setFrame(seq, sm.frame, sm.frameMax);
};
 
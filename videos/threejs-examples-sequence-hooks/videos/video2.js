// video2 for threejs-examples-sequence-hooks
 
// scripts
VIDEO.scripts = [
   '../../../js/sequences-hooks/r2/sequences-hooks.js',
   '../../../js/canvas/r1/canvas.js',
   '../../../js/canvas-text-cube/r1/canvas-text-cube.js',
   '../../../js/sphere-mutate/r2/sphere-mutate.js'
];
// init
VIDEO.init = function(sm, scene, camera){
    //-------- ----------
    // HELPERS
    //-------- ----------
    // just a short hand for THREE.QuadraticBezierCurve3
    const QBC3 = function(x1, y1, z1, x2, y2, z2, x3, y3, z3){
        let vs = x1;
        let ve = y1;
        let vc = z1;
        if(arguments.length === 9){
            vs = new THREE.Vector3(x1, y1, z1);
            ve = new THREE.Vector3(x2, y2, z2);
            vc = new THREE.Vector3(x3, y3, z3);
        }
        return new THREE.QuadraticBezierCurve3( vs, vc, ve );
    };
    // QBDelta helper using QBC3
    // this works by giving deltas from the point that is half way between
    // the two start and end points rather than a direct control point for x3, y3, and x3
    const QBDelta = function(x1, y1, z1, x2, y2, z2, x3, y3, z3) {
        const vs = new THREE.Vector3(x1, y1, z1);
        const ve = new THREE.Vector3(x2, y2, z2);
        // deltas
        const vDelta = new THREE.Vector3(x3, y3, z3);
        const vc = vs.clone().lerp(ve, 0.5).add(vDelta);
        const curve = QBC3(vs, ve, vc);
        return curve;
    };
    // QBV3Array
    const QBV3Array = function(data) {
        const v3Array = [];
        data.forEach( ( a ) => {
            const curve = QBDelta.apply(null, a.slice(0, a.length - 1))
            v3Array.push( curve.getPoints( a[9]) );
        })
        return v3Array.flat();
    };
    //-------- ----------
    // V3 ARRAYS
    //-------- ----------
    const v3Array_campos = QBV3Array([
        [8,1,0, 8,8,8,      4,4,5,      20],
        [8,8,8, -8,4,0,   -5,-2,0,      25],
        [-8,4,0, 0,0,-8,   -14,2,-9,      50]
    ]);
    const v3Array_camlook = QBV3Array([
        [0,0,0, 5,0,-5,      1,0,1,      25],
        [5,0,-5, -5,0,-5,     0,0,-3,      25],
        [-5,0,-5, -2,0,1,     3,0,0,      50]
    ]);

    //-------- ----------
    // POINTS
    //-------- ----------
    const points_campos = new THREE.Points(
        new THREE.BufferGeometry().setFromPoints(v3Array_campos),
        new THREE.PointsMaterial({color: new THREE.Color(0,1,0), size: 0.75 })
    );
    scene.add(points_campos);
    const points_camlook = new THREE.Points(
        new THREE.BufferGeometry().setFromPoints(v3Array_camlook),
        new THREE.PointsMaterial({color: new THREE.Color(0,1,1), size: 0.75 })
    );
    scene.add(points_camlook);


    //-------- ----------
    //  SPHERE MUTATE MESH OBJECTS, UPDATE OPTIONS
    //-------- ----------
    const updateOpt1 = {
        forPoint : function(vs, i, x, y, mesh, alpha){
            const mud = mesh.userData;
            const state = mud.state = mud.state === undefined ? [] : mud.state;
            if(!state[i]){
                const size = mesh.geometry.parameters.radius;
                const ud = mesh.userData.ud === undefined ? 0.2 : mesh.userData.ud;
                state[i] = {
                    v: vs.clone().normalize().multiplyScalar(size + ud * Math.random()),
                    count: 1 + Math.floor( Math.random() * 9 ),
                    offset: Math.random()
                };
            }
            const alpha2 = (state[i].offset + state[i].count * alpha) % 1;
            const alpha3 = 1 - Math.abs(0.5 - alpha2) / 0.5;
            return vs.lerp(state[i].v, alpha3);
        }
    };
    const material_sphere = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide, transparent: true, opacity:0.8 });
    const mesh1 = sphereMutate.create({
        size: 30, w: 40, h: 40, material: material_sphere
    });
    mesh1.userData.ud = 10;
    scene.add(mesh1);
    sphereMutate.update(mesh1, 1, updateOpt1);


    const mesh2 = sphereMutate.create({
        size: 2, w: 40, h: 40, material: material_sphere
    });
    mesh2.userData.ud = 0.8;
    mesh2.position.set(-1, 0, -3);
    scene.add(mesh2);
    sphereMutate.update(mesh2, 1, updateOpt1);


    //-------- ----------
    // BACKGROUND
    //-------- ----------
    scene.background = new THREE.Color('#ffffff');
    //-------- ----------
    // GRID
    //-------- ----------
    const grid = scene.userData.grid = new THREE.GridHelper(30, 30, '#000000', '#000000');
    grid.material.linewidth = 3;
    grid.material.transparent = true;
    grid.material.opacity = 0.3;
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
            ['Sequence hooks', 64, 17, 14, 'white'],
            ['r2', 64, 32, 14, 'white'],
            ['threejs example', 64, 47, 14, 'white'],
            ['( r140 10/26/2022 )', 64, 70, 12, 'gray'],
            ['video2', 64, 100, 10, 'gray']
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
            textCube.position.set(5.5, 0.7, 0);
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
                    textCube.position.set(5.5, 0.7 + 1 * partPer, 0);
                    textCube.rotation.y = Math.PI * 2 * partPer;
                    textCube.material.opacity = 1.0 - partPer;
                }
            }
        ]
    });
    //-------- ----------
    // A MAIN SEQ OBJECT
    //-------- ----------
    const seq = scene.userData.seq = seqHooks.create({
        fps: 30,
        beforeObjects: function(seq){
            textCube.visible = false;
            camera.position.set(8, 1, 0);
            sphereMutate.update(mesh1, seq.per, updateOpt1);
            sphereMutate.update(mesh2, seq.per, updateOpt1);
        },
        afterObjects: function(seq){
            camera.updateProjectionMatrix();
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
                    camera.position.set(14, 14, 14);
                    camera.lookAt(0, 0, 0);
                    camera.zoom = 1 + 0.6 * partPer;
                }
            },
            {
                secs: 17,
                v3Paths: [
                    { key: 'campos', array: v3Array_campos, lerp: true },
                    { key: 'camlook', array: v3Array_camlook, lerp: true }
                ],
                update: function(seq, partPer, partBias){
                    // camera
                    seq.copyPos('campos', camera);
                    camera.lookAt(seq.getPos('camlook', camera));
                    camera.zoom = 1.6 - 0.2 * partPer;
                }
            },
            {
                secs: 10,
                update: function(seq, partPer, partBias){
                    const v1 = new THREE.Vector3(0,0,-8);
                    const v2 = new THREE.Vector3(17, 10, -17);
                    // camera
                    camera.position.copy(v1).lerp(v2, partPer);
                    const v3 = new THREE.Vector3(-5,0,5);
                    const v4 = new THREE.Vector3(0, 0, 0);
                    camera.lookAt( v3.lerp(v4, partPer) );
                    camera.zoom = 1.4 - 0.6 * partPer;
                }
            }
        ]
    });
    console.log('frameMax for main seq: ' + seq.frameMax);
    sm.frameMax = seq.frameMax;
};
 
// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
    const seq = scene.userData.seq;
    seqHooks.setFrame(seq, sm.frame, sm.frameMax);
};
 
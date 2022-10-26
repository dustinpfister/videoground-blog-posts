// video2 for threejs-examples-sequence-hooks
 
// scripts
VIDEO.scripts = [
   '../../../js/sequences-hooks/r2/sequences-hooks.js',
   '../../../js/canvas/r1/canvas.js',
   '../../../js/canvas-text-cube/r1/canvas-text-cube.js'
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
        [8,1,0, 8,8,8,      4,4,5,      25],
        [8,8,8, -8,4,0,   -5,-2,0,      50],
        [-8,4,0, 0,0,-8,   -14,2,-9,      25]
    ]);
    const v3Array_camlook = QBV3Array([
        [0,0,0, -2,0,-5,      2,0,-2,      25],
        [-2,0,-5, -5,0,5,      -5,0,-5,      50]
    ]);

    //-------- ----------
    // POINTS
    //-------- ----------
    const points_campos = new THREE.Points(
        new THREE.BufferGeometry().setFromPoints(v3Array_campos),
        new THREE.PointsMaterial({color: new THREE.Color(0,0,1), size: 0.25 })
    );
    scene.add(points_campos);
    const points_camlook = new THREE.Points(
        new THREE.BufferGeometry().setFromPoints(v3Array_camlook),
        new THREE.PointsMaterial({color: new THREE.Color(0,1,1), size: 0.5 })
    );
    scene.add(points_camlook);


    //-------- ----------
    // BACKGROUND
    //-------- ----------
    scene.background = new THREE.Color('#2a2a2a');
    //-------- ----------
    // GRID
    //-------- ----------
    const grid = scene.userData.grid = new THREE.GridHelper(10, 10, '#ffffff', '#ffffff');
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
    const seq = scene.userData.seq = seqHooks.create({
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
                    camera.position.set(14, 14, 14);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 27,
                v3Paths: [
                    { key: 'campos', array: v3Array_campos, lerp: true },
                    { key: 'camlook', array: v3Array_camlook, lerp: true }
                ],
                update: function(seq, partPer, partBias){
                    // camera
                    seq.copyPos('campos', camera);
                    camera.lookAt(seq.getPos('camlook', camera));
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
 
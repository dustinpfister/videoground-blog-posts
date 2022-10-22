// video1 for threejs-curve-quadratic-bezier-curve3
 
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
    // make a curve path
    const createCurvePath = (data) => {
        const curvePath = new THREE.CurvePath();
        data.forEach((a)=>{
            const v1 = new THREE.Vector3(a[0], a[1], a[2]);       // start
            const v2 = new THREE.Vector3(a[3], a[4], a[5]);       // end
            const vControl = new THREE.Vector3(a[6], a[7], a[8]); // control
            curvePath.add( new THREE.QuadraticBezierCurve3( v1, vControl, v2) );
        });
        return curvePath;
    };
    // get a point along a curve path using a getAlpha method
    const getPoint = (cp, rawAlpha, getAlpha) => {
        rawAlpha = rawAlpha === undefined ? 0 : rawAlpha;
        getAlpha = getAlpha || function(rawAlpha){
            return rawAlpha
        };
        const alpha = getAlpha(rawAlpha);
        return cp.getPoint(alpha);
    };
    // create a v3 array
    const createV3Array = (cp, pointCount, getAlpha) => {
        let i = 0;
        const v3Array = [];
        while(i < pointCount){
           const alpha = i / pointCount;
           v3Array.push( getPoint(cp, alpha, getAlpha) );
           i += 1;
        }
        return v3Array;
    };
    // create points from v3 array
    const createPoints = (cp, color, pointCount, getAlpha) => {
        color = color || 0xffffff;
        const geometry = new THREE.BufferGeometry();
        const points = createV3Array(cp, pointCount, getAlpha);
        geometry.setFromPoints(points);
        return new THREE.Points(geometry, new THREE.PointsMaterial({color: color, size: 0.125 }));
    };
    //-------- ----------
    // CURVE PATHS
    //-------- ----------
    const POINT_COUNT = 400;
    const cp_pos1 = createCurvePath([
        [5,0,5, 0,1,-5, 5,0.5,-5],
        [0,1,-5, -5,3,-5, -3,0.75,-5]
    ]);
    const cp_pos2 = createCurvePath([
        [5,1,5, 0,2,-5, 5,1.5,-5],
        [0,2,-5, -5,4,-5, -3,1.75,-5]
    ]);
    const cp_pos3 = createCurvePath([
        [5,2,5, 0,3,-5, 5,2.5,-5],
        [0,3,-5, -5,5,-5, -3,2.75,-5]
    ]);
    const cp_pos4 = createCurvePath([
        [5,3,5, 0,4,-5, 5,3.5,-5],
        [0,4,-5, -5,6,-5, -3,3.75,-5]
    ]);
    // damp alpha
    const dampAlpha = (rawAlpha) => {
        return 1 - THREE.MathUtils.damp(0, 1, 8, 1 - rawAlpha);
    };
    // smooth alpha
    const smoothAlpha = (rawAlpha) => {
        return THREE.MathUtils.smoothstep(rawAlpha, 0, 1);
    };
    // curve Alpha
    const curveAlpha = (function(){
        const curve = new THREE.QuadraticBezierCurve(
            new THREE.Vector2( 0, 0 ),
            new THREE.Vector2( 2, 0 ),
            new THREE.Vector2( 10, 10 )
        );
        return function(rawAlpha){
            const pt = curve.getPoint(rawAlpha);
            return pt.y / 10;
        };
    }());
    //-------- ----------
    // POINTS
    //-------- ----------
    scene.add( createPoints( cp_pos1, 0xff0000, POINT_COUNT) );
    scene.add( createPoints( cp_pos2, 0x00ff00, POINT_COUNT, dampAlpha ) );
    scene.add( createPoints( cp_pos3, 0x0000ff, POINT_COUNT, smoothAlpha ) );
    scene.add( createPoints( cp_pos4, 0x00ffff, POINT_COUNT, curveAlpha ) );
    //-------- ----------
    // GRID, MESH
    //-------- ----------
    const mesh1 = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshNormalMaterial());
    scene.add(mesh1);
    const mesh2 = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshNormalMaterial());
    scene.add(mesh2);
    const mesh3 = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshNormalMaterial());
    scene.add(mesh3);
    const mesh4 = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshNormalMaterial());
    scene.add(mesh4);
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
            ['Quadratic Bezier', 64, 17, 14, 'white'],
            ['Curve in', 64, 32, 14, 'white'],
            ['threejs', 64, 47, 14, 'white'],
            ['( r140 10/22/2022 )', 64, 70, 12, 'gray'],
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
    const update = function(alpha){
        const b = 1 - Math.abs(0.5 - alpha) / 0.5;
        // uisng the get Point method here
        const v1 = getPoint(cp_pos1, b);
        mesh1.position.copy(v1);
        mesh1.lookAt(0, 0, 0);
        const v2 = getPoint(cp_pos2, b, dampAlpha);
        mesh2.position.copy(v2);
        mesh2.lookAt(0, 0, 0);
        const v3 = getPoint(cp_pos3, b, smoothAlpha);
        mesh3.position.copy(v3);
        mesh3.lookAt(0, 0, 0);
        const v4 = getPoint(cp_pos4, b, curveAlpha);
        mesh4.position.copy(v4);
        mesh4.lookAt(0, 0, 0);
    };
    const seq = scene.userData.seq = seqHooks.create({
        fps: 30,
        beforeObjects: function(seq){
update(seq.getPer(2, false))
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

                v3Paths: [
                    {
                        key: 'campos',
                        array: [8,1,0, -8,8,8],
                        lerp: true
                    }
                ],

                update: function(seq, partPer, partBias){
                    // camera
                    seq.copyPos('campos', camera);
                    camera.lookAt(0, 3 * partPer, 0);
                }
            },
            {
                secs: 5,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(-8, 8, 8);
                    camera.lookAt(0, 3, 0);
                }
            },
            {
                secs: 20,
                update: function(seq, partPer, partBias){
                    // camera
                    var v1 = new THREE.Vector3(-8, 8, 8);
                    var v2 = mesh4.position.clone().add( new THREE.Vector3(-2,0,1) );
                    camera.position.copy(v1).lerp(v2, partPer);

                    var v3 = new THREE.Vector3(0, 3, 0);
                    camera.lookAt( v3.clone().lerp(v2, partPer) );
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
 
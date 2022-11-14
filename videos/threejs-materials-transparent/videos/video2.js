// video2 for threejs-materials-transparent
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
    // HELPERS
    //-------- ----------
    const createCube = (size, material, x, y, z) => {
        const geometry = new THREE.BoxGeometry(size, size, size),
        cube = new THREE.Mesh(geometry, material);
        cube.position.set(x, y, z);
        return cube;
    };
    const createCanvasTexture = (draw, size) => {
        const canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d');
        canvas.width = size || 64;
        canvas.height = size || 64;
        draw(ctx, canvas);
        return new THREE.CanvasTexture(canvas);
    };
    //-------- ----------
    // TEXTURE
    //-------- ----------
    const canObj_rnd = canvasMod.create({
        size: 64,
        update_mode: 'canvas',
        palette: [ '#ffdd00', '#eecc00', '#ddaa00', '#cc9900', '#aa8800', '#997700', '#886600', '#553300'],
        state: {
            gSize: 20
        },
        draw: 'rnd'
    });
    const draw_trans = (canObj, ctx, canvas, state) => {
        // base color background
        ctx.fillStyle = 'rgba(255,255,255,1)';
        // using rnd canvas for soem base tetxure
        ctx.fillRect(0,0, canvas.width, canvas.height);
        ctx.drawImage(canObj_rnd.canvas, 0, 0, canvas.width, canvas.height);
        // CLEAR RECT CAN BE USED TO SET AN AREA AS TRANSPARENT
        // THEN FILL WITH AN rgba STYLE
        ctx.clearRect(6, 6, 24, 24);
        ctx.fillStyle = 'rgba(0,255,255,0.4)';
        ctx.fillRect(6, 6, 24, 24);
        // can also rotate
        ctx.save();
        ctx.translate(34 + 7, 34 + 7);
        ctx.rotate( Math.PI / 180 * 45 );
        ctx.clearRect(-12, -12, 24, 24);
        ctx.fillStyle = 'rgba(0,255,255,0.4)';
        ctx.fillRect(-12, -12, 24, 24);
        ctx.restore();
        // FRAME
        ctx.strokeStyle = 'rgba(0,0,0,1)';
        ctx.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);
    };
    const canObj_trans = canvasMod.create({
        size: 64,
        update_mode: 'canvas',
        draw: draw_trans
    });
    //-------- ----------
    // MATERIAL
    //-------- ----------
    const material =  new THREE.MeshBasicMaterial({
        color: new THREE.Color(1, 1, 1),
        map: canObj_trans.texture,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 1
    });
    //-------- ----------
    // MESH
    //-------- ----------
    const cube = createCube(3, material, 0, 0, 0);
    scene.add(cube);
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
        lineColor: 'rgba(100,100,0,1)',
        lineCount: 9,
        lines: [
            ['Transparent', 64, 17, 14, 'white'],
            ['Materials', 64, 32, 14, 'white'],
            ['in Threejs', 64, 47, 14, 'white'],
            ['( r140 11/14/2022 )', 64, 70, 12, 'gray'],
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
                    textCube.material.opacity = 0.9;
                }
            },
            {
                per: 0.75,
                update: function(seq, partPer, partBias){
                    // move up text cube
                    textCube.visible = true;
                    textCube.position.set(6, 0.8 + 1 * partPer, 0);
                    textCube.rotation.y = Math.PI * 2 * partPer;
                    textCube.material.opacity = 0.9 - 0.9 * partPer;
                }
            }
        ]
    });
    //-------- ----------
    // A MAIN SEQ OBJECT
    //-------- ----------
    const v3Array_campos = QBV3Array([
        [8,1,0, 5,2,5,    5,0.5,0,      30],
        [5,2,5, -5,2,5,    -1,0,2,      50],
        [-5,2,5, -5,1,-5,    -5,0,2.5,      60]
    ]);
    // PATH DEBUG POINTS
    //const points_debug = new THREE.Points(
    //    new THREE.BufferGeometry().setFromPoints(v3Array_campos),
    //    new THREE.PointsMaterial({size: 0.25, color: new THREE.Color(0,1,0)})
    //);
    //scene.add(points_debug);
    // start options for main seq object
    const opt_seq = {
        fps: 30,
        beforeObjects: function(seq){
            textCube.visible = false;
            camera.position.set(8, 1, 0);
            camera.zoom = 1;
            cube.rotation.x = Math.PI / 180 * 90 * seq.per;
            cube.rotation.y = Math.PI * 4 * seq.per;
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
            //camera.position.set(-10, 10, 1);
            //camera.lookAt(-5, 2, 5);
            camera.lookAt(0,0,0)
        }
     };
    // SEQ 1 - ...
    opt_seq.objects[1] = {
        secs: 27,
        v3Paths: [
            { key: 'campos', array: v3Array_campos, lerp: true }
        ],
        update: function(seq, partPer, partBias){
            // camera
            seq.copyPos('campos', camera);
            camera.lookAt(0, 0, 0);
        }
    };
    const seq = scene.userData.seq = seqHooks.create(opt_seq);
    console.log('frameMax for main seq: ' + seq.frameMax);
    sm.frameMax = seq.frameMax;
};
// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
    const seq = scene.userData.seq;
    seqHooks.setFrame(seq, sm.frame, sm.frameMax);
};
 
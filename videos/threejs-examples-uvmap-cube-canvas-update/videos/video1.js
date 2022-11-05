// video1 for threejs-examples-uvmap-cube-canvas-update
VIDEO.scripts = [
   '../../../js/sequences-hooks/r2/sequences-hooks.js',
   '../../../js/canvas/r1/canvas.js',
   '../../../js/canvas-text-cube/r1/canvas-text-cube.js',
   '../../../js/canvas-uvmap-cube/r0/uvmap-cube.js'
];
// init
VIDEO.init = function(sm, scene, camera){
    //-------- ----------
    // HELPERS
    //-------- ----------
    const wrap = function (value, a, b){
        // get min and max this way
        let max = Math.max(a, b);
        let min = Math.min(a, b);
        // return 0 for Wrap(value, 0, 0);
        if(max === 0 && min === 0){
             return 0;
        }
        let range = max - min;
        return (min + ((((value - min) % range) + range) % range));
    };
    // wrap an axis
    const wrapAxis = function(vec, vecMin, vecMax, axis){
        axis = axis || 'x';
        vec[axis] = wrap( vec[axis], vecMin[axis], vecMax[axis] );
        return vec;
    };
    const createRandomPoints = (count, vRange) => {
         const points = [];
         let i = 0;
         while(i < count){
             const x = vRange.x * THREE.MathUtils.seededRandom();
             const y = vRange.y * THREE.MathUtils.seededRandom();
             points.push( new THREE.Vector2(x, y) );
             i += 1;
         }
         return points;
    };
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
    // CANVAS.JS DRAW METHODS
    //-------- ----------
    const draw_one = (canObj, ctx, canvas, state) => {
        ctx.fillStyle = canObj.palette[0];
        ctx.strokeStyle = canObj.palette[1];
        ctx.lineWidth = 2;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        state.points.forEach( (v2, i) => {
            const ci = state.colorIndices[i];
            ctx.fillStyle = canObj.palette[ci];
            ctx.beginPath();
            ctx.arc(v2.x, v2.y, state.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        });
    };
    const draw_one_update = (canObj, alpha) => {
         const points = canObj.state.points;
         const count = points.length;
         let i = 0;
         while(i < count){
             const pt = points[i];
             const pt_start = canObj.state.points_start[i];
             const dir = canObj.state.dirs[i];
             const dist = canObj.state.dists[i];
             pt.x = pt_start.x + dist * dir.x * alpha;
             pt.y = pt_start.y + dist * dir.y * alpha;
             wrapAxis(pt, new THREE.Vector2(0,0), new THREE.Vector2(128,128), 'x');
             wrapAxis(pt, new THREE.Vector2(0,0), new THREE.Vector2(128,128), 'y');
             i += 1;
         }
    };
    //-------- ----------
    // SOURCE CANVAS OBJECTS
    //-------- ----------
    const points = createRandomPoints(400, new THREE.Vector2(128, 128));
    const palette = ['white', 'black', 'red', 'lime', 'blue', 'orange', 'green', 'cyan', 'purple'];
    const canOpt1 = {
            draw: draw_one, 
            update_mode: 'canvas', 
            palette: palette, 
            size: 128, 
            state:{
                radius: 6,
                points: points,
                points_start: points.map( (v2) =>{ return v2.clone(); }),
                colorIndices: points.map( (v2) => {
                    return Math.floor( 2 + ( palette.length - 2 ) * THREE.MathUtils.seededRandom() );
                }),
                dists: points.map( (v2) => {
                     return Math.floor( 64 + ( 512 - 64 ) * THREE.MathUtils.seededRandom() );
                }),
                dirs: points.map( (v2) => {
                    const radian = Math.PI * 2 * THREE.MathUtils.seededRandom();
                    const vul = 1; 
                    const dx = Math.cos(radian) * vul;
                    const dy = Math.sin(radian) * vul;
                    return new THREE.Vector2(dx, dy);
                })
            }
    };
    const canObj1 = canvasMod.create( canOpt1 );
    //-------- ----------
    // CREATE MESH
    //-------- ----------
    const mesh = uvMapCube.create({
        pxa: 0,
        images: [ 
            canObj1.canvas
        ]
    });
    mesh.position.set(0, 0, 0);
    mesh.material.emissiveIntensity = 0.1;
    scene.add(mesh);
    //-------- ----------
    // PLANE
    //-------- ----------
    const plane1 = new THREE.Mesh(
        new THREE.PlaneGeometry(2, 2, 1, 1),
        new THREE.MeshBasicMaterial({
            map: mesh.material.map,
            side: THREE.DoubleSide
        })
    );
    plane1.rotation.y = Math.PI / 180 * 45;
    plane1.position.set(-2, 0, -1);
    scene.add(plane1);
    const plane2 = new THREE.Mesh(
        new THREE.PlaneGeometry(2, 2, 1, 1),
        new THREE.MeshBasicMaterial({
            map: canObj1.texture,
            side: THREE.DoubleSide
        })
    );
    plane2.rotation.y = Math.PI / 180 * -45;
    plane2.position.set(2, 0, -1);
    scene.add(plane2);
    //-------- ----------
    // SPHERE
    //-------- ----------
    const sphere = new THREE.Mesh( new THREE.SphereGeometry(60, 30, 30),
        new THREE.MeshPhongMaterial({
            side : THREE.DoubleSide,
            map: canObj1.texture,
            transparent: true,
            opacity: 0.5
        })
    );
    sphere.rotation.y = Math.PI / 180 * 90;
    scene.add(sphere)
    //-------- ----------
    // BACKGROUND
    //-------- ----------
    scene.background = new THREE.Color(0.8, 0.8, 0.8);  //mesh.material.map; //canObj1.texture;
    //-------- ----------
    // LIGHT
    //-------- ----------
    const dl = new THREE.DirectionalLight(0xffffff, 1);
    dl.position.set(3, 2, 1);
    scene.add(dl);
    //-------- ----------
    // GRID
    //-------- ----------
    //const grid = scene.userData.grid = new THREE.GridHelper(10, 10, '#00ff00', '#ffffff');
    //grid.material.linewidth = 4;
    //grid.material.transparent = true;
    //grid.material.opacity = 0.25;
    //scene.add( grid );
    //-------- ----------
    // PATHS
    //-------- ----------
    const v3Array_campos = QBV3Array([
        [8,1,0, 0,1,-5,    5,0,-3,      60],
        [0,1,-5, 0,2,4,    -6,0,-3,      60]
    ]);
    // PATH DEBUG POINTS
    //const points_debug = new THREE.Points(
    //    new THREE.BufferGeometry().setFromPoints(v3Array_campos),
    //    new THREE.PointsMaterial({size: 0.25, color: new THREE.Color(0,1,0)})
    //);
    //scene.add(points_debug);
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
            ['UV map cube', 64, 17, 14, 'white'],
            ['Threejs module', 64, 32, 14, 'white'],
            ['Example', 64, 47, 14, 'white'],
            ['( r140 11/04/2022 )', 64, 70, 12, 'gray'],
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
                    textCube.material.opacity = 0.8;
                }
            },
            {
                per: 0.75,
                update: function(seq, partPer, partBias){
                    // move up text cube
                    textCube.visible = true;
                    textCube.position.set(6, 0.8 + 1 * partPer, 0);
                    textCube.rotation.y = Math.PI * 2 * partPer;
                    textCube.material.opacity = 0.8 - 0.8 * partPer;
                }
            }
        ]
    });
    //-------- ----------
    // A MAIN SEQ OBJECT
    //-------- ----------
    // start options for main seq object
    const opt_seq = {
        fps: 30,
        beforeObjects: function(seq){
            textCube.visible = false;
            camera.position.set(8, 1, 0);
            camera.zoom = 1;
            draw_one_update(canObj1, seq.per);
            canvasMod.update(canObj1);
            uvMapCube.drawFace(mesh, 'front', {i:0, sx: 32, sy: 32, sw: 32, sh: 32});
            uvMapCube.drawFace(mesh, 'back', {i:0, sx: 96, sy: 32, sw: 32, sh: 32});
            uvMapCube.drawFace(mesh, 'left', {i:0, sx: 64, sy: 32, sw: 32, sh: 32});
            uvMapCube.drawFace(mesh, 'right', {i:0, sx: 0, sy: 32, sw: 32, sh: 32});
            uvMapCube.drawFace(mesh, 'top', {i:0, sx: 32, sy: 0, sw: 32, sh: 32});
            uvMapCube.drawFace(mesh, 'bottom', {i:0, sx: 32, sy: 64, sw: 32, sh: 32});
            mesh.rotation.x = Math.PI / 180 * -180 * seq.per;
            mesh.rotation.y = Math.PI * 4 * seq.per;
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
            //camera.position.set(10, 10, 10);
            camera.lookAt(0, 0, 0);
        }
     };
    // SEQ 1 - ...
    opt_seq.objects[1] = {
        secs: 7,
        v3Paths: [
            { key: 'campos', array: v3Array_campos, lerp: true }
        ],
        update: function(seq, partPer, partBias){
            // camera
            seq.copyPos('campos', camera);
            camera.lookAt(0, 0, 0);
        }
    };
    // SEQ 2 - ...
    opt_seq.objects[2] = {
        secs: 20,
        v3Paths: [
            { key: 'campos', array: [
                0, 2, 4,
                0, 1, 4,
                -5, 1, 4,
                -2, -2, 4,
                0, -5, 4,
                2, 1, 4,
                5, 5, 5
             ], lerp: true }
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
 
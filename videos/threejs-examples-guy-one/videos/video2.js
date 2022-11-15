// video2 for threejs-examples-guy-one
// scripts
VIDEO.scripts = [
   '../../../js/sequences-hooks/r2/sequences-hooks.js',
   '../../../js/canvas/r1/canvas.js',
   '../../../js/canvas-text-cube/r1/canvas-text-cube.js',
   './guy.js'
];
// init
VIDEO.init = function(sm, scene, camera){
    //-------- ----------
    // LIGHT
    //-------- ----------
    const pl = new THREE.PointLight(0xffffff, 1);
    pl.position.set(3, 2, 1);
    scene.add(pl);
    const al = new THREE.AmbientLight(0xffffff, 0.15);
    scene.add(al);
    //-------- ----------
    // TEXTURE
    //-------- ----------
    const palette = ['#444444', '#888888', '#aaaaaa', '#ffffff'];
    const canObj_guy = canvasMod.create({ palette: palette, size: 128, state:{ gSize: 30}, draw: 'rnd'});
    //-------- ----------
    // HELPERS
    //-------- ----------
    // create guy helper
    const createGuy = (scale) => {
        const guy = new Guy();
        const gud =  guy.group.userData;
        gud.scale = scale;
        guy.group.scale.set(scale, scale, scale);
        // using set to plain surface
        setGuyPos(guy);
        return guy;
    };
    // get guy size helper
    const getGuySize = (guy) => {
        const b3 = new THREE.Box3();
        b3.setFromObject(guy.group);
        const v3_size = new THREE.Vector3();
        b3.getSize(v3_size);
        return v3_size;
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
    // set guy pos using box3 and userData object
    const setGuyPos = (guy, v3_pos) => {
        v3_pos = v3_pos || new THREE.Vector3();
        const gud = guy.group.userData;
        const v3_size = getGuySize(guy);
        guy.group.position.copy(v3_pos);
        guy.group.position.y = ( v3_size.y + gud.scale ) / 2 + v3_pos.y;
    };
    // a set guy rotation helper
    const setGuyRotation = (guy, v3_lookat, ignoreY) => {
        ignoreY = ignoreY === undefined ? true: ignoreY;
        const gud = guy.group.userData;
        const v3_size = getGuySize(guy);
        const v3 = v3_lookat.clone();
        v3.y = guy.group.position.y;
        if(!ignoreY){
            v3.y = v3_lookat.y + ( v3_size.y + gud.scale ) / 2;
        }
        guy.group.lookAt( v3 );
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
    // create guy collection
    const createGuyCollection = (guyCount, hScale) => {
        const scale_h1 = 1 / getGuySize( createGuy(1) ).y;
        // height 1
        const guys = [];
        let gi = 0;
        while(gi < guyCount){
            const guy = createGuy(scale_h1 * hScale);
            // head
            guy.head.material = [
               // 0 default material
               new THREE.MeshPhongMaterial({
                   color: 0xffff00, transparent: true, map: canObj_guy.texture
               }),
               // 1 used for the face
               new THREE.MeshPhongMaterial({
                    color: 0xffffff, transparent: true, map: canObj_guy.texture
                })
            ];
            guy.body.material = new THREE.MeshPhongMaterial({
                color: 0x00ff00, transparent: true, map: canObj_guy.texture
            });
            guy.arm_right.material = new THREE.MeshPhongMaterial({
                color: 0x00ff00, transparent: true, map: canObj_guy.texture
            });
            guy.leg_right.material = new THREE.MeshPhongMaterial({
                color: 0x00ffff, transparent: true, map: canObj_guy.texture
            });
            guy.arm_left.material = guy.arm_right.material;
            guy.leg_left.material = guy.leg_right.material;
            guys.push(guy);
            scene.add(guy.group);
            gi += 1;
        }
        return guys;
    };
    // update a guy collection
    const updateGuyCollection = (guys, f, fMax) => {
        guys.forEach((guy, i, arr)=>{
            const offset = i / arr.length;
            const a1 = f / fMax;
            let a2 = (f + 0.05) / fMax;
            a2 = a2 > 1 ? 1 : a2;
            // position and rotation
            const a3 = (a1 + offset) % 1;
            setGuyPos(guy, curvePath.getPoint( a3 ));
            setGuyRotation(guy, curvePath.getPoint( (a2 + offset) % 1 ) );
            guy.walk(a1, 10);
            // opacity
            const a4 = 1 - Math.abs(0.5 - a3) / 0.5;
            guy.head.material[0].opacity = a4;
            guy.head.material[1].opacity = a4;
            guy.body.material.opacity = a4;
            guy.arm_right.material.opacity = a4;
            guy.leg_right.material.opacity = a4;
        });
    };
    //-------- ----------
    // CURVE PATH
    //-------- ----------
    const curvePath = new THREE.CurvePath();
    curvePath.add( QBDelta(-5, 0, -5, 5, 0, 0, 5, 0, -2.5) );
    curvePath.add( QBDelta(5, 0, 0, 2, 0, 5, 2, 0, 2) );
    curvePath.add( QBDelta(2, 0, 5, -5, 0, 5, 0, 0, 0) );
    curvePath.add( QBDelta(-5, 0, 5, -10, 0, -5, -5, 0, 5) );
    // PATH DEBUG POINTS
    const v3Array_path = curvePath.getPoints(40);
    const points_debug1 = new THREE.Points(
        new THREE.BufferGeometry().setFromPoints(v3Array_path),
        new THREE.PointsMaterial({size: 0.25, color: new THREE.Color(0,1,0)})
    );
    scene.add(points_debug1);
    //-------- ----------
    // ADDING GUY OBJECT TO SCENE
    //-------- ----------
    const guys = createGuyCollection(16, 2);
    //-------- ----------
    // BACKGROUND
    //-------- ----------
    scene.background = new THREE.Color('#1a1a1a');
    //-------- ----------
    // GRID
    //-------- ----------
    const grid = scene.userData.grid = new THREE.GridHelper(30, 60, '#ffffff', '#00afaf');
    grid.material.linewidth = 3;
    grid.material.transparent = true;
    grid.material.opacity = 0.5;
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
            ['Guy.js r0 ', 64, 17, 14, 'white'],
            ['Threejs Example ', 64, 32, 14, 'white'],
            ['Curve Path Demo', 64, 47, 14, 'white'],
            ['( r140 11/15/2022 )', 64, 70, 12, 'gray'],
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
        [8,1,0, 10,10,10,    10,5,5,      40],
        //[10,10,10, -5,10,10,    0,0,0,      20]
    ]);
    // PATH DEBUG POINTS
    //const points_debug2 = new THREE.Points(
    //    new THREE.BufferGeometry().setFromPoints(v3Array_campos),
    //    new THREE.PointsMaterial({size: 0.5, color: new THREE.Color(0,1,0)})
    //);
    //scene.add(points_debug2);
    // start options for main seq object
    const opt_seq = {
        fps: 30,
        beforeObjects: function(seq){
            textCube.visible = false;
            camera.position.set(8, 1, 0);
            camera.zoom = 1;


            updateGuyCollection(guys, seq.frame, seq.frameMax);

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
            //camera.position.set(18, 18, 18);
            camera.lookAt(0, 0, 0);
        }
     };
    // SEQ 2 - ...
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
 
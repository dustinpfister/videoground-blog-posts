// video1 for threejs-vector3-multiply-scalar
 
// scripts
VIDEO.scripts = [
   '../../../js/canvas/r0/canvas.js',
   '../../../js/canvas-text-cube/r0/canvas-text-cube.js',
   '../../../js/sequences-hooks/r1/sequences-hooks.js',
   '../../../js/datatex/r0/datatex.js'
];
// init
VIDEO.init = function(sm, scene, camera){
    // GRID
    var grid = scene.userData.grid = new THREE.GridHelper(30, 30, '#afafaf', '#ffffff');
    grid.material.linewidth = 3;
    grid.material.transparent = true;
    grid.material.opacity = 0.3;
    scene.add( grid );
    // BACKGROUND
    scene.background = new THREE.Color('#000000');
    //-------- ----------
    // LIGHT
    //-------- ----------
    let dl = new THREE.DirectionalLight(0xffffff, 1);
    dl.position.set(-10, 3, -5);
    scene.add(dl);
    let al = new THREE.AmbientLight(0xffffff, 0.15);
    scene.add(al);
    //-------- ----------
    // HELPERS
    //-------- ----------
    // set position of mesh based on vector unit length along with a and b values
    // relative to a standard start position
    const setByLength = function(mesh, len, a, b, startDir){
        startDir = startDir || new THREE.Vector3(1, 0, 0);
        const pi2 = Math.PI * 2,
        eul = new THREE.Euler(
            0, 
            a % 1 * pi2,
            b % 1 * pi2);
        // using copy to start at startDir, then applying the Euler. After that normalize and multiplyScalar
        return mesh.position.copy( startDir ).applyEuler( eul ).normalize().multiplyScalar(len);
    };
    // get a bias value
    const getBias = function(alpha, count){
        let per = alpha * count % 1;
        return 1 - Math.abs(0.5 - per) / 0.5;
    };
    // update a group
    //const updateGroup = function(group, gAlpha, alphaAdjust, lenBiasCount, bBiasCount){
    const updateGroup = function(group, gAlpha, opt){
        gAlpha = gAlpha === undefined ? 0 : gAlpha; 
        opt = opt || {};
        opt.alphaAdjust = opt.alphaAdjust === undefined ? 1 : opt.alphaAdjust;
        opt.lenBiasCount = opt.lenBiasCount === undefined ? 5 : opt.lenBiasCount;
        opt.bBiasCount = opt.bBiasCount === undefined ? 5 : opt.bBiasCount;
        opt.lenRange = opt.lenRange || [3, 8];
        opt.bRange = opt.bRange || [-0.125, 0.125];
        let i = 0, count = group.children.length;
        while(i < count){
            let mesh = group.children[i];
            let iAlpha = i / count;
            let alpha = ( iAlpha + gAlpha ) / opt.alphaAdjust;
            let len = opt.lenRange[0] + (opt.lenRange[1] - opt.lenRange[0]) * getBias(alpha, opt.lenBiasCount);
            let a = alpha;
            let b = opt.bRange[0] + (opt.bRange[1] - opt.bRange[0]) * getBias(alpha, opt.bBiasCount);
            setByLength(mesh, len, a, b);
            // next child
            nextChild = group.children[i + 1];
            if(i === count - 1){
               nextChild = group.children[i - 1];
            }
            mesh.lookAt(nextChild.position);
            i += 1;
        }
        return group;
    };
    // create a group
    const createGroup = function(count, s){
        count = count === undefined ? 10 : count;
        s = s === undefined ? 1 : s;
        let i = 0;
        let group = new THREE.Group();
        while(i < count){
            let mesh = new THREE.Mesh(
                new THREE.BoxGeometry(s, s, s),
                new THREE.MeshPhongMaterial({
                    color: new THREE.Color(0, 1, 1)
                }));
            group.add(mesh);
            i += 1;
        }
        updateGroup(group, 0);
        return group;
    };
    //-------- ----------
    // OBJECTS
    //-------- ----------
    let group1 = createGroup(120, 0.6);
    scene.add(group1);

    //******** **********
    // TEXT CUBE
    //******** **********
    var textCube = scene.userData.textCube = CanvasTextCube.create({
        width: 128,
        height: 128,
        lineWidth: 7,
        lineColor: 'rgba(0,100,128,0.8)',
        lineCount: 9,
        lines: [
            ['Multiply Scalar', 64, 17, 14, 'white'],
            ['Vector3 Method', 64, 32, 14, 'white'],
            ['in threejs', 64, 47, 14, 'white'],
            ['( r140 09/08/2022 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);

    //******** **********
    // TEXTURES
    //******** **********
    var texture_rnd1 = datatex.seededRandom(40, 40, 1, 1, 1, [0, 255]);

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

                    updateGroup(group1, seq.per, {
                        lenRange: [1, 6],
                        bRange: [-0.125, 0]
                    });

                }
            },
            {
                secs: 7,
                update: function(seq, partPer, partBias){
                    // camera
                    var v1 = new THREE.Vector3(8, 1, 0);
                    var v2 = new THREE.Vector3(9, 9, 9);
                    //camera.position.set(8, 1 + 7 * partPer, 8 * partPer);
                    camera.position.copy(v1).lerp(v2, partPer);
                    camera.lookAt(0, 1 * partPer, 0);
                    updateGroup(group1, seq.per, {
                        lenRange: [1, 6],
                        bRange: [-0.125, 0]
                    });
                }
            },
            {
                secs: 20,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(9, 9, 9);
                    camera.lookAt(0, 1, 0);
                    updateGroup(group1, seq.per, {
                        lenRange: [1, 6],
                        bRange: [-0.125, 0.2 * seq.getBias(4) ]
                    });
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


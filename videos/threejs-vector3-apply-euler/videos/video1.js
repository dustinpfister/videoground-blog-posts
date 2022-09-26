// video1 for threejs-vector3-apply-euler
 
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
    // Vector from angles method
    const vectorFromAngles = function (a, b, len) {
        a = a === undefined ? 0 : a;
        b = b === undefined ? 0 : b;
        len = len === undefined ? 1 : len;
        const startVec = new THREE.Vector3(1, 0, 0);
        const e = new THREE.Euler(
                0,
                THREE.MathUtils.degToRad(a),
                THREE.MathUtils.degToRad(-90 + b));
        return startVec.applyEuler(e).normalize().multiplyScalar(len);
    };
    // create a cube
    const createCube = function(pos, size){
        const cube = new THREE.Mesh(
            new THREE.BoxGeometry(size, size, size),
            new THREE.MeshNormalMaterial());
        cube.position.copy( pos || new THREE.Vector3() );
        cube.lookAt(0, 0, 0);
        return cube;
    };
    // create a group
    const createGroup = (len) => {
        const group = new THREE.Group();
        let i = 0;
        while(i < len){
            group.add( createCube(null, 1) );
            i += 1;
        }
        return group;
    };
    // set a group
    const setGroup = (group, aCount, unitLength, vd, vlt, alpha) => {
        aCount = aCount === undefined ? 1 : aCount;
        unitLength = unitLength === undefined ? 1 : unitLength;
        vd = vd === undefined ? new THREE.Vector3() : vd;       // vector delta for each object effected by i / len
        vlt = vlt === undefined ? new THREE.Vector3() : vlt;    // vector to lerp to for each mesh positon
        alpha = alpha === undefined ? 0 : alpha;
        let len = group.children.length;
        let i = 0;
        while(i < len){
            const p = i / len;
            const a = 360 * aCount * p;
            // using my vector from angles method
            const v = vectorFromAngles(a, 180 * p, unitLength);
            // adding another Vector
            v.add( vd.clone().multiplyScalar(p) );
            const cube = group.children[i];
            cube.position.copy(v.lerp(vlt, alpha));
            cube.lookAt(0, 0, 0);
            const s = 1 - 0.95 * p;
            cube.scale.set(s, s, s);
            i += 1;
        }
    };
    //-------- ----------
    // MESH
    //-------- ----------
    const group = createGroup(400);
    scene.add(group);

    const sphere = new THREE.Mesh( 
        new THREE.SphereGeometry(30, 30, 30), 
        new THREE.MeshBasicMaterial({ wireframe: true, wireframeLinewidth: 4, transparent: true, opacity: 0.15}) )
    scene.add(sphere);

    //-------- ----------
    // BACKGROUND
    //-------- ----------
    scene.background = new THREE.Color('#000000');
    // GRID
    //var grid = scene.userData.grid = new THREE.GridHelper(10, 10, '#ffffff', '#00afaf');
    //grid.material.linewidth = 3;
    //scene.add( grid );
    //-------- ----------
    // TEXT CUBE
    //-------- ----------
    var textCube = scene.userData.textCube = CanvasTextCube.create({
        width: 128,
        height: 128,
        lineWidth: 7,
        lineColor: 'rgba(0,100,128,0.8)',
        lineCount: 9,
        lines: [
            ['Vector3.applyEuler', 64, 17, 14, 'white'],
            ['Method in', 64, 32, 14, 'white'],
            ['threejs', 64, 47, 14, 'white'],
            ['( r140 09/26/2022 )', 64, 70, 12, 'gray'],
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
                    // set group
                    setGroup(group, 0, 4);
                    // camera
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 5,
                update: function(seq, partPer, partBias){
                    // set group
                    setGroup(group, 4 * partPer, 4);
                    // camera
                    camera.position.set(8, 1 + 7 * partPer, 8 * partPer);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 2,
                update: function(seq, partPer, partBias){
                    // set group
                    setGroup(group, 4, 4);
                    // camera
                    camera.position.set(8 - 16 * partPer, 8, 8);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 4,
                update: function(seq, partPer, partBias){
                    setGroup(group, 4 - 8 * partPer, 4);
                    // camera
                    camera.position.set(-8, 8, 8);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 5,
                update: function(seq, partPer, partBias){
                    vd = new THREE.Vector3(20 * partBias,0, 0);
                    setGroup(group, -4 + 8 * partPer, 4, vd);
                    // camera
                    camera.position.set(-8, 8, 8);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 5,
                update: function(seq, partPer, partBias){
                    vd = new THREE.Vector3();
                    vlt = new THREE.Vector3(0,0,0)
                    setGroup(group, 4, 4, vd, vlt, partPer);
                    // camera
                    camera.position.set(-8, 8, 8);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 3,
                update: function(seq, partPer, partBias){
                    vd = new THREE.Vector3();
                    vlt = new THREE.Vector3(0,0,0)
                    setGroup(group, 4, 4, vd, vlt, 1);
                    // camera
                    camera.position.set(-8, 8, 8);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 3,
                update: function(seq, partPer, partBias){
                    vd = new THREE.Vector3();
                    vlt = new THREE.Vector3(0,0,0)
                    setGroup(group, 24 * partPer, 12, vd, vlt, 1 - partPer);
                    // camera
                    camera.position.set(-8, 8, 8);
                    camera.lookAt(0, 0, 0);
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


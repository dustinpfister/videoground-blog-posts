// video1 for threejs-examples-weird-walk-two
VIDEO.scripts = [
   '../../../js/sequences-hooks/r2/sequences-hooks.js',
   '../../../js/canvas/r1/canvas.js',
   '../../../js/canvas-text-cube/r1/canvas-text-cube.js',
   '../../../js/curve/r0/curve.js',
   '../../../js/datatex/r0/datatex.js',
   'guy-weird-two-r0.js'
];
// init
VIDEO.init = function(sm, scene, camera){
    //-------- ----------
    // LIGHT
    //-------- ----------
    const dl = new THREE.DirectionalLight(0xffffff, 0.8);
    dl.position.set(5, 10, 1);
    scene.add(dl);
    //-------- ----------
    // HELPER METHODS
    //-------- ----------
    // give frame, maxframe, and count to get values like per, bias, ect
    const getFrameValues = function(frame, maxFrame, count){
        count = count === undefined ? 1 : count;
        const values = {
            frame: frame, 
            maxFrame: maxFrame
        };
        values.per = frame / maxFrame * count % 1;
        values.bias = 1 - Math.abs(0.5 - values.per) / 0.5;
        return values;
    };
    //-------- ----------
    // GROUND MESH
    //-------- ----------
    const texture = datatex.forEachPix(20, 100, function(x, y, w, h, i){
        const obj = {};
        const v = y % 2 === 0 ? 255 - 200 * (x / w) : 55 + 200 * (x / w);
        obj.r = v;
        obj.b = v;
        return obj;
    });
    const ground = new THREE.Mesh( new THREE.BoxGeometry(20, 1, 100), new THREE.MeshStandardMaterial({
        map: texture
    }) );
    ground.position.y = -1.0;
    scene.add(ground);
    //-------- ----------
    // WEIRD GUY INSTANCE
    //-------- ----------
    const guy = weirdGuy2.create({
        guyID: 'mrguy1'
    });
    guy.position.y = 2.75;
    scene.add(guy);
    weirdGuy2.setWalk(guy, 0);
    //-------- ----------
    // BACKGROUND
    //-------- ----------
    scene.background = new THREE.Color('#2a2a2a');
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
            ['Weird Walk', 64, 17, 14, 'white'],
            ['Two', 64, 32, 14, 'white'],
            ['Threejs Example', 64, 47, 14, 'white'],
            ['( r140 12/12/2022 )', 64, 70, 12, 'gray'],
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
            camera.zoom = 0.9;


            const frame = seq.frame;
            const maxFrame = seq.frameMax;

            // update guy position over mesh
            let v = getFrameValues(frame, maxFrame, 1);
            guy.position.z = -10 + 20 * v.per;
            // set walk
            v = getFrameValues(frame, maxFrame, 40);
            weirdGuy2.setWalk(guy, v.bias);
            // setting arms
            const v1 = getFrameValues(frame, maxFrame, 10);
            const v2 = getFrameValues(frame, maxFrame, 80);
            const a2 = 360 - (80 + 20 * v2.bias);
            weirdGuy2.setArm(guy, 1, 185 - 10 * v1.bias, a2 );
            weirdGuy2.setArm(guy, 2, 175 + 10 * v1.bias, a2 );
            // body rotation
            v = getFrameValues(frame, maxFrame, 1);
            const body = guy.getObjectByName(guy.name + '_body');
            body.rotation.y = -0.5 + 1 * v.bias;
            // update camera
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
        secs: 2,
        update: function(seq, partPer, partBias){
            const v1 = new THREE.Vector3(8, 1, 0);
            const v2 = guy.position.clone().add( new THREE.Vector3(5, 3, 5) );
            camera.position.copy(v1.lerp(v2, partPer));

            const v3 = new THREE.Vector3(0, 0, 0);
            const v4 = new THREE.Vector3(0, 0, 0);
            guy.getWorldPosition(v4).add(new THREE.Vector3( 0, -1.0, 2.0));
            camera.lookAt(v3.lerp(v4, partPer) );
        }
    };
    // SEQ 2 - ...
    opt_seq.objects[2] = {
        secs: 25,
        update: function(seq, partPer, partBias){
            const v1 = guy.position.clone().add( new THREE.Vector3(5, 3, 5) );
            camera.position.copy(v1);
            const a = new THREE.Vector3(0, 0, 0);
            guy.getWorldPosition(a);
            camera.lookAt(a.add(new THREE.Vector3( 0, -1.0, 2.0)));
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
 
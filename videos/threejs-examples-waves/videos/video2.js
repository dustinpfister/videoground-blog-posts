// video2 for threejs-examples-waves

VIDEO.scripts = [
   '../../../js/sequences-hooks/r2/sequences-hooks.js',
   '../../../js/canvas/r1/canvas.js',
   '../../../js/canvas-text-cube/r1/canvas-text-cube.js',
   '../../../js/curve/r0/curve.js',
   'waves-r1.js'
];
// init
VIDEO.init = function(sm, scene, camera){
    //-------- ----------
    // GEO
    //-------- ----------
    const wave_opt = waveMod.parseOpt({
        width: 10,
        height: 10,
        waveHeight: 0.5,
        xWaveCount: 2,
        zWaveCount: 2,
        widthSegs: 100,
        heightSegs: 100
    });
    const geo = waveMod.create( wave_opt );
    console.log(geo.getAttribute('position').count)
    //-------- ----------
    // MESH, MATERIAL
    //-------- ----------
    const material = new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, wireframe: false});
    const mesh = new THREE.Mesh(geo, material);
    scene.add(mesh);
    //-------- ----------
    // LIGHT
    //-------- ----------
    const dl = new THREE.DirectionalLight(0xffffff, 1);
    dl.position.set(3, 2, 1);
    scene.add(dl);
    //-------- ----------
    // BACKGROUND
    //-------- ----------
    scene.background = new THREE.Color('#2a2a2a');
    //-------- ----------
    // GRID
    //-------- ----------
    //const grid = scene.userData.grid = new THREE.GridHelper(10, 10, '#ffffff', '#00afaf');
    //grid.material.linewidth = 3;
    //scene.add( grid );
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
            ['Waves', 64, 17, 14, 'white'],
            ['Threejs Example', 64, 32, 14, 'white'],
            ['', 64, 47, 14, 'white'],
            ['( r140 12/15/2022 )', 64, 70, 12, 'gray'],
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
            // wave options and update of wave geo
            wave_opt.alpha = seq.getPer(16, false);
            wave_opt.degree = 45;
            wave_opt.waveHeight = 0.75;
            wave_opt.xWaveCount = 2;
            wave_opt.zWaveCount = 2;
        },
        afterObjects: function(seq){
            camera.updateProjectionMatrix();
            waveMod.update(geo, wave_opt);
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
            // camera
            const v1 = new THREE.Vector3(8, 1, 0);
            const v2 = new THREE.Vector3(8.5, 8.5, 8.5);
            camera.position.copy( v1.lerp(v2, partPer) );
            camera.lookAt(0, -2 * partPer, 0);
        }
    };
    // SEQ 1 - ...
    opt_seq.objects[2] = {
        secs: 15,
        update: function(seq, partPer, partBias){
            // wave
            wave_opt.degree = 45 + 360 * seq.getPer(1);
            // camera
            camera.position.set( 8.5, 8.5, 8.5 );
            camera.lookAt(0, -2, 0);
        }
    };
    // SEQ 1 - ...
    opt_seq.objects[3] = {
        secs: 10,
        update: function(seq, partPer, partBias){
            wave_opt.waveHeight = 0.75 + 1.25 * seq.getSinBias(4);
            // camera
            camera.position.set( 8.5, 8.5, 8.5 );
            camera.lookAt(0, -2, 0);
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
 
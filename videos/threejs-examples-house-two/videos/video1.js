// video1 for threejs-examples-house-two
VIDEO.scripts = [
   '../../../js/sequences-hooks/r2/sequences-hooks.js',
   '../../../js/canvas/r2/lz-string.js',
   '../../../js/canvas/r2/canvas.js',
   '../../../js/curve/r1/curve.js',
   '../../../js/canvas-text-cube/r1/canvas-text-cube.js',
   '../../../js/dae-helper/r0/dae-helper.js'
];
// init
VIDEO.init = function(sm, scene, camera){
    //-------- ----------
    // BACKGROUND - using canvas2 and lz-string to create a background texture
    //-------- ----------
    const canObj = canvasMod.create({
        size: 512,
        draw: 'grid_palette',
        palette: ['#00ffff', '#008888', '#00ffff'],
        dataParse: 'lzstring64',
        state: { w: 8, h: 5, data: 'AwGlEYyzNCVgpcmPit1mqvTsg===' }
    });
    // can use LZString to compress and decompress
    //console.log( LZString.decompressFromBase64('AwGlEYyzNCVgpcmPit1mqvTsg===') );
    // I want to repeat the texture
    const texture = canObj.texture;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(32, 24);
    scene.background = texture;
    //-------- ----------
    // TEXTURES
    //-------- ----------
    const canObj_grass = canvasMod.create({
        size: 512,
        draw: 'rnd',
        palette: ['#002200', '#004400', '#008800'],
        dataParse: 'lzstring64',
        state: { gSize: 100 }
    });
    //-------- ----------
    // CURVE PATHS - creating a curve path for the camera
    //-------- ----------
    const cp_campos = curveMod.QBCurvePath([
        [8,1,0, 0,1,4,  2,0,8,    0],
        [0,1,4, -3,1,-2,  -2,0,-1,    0],
        [-3,1,-2, 0,2,-2,  -1,-1,-2,    0],
        [0,2,-2, 2,2,0,  0,1,0,    0]
    ]);
    //scene.add( curveMod.debugPointsCurve(cp_campos, {color: new THREE.Color(1,0,0)}) )
    //-------- ----------
    // CURVE Alphas
    //-------- ----------
    const getCamPosAlpha = curveMod.getAlphaFunction({
        type: 'curve2',
        ac_points: [0,0.4,  0.6,-0.25,  1]
    });
    //scene.add( curveMod.debugAlphaFunction(getCamPosAlpha) )
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
            ['House Two', 64, 17, 14, 'white'],
            ['Threejs example', 64, 32, 14, 'white'],
            ['', 64, 47, 14, 'white'],
            ['( r140 JAN/28/2023 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);
    //-------- ----------
    // A SEQ FOR TEXT CUBE
    //-------- ----------
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
    // LOADING
    //-------- ----------
    return DAE_loader({
        // custom cloner
        cloner: (obj, scene_source ) => {
            if(obj.type === 'Mesh'){
                const mat = new THREE.MeshPhongMaterial({
                    emissiveMap: obj.material.map,
                    emissive: new THREE.Color(1,1,1),
                    emissiveIntensity: 2
                });
                const mesh = new THREE.Mesh(obj.geometry, mat);
                mesh.name = obj.name;
                mesh.rotation.copy(obj.rotation);
                scene_source.add(mesh);
            }
        },
        urls_dae: [
            videoAPI.pathJoin(sm.filePath, '../../../dae/house_two/house_2.dae')
        ],
        urls_resource: [
            videoAPI.pathJoin(sm.filePath, '../../../dae/house_two/skins/windows/')
        ]
    })
    .then( (scene_source) => {
        console.log('done loading');
        // adding the house_0 object to the scene
        const mesh_house = scene_source.getObjectByName('house_0').clone();
        scene.add( mesh_house );
        // plane geometry for the ground
        const plane = new THREE.Mesh(
            new THREE.PlaneGeometry(20, 20, 1, 1), 
            new THREE.MeshBasicMaterial({
                map: canObj_grass.texture
                //side: THREE.DoubleSide
            })
        );
        plane.geometry.rotateX(Math.PI * 1.5);
        scene.add(plane);
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
            },
            afterObjects: function(seq){
                camera.updateProjectionMatrix();
            },
            objects: []
        };
        // SEQ 0 - Text cube moves up
        opt_seq.objects[0] = {
            secs: 3,
            update: function(seq, partPer, partBias){
                // textcube
                if(seq.partFrame < seq.partFrameMax){
                   seqHooks.setFrame(seq_textcube, seq.partFrame, seq.partFrameMax);
                }
                // camera
                //camera.position.set(-8, 8, -8);
                camera.lookAt(mesh_house.position);
            }
        };
        // SEQ 1 - Move camera along a Curve
        opt_seq.objects[1] = {
            secs: 7,
            update: function(seq, partPer, partBias){
                const a1 = partPer;
                camera.position.copy( cp_campos.getPoint(a1) );
                camera.lookAt(mesh_house.position);
            }
        };
        // SEQ 2 - lerp camera from curve end to fixed pos
        opt_seq.objects[2] = {
            secs: 20,
            update: function(seq, partPer, partBias){
                const v1 = cp_campos.getPoint(1);
                const v2 = new THREE.Vector3(2.25,0.5,-2.25);
                camera.position.copy( v1.lerp(v2, partPer) );
                const v3 = new THREE.Vector3().lerp( new THREE.Vector3(0, 0.5, 0), partPer );
                camera.lookAt(mesh_house.position.clone().add( v3 ));
            }
        };
        const seq = scene.userData.seq = seqHooks.create(opt_seq);
        console.log('frameMax for main seq: ' + seq.frameMax);
        sm.frameMax = seq.frameMax;
    })
    .catch( (e) => {
        console.warn(e);
    });
};
// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
    const seq = scene.userData.seq;
    seqHooks.setFrame(seq, sm.frame, sm.frameMax);
};
 
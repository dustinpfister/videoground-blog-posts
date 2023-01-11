// video1 for threejs-phong-material
 
// scripts
VIDEO.scripts = [
   '../../../js/sequences-hooks/r2/sequences-hooks.js',
   '../../../js/canvas/r2/lz-string.js',
   '../../../js/canvas/r2/canvas.js',
   '../../../js/canvas-text-cube/r1/canvas-text-cube.js',
   '../../../js/sphere-mutate/r2/sphere-mutate.js'
];
// init
VIDEO.init = function(sm, scene, camera){
    //-------- ----------
    // TEXTURE
    //-------- ----------
    // USING THREE DATA TEXTURE To CREATE A RAW DATA TEXTURE
/*
    const width = 256, height = 256;
    const size = width * height;
    const data = new Uint8Array( 4 * size );
    for ( let i = 0; i < size; i ++ ) {
        const stride = i * 4;
        const a1 = i / size;
        const a2 = 1 - Math.abs(0.5 - a1 * 2 % 1) / 0.5;
        const v = 105 + 150 * Math.random();
        data[ stride ] = v * a1;
        data[ stride + 1 ] = v * (1 - a1);
        data[ stride + 2 ] = v * a2
        data[ stride + 3 ] = 255;
    }
    const texture = new THREE.DataTexture( data, width, height );
    texture.needsUpdate = true;
*/
    const canObj_sphere = canvasMod.create({
        size: 64,
        draw: 'rnd',
        palette: ['#00ff00','#00ffff'],
        state: { 
           gSize: 30
        }
    });
    const texture_sphere = canObj_sphere.texture;
    texture_sphere.magFilter = THREE.NearestFilter;
    texture_sphere.minFilter = THREE.NearestFilter;

    //-------- ----------
    //  MESH OBJECTS, UPDATE OPTIONS
    //-------- ----------
    const mesh1 = sphereMutate.create({
        size: 2, w: 40, h: 40, 
        material : new THREE.MeshPhongMaterial({
            map: texture_sphere
        })

//texture: texture_sphere
    });
    mesh1.material.transparent = true;
    //mesh1.material.opacity = 1;
    const updateOpt1 = {
        forPoint : function(vs, i, x, y, mesh, alpha){
            const mud = mesh.userData;
            const state = mud.state = mud.state === undefined ? [] : mud.state;
            if(!state[i]){
                state[i] = {
                    v: vs.clone().normalize().multiplyScalar(2 + 0.5 * Math.random()),
                    count: 1 + Math.floor( Math.random() * 9 ),
                    offset: Math.random()
                };
            }
            const alpha2 = (state[i].offset + state[i].count * alpha) % 1;
            const alpha3 = 1 - Math.abs(0.5 - alpha2) / 0.5;
            return vs.lerp(state[i].v, alpha3);
        }
    };
    console.log(mesh1.material.type) // MeshPhongMaterial
    scene.add(mesh1);
    sphereMutate.update(mesh1, 1, updateOpt1);
    //-------- ----------
    // LIGHT
    //-------- ----------
    const dl = new THREE.DirectionalLight(0xffffff, 1);
    scene.add(dl);
    //-------- ----------
    // BACKGROUND
    //-------- ----------
    const canObj_back = canvasMod.create({
        size: 512,
        draw: 'grid_palette',
        palette: ['#000000', '#1f1f1f', '#00ffff'],
        dataParse: 'lzstring64',
        state: { w: 8, h: 5, data: 'AwGlEYyzNCVgpcmPit1mqvTsg===' }
    });
    // can use LZString to compress and decompress
    //console.log( LZString.decompressFromBase64('AwGlEYyzNCVgpcmPit1mqvTsg===') );
    // I want to repeat the texture
    const texture_back = canObj_back.texture;
    texture_back.wrapS = THREE.RepeatWrapping;
    texture_back.wrapT = THREE.RepeatWrapping;
    texture_back.repeat.set(40, 40);
    scene.background = texture_back;
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
        lineColor: 'rgba(0,100,100,1)',
        lineCount: 9,
        lines: [
            ['The Phong Material', 64, 17, 14, 'white'],
            ['in', 64, 32, 14, 'white'],
            ['threejs', 64, 47, 14, 'white'],
            ['( r140 01/11/2023 )', 64, 70, 12, 'gray'],
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
                    textCube.material.opacity = 0.75;
                }
            },
            {
                per: 0.75,
                update: function(seq, partPer, partBias){
                    // move up text cube
                    textCube.visible = true;
                    textCube.position.set(6, 0.8 + 1 * partPer, 0);
                    textCube.rotation.y = Math.PI * 2 * partPer;
                    textCube.material.opacity = 0.75 - 0.75 * partPer;
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
            sphereMutate.update(mesh1, seq.per, updateOpt1);
            mesh1.rotation.y = Math.PI * 2 * seq.per;

        },
        afterObjects: function(seq){
            //mesh1.material.opacity = 1;
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
                        array: [8,1,0, 6,1,0, 6,6,0, 6,6,6],
                        lerp: true
                    }
                ],
                update: function(seq, partPer, partBias){
                    // camera
                    seq.copyPos('campos', camera);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 25,
               v3Paths: [
                    {
                        key: 'campos',
                        array: [6,6,6, 5,1,5, -5,1,5],
                        lerp: true
                    }
                ],
                update: function(seq, partPer, partBias){
                    // camera
                    seq.copyPos('campos', camera);
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
    const seq = scene.userData.seq;
    seqHooks.setFrame(seq, sm.frame, sm.frameMax);
};
 
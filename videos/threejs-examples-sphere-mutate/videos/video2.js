// video2 for threejs-examples-sphere-mutate
 
// scripts
VIDEO.scripts = [
   '../../../js/sequences-hooks/r2/sequences-hooks.js',
   '../../../js/canvas/r1/canvas.js',
   '../../../js/canvas-text-cube/r1/canvas-text-cube.js',
   './sphere-mutate-r2.js'
];
// init
VIDEO.init = function(sm, scene, camera){
    //-------- ----------
    // TEXTURE
    //-------- ----------
    // USING THREE DATA TEXTURE To CREATE A RAW DATA TEXTURE
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
    //-------- ----------
    //  MESH OBJECTS, UPDATE OPTIONS
    //-------- ----------
    const mesh1 = sphereMutate.create({
        size: 2, w: 40, h: 40, texture: texture
    });
    mesh1.material.transparent = true;
    mesh1.material.opacity = 0.8;
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
    scene.add(mesh1);
    sphereMutate.update(mesh1, 1, updateOpt1);

    const mesh2 = sphereMutate.create({
        size: 2, w: 60, h: 60, material: new THREE.MeshNormalMaterial({wireframe: true, wireframeLinewidth : 3})
    });
    mesh2.position.set(-5, 0, 0);
    scene.add(mesh2);
    // update options
    const updateOpt2 = {
        forPoint : function(vs, i, x, y, mesh, alpha){
            const geo = mesh.geometry;
            const w = geo.parameters.widthSegments;
            const h = geo.parameters.heightSegments;
            const a1 = x / w;
            const a2 = y / h;
            const radian1 = Math.PI * 16 * a1 + Math.PI * (2 + 16 * a2) * alpha;
            const radian2 = Math.PI * 16 * a2 + Math.PI * 8 * alpha;
            const n1 = ( Math.PI + Math.sin( radian1 ) ) / Math.PI;
            const n2 = ( Math.PI + Math.sin( radian2 ) ) / Math.PI;
            const n3 = ( n1 + n2 ) / 2;
            const v2 = vs.clone().normalize().multiplyScalar( 2 + 0.5 * n3 );
            return vs.lerp(v2, 1 - Math.abs(0.5 - alpha) / 0.5);
        }
    };
    sphereMutate.update(mesh2, 0, updateOpt2);

let canObj2 = canvasMod.create({
    draw:'rnd',
    size: 128,
    update_mode: 'dual',
    state: {
        gSize: 30
    },
    palette: ['black', 'white', 'cyan', 'lime', 'red', 'blue', 'yellow', 'orange', 'purple']
});


    const mesh3 = sphereMutate.create({
        size: 2, w: 60, h: 60, texture: canObj2.texture_data
    });
    mesh3.position.set(0, 0, -5);
    scene.add(mesh3);
    // MAP DATA
    const map_w = 16;
    const map_data = [
        1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,
        1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,
        1,0,0,4,3,0,0,1,1,0,0,3,4,0,0,1,
        1,0,0,5,2,0,0,1,1,0,0,2,5,0,0,1,
        2,0,0,5,1,0,0,2,2,0,0,1,5,0,0,2,
        3,0,0,0,0,0,0,3,3,0,0,0,0,0,0,3,
        4,0,0,0,0,0,0,4,4,0,0,0,0,0,0,4,
        5,4,3,2,2,3,4,5,5,4,3,2,2,3,4,5,
        5,4,3,2,2,3,4,5,5,4,3,2,2,3,4,5,
        4,0,0,0,0,0,0,4,4,0,0,0,0,0,0,4,
        3,0,0,0,0,0,0,3,3,0,0,0,0,0,0,3,
        2,0,0,5,1,0,0,2,2,0,0,1,5,0,0,2,
        1,0,0,5,2,0,0,1,1,0,0,2,5,0,0,1,
        1,0,0,4,3,0,0,1,1,0,0,3,4,0,0,1,
        1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,
        1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1
    ];
    // update options
    const updateOpt3 = {
        forPoint : function(vs, i, x, y, mesh, alpha){
            const geo = mesh.geometry;
            const w = geo.parameters.widthSegments;
            const h = geo.parameters.heightSegments;
            // get grid location
            const gx = Math.floor( x / w * map_w );
            const gy = Math.floor( ( y - 1 ) / ( h - 1) * map_w );
            const gi = gy * map_w + gx;
            const dy = map_data[gi];

            const ulb = 1.25 + 1.75 * alpha;
            const uld = 1.75 - 1.75 * alpha
            return vs.normalize().multiplyScalar(ulb + dy / 5 * uld);
        }
    };
    sphereMutate.update(mesh3, 0, updateOpt3);

    //-------- ----------
    // LIGHT
    //-------- ----------
    const dl = new THREE.DirectionalLight(0xffffff, 1);
    scene.add(dl);
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
            ['Sphere Mutate r2', 64, 17, 14, 'white'],
            ['THREEJS', 64, 32, 14, 'white'],
            ['EXAMPLE', 64, 47, 14, 'white'],
            ['( r140 10/24/2022 )', 64, 70, 12, 'gray'],
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
    const seq = scene.userData.seq = seqHooks.create({
        fps: 30,
        beforeObjects: function(seq){
            textCube.visible = false;
            camera.position.set(8, 1, 0);

            sphereMutate.update(mesh1, seq.per, updateOpt1);
            mesh1.rotation.y = Math.PI * 2 * seq.per;


    sphereMutate.update(mesh2, seq.getSinBias(4, false), updateOpt2);


    sphereMutate.update(mesh3, seq.getSinBias(4, false), updateOpt3);

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
 
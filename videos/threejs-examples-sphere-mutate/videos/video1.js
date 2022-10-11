// video1 for threejs-examples-sphere-mutate
 
// scripts
VIDEO.scripts = [
   '../../../js/sequences-hooks/r1/sequences-hooks.js',
   '../../../js/canvas/r0/canvas.js',
   '../../../js/canvas-text-cube/r0/canvas-text-cube.js'
];
 
// init
VIDEO.init = function(sm, scene, camera){
    // ---------- ----------
    // LIGHT
    // ---------- ----------
    const dl = new THREE.DirectionalLight(0xffffff, 1);
    dl.position.set(-3, 1, 2);
    scene.add(dl);
    const al = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(al);
    // ---------- ----------
    // HELPERS
    // ---------- ----------
    // create new vectors
    const createNewVectors = (mesh, mag) => {
        mag = mag === undefined ? 0.25 : mag
        const pos = mesh.userData.pos_base;
        const len = pos.count, vstart=[], vend= [];
        let i = 0;
        while(i < len){
            const v = new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i));
            const ul = v.length();
            vstart.push(v);
            vend.push(v.clone().normalize().multiplyScalar(ul - mag + mag * 2 * Math.random()));
            i += 1;
        }
        mesh.userData.vstart = vstart;
        mesh.userData.vend = vend;
    };
    // create the mesh object
    const createMesh = () => {
        const mesh = new THREE.Mesh(
            new THREE.SphereGeometry(3.25, 40, 40, 0, Math.PI * 1.6), 
            new THREE.MeshPhongMaterial({
                color: 'white',
                map: texture,
                side: THREE.DoubleSide
            }));
        mesh.userData.pos_base = mesh.geometry.getAttribute('position').clone();
        createNewVectors(mesh);
        return mesh;
    };
    // update the mesh object
    const updateMeshGeo = (mesh, alpha) => {
        const geo = mesh.geometry;
        const pos = geo.getAttribute('position');
        const len = pos.count;
        const mud = mesh.userData;
        let i = 0;
        while(i < len){
            const v = mud.vstart[i].clone().lerp( mud.vend[i], alpha );
            pos.array[i * 3] = v.x;
            pos.array[i * 3 + 1] = v.y;
            pos.array[i * 3 + 2] = v.z;
            i += 1;
        }
        pos.needsUpdate = true;
    };
    //-------- ----------
    // TEXTURE
    //-------- ----------
    // USING THREE DATA TEXTURE To CREATE A RAW DATA TEXTURE
    const width = 32, height = 32;
    const size = width * height;
    const data = new Uint8Array( 4 * size );
    for ( let i = 0; i < size; i ++ ) {
        const stride = i * 4;
        const a1 = i / size;
        const a2 = i % width / width;
        const v = 30 + 70 * Math.random();
        data[ stride ] = v + 150 * a1;           // red
        data[ stride + 1 ] = v + 150 - 150 * a1; // green
        data[ stride + 2 ] = v + 50 * a2;        // blue
        data[ stride + 3 ] = 255;                // alpha
    }
    const texture = new THREE.DataTexture( data, width, height );
    texture.needsUpdate = true;
    // ---------- ----------
    // GEOMETRY, MESH
    // ---------- ----------
    const mesh = createMesh();
    scene.add(mesh);
    camera.lookAt(mesh.position);
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
        width: 128,
        height: 128,
        lineWidth: 7,
        lineColor: 'rgba(0,100,128,0.8)',
        lineCount: 9,
        lines: [
            ['Sphere Mutation', 64, 17, 14, 'white'],
            ['Threejs Example', 64, 32, 14, 'white'],
            ['', 64, 47, 14, 'white'],
            ['( r140 10/11/2022 )', 64, 70, 12, 'gray'],
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
    //-------- ----------
    // A MAIN SEQ OBJECT
    //-------- ----------
    const MAGS = [
        [0.75, 1.5],
        [0.25, 0.35],
        [1.25, 2.25]
    ];
    const seq = scene.userData.seq = seqHooks.create({
        fps: 30,
        beforeObjects: function(seq){
            let alpha = seq.per;
            let bias = seq.getSinBias(6, false);
            if(bias <= 0.05){
                const mi = Math.floor(  MAGS.length * seq.per);
                const magMin = MAGS[mi][0];
                const magMax = MAGS[mi][1];
                createNewVectors(mesh, magMin + (magMax - magMin) * Math.random())
            }
            updateMeshGeo(mesh, bias);
            mesh.rotation.y = Math.PI * 4 * alpha;
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
                }
            },
            {
                secs: 7,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(8, 1 + 7 * partPer, 8 * partPer);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 20,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(8 - 16 * partPer, 8, 8);
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
 
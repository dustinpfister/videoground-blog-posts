// video1 for threejs-buffer-geometry-index
VIDEO.scripts = [
   '../../../js/sequences-hooks/r2/sequences-hooks.js',
   '../../../js/canvas/r1/canvas.js',
   '../../../js/canvas-text-cube/r1/canvas-text-cube.js',
   '../../../js/curve/r0/curve.js'
];
// init
VIDEO.init = function(sm, scene, camera){
    // ---------- ----------
    // LIGHT
    // ---------- ----------
    const dl = new THREE.DirectionalLight(0xffffff, 1);
    dl.position.set(0, 1, 0)
    scene.add(dl);
    // ---------- ----------
    // HELPERS
    // ---------- ----------
    // create ddeltas for the traingle y values
    const createTriDeltas = (geo) => {
        const pos = geo.getAttribute('position');
        const len_tri = Math.floor(pos.array.length / 9);
        let i_tri = 0;
        const deltas = [];
        while(i_tri < len_tri){
            deltas.push(-2 + 4 * Math.random() );
            i_tri += 1;
        }
        return deltas;
    };
    // create group helper
    const createGroup = () => {
        // material
        const material = new THREE.MeshPhongMaterial({
            side: THREE.DoubleSide,
            color: new THREE.Color(1,1,1),
            emissive: new THREE.Color(0,0,0),
            emissiveIntensity: 0.0
        });
        // geo indexed and non indxed
        const geo_index = new THREE.PlaneGeometry(12, 20, 12, 20);
        geo_index.rotateX(Math.PI * 1.5)
        const geo_noindex = geo_index.clone().toNonIndexed();
        const group = new THREE.Group();
        // indexed mesh
        const mesh1 = new THREE.Mesh(geo_index, material);
        mesh1.userData.pos_home = mesh1.geometry.getAttribute('position').clone();
        mesh1.userData.deltas = createTriDeltas(mesh1.geometry);
        // no index mesh
        const mesh2 = new THREE.Mesh(geo_noindex, material);
        mesh2.userData.pos_home = mesh2.geometry.getAttribute('position').clone();
        mesh2.userData.deltas = createTriDeltas(mesh2.geometry);
        group.add(mesh1);
        group.add(mesh2);
        mesh1.position.set(-6, 0, 0);
        mesh2.position.set(6, 0, 0);
        return group;
    };
    const updateGroup = (group, alpha) => {
        // loop over group children
        group.children.forEach( (mesh) => {
            const pos = mesh.geometry.getAttribute('position');
            const pos_home = mesh.userData.pos_home;
            let len_tri = Math.floor(pos.array.length / 9);
            let i_tri = 0;
            while(i_tri < len_tri){
                let i = i_tri * 9;
                 const delta = mesh.userData.deltas[i_tri];
                 pos.array[i + 1] = pos_home.array[ i + 1] + delta * alpha;
                 pos.array[i + 4] = pos_home.array[i + 4] + delta * alpha;
                 pos.array[i + 7] = pos_home.array[ i + 7] + delta * alpha;
                 i_tri += 1;
            }
            pos.needsUpdate = true;
            mesh.geometry.computeVertexNormals();
        });
    };
    const createCanvasTexture = function (draw, size) {
        var canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d');
        canvas.width = size || 32;
        canvas.height = size || 32;
        draw(ctx, canvas);
        return new THREE.CanvasTexture(canvas);
    };
    // ---------- ----------
    // TEXTURE
    // ---------- ----------
    const texture_map = createCanvasTexture(function (ctx, canvas) {
        const w = 12, h = 20;
        let i = 0, len = w * h;
        while(i < len){
            const x = i % w;
            const y = Math.floor(i / w);
            const px = canvas.width / w * x;
            const py = canvas.height / h * y;
            const r = Math.random().toFixed(2);
            const g = Math.random().toFixed(2);
            const b = Math.random().toFixed(2);
            const color = new THREE.Color(r,g,b);
            ctx.fillStyle = color.getStyle();
            ctx.fillRect(px, py, canvas.width / w, canvas.width / h);
            i += 1;
        }
    }, 64);
    // ---------- ----------
    // GROUP
    // ---------- ----------
    const group = createGroup();
    scene.add(group);
    group.children.forEach((mesh) => {
        mesh.material.map = texture_map;
    });
    //-------- ----------
    // BACKGROUND
    //-------- ----------
    scene.background = new THREE.Color('#000000');
    //-------- ----------
    // GRID
    //-------- ----------
    //const grid = scene.userData.grid = new THREE.GridHelper(10, 10, '#ffffff', '#00afaf');
    //grid.material.linewidth = 3;
    //scene.add( grid );
    //-------- ----------
    // PATHS
    //-------- ----------
    const v3Array_campos1 = curveMod.QBV3Array([
        [8,1,0, 8,8,8,    0,0,0,      20]
    ]);
    scene.add( curveMod.debugPoints( v3Array_campos1 ) );
    const v3Array_campos2 = curveMod.QBV3Array([
        [8,8,8, -8,8,8,    0,0,0,      20]
    ]);
    scene.add( curveMod.debugPoints( v3Array_campos2 ) );
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
            ['Indexed and', 64, 17, 14, 'white'],
            ['NonIndexed', 64, 32, 14, 'white'],
            ['Geometry', 64, 47, 14, 'white'],
            ['( r140 12/10/2022 )', 64, 70, 12, 'gray'],
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
            // groups
            updateGroup(group, partPer);
            // camera
            //camera.position.set(5, 18, 14);
            camera.lookAt(0, 0, 0);
        }
    };
    // SEQ 1 - ...
    opt_seq.objects[1] = {
        secs: 3,
        v3Paths: [
            { key: 'campos1', array: v3Array_campos1, lerp: true }
        ],
        update: function(seq, partPer, partBias){
            // groups
            updateGroup(group, 1 - partPer);
            // camera
            seq.copyPos('campos1', camera);
            camera.lookAt(0, 0, 0);
        }
    };
    // SEQ 2 - ...
    opt_seq.objects[2] = {
        secs: 4,
        update: function(seq, partPer, partBias){
            // groups
            updateGroup(group, seq.getSinBias(1));
            // camera
            camera.position.set(8, 8, 8);
            camera.lookAt(0, 0, 0);
        }
    };
    // SEQ 3 - ...
    opt_seq.objects[3] = {
        secs: 20,
        v3Paths: [
            { key: 'campos2', array: v3Array_campos2, lerp: true }
        ],
        update: function(seq, partPer, partBias){
            // groups
            updateGroup(group, seq.getSinBias(8));
            // camera
            seq.copyPos('campos2', camera);
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
 
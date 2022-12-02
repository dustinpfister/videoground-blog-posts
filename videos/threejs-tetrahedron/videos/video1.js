// video1 for threejs-tetrahedron
VIDEO.scripts = [
   '../../../js/sequences-hooks/r2/sequences-hooks.js',
   '../../../js/canvas/r1/canvas.js',
   '../../../js/canvas-text-cube/r1/canvas-text-cube.js',
   '../../../js/curve/r0/curve.js'
];
// init
VIDEO.init = function(sm, scene, camera){
    // ---------- ----------
    // HELPERS
    // ---------- ----------
    const appendLine = (mesh, color, lw, opacity ) => {
        const line_material = new THREE.LineBasicMaterial( {
            color: color|| 0xffffff,
            linewidth: lw === undefined ? 6 : lw,
            transparent: true,
            opacity: opacity === undefined ? 1 : opacity
        });
        const line = new THREE.LineSegments( mesh.geometry, line_material );
        mesh.add(line)
    };
    // ---------- ----------
    // Tetrahedron Geometry
    // ---------- ----------
    const geo = new THREE.TetrahedronGeometry(3, 0);
    // ---------- ----------
    // MESH
    // ---------- ----------
    const mesh_material1 = new THREE.MeshPhongMaterial( {
        color: 0x00ff88, flatShading: true,
        side: THREE.DoubleSide,
        transparent: true, opacity: 0.50 } );
    const mesh_material2 = new THREE.MeshPhongMaterial( {
        color: 0x00ff00, flatShading: true,
        transparent: true, opacity: 0.25
    });
    const mesh = new THREE.Mesh( geo, mesh_material1 );
    scene.add(mesh);
    appendLine(mesh);
    // sphere mesh
    const mesh_sphere = new THREE.Mesh( new THREE.SphereGeometry(3.0, 30, 30), mesh_material2);
    scene.add(mesh_sphere);
    appendLine(mesh_sphere, 0xffffff, 3, 0.2);
    // ---------- ----------
    // LIGHT
    // ---------- ----------
    const dl = new THREE.DirectionalLight(0xffffff, 1.0);
    dl.position.set(3, 1, 2);
    scene.add(dl);
    const al = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(al);
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
    // PATHS
    //-------- ----------
    const v3Array_campos = curveMod.QBV3Array([
        [8,1,0, 0,5,9,    4,0,4,      200]
    ]);
    scene.add( curveMod.debugPoints( v3Array_campos ) );
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
            ['Tetrahedron', 64, 17, 14, 'white'],
            ['Geometry in', 64, 32, 14, 'white'],
            ['Threejs', 64, 47, 14, 'white'],
            ['( r140 12/01/2022 )', 64, 70, 12, 'gray'],
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
            const a1 = seq.getSinBias(1, false);
            mesh.rotation.y = Math.PI * 2 * a1;
            mesh.rotation.z = Math.PI * 4 * a1;
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
        secs: 27,
        v3Paths: [
            { key: 'campos', array: v3Array_campos, lerp: true }
        ],
        update: function(seq, partPer, partBias){
            // camera
            camera.zoom = 1 + 0.15 * partPer;
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
 
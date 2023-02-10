// video1 for threejs-curves-cubicbeziercurve3
VIDEO.scripts = [
   '../../../js/sequences-hooks/r2/sequences-hooks.js',
   '../../../js/canvas/r2/lz-string.js',
   '../../../js/canvas/r2/canvas.js',
   '../../../js/curve/r1/curve.js',
   '../../../js/canvas-text-cube/r1/canvas-text-cube.js'
];
// init
VIDEO.init = function(sm, scene, camera){
    // ---------- ----------
    // LIGHT
    // ---------- ----------
    const dl = new THREE.DirectionalLight(0xffffff, 1);
    dl.position.set(2,1,10);
    scene.add(dl);
    const al = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(al);
    // ---------- ----------
    // MESH POINTERS
    // ---------- ----------
    const geo_pointer = new THREE.SphereGeometry(0.75, 20, 20);
    const material_pointer = new THREE.MeshNormalMaterial({transparent: true, opacity: 0.8});
    const mesh_start = new THREE.Mesh(geo_pointer, material_pointer);
    const mesh_end = new THREE.Mesh(geo_pointer, material_pointer);
    const mesh_c1 = new THREE.Mesh(geo_pointer, material_pointer);
    const mesh_c2 = new THREE.Mesh(geo_pointer, material_pointer);
    scene.add(mesh_start);
    scene.add(mesh_end);
    scene.add(mesh_c1);
    scene.add(mesh_c2);
    // ---------- ----------
    // MESH GROUP
    // ---------- ----------
    const material_child = new THREE.MeshPhongMaterial({
        color: new THREE.Color(1,0,0),
        specular: new THREE.Color(0.2,0.2,0.2)
    });
    const geometry_child = new THREE.SphereGeometry(0.5, 20, 20);
    const group = new THREE.Group();
    let i = 0; const len = 14;
    while(i < len){
        const mesh = new THREE.Mesh(geometry_child, material_child);
        group.add(mesh);
        i += 1;
    }
    scene.add(group);
    // ---------- ----------
    // CURVE
    // ---------- ----------
    const curve = new THREE.CubicBezierCurve3(mesh_start.position, mesh_c1.position, mesh_c2.position, mesh_end.position);
    //-------- ----------
    // BACKGROUND - using canvas2 and lz-string to create a background texture
    //-------- ----------
    const canObj = canvasMod.create({
        size: 512,
        draw: 'grid_palette',
        palette: ['#000000', '#1f1f1f', '#00ffff'],
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
    // CURVE PATHS - cretaing a curve path for the camera
    //-------- ----------
    //const cp_campos = curveMod.QBCurvePath([
    //    [8,1,0, 8,3,8,  5,2,5,    0]
    //]);
    //scene.add( curveMod.debugPointsCurve(cp_campos) )
    //-------- ----------
    // CURVE Alphas
    //-------- ----------
    //const getCamPosAlpha = curveMod.getAlphaFunction({
    //    type: 'curve2',
    //    ac_points: [0,0.4,  0.6,-0.25,  1]
    //});
    //scene.add( curveMod.debugAlphaFunction(getCamPosAlpha) )
    //-------- ----------
    // GRID
    //-------- ----------
    const grid = scene.userData.grid = new THREE.GridHelper(10, 10, '#ffffff', '#00afaf');
    grid.material.linewidth = 3;
    grid.material.transparent = true;
    grid.material.opacity = 0.5;
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
            ['CubicBezierCurve3', 64, 17, 14, 'white'],
            ['Curve Class in', 64, 32, 14, 'white'],
            ['Threejs', 64, 47, 14, 'white'],
            ['( r140 02/10/2023 )', 64, 70, 12, 'gray'],
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
            // always update group children to current state of curve
            group.children.forEach( (mesh, i, arr) => {
                const a4 = (i + 1) / (arr.length + 1);
                mesh.position.copy( curve.getPoint(a4) );
            });
            camera.updateProjectionMatrix();
        },
        objects: []
    };
    // SEQ 0 - text cube
    opt_seq.objects[0] = {
        secs: 3,
        update: function(seq, partPer, partBias){
            // textcube
            if(seq.partFrame < seq.partFrameMax){
               seqHooks.setFrame(seq_textcube, seq.partFrame, seq.partFrameMax);
            }
            // pointer mesh objects
            const a2 = seq.getSinBias(2)
            mesh_start.position.set(0,0,5);
            mesh_end.position.set(0,0,-5);
            mesh_c1.position.set(-5 + 10 * a2,0,2.5);
            mesh_c2.position.set(5 - 10 * a2,0,-2.5);
            // camera
            camera.lookAt(0, 0, 0);
        }
    };
    // SEQ 1 - move camera to new position, move control points to center
    opt_seq.objects[1] = {
        secs: 5,
        update: function(seq, partPer, partBias){
            // pointer mesh objects
            mesh_start.position.set(0,0,5);
            mesh_end.position.set(0,0,-5);
            mesh_c1.position.set(-5 + 5 * partPer,0,2.5);
            mesh_c2.position.set(5 - 5 * partPer,0,-2.5);
            // camera
            const v1 = new THREE.Vector3(8, 1, 0);
            const v2 = new THREE.Vector3(8, 8, 8);
            camera.position.copy(v1).lerp(v2, partPer);
            camera.lookAt(0, 0, 0);
        }
    };
    // SEQ 2 - rest
    opt_seq.objects[2] = {
        secs: 2,
        update: function(seq, partPer, partBias){
            // pointer mesh objects
            mesh_start.position.set(0,0,5);
            mesh_end.position.set(0,0,-5);
            mesh_c1.position.set(0,0,2.5);
            mesh_c2.position.set(0,0,-2.5);
            // camera
            camera.position.set(8,8,8);
            camera.lookAt(0, 0, 0);
        }
    };
    // SEQ 3 - move c1 up
    opt_seq.objects[3] = {
        secs: 3,
        update: function(seq, partPer, partBias){
            // pointer mesh objects
            mesh_start.position.set(0,0,5);
            mesh_end.position.set(0,0,-5);
            mesh_c1.position.set(0,4.5 * partPer,2.5);
            mesh_c2.position.set(0,0,-2.5);
            // camera
            camera.position.set(8,8,8);
            camera.lookAt(0, 0, 0);
        }
    };
    // SEQ 4 - rest
    opt_seq.objects[4] = {
        secs: 2,
        update: function(seq, partPer, partBias){
            // pointer mesh objects
            mesh_start.position.set(0,0,5);
            mesh_end.position.set(0,0,-5);
            mesh_c1.position.set(0,4.5,2.5);
            mesh_c2.position.set(0,0,-2.5);
            // camera
            camera.position.set(8,8,8);
            camera.lookAt(0, 0, 0);
        }
    };
    // SEQ 5 - move c2 down
    opt_seq.objects[5] = {
        secs: 3,
        update: function(seq, partPer, partBias){
            // pointer mesh objects
            mesh_start.position.set(0,0,5);
            mesh_end.position.set(0,0,-5);
            mesh_c1.position.set(0,4.5,2.5);
            mesh_c2.position.set(0,-4.5 * partPer,-2.5);
            // camera
            camera.position.set(8,8,8);
            camera.lookAt(0, 0, 0);
        }
    };
    // SEQ 6 - rest
    opt_seq.objects[6] = {
        secs: 2,
        update: function(seq, partPer, partBias){
            // pointer mesh objects
            mesh_start.position.set(0,0,5);
            mesh_end.position.set(0,0,-5);
            mesh_c1.position.set(0,4.5,2.5);
            mesh_c2.position.set(0,-4.5,-2.5);
            // camera
            camera.position.set(8,8,8);
            camera.lookAt(0, 0, 0);
        }
    };
    // SEQ 7 - move c1 back, and c2 forward
    opt_seq.objects[7] = {
        secs: 3,
        update: function(seq, partPer, partBias){
            // pointer mesh objects
            mesh_start.position.set(0,0,5);
            mesh_end.position.set(0,0,-5);
            mesh_c1.position.set(-5 * partPer,4.5 - 1.5 * partPer,2.5);
            mesh_c2.position.set(5 * partPer,-4.5 + 1.5 * partPer,-2.5);
            // camera
            camera.position.set(8,8,8);
            camera.lookAt(0, 0, 0);
        }
    };
    // SEQ 8 - rest
    opt_seq.objects[8] = {
        secs: 2,
        update: function(seq, partPer, partBias){
            // pointer mesh objects
            mesh_start.position.set(0,0,5);
            mesh_end.position.set(0,0,-5);
            mesh_c1.position.set(-5,3,2.5);
            mesh_c2.position.set(5,-3,-2.5);
            // camera
            camera.position.set(8,8,8);
            camera.lookAt(0, 0, 0);
        }
    };
    // SEQ 9 - rotate
    opt_seq.objects[9] = {
        secs: 5,
        update: function(seq, partPer, partBias){
            // pointer mesh objects
            const radian = Math.PI * 2 * partPer;
            const e = new THREE.Euler();
            e.y = radian;
            mesh_start.position.set(0,0,5).applyEuler(e).multiplyScalar(1 + partPer);
            mesh_end.position.set(0,0,-5).applyEuler(e).multiplyScalar(1 + partPer);
            mesh_c1.position.set(-5,3,2.5).applyEuler(e);
            mesh_c2.position.set(5,-3,-2.5).applyEuler(e);
            // camera
            camera.position.set(8,8,8);
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
 
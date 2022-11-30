// video1 for # threejs-object3d-visible
VIDEO.scripts = [
   '../../../js/sequences-hooks/r2/sequences-hooks.js',
   '../../../js/canvas/r1/canvas.js',
   '../../../js/canvas-text-cube/r1/canvas-text-cube.js',
   '../../../js/curve/r0/curve.js'
];
// init
VIDEO.init = function(sm, scene, camera){
    //-------- ----------
    // HELPERS
    //-------- ----------
    // make a single box
    const makeBox = () => {
        const box = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshNormalMaterial());
        return box;
    };
    // make a group
    const makeGroup = (count) => {
        let i = 0;
        const group = new THREE.Group();
        while(i < count){
            const mesh = makeBox();
            group.add( mesh );
            i += 1;
        }
        return group;
    };
    // set a group as a ring with options
    const setGroupAsRing = (group, opt) => {
        opt = opt || {};
        opt.alpha = opt.alpha === undefined ? 0 : opt.alpha;
        opt.y = opt.y === undefined ? 0 : opt.y;
        opt.scale = opt.scale === undefined ? 1 : opt.scale;
        opt.radius = opt.radius === undefined ? 5 : opt.radius;
        opt.radianOffset = opt.radianOffset === undefined ? 0 : opt.radianOffset;
        opt.toggleAlpha = opt.toggleAlpha === undefined ? 0.10 : opt.toggleAlpha;
        const len = group.children.length;
        group.children.forEach( (mesh, i) => {
            const alpha_mesh = i / len;
            const radian = Math.PI * 2 * alpha_mesh + opt.radianOffset * Math.PI * 2;
            mesh.position.x = Math.cos(radian) * opt.radius;
            mesh.position.z = Math.sin(radian) * opt.radius;
            mesh.position.y = opt.y;
            // VISIBLE BASED ON i AS WELL AS opt.alpha
            const a = opt.alpha % opt.toggleAlpha;
            const b = a < opt.toggleAlpha / 2 ? 0 : 1;
            const c = (i + b) % 2;
            mesh.visible = true;
            if(c){
                mesh.visible = false;
            }
            // scale
            mesh.scale.set(1, 1, 1).multiplyScalar(opt.scale)
            // look at group
            mesh.lookAt(group.position);
        });
    };
    //-------- ----------
    // OBJECTS
    //-------- ----------
    // box helpers
    scene.add( new THREE.GridHelper(10, 10));
    const rings = new THREE.Group();
    let ri = 0;
    while(ri < 10){
        rings.add( makeGroup(10) );
        ri += 1;
    }
    scene.add(rings);
    // add box helpers
    rings.children.forEach( (r, ri) => {
        r.children.forEach( (m, mi) => {
            const box = new THREE.BoxHelper( m, 0xffff00 );
            box.material.transparent = true;
            box.material.opacity = 0.25;
            box.material.linewidth = 3;
            box.name = 'box_' + ri + '_' + mi;
            scene.add(box);
        });
    });
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
        [8,1,0, -8,0,8,    3,0,8,      100],
        [-8,0,8, 0,0,0,    -15,2,1,      100]
    ]);
    //scene.add( curveMod.debugPoints( v3Array_campos ) );
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
            ['Object3d Visible', 64, 17, 14, 'white'],
            ['Property in', 64, 32, 14, 'white'],
            ['threejs', 64, 47, 14, 'white'],
            ['( r140 11/20/2022 )', 64, 70, 12, 'gray'],
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
            const a1 = seq.per;
            rings.children.forEach((r, ri)=>{
                const a_r = ri / rings.children.length;
                const a_r2 = Math.abs(0.5 - a_r) / 0.5;
                const a3 = Math.sin( Math.PI * 0.25 * a_r);
                setGroupAsRing(r, {
                    radius: 5 - 5 * a_r2,
                    radianOffset: Math.PI * 0.25 * a_r,
                    y: 5 - 10 * a3,
                    scale: 0.75 - 0.5 * a_r2,
                    alpha: a1
                });
                // update box helpers
                r.children.forEach((m, mi) => {
                    const box = scene.getObjectByName('box_' + ri + '_' + mi);
                    box.update();
                })
            });
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
    // SEQ 2 - ...
    opt_seq.objects[1] = {
        secs: 27,
        v3Paths: [
            { key: 'campos', array: v3Array_campos, lerp: true }
        ],
        update: function(seq, partPer, partBias){
            // camera
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
 
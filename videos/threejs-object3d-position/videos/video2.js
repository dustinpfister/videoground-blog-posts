// video2 for threejs-object3d-position
// scripts
VIDEO.scripts = [
   '../../../js/sequences-hooks/r2/sequences-hooks.js',
   '../../../js/canvas/r1/canvas.js',
   '../../../js/canvas-text-cube/r1/canvas-text-cube.js'
];
// init
VIDEO.init = function(sm, scene, camera){
    //-------- ----------
    // LIGHT
    //-------- ----------
    const dl = new THREE.DirectionalLight(0xffffff, 1);
    dl.position.set(2, 1, -3);
    scene.add(dl);
    //-------- ----------
    // HELPERS
    //-------- ----------
    // Make a single mesh object
    const makeMesh = (color) => {
        var mesh = new THREE.Mesh(
            new THREE.SphereGeometry(0.5, 20, 20),
            new THREE.MeshPhongMaterial({
                color: color || new THREE.Color(1, 1, 1),
                transparent: true,
                opacity: 1
            })
        );
        return mesh;
    };
    // Make a group of mesh objects
    const makeGroup = (opt) => {
        opt = opt || {};
        opt.count = opt.count === undefined ? 10 : opt.count;
        opt.color = opt.color || new THREE.Color(1, 1, 1);
        const group = new THREE.Group();
        let i = 0;
        while(i < opt.count){
            const mesh = makeMesh(opt.color);
            group.add(mesh);
            i+= 1;
        };
        return group;
    };
    // clamp helper
    const clamp = (i, d) => {
        i = i < 0 ? 0 : i;
        i = i >= d ? d - 1 : i;
        return i;
    };
    // position a group to a geometry helper
    const positionGroupToGeometry = (group, geo, alpha) => {
        const pos = geo.getAttribute('position');
        const len1 = pos.count;
        const len2 = group.children.length;
        const a2 = len1  * alpha / len1;
        const a3 = a2 % ( 1 / len1 ) * len1;
        group.children.forEach( (mesh, mi) => {
            const i = Math.floor( len1 * alpha);
            const i2 = (i + mi) % len1;;
            const v_c = new THREE.Vector3(pos.getX(i2), pos.getY(i2), pos.getZ(i2));
            const i3 = (i2 + 1) % len1;
            const v_n = new THREE.Vector3(pos.getX(i3), pos.getY(i3), pos.getZ(i3));
            mesh.position.copy( v_c.lerp( v_n, a3) );
        });
    };
    // just a short hand for THREE.QuadraticBezierCurve3
    const QBC3 = function(x1, y1, z1, x2, y2, z2, x3, y3, z3){
        let vs = x1;
        let ve = y1;
        let vc = z1;
        if(arguments.length === 9){
            vs = new THREE.Vector3(x1, y1, z1);
            ve = new THREE.Vector3(x2, y2, z2);
            vc = new THREE.Vector3(x3, y3, z3);
        }
        return new THREE.QuadraticBezierCurve3( vs, vc, ve );
    };
    // create curve points
    const createCurvePoints = (curve, point_count, point_size, point_color, get_alpha) => {
        point_count = point_count === undefined ? 100 : point_count;
        point_size = point_size === undefined ? 1 : point_size;
        point_color = point_color || new THREE.Color(1, 1, 1);
        get_alpha = get_alpha || function(a1){ return a1; };
        const v3_array = [];
        let i = 0;
        while(i < point_count){
            v3_array.push( curve.getPoint( get_alpha(i / point_count) ));
            i += 1;
        }
        const points = new THREE.Points(
            new THREE.BufferGeometry().setFromPoints( v3_array ),
            new THREE.PointsMaterial({size: point_size, color: point_color})
        );
        return points;
    };
    // smooth get alpha
    const getAlphaSmoother = (a1) => {
        return THREE.MathUtils.smootherstep(a1, 0, 1);
    };
    //-------- ----------
    // GROUPS
    //-------- ----------
    const group1 = makeGroup({ count: 10, color: new THREE.Color(1, 0, 0) })
    scene.add(group1);
    const group2 = makeGroup({ count: 10, color: new THREE.Color(0, 1, 0)  })
    scene.add(group2);
    const group3 = makeGroup({ count: 10, color: new THREE.Color(0, 0, 1)  })
    scene.add(group3);
    // geometry used to update group1, group2, and group3
    const geo1 = new THREE.SphereGeometry(4, 10, 10);
    const geo2 = new THREE.BoxGeometry(2, 2, 2);
    const geo3 = new THREE.TorusGeometry(6, 1, 10, 40);
    geo3.rotateX(Math.PI * 0.5);
    //-------- ----------
    // MESH OBJECTS FOR UPDATE GEOS
    //-------- ----------
    const mesh1 = new THREE.Mesh(geo1, 
        new THREE.MeshBasicMaterial({
            color: new THREE.Color(1, 0, 0),
            transparent: true, opacity: 0.2, wireframe: true, wireframeLinewidth: 2
        })
    );
    scene.add(mesh1);
    const mesh2 = new THREE.Mesh(geo2, 
        new THREE.MeshBasicMaterial({
            color: new THREE.Color(0, 1, 0),
            transparent: true, opacity: 0.8, wireframe: true, wireframeLinewidth: 4
        })
    );
    scene.add(mesh2);
    const mesh3 = new THREE.Mesh(geo3, 
        new THREE.MeshBasicMaterial({
            color: new THREE.Color(0, 0, 1),
            transparent: true, opacity: 0.2, wireframe: true, wireframeLinewidth: 1
        })
    );
    scene.add(mesh3);
    //-------- ----------
    // CURVE
    //-------- ----------
    const curve1 = new THREE.CurvePath();
    curve1.add( QBC3(5, 0, -5, 5, 0, 5, 10, -5, 2) );
    curve1.add( QBC3(5, 0, 5, -5, 5, 0, -10, 2.5, 10) );
    //-------- ----------
    // POINTS
    //-------- ----------
    scene.add( createCurvePoints(curve1, 100, 0.125, new THREE.Color(1,1,1), getAlphaSmoother ) );
    //-------- ----------
    // MESH TO MOVE ALONG CURVE
    //-------- ----------
    const mesh_curve1 = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1), 
        new THREE.MeshNormalMaterial({
            transparent: true, opacity: 0.8
        })
    );
    scene.add(mesh_curve1)
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
            ['template2', 64, 17, 14, 'white'],
            ['', 64, 32, 14, 'white'],
            ['', 64, 47, 14, 'white'],
            ['( r140 dd/mm/yyyy )', 64, 70, 12, 'gray'],
            ['video3', 64, 100, 10, 'gray']
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
    // start options for main seq object
    const opt_seq = {
        fps: 30,
        beforeObjects: function(seq){
            textCube.visible = false;
            camera.position.set(8, 1, 0);
            camera.zoom = 1;
        const a1 = seq.per;
        const a2 = seq.getSinBias(1, false);
        positionGroupToGeometry(group1, geo1, a1);
        positionGroupToGeometry(group2, geo2, a2);
        positionGroupToGeometry(group3, geo3, a2);
        mesh_curve1.position.copy( curve1.getPoint( getAlphaSmoother(a1) ) );
        mesh_curve1.lookAt(0, 0, 0);
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
            // camera
            const v1 = new THREE.Vector3(8, 1, 0);
            const v2 = new THREE.Vector3(8, 8, 8);
            camera.position.copy( v1.lerp(v2, partPer) );
            camera.lookAt(0, 0, 0);
        }
    };
    // SEQ 2 - ...
    opt_seq.objects[2] = {
        secs: 25,
        v3Paths: [
            { key: 'campos', array: [8, 8, 8, 8, 8, -8, -8, 0, -8], lerp: true }
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
 
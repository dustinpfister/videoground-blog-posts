// video1 for threejs-curve-geometry-from
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
    // get position data array helper
    const getCurvePosData = (curve1, curve2, points_per_line) => {
        const pos_data = [];
        let pi = 0;
        while(pi < points_per_line){
            const a1 = pi / (points_per_line - 1);
            const v1 = curve1.getPoint(a1);
            const v2 = curve2.getPoint(a1);
            pos_data.push(v1.x, v1.y, v1.z, v2.x, v2.y, v2.z);
            pi += 1;
       }
       return pos_data;
    };
    // get uv data array helper
    const getCurveUVData = (curve1, curve2, points_per_line) => {
        const uv_data = [];
        let pi = 0;
        while(pi < points_per_line){
            const a1 = pi / (points_per_line - 1);
            uv_data.push(a1, 0, a1, 1);
            pi += 1;
       }
       return uv_data;
    };
    // set index
    const setCurveGeoIndex = (geo, points_per_line) => {
        const data_index = [];
        let pi2 = 0;
        while(pi2 < points_per_line - 1){
            const a = pi2 * 2;
            const b = a + 1;
            const c = a + 2;
            const d = a + 3;
            data_index.push(b, c, d, c, b, a);
            pi2 += 1;
        }
        geo.setIndex(data_index);
    };
    // create curve geo
    const createCurveGeo = (curve1, curve2, points_per_line) => {
        const geo = new THREE.BufferGeometry();
        const uv_data = getCurveUVData(curve1, curve2, points_per_line);
        // position/index
        const pos_data = getCurvePosData(curve1, curve2, points_per_line);
        geo.setAttribute('position', new THREE.Float32BufferAttribute( pos_data, 3 ) );
        setCurveGeoIndex(geo, points_per_line);
        // uv
        geo.setAttribute('uv', new THREE.Float32BufferAttribute( uv_data, 2 ) );
        // normal
        geo.computeVertexNormals();
        return geo;
    };
    const updateCurveGeo = (geo, curve1, curve2, points_per_line) => {
        const pos_data = getCurvePosData(curve1, curve2, points_per_line);
        const pos = geo.getAttribute('position');
        pos.array = pos.array.map((n, i) => { return pos_data[i] });
        pos.needsUpdate = true;
        // normal
        geo.computeVertexNormals();
        return geo;
    };
    const QBC3 = (c1_start, c1_control, c1_end) => {
        return new THREE.QuadraticBezierCurve3(c1_start, c1_control, c1_end);
    };
    // ---------- ----------
    // LIGHT
    // ---------- ----------
    const dl = new THREE.DirectionalLight(0xffffff, 1);
    dl.position.set(0, 1, -5);
    scene.add(dl);
    const al = new THREE.AmbientLight(0xffffff, 0.25);
    scene.add(al);
    // ---------- ----------
    // CURVES
    // ---------- ----------
    const c1_start = new THREE.Vector3(-5,0,5), 
    c1_control = new THREE.Vector3(0, 10, 0), 
    c1_end = new THREE.Vector3(5,0,5),
    c2_start = new THREE.Vector3(-5,0,-5), 
    c2_control = new THREE.Vector3(0, -5, 0), 
    c2_end = new THREE.Vector3(5,0,-5);
    const curve1 = new THREE.QuadraticBezierCurve3(c1_start, c1_control, c1_end);
    const curve2 = new THREE.QuadraticBezierCurve3(c2_start, c2_control, c2_end);
    // ---------- ----------
    // GEO POSITION / UV
    // ---------- ----------
    const geo = createCurveGeo(
         QBC3(c1_start, c1_control, c1_end),
         QBC3(c2_start, c2_control, c2_end),
         50
    );
    // ---------- ----------
    // TEXTURE
    // ---------- ----------
    // USING THREE DATA TEXTURE To CREATE A RAW DATA TEXTURE
    const width = 128, height = 128;
    const size = width * height;
    const data = new Uint8Array( 4 * size );
    for ( let i = 0; i < size; i ++ ) {
        const stride = i * 4;
        // x and y pos
        const xi = i % width;
        const yi = Math.floor(i / width);
        const v2 = new THREE.Vector2(xi, yi);
        // alphas
        const a_rnd1 = THREE.MathUtils.seededRandom();
        const a_rnd2 = THREE.MathUtils.seededRandom();
        const a_rnd3 = THREE.MathUtils.seededRandom();
        let a_dist = v2.distanceTo( new THREE.Vector2( width * 0.25, height * 0.75) ) / (width / 16);
        a_dist = a_dist % 1;
        const a_x = xi / width;
        const a_y = yi / height;
        const cv = 255 * (a_dist);
        // red, green, blue, alpha
        data[ stride ] = cv;
        data[ stride + 1 ] = 0;
        data[ stride + 2 ] = 255 - cv;
        data[ stride + 3 ] = 255;
    }
    const texture = new THREE.DataTexture( data, width, height );
    texture.needsUpdate = true;
    // ---------- ----------
        // MATERIAL AND MESH
    // ---------- ----------
    const material = new THREE.MeshPhongMaterial({ map: texture, wireframe: false, side: THREE.DoubleSide});
    const mesh = new THREE.Mesh(geo, material);
    scene.add(mesh);
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
    const v3Array_campos = curveMod.QBV3Array([
        [8,1,0, -5,4,-10,    20,2,-10,      100]
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
            ['Geometry Made', 64, 17, 14, 'white'],
            ['From Curves', 64, 32, 14, 'white'],
            ['in Threejs ', 64, 47, 14, 'white'],
            ['( r140 12/16/2022 )', 64, 70, 12, 'gray'],
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

            const a1 = seq.getSinBias(8, false);
            const a2 = seq.getSinBias(4, false);

            c1_start.set(-5 - 15 * seq.per, 0, 5);
            c1_end.set(5, 0, 5);
            c1_control.set(5 * seq.per,-5 + 10 * a1, 0);


            c2_start.set(-5 + 4 * seq.per, 0, -5);
            c2_end.set(5 - 4 * seq.per, 0, -5);
            c2_control.set(0, 2.5 - 5 * a2, 0);

        },
        afterObjects: function(seq){
            camera.updateProjectionMatrix();
            updateCurveGeo(
                geo,
                QBC3(c1_start, c1_control, c1_end),
                QBC3(c2_start, c2_control, c2_end),
                50
            );
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
            //camera.position.set(15, 15, 15);
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
 
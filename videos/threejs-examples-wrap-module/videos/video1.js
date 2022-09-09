// video1 forthreejs-examples-wrap-module
 
// scripts
VIDEO.scripts = [
   '../../../js/canvas/r0/canvas.js',
   '../../../js/canvas-text-cube/r0/canvas-text-cube.js',
   '../../../js/sequences-hooks/r1/sequences-hooks.js',
   '../js/threejs-wrap-r0.js'
];
// init
VIDEO.init = function(sm, scene, camera){
 
    //-------- ----------
    // LIGHT
    //-------- ----------
    const dl = new THREE.DirectionalLight(0xffffff, 1);
    dl.position.set(1,10,3);
    scene.add(dl);
    const al = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(al);
    //-------- ----------
    // HELPERS
    //-------- ----------
    // make a cone with the geometry adjusted so that it points to x+ by default
    const makeCone = (len, radius, color) => {
        len = len === undefined ? 3 : len;
        radius = radius === undefined ? 0.5 : radius;
        color = color || new THREE.Color(1, 1, 1);
        const mesh = new THREE.Mesh(
            new THREE.ConeGeometry(radius, len, 20, 20),
            new THREE.MeshPhongMaterial({
                color: color,
                transparent: true,
                opacity: 0.8
            }));
        mesh.geometry.rotateX( Math.PI * 0.5 );
        mesh.geometry.rotateY( Math.PI * 0.5 );
        return mesh;
    };
    // make a cube
    const makeCube = (size, color) => {
        size = size === undefined ? 1 : size;
        color = color || new THREE.Color(1, 1, 1);
        const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(size, size, size),
            new THREE.MeshPhongMaterial({
                color: color,
                transparent: true,
                opacity: 0.8
            }));
        return mesh;
    };
    // get an alpha value for a wrap
    const getWrapAlpha = (value, vMin, vMax) => {
        const range = Math.abs(vMax - vMin);
        // looks like I might have a one liner here...
        return Math.abs( vMin - wrapMod.wrap(value, vMin, vMax) ) / range;
    };
    // update a group
    var updateGroup = function (group, secs) {
       var gud = group.userData;
       var bs = gud.boundSize / 2;
       var ms = gud.meshSize / 2;
       var a = bs * -1 + ms;
       var b = bs - ms;
       var vMin = new THREE.Vector3(a, a, a);
       var vMax = new THREE.Vector3(b, b, b);
       group.children.forEach(function(mesh){
            var ud = mesh.userData;
            // update
            mesh.position.x += ud.dir.x * ud.pps * secs;
            mesh.position.y += ud.dir.y * ud.pps * secs;
            mesh.position.z += ud.dir.z * ud.pps * secs;
            // if wrap vector
            if(gud.type === 'wrapVector'){
                wrapMod.wrapVector(
                    mesh.position,
                    vMin,
                    vMax);
            }
            // if wrap vector length type
            if(gud.type === 'wrapVectorLength'){
                wrapMod.wrapVectorLength(
                    mesh.position,
                    a,
                    b);
                mesh.lookAt(group.position);
            }

        });
    };
    // create group
    var createGroup = function (count, spread, ppsMin, ppsMax, meshSize, boundSize, color, getDir) {
        spread = spread === undefined ? 5 : spread;
        count = count === undefined ? 50 : count;
        ppsMin = ppsMin === undefined ? 0.5 : ppsMin;
        ppsMax = ppsMax === undefined ? 2 : ppsMax;
        meshSize = meshSize === undefined ? 1 : meshSize;
        boundSize = boundSize === undefined ? 4 : boundSize;
        color = color || new THREE.Color(1, 1, 1);
        getDir = getDir || function(){
            let v = new THREE.Vector3(1, 0, 0);
            let e = new THREE.Euler(
                0,
                Math.PI * 2 * Math.random(),
                Math.PI * 2 * Math.random());
            return v.applyEuler(e);
        };
        var group = new THREE.Group();
        var gud = group.userData;
        gud.meshSize = meshSize;
        gud.boundSize = boundSize;
        gud.type = 'wrapVector';
        var i = 0;
        while (i < count) {
            var mesh = makeCube(gud.meshSize, color);
            // start position
            mesh.position.x = spread * -1 + spread * 2 * THREE.MathUtils.seededRandom();
            mesh.position.y = spread * -1 + spread * 2 * THREE.MathUtils.seededRandom();
            mesh.position.z = spread * -1 + spread * 2 * THREE.MathUtils.seededRandom();
            // user data values, pps and direction
            var ud = mesh.userData;
            ud.pps = ppsMin + (ppsMax - ppsMin) * THREE.MathUtils.seededRandom();
            ud.dir = getDir(group, mesh, i);
            group.add(mesh);
            i += 1;
        }
        updateGroup(group, 0);
        return group;
    };
    //-------- ----------
    // OBJECTS
    //-------- ----------
    var group1 = createGroup(80, 5, 0.25, 1, 0.75, 5, new THREE.Color(0,1,1));
    group1.userData.type = 'wrapVector';
    group1.position.set(-5,0,-5);
    scene.add(group1);
    var group2 = createGroup(80, 5, 0.25, 1, 0.75, 5, new THREE.Color(0,1,0));
    group2.userData.type = 'wrapVectorLength';
    group2.position.set(5,0,5);
    scene.add(group2);
    const mesh1 = makeCone(7, 2);
    scene.add(mesh1);

    // BACKGROUND
    scene.background = new THREE.Color('#2a2a2a');

    // GRID
    var grid = scene.userData.grid = new THREE.GridHelper(10, 10, '#ffffff', '#00afaf');
    grid.material.linewidth = 3;
    scene.add( grid );
 
    // TEXT CUBE
    var textCube = scene.userData.textCube = CanvasTextCube.create({
        width: 128,
        height: 128,
        lineWidth: 7,
        lineColor: 'rgba(0,100,128,0.8)',
        lineCount: 9,
        lines: [
            ['template2', 64, 17, 14, 'white'],
            ['', 64, 32, 14, 'white'],
            ['', 64, 47, 14, 'white'],
            ['( r140 dd/mm/yyyy )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);

    // A SEQ FOR TEXT CUBE
    var seq_textcube = seqHooks.create({
        setPerValues: false,
        fps: 30,
        beforeObjects: function(seq){
            var textCube = scene.userData.textCube;
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

    // A MAIN SEQ OBJECT
    var seq = scene.userData.seq = seqHooks.create({
        fps: 30,
        beforeObjects: function(seq){
            textCube.visible = false;
            camera.position.set(8, 1, 0);

            var secs = 1 / 30;
let pi2 = Math.PI * 2,
    eMin = new THREE.Euler(0, pi2 * 0.5 * -1, 0),
    eMax = new THREE.Euler(pi2, pi2 * 0.25, pi2),
    degPerSec = 45;

            updateGroup(group1, secs);
            updateGroup(group2, secs);
            mesh1.rotation.y += Math.PI / 180 * degPerSec * secs;
            wrapMod.wrapEuler(mesh1.rotation, eMin, eMax);
            mesh1.material.opacity = 1 - Math.abs( 0.5 - getWrapAlpha(mesh1.rotation.y, eMin.y, eMax.y) ) / 0.5;

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
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(8 - 18 * partPer, 1 + 9 * partPer, 10 * partPer);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 20,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(-10, 10, 10);
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
    var seq = scene.userData.seq;
    seqHooks.setFrame(seq, sm.frame, sm.frameMax);

};


// video1 for threejs-vector3-wrap
 
// scripts
VIDEO.scripts = [
   '../../../js/canvas/r0/canvas.js',
   '../../../js/canvas-text-cube/r0/canvas-text-cube.js',
   '../../../js/sequences-hooks/r1/sequences-hooks.js',
   '../../../js/datatex/r0/datatex.js',
   './wrap-vector-r0.js'
];
// init
VIDEO.init = function(sm, scene, camera){

    //-------- ----------
    // HELPERS
    //-------- ----------
    // create group
    var texture = datatex.seededRandom(4, 4, 1, 1, 1, [64,255]);
    var createGroup = function (count, spread, ppsMin, ppsMax, meshSize, boundSize, color, gitDir) {
        count = count === undefined ? 50 : count;
        spread = spread === undefined ? 5 : spread;
        ppsMin = ppsMin === undefined ? 0.5 : ppsMin;
        ppsMax = ppsMax === undefined ? 2 : ppsMax;
        meshSize = meshSize === undefined ? 1 : meshSize;
        boundSize = boundSize === undefined ? 4 : boundSize;
        color = color === undefined ? new THREE.Color(1, 1, 1) : color;
        var group = new THREE.Group();
        var gud = group.userData;
        gud.meshSize = meshSize;
        gud.boundSize = boundSize;
        var i = 0;
        while (i < count) {
            var mesh = new THREE.Mesh(
                new THREE.BoxGeometry(gud.meshSize, gud.meshSize, gud.meshSize), 
                new THREE.MeshPhongMaterial({
                    color: color,
                    map: texture,
                    transparent: true,
                    opacity: 0.80
                })
            );
            // start position
            mesh.position.x = spread * THREE.MathUtils.seededRandom();
            mesh.position.y = spread * THREE.MathUtils.seededRandom();
            mesh.position.z = spread * THREE.MathUtils.seededRandom();
            // user data values, pps and direction
            var ud = mesh.userData;
            ud.pps = ppsMin + (ppsMax - ppsMin) * THREE.MathUtils.seededRandom();
            ud.dir = gitDir ? gitDir(group, mesh, i) : new THREE.Vector3(0, 1, 0).normalize();
            group.add(mesh);
            i += 1;
        }
        return group;
    };
    // update a group
    var updateGroup = function (group, secs, bias) {
       var gud = group.userData;
       var bs = gud.boundSize / 2;
       var ms = gud.meshSize / 2;
       var a = bs * -1 + ms;
       var b = bs - ms;
       var vMin = new THREE.Vector3(a, a, a);
       var vMax = new THREE.Vector3(b, b, b);
       group.children.forEach(function(mesh){
            var ud = mesh.userData;
            var d = mesh.position.distanceTo(group.position);
            var dp = d / bs;
            dp = dp < 0 ? 0 : dp;
            dp = dp > 1 ? 1 : dp;

            mesh.position.x += ud.dir.x * ud.pps * secs;
            mesh.position.y += ud.dir.y * ud.pps * secs;
            mesh.position.z += ud.dir.z * ud.pps * secs;

            mesh.material.opacity = 1.0 - 0.75 * dp;

            wrapVector(
                mesh.position,
                vMin,
                vMax);
        });
    };

    // BACKGROUND
    scene.background = new THREE.Color('#000000');

    // LIGHT
    var dl = new THREE.DirectionalLight(0xffffff, 1);
    dl.position.set(2, 1, -3);
    scene.add(dl);
    var al = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(al);

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
            ['Wrap Vector3', 64, 17, 14, 'white'],
            ['Class instances', 64, 32, 14, 'white'],
            ['', 64, 47, 14, 'white'],
            ['( r140 09/05/2022 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);

    // GROUPS
    // group1 uses default values
    var group1 = createGroup(50, 10, 0.5, 2, 1, 10, 0xff0000);
    scene.add(group1);
    // group2 uses custom values
    var group2 = createGroup(100, 10, 0.125, 0.25, 0.25, 10, 0x00ff00, () => {
        return new THREE.Vector3(
            -5 + 10 * THREE.MathUtils.seededRandom(),
            -5 + 10 * THREE.MathUtils.seededRandom(),
            -5 + 10 * THREE.MathUtils.seededRandom());
    });
    scene.add(group2);
    // group2 uses custom values
    var group3 = createGroup(100, 10, 0.75, 1.0, 0.5, 10, 0x00ffff, () => {
        return new THREE.Vector3(-1, 0, 0);
    });
    scene.add(group3);


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

            updateGroup(group1, 1 / 30, seq.bias);
            updateGroup(group2, 1 / 30, seq.bias);
            updateGroup(group3, 1 / 30, seq.bias);

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
                    camera.position.set(8 - 3 * partPer, 1 + 4 * partPer, 5 * partPer);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 5,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(5, 5, 5);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 15,
                update: function(seq, partPer, partBias){
                    // camera
                    var s = 5 + 5 * partPer;
                    camera.position.set(s, s, s);
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


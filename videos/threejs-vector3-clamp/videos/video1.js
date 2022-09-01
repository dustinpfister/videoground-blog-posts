// video1 for threejs-vector3-clamp
 
// scripts
VIDEO.scripts = [
   '../../../js/canvas/r0/canvas.js',
   '../../../js/canvas-text-cube/r0/canvas-text-cube.js',
   '../../../js/sequences-hooks/r1/sequences-hooks.js'
];
// init
VIDEO.init = function(sm, scene, camera){
 
    //-------- ----------
    // HELPERS
    //-------- ----------
    // mod method
    var mod = function (a, b) {
        return THREE.MathUtils.euclideanModulo(a, b);
    };
    // wrap and axis
    var wrapAxis = function(vec, vecMin, vecMax, axis){
        axis = axis || 'x';
        var maxD = new THREE.Vector2(vecMin[axis], 0).distanceTo( new THREE.Vector2(vecMax[axis], 0) );
        var d = new THREE.Vector2(vec[axis], 0).distanceTo( new THREE.Vector2(vecMin[axis], 0) );
        if(maxD === 0){
           vec[axis] = 0;
        }else{
            if(vec[axis] >= vecMax[axis]){
                vec[axis] = vecMin[axis] + mod(d, maxD);
            }
            if(vec[axis] < vecMin[axis]){
                vec[axis] = vecMax[axis] - mod(d, maxD);
            }
        }
    };
    // wrap a vector
    var wrapVector = function (vec, vecMin, vecMax) {
        vecMin = vecMin || new THREE.Vector3(0, 0, 0);
        vecMax = vecMax || new THREE.Vector3(1, 1, 1);
        wrapAxis(vec, vecMin, vecMax, 'x');
        wrapAxis(vec, vecMin, vecMax, 'y');
        wrapAxis(vec, vecMin, vecMax, 'z');
    };
    // get a random axis
    var randAxis = function () {
        return (0.25 + 1.25 * Math.random()) * (Math.random() < 0.5 ? -1 : 1);
    };
    // create group
    var createGroup = function (clampType, color) {
        clampType = clampType || 'clamp';
        color = color || 0xffffff;
        var group = new THREE.Group();
        var i = 0,
        len = 100;
        while (i < len) {
            var mesh = new THREE.Mesh(
                new THREE.BoxGeometry(1.0, 1.0, 1.0), 
                new THREE.MeshPhongMaterial({
                    color: color,
                    transparent: true,
                    opacity: 0.60
                })
            );
            var ud = mesh.userData;
            var start_dir = ud.start_dir = new THREE.Vector3();
            ud.alpha = 0;
            ud.dr = 0.05 + 0.95 * Math.random();
            ud.clampType = clampType;
            start_dir.x = randAxis();
            start_dir.y = randAxis();
            start_dir.z = randAxis();
            mesh.position.copy(start_dir.normalize().multiplyScalar(2));
            group.add(mesh);
            i += 1;
        }
        return group;
    };
    // update group
    var update = function (group, delta) {
        group.children.forEach(function (mesh, i) {
            var ud = mesh.userData;
            var start_dir = ud.start_dir;
            var pos = mesh.position;
            ud.alpha += delta * ud.dr;
            pos.copy(start_dir.clone().normalize().multiplyScalar(ud.alpha));
            // clamp type
            if(ud.clampType === 'clamp'){
                pos.clamp(
                    new THREE.Vector3(-10, -10, -10),
                    new THREE.Vector3(10, 10, 10));
                if (Math.abs(pos.x) === 10 || Math.abs(pos.z) === 10) {
                    ud.alpha = 0;
                }
            }
            // if clamp type is length
            if(ud.clampType === 'length'){
                pos.clampLength(0.1, 10);
                mesh.lookAt(group.position);
                if(pos.length() === 10){
                    ud.alpha = 0;
                }
            }
            // if clamp type is wrap
            if(ud.clampType === 'wrap'){
                wrapVector(
                    pos,
                    new THREE.Vector3(-10, -10, -10),
                    new THREE.Vector3(10, 10, 10));
                //ud.alpha = ud.alpha % 2;
            }
        });
    };

    var group1 = createGroup('clamp', 0xff0000);
    scene.add(group1);
    var group2 = createGroup('length', 0x00ff00);
    scene.add(group2);
    var group3 = createGroup('wrap', 0x00ffff);
    scene.add(group3);
    var group4 = createGroup('none', 0xffffff);
    scene.add(group4);

    // BACKGROUND
    scene.background = new THREE.Color('#2a2a2a');

    //-------- ----------
    // LIGHT
    //-------- ----------
    var dl = new THREE.DirectionalLight(0xffffff, 1);
    dl.position.set(8, 1, 3);
    scene.add(dl);
    // GRID
    //var grid = scene.userData.grid = new THREE.GridHelper(10, 10, '#ffffff', '#00afaf');
    //grid.material.linewidth = 3;
    //scene.add( grid );
 
    // TEXT CUBE
    var textCube = scene.userData.textCube = CanvasTextCube.create({
        width: 128,
        height: 128,
        lineWidth: 7,
        lineColor: 'rgba(0,100,128,0.8)',
        lineCount: 9,
        lines: [
            ['The Vector3', 64, 17, 14, 'white'],
            ['Clamp Method', 64, 32, 14, 'white'],
            ['in threejs', 64, 47, 14, 'white'],
            ['( r140 09/01/2022 )', 64, 70, 12, 'gray'],
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

            update(group1, 0.25);
            update(group2, 0.25);
            update(group3, 0.25);
            update(group4, 0.15);

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
                secs: 2,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(8, 1 + 7 * partPer, 8 * partPer);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 2,
                update: function(seq, partPer, partBias){
                    // camera
                    var s = 8 + 7 * partPer;
                    camera.position.set(s, s, s);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 23,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(15, 15, 15);
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


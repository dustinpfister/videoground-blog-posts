// video1 for threejs-examples-aplerp
 
// scripts
VIDEO.scripts = [
   '../../../js/canvas.js',
   '../../../js/canvas-text-cube.js',
   '../../../js/sequences-hooks-r1.js',
   '../js/aplerp-r0.js'
];
// init
VIDEO.init = function(sm, scene, camera){
 
    //******** **********
    // MATH.SIN getAlpha Method
    //******** **********
    var sinGetAlpha = function(state, param){
        param.piM = param.piM === undefined ? 2 : param.piM;
        param.bMulti = param.bMulti=== undefined ? 0.1 : param.bMulti;
        param.aOffset = param.aOffset=== undefined ? 0.5 : param.aOffset;
        var r = Math.PI * param.piM * state.p;
        var b = Math.sin( r );
        var a = state.p + b * param.bMulti;
        // apply aOffset
        a += param.aOffset;
        a %= 1;
        // clamp
        a = a < 0 ? 0 : a;
        a = a > 1 ? 1 : a;
        return a;
    };

    //******** **********
    // UPDATE METHOD USING APLERP
    //******** **********

    var update = function(group, alpha){
        // for each child group ( ch, gi )
        group.children.forEach(function(cg, gi, gArr ){
            var gAlpha = ( gi + 1 ) / gArr.length;
            // for each mesh of current child group (m, mi)
            cg.children.forEach(function(m, mi, mArr){
                var v1 = new THREE.Vector3(-5, 0, 0),
                v2 = new THREE.Vector3(5, 0, 0);
                var mAlpha = ( mi + 1 ) / mArr.length;
                var v3 = apLerp.lerp(v1, v2, mAlpha, { 
                    getAlpha:  sinGetAlpha,
                    gaParam: {
                        piM: 2,
                        bMulti: 0.2 - 0.199 * gAlpha, 
                        aOffset: 2 * alpha
                    }
                });
                // adding to v3 for addtional effect
                var d = v3.distanceTo(new THREE.Vector3( 0, 0, 0) );
                var v4 = v3.clone().add( new THREE.Vector3(0, 2 - 2 * gAlpha * ( d / ( 5 * mAlpha) ), 0) );
                m.position.copy(  v4  );
                // rotation
                m.rotation.x = Math.PI * 0.5 * gAlpha + Math.PI * 8 * mAlpha * alpha;
                // opacity effect for material
                m.material.opacity = 1 - (d / 5);
            });
        });
    };

    //******** **********
    // MOVE CAMERA METHOD USING APLERP
    //******** **********
    var moveCamera = function(camera, v1Arr, v2Arr, alpha, bMulti){
        bMulti = bMulti === undefined ? 0.085 : bMulti;
        alpha = alpha >= 1 ? 0.99 : alpha;
        var v1 = (new THREE.Vector3()).fromArray(v1Arr);
        var v2 = (new THREE.Vector3()).fromArray(v2Arr);
        var v3 = apLerp.lerp(v1, v2, alpha, { 
            getAlpha:  sinGetAlpha,
            gaParam: {
                piM: 2,
                bMulti: bMulti, 
                aOffset: 0.0
            }
        });
        camera.position.copy(v3);
    };

    //******** **********
    // ADD MESH OBJECTS
    //******** **********
    var v1 = new THREE.Vector3(-5, 0, 0);
    var v2 = new THREE.Vector3(5, 0, 0);
    var group = new THREE.Group();
    var i = 0, len = 10;
    var colors = [0xffffff, 0x00ff00, 0xffff00, 0x00ffff, 0xff4400, 0xff00ff];
    while(i < len){
        var per = i / len;
        var cg = new THREE.Group();
        // how many mesh objects per group
        var ci = 0, cLen = 15, s = 0.5;
        while(ci < cLen){
            var mesh = new THREE.Mesh(
                new THREE.BoxGeometry(s, s, s),
                new THREE.MeshStandardMaterial({ 
                    color: colors[ci % colors.length],
                    transparent: true }) );
            cg.add(mesh);
            ci += 1;
        }
        cg.position.z = -5 + 10 * per + 0.5;
        group.add(cg);
        i += 1;
    }
    scene.add(group);
    update(group, 0);
    //******** **********
    // LIGHT
    //******** **********
    var dl = new THREE.DirectionalLight(0xffffff, 1);
    dl.position.set(2, 3, 1);
    scene.add(dl);


    // BACKGROUND
    scene.background = new THREE.Color('#1a1a1a');

    // GRID
    var grid = scene.userData.grid = new THREE.GridHelper(10, 10, '#ffffff', '#00afaf');
    grid.material.linewidth = 3;
    grid.material.transparent = true;
    grid.material.opacity = 0.25;
    scene.add( grid );
 
    // TEXT CUBE
    var textCube = scene.userData.textCube = CanvasTextCube.create({
        width: 128,
        height: 128,
        lineWidth: 7,
        lineColor: 'rgba(0,100,128,0.8)',
        lineCount: 9,
        lines: [
            ['Advanced Lerp', 64, 17, 14, 'white'],
            ['Module', 64, 32, 14, 'white'],
            ['threejs example', 64, 47, 14, 'white'],
            ['( r140 07/29/2022 )', 64, 70, 12, 'gray'],
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

            update(group, seq.per);

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
                    moveCamera(camera, [8, 1, 0], [10, 7, 10], partPer, 0.02);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 5,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(10, 7, 10);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 10,
                update: function(seq, partPer, partBias){
                    // camera
                    moveCamera(camera, [10, 7, 10], [-5, 0, 10], partPer);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 10,
                update: function(seq, partPer, partBias){
                    // camera
                    moveCamera(camera, [-5, 0, 10], [-5, -5, -10], partPer);
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


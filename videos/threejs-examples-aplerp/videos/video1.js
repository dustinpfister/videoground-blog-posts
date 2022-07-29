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
                var v4 = v3.clone().add( new THREE.Vector3(0, 2 - 2 * gAlpha * ( d / (5 * mAlpha) ), 0) );
                m.position.copy(  v4  );
                // rotation
                m.rotation.x = Math.PI * 0.5 * gAlpha + Math.PI * 8 * mAlpha * alpha;
            });
        });
    };

    //******** **********
    // ADD MESH OBJECTS
    //******** **********
    var v1 = new THREE.Vector3(-5, 0, 0);
    var v2 = new THREE.Vector3(5, 0, 0);
    var group = new THREE.Group();
    var i = 0, len = 10;
    while(i < len){
        var per = i / len;
        var cg = new THREE.Group();
        // how many mesh objects per group
        var ci = 0, cLen = 15, s = 0.3;
        while(ci < cLen){
            var mesh = new THREE.Mesh( new THREE.BoxGeometry(s, s, s), new THREE.MeshStandardMaterial({}) );
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
    scene.background = new THREE.Color('#2a2a2a');

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
                    camera.position.set(8 + 2 * partPer, 1 + 6 * partPer, 10 * partPer);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 25,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(10, 7, 10);
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


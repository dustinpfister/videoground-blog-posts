// video1 for threejs-point-light
 
// scripts
VIDEO.scripts = [
   '../../../js/canvas/r0/canvas.js',
   '../../../js/canvas-text-cube/r0/canvas-text-cube.js',
   '../../../js/sequences-hooks/r1/sequences-hooks.js',
   '../../../js/datatex/r0/datatex.js'
];


VIDEO.daePaths = [
  '../../../dae/sphere-normal-invert/sphere-normal-invert-base.dae'
];

// init
VIDEO.init = function(sm, scene, camera){

    //******** **********
    // SPHERE MESH
    //******** **********

    var dscene = VIDEO.daeResults[0].scene;
    var sourceObj = {};
    var sphereInvert = sourceObj.sphereInvert = dscene.getObjectByName('sphere-inverted');
    sphereInvert.material = new THREE.MeshPhongMaterial({
        map: datatex.seededRandom(256, 256, 1, 1, 1, [20, 150]),
        color: 0xffffff
    });
    scene.add(sphereInvert);


    //******** **********
    // TORUS MESH
    //******** **********
    var torus = new THREE.Mesh(
        new THREE.TorusGeometry( 5, 3, 16, 100 ), 
        new THREE.MeshStandardMaterial( { color: 0xffffff } ) );
    scene.add( torus );


    //******** **********
    // LIGHT
    //******** **********
    // custom make point light helper, helper function
    var makePointLightHelper = function(pl){
        var helper = new THREE.PointLightHelper(pl);
        helper.material.wireframeLinewidth = 6;
        helper.geometry = new THREE.SphereGeometry(0.5, 4, 4);
        return helper;
    };

    // update point light group
    var updatePointLightGroup = function(plGroup, alpha, dSet){
        dSet = dSet === undefined ? 1 : dSet;
        plGroup.children.forEach(function(pl, i, arr){
            var per = i / arr.length;
            var bias = 1 - Math.abs(0.5 - per) / 0.5;
            var x = -20 + 20 * ( 1 - dSet ) + 40 * (per * dSet);
            var y = 0;
            pl.position.set( x, y, 0);
            pl.intensity = 0.25 + 0.75 * bias
        });
        plGroup.children[3].intensity = 0.25;
    };

    // point light group
    var plGroup = new THREE.Group();
    scene.add(plGroup);
    [0xff0000, 0x00ff00, 0x0000ff, 0xafafaf, 0xff00ff, 0x00ffff, 0xffff00].forEach(function(color, i, arr){
        var pl = new THREE.PointLight(color, 0);
        plGroup.add( makePointLightHelper(pl) );
        plGroup.add(pl);
    });
    updatePointLightGroup(plGroup, 1, 1);

    // BACKGROUND
    scene.background = new THREE.Color('#2a2a2a');

    // GRID
    //var grid = scene.userData.grid = new THREE.GridHelper(10, 10, '#ffffff', '#00afaf');
    //grid.material.linewidth = 3;
    //scene.add( grid );
 
    // SPHERE
 
    // TEXT CUBE
    var textCube = scene.userData.textCube = CanvasTextCube.create({
        width: 128,
        height: 128,
        lineWidth: 7,
        lineColor: 'rgba(0,100,128,0.8)',
        lineCount: 9,
        lines: [
            ['Point Lights', 64, 17, 14, 'white'],
            ['in', 64, 32, 14, 'white'],
            ['threejs', 64, 47, 14, 'white'],
            ['( r140 08/23/2022 )', 64, 70, 12, 'gray'],
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


            updatePointLightGroup(plGroup, 1, 0.5 + 1.5 * seq.per);

            plGroup.rotation.x = Math.PI / 180 * 45 * seq.per;
            plGroup.rotation.y = Math.PI * 2 * 4 * seq.per;


            torus.rotation.set(0, Math.PI * 0.5, 0);

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
                    camera.position.set(8, 1 + 7 * partPer, 8 * partPer);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 20,
                update: function(seq, partPer, partBias){
                    // camera
                    var b = seq.getSinBias(2);
                    camera.position.set(8, 8 - 16 * b, 8);
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


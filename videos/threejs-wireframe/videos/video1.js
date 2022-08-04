// video1 for threejs-wireframe
 
// scripts
VIDEO.scripts = [
   '../../../js/canvas.js',
   '../../../js/canvas-text-cube.js',
   '../../../js/sequences-hooks-r1.js'
];
// init
VIDEO.init = function(sm, scene, camera){
 
    // BACKGROUND
    scene.background = new THREE.Color('#2a2a2a');

    var materials = [
        new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true, wireframeLinewidth: 6}),
        new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true, wireframeLinewidth: 6}),
        new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true, wireframeLinewidth: 6}),
    ];
    var material_normal = new THREE.MeshNormalMaterial({wireframe: true, wireframeLinewidth: 6});
    var material_standard = new THREE.MeshStandardMaterial({wireframe: true, wireframeLinewidth: 6});
    scene.overrideMaterial = null;
 

    // LIGHT ( for standard material )
    var dl = new THREE.DirectionalLight(0xffffff, 1);
    dl.position.set(2, 1, 3);
    scene.add(dl);
 
    // MESH OBJECTS
    var w = 8, h = 4, d = 3, x = 0, y = 0, z = 0;
    while(x < w){
         var y = 0;
         while(y < h){
             var z = 0;
             while(z < d){
                 var mi = Math.floor( THREE.MathUtils.seededRandom() * materials.length );
                 var mesh = new THREE.Mesh( new THREE.BoxGeometry(1, 1, 1), materials[mi] );
                 mesh.position.set(
                     -1 + ( ( w / 2 * -1 ) + w * ( x / w ) * 1.4 ), 
                     ( ( h / 2 * -1 ) + h * ( y / h ) * 1.4 ), 
                     ( ( d / 2 * -1 ) + d * ( z / d ) * 1.4 ) );
                 scene.add(mesh);
                 z += 1;
             }
             y += 1;
         }
         x += 1;
    }

    // TEXT CUBE
    var textCube = scene.userData.textCube = CanvasTextCube.create({
        width: 128,
        height: 128,
        lineWidth: 7,
        lineColor: 'rgba(0,100,128,0.8)',
        lineCount: 9,
        lines: [
            ['Wireframes', 64, 17, 14, 'white'],
            ['in', 64, 32, 14, 'white'],
            ['threejs', 64, 47, 14, 'white'],
            ['( r140 08/03/2022 )', 64, 70, 12, 'gray'],
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

            scene.overrideMaterial = null;
            dl.position.set(2, 1, 3);

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
                    var v1 = new THREE.Vector3(8, 1, 0);
                    var v2 = new THREE.Vector3(10, 10, 10);
                    camera.position.copy( v1.clone().lerp(v2, partPer ) );
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 3,
                update: function(seq, partPer, partBias){
                    // camera
                    var v1 = new THREE.Vector3(10, 10, 10);
                    var v2 = new THREE.Vector3(0, 8, 10);
                    camera.position.copy( v1.clone().lerp(v2, partPer ) );
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 3,
                update: function(seq, partPer, partBias){

                    scene.overrideMaterial = material_normal;

                    // camera
                    camera.position.set(0, 8, 10);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 3,
                update: function(seq, partPer, partBias){

                    scene.overrideMaterial = material_normal;

                    // camera
                    camera.position.set(2 * partBias, 8, 10 - 20 * partPer);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 3,
                update: function(seq, partPer, partBias){

                    scene.overrideMaterial = material_standard;

                    // camera
                    camera.position.set(0, 8, -10);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 5,
                update: function(seq, partPer, partBias){

                    scene.overrideMaterial = material_standard;
                    dl.position.set(2 - 4 * partPer, 1, 3 - 6 * partPer)

                    // camera
                    camera.position.set(0, 8, -10);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 3,
                update: function(seq, partPer, partBias){

                    scene.overrideMaterial = null;

                    // camera
                    camera.position.set(8 * partPer, 8, -10 + 18 * partPer);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 5,
                update: function(seq, partPer, partBias){

                    scene.overrideMaterial = null;

                    // camera
                    camera.position.set(8 + 2 * partPer, 8 + 2 * partPer, 8 + 2 * partPer);
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


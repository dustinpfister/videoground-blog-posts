// video1 for threejs-examples-weird-walk-one

VIDEO.scripts = [
   '../../../js/canvas.js',
   '../../../js/canvas-text-cube.js',
   '../../../js/sequences.js',
   './guy-weird.js'
];

// ********** **********
// HELPER METHODS
// ********** **********
// give frame, maxframe, and count to get values like per, bias, ect
var getFrameValues = function(frame, maxFrame, count){
    count = count === undefined ? 1 : count;
    var values = {
        frame: frame, 
        maxFrame: maxFrame
    };
    values.per = frame / maxFrame * count % 1;
    values.bias = 1 - Math.abs(0.5 - values.per) / 0.5;
    return values;
};

// init method for the video
VIDEO.init = function(sm, scene, camera){
 
    // BACKGROUND
    scene.background = new THREE.Color('#2a2a2a');
 
    // TEXT CUBE
    var textCube = scene.userData.textCube = CanvasTextCube.create({
        width: 128,
        height: 128,
        lineWidth: 7,
        lineColor: 'rgba(0,100,128,0.8)',
        lineCount: 9,
        lines: [
            ['Weird Walk', 64, 17, 15, 'white'],
            ['Guy Example', 64, 32, 15, 'white'],
            ['in Three.js.', 64, 47, 15, 'white'],
            ['( r135 04/22/2022 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    //camera.fov = 60;
    //camera.updateProjectionMatrix();
    camera.add(textCube);
    //camera.add(textCube);
    //scene.add(camera);

    var dl = new THREE.DirectionalLight(0xffffff, 0.8);
    dl.position.set(5, 10, 1);
    scene.add(dl);


    // ********** **********
    // GROUND MESH
    // ********** **********
    var width = 20, height = 100;
    var size = width * height;
    var data = new Uint8Array( 4 * size );
    for ( let i = 0; i < size; i ++ ) {
        var stride = i * 4;
        var x = i % width;
        var y = Math.floor(i / width);
        //var v = Math.floor( THREE.MathUtils.seededRandom() * 255 );
        var v = y % 2 === 0 ? 255 - 200 * (x / width) : 55 + 200 * (x / width);
        data[ stride ] = 0;
        data[ stride + 1 ] = v;
        data[ stride + 2 ] = 0;
        data[ stride + 3 ] = 255;
    }
    var texture = new THREE.DataTexture( data, width, height );
    texture.needsUpdate = true;

    var ground = new THREE.Mesh( new THREE.BoxGeometry(20, 1, 100), new THREE.MeshStandardMaterial({
        map: texture
    }) );
    ground.position.y = -0.5;
    scene.add(ground);

    // ********** **********
    // WEIRD GUY INSTANCE
    // ********** **********
    var guy = scene.userData.guy = weirdGuy.create({
        guyID: 'mrguy1'
    });
    guy.position.y = 2.75;
    scene.add(guy);
    weirdGuy.setWalk(guy, 0);


    guy.add(camera)

    // SET UP SEQ OBJECT
    sm.seq = Sequences.create({
        sm: sm,
        part : [
            {
                per: 0,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // text cube
                    textCube.visible = true;
                    //textCube.position.set(6, 0.8, 0);
                    // camera
                    //camera.position.set(8, 1, 0);
                    //camera.lookAt(guy.position);

                }
            },
            {
                per: 0.10,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // move up text cube
                    textCube.visible = true;
                    textCube.position.set(0, 2 * partPer, -2);
                    textCube.rotation.y = Math.PI * 2 * partPer;
                    // camera
                    //camera.position.set(8, 1, 0);
                    //camera.lookAt(guy.position);
                }
            },
            // sq1 - 
            {
                per: 0.15,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    //camera.position.set(8, 1, 0);
                    //camera.lookAt(guy.position);
/*
                    var v = guy.position.clone(),
                    len = v.length();
                    // camera
                     var camPos = new THREE.Vector3(8, 1, 0);
                    // BOOK MARK
                     camera.position.copy(camPos);
                    // look at
                     camera.lookAt(v.clone().normalize().multiplyScalar(len * partPer));
*/
                }
            }
        ]
    });
};

// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
    var textCube = scene.userData.textCube;
    textCube.rotation.y = 0;
    textCube.position.set(0, 0, -2);
    textCube.visible = false;

    var frame = sm.frame, maxFrame = sm.frameMax;

    var guy = scene.userData.guy;

    // camera
    camera.position.set(4, 2, 4);
    camera.lookAt(guy.position.clone().add(new THREE.Vector3(0,-0.50,0)));

    // update guy position over mesh
    var v = getFrameValues(frame, maxFrame, 1);
    guy.position.z = -10 + 20 * v.per;

    // set walk
    var v = getFrameValues(frame, maxFrame, 40);
    weirdGuy.setWalk(guy, v.bias);

    // setting arms
    var v1 = getFrameValues(frame, maxFrame, 10);
    var v2 = getFrameValues(frame, maxFrame, 80);
    var a2 = 360 - (80 + 20 * v2.bias);
    weirdGuy.setArm(guy, 1, 185 - 10 * v1.bias, a2 );
    weirdGuy.setArm(guy, 2, 175 + 10 * v1.bias, a2 );

    // body rotation
    var v = getFrameValues(frame, maxFrame, 1);
    var body = guy.getObjectByName(guy.name + '_body');
    body.rotation.y = -0.5 + 1 * v.bias;

    //var v = getFrameValues(frame, maxFrame, 40);
    //weirdGuy.setArm(guy, 1, 180 - 90 * v.bias, 300 );
    //weirdGuy.setArm(guy, 2, 90 + 90 * v.bias, 300 );

    // sequences
    Sequences.update(sm.seq, sm);

};

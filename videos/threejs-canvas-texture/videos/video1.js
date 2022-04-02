// scripts
VIDEO.scripts = [
   '../../../js/canvas.js',
   '../../../js/canvas-text-cube.js',
   '../../../js/sequences.js'
];
 
// init method for the video
VIDEO.init = function(sm, scene, camera){
 
    scene.add( new THREE.GridHelper(10, 10))
 
    // TEXT CUBE
    var textCube = scene.userData.textCube = CanvasTextCube.create({
        width: 128,
        height: 128,
        lineWidth: 7,
        lineColor: 'rgba(0,100,128,0.8)',
        lineCount: 9,
        lines: [
            ['Canvas Textures', 64, 20, 16, 'white'],
            ['in Three.js.', 64, 45, 16, 'white'],
            ['( r135 04/02/2022 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);
 
    var drawMethods = {};

    drawMethods.basic = {};

    drawMethods.basic.square = function(ctx, canvas, sm, opt){
        ctx.fillStyle = opt.bgStyle || 'gray';
        ctx.fillRect(-1, -1, canvas.width + 2, canvas.height + 2);
    };
 
    // canvas mod Object
    var canvasObj = CanvasMod.createCanvasObject(sm, drawMethods, {
        width: 32,
        height: 32
    });

    canvasObj.draw({drawClass: 'basic', drawMethod: 'square'});
 
    // SPHERE MESH
    let sphere = scene.userData.sphere = new THREE.Mesh(
        new THREE.SphereGeometry(1, 30, 30),
        new THREE.MeshStandardMaterial({
            emissive: new THREE.Color('white'),
            emissiveMap: canvasObj.texture
        }));
    scene.add(sphere);

    // SET UP SEQ OBJECT
    sm.seq = Sequences.create({
        sm: sm,
        part : [
            {
                per: 0,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    textCube.visible = true;
                    textCube.position.set(6, 0, 0);
                }
            },
            {
                per: 0.1,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    textCube.visible = true;
                    textCube.position.set(6, 2 * partPer, 0);
                    textCube.rotation.y = Math.PI * 2 * partPer;
                }
            },
            {
                per: 0.25,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){

                }
            }
        ]
    });

};

// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
    var textCube = scene.userData.textCube;
    camera.position.set(8, 0, 0);
    textCube.rotation.y = 0;
    textCube.position.set(6, 0, 0);
    textCube.visible = false;
    // sequences
    Sequences.update(sm.seq, sm);
    // have camera always look at center
    camera.lookAt(0, 0, 0);
};


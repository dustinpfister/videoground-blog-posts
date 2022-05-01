// video1 for threejs-alpha-map
 
// scripts
VIDEO.scripts = [
   '../../../js/canvas.js',
   '../../../js/canvas-text-cube.js',
   '../../../js/sequences.js'
];
// init
VIDEO.init = function(sm, scene, camera){
 
    // BACKGROUND
    scene.background = new THREE.Color('#2a2a2a');
    var grid = scene.userData.grid = new THREE.GridHelper(10, 10, '#ffffff', '#00afaf');
    scene.add( grid );
 
    // TEXT CUBE
    var textCube = scene.userData.textCube = CanvasTextCube.create({
        width: 128,
        height: 128,
        lineWidth: 7,
        lineColor: 'rgba(0,100,128,0.8)',
        lineCount: 9,
        lines: [
            ['Alpha Maps', 64, 17, 14, 'white'],
            ['in threejs', 64, 47, 14, 'white'],
            ['( r135 05/01/2022 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);

 
    // creating a texture with canvas
    var canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d');
    canvas.width = 64;
    canvas.height = 64;
    // drawing gray scale areas
    ctx.fillStyle = '#404040';
    ctx.fillRect(0, 0, 32, 32);
    ctx.fillStyle = '#808080';
    ctx.fillRect(32, 0, 32, 32);
    ctx.fillStyle = '#c0c0c0';
    ctx.fillRect(0, 32, 32, 32);
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(32, 32, 32, 32);
    var texture = new THREE.CanvasTexture(canvas);
 
    // creating a mesh that is using the Basic material
    var mesh = new THREE.Mesh(
        new THREE.BoxGeometry(5, 5, 5),
        new THREE.MeshBasicMaterial({
            color: 0x00ffff,
            // using the alpha map property to set the texture
            // as the alpha map for the material
            alphaMap: texture,
            // I also need to make sure the transparent
            // property is true
            transparent: true,
            // even when opacity is one the alpha map will 
            // still effect transparency this can just be used to set it even lower
            opacity: 1,
            //side: THREE.DoubleSide
            side: THREE.FrontSide
        }));
    scene.add(mesh);


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
                    textCube.position.set(6, 0.8, 0);
                    textCube.material.opacity = 1.0;
                    // camera
                    camera.position.set(8, 1, 0);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                per: 0.10,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // move up text cube
                    textCube.visible = true;
                    textCube.position.set(6, 0.8 + 1 * partPer, 0);
                    textCube.rotation.y = Math.PI * 2 * partPer;
                    textCube.material.opacity = 1.0 - partPer;
                    // camera
                    camera.position.set(8, 1, 0);
                    camera.lookAt(0, 0, 0);
                }
            },
            // sq1 - 
            {
                per: 0.15,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    camera.position.set(8 + 2 * partPer, 1 + 9 * partPer, 10 * partPer);
                    camera.lookAt(0, 0, 0);
                }
            },
            // sq2 - 
            {
                per: 0.20,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    camera.position.set(10, 10, 10);
                    camera.lookAt(0, 0, 0);
                }
            },
            // sq3 - 
            {
                per: 0.40,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    camera.position.set(10 - 3 * partPer, 10 - 3 * partPer, 10 - 3 * partPer);
                    camera.lookAt(0, 0, 0);
                }
            }
        ]
    });
};

// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
    var textCube = scene.userData.textCube;
    textCube.rotation.y = 0;
    textCube.position.set(8, 0.8, 0);
    textCube.visible = false;
    textCube.material.transparent = true;
    textCube.material.opacity = 0.0;
    // sequences
    Sequences.update(sm.seq, sm);
};


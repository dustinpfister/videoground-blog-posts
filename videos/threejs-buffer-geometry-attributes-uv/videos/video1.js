// video1 for threejs-geometry-attributes-uv
// scripts
VIDEO.scripts = [
   '../../../js/canvas.js',
   '../../../js/canvas-text-cube.js',
   '../../../js/sequences.js'
];


// init method for the video
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
            ['UV Attribute of', 64, 17, 14, 'white'],
            ['Buffer Geometry', 64, 32, 14, 'white'],
            ['in Three.js.', 64, 47, 14, 'white'],
            ['( r135 04/30/2022 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);


    // creating a simple canvas generated texture
    var canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d');
    canvas.width = 32;
    canvas.height = 32;
    ctx.fillStyle = '#004040'; // fill
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'white';
    ctx.fillStyle = 'red';
    ctx.beginPath(); // draw red and white circle
    ctx.arc(16, 16, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath(); // draw white square
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.stroke();
    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
 
    // GEOMETRY - starting with a plane
    var geometry = new THREE.PlaneGeometry(5, 5, 1, 1);
 
    var uv = scene.userData.uv = geometry.getAttribute('uv'),
    position = geometry.getAttribute('position');
 
    // use the geometry with a mesh
    var mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
                side: THREE.DoubleSide,
                map: texture
            }));
    mesh.position.set(0, 0.01, 2.5);
    mesh.rotation.set(1.57, 0, 0);
    scene.add(mesh);
 
    // another mesh where I am not doing anything to the uv values
    var geometry = new THREE.PlaneGeometry(5, 5, 1, 1);
    var mesh2 = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
                side: THREE.DoubleSide,
                map: texture
            }));
    mesh2.position.set(0, 0.01, -2.5);
    mesh2.rotation.set(1.57, 0, 0);
    scene.add(mesh2);

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
                    textCube.material.opacity = 1;
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
                    textCube.position.set(6, 0.8 + 2 * partPer, 0);
                    textCube.material.opacity = 1 - partPer;
                    textCube.rotation.y = Math.PI * 2 * partPer;
                    // camera
                    camera.position.set(8, 1, 0);
                    camera.lookAt(0, 0, 0);
                }
            },
            // sq1 - from FULL default to zoomed into center
            {
                per: 0.15,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    camera.position.set(8 + 2 * partPer, 1 + 9 * partPer, 0);
                    camera.lookAt(0, 0, 0);
                    var a = 0.5 * partPer,
                    b = 1 - 0.5 * partPer;

                    uv.array[0] = a;
                    uv.array[1] = b;
 
                    uv.array[2] = b;
                    uv.array[3] = b;
 
                    uv.array[4] = a;
                    uv.array[5] = a;
 
                    uv.array[6] = b;
                    uv.array[7] = a;
                }
            },
            // sq2 - zoomed into center 
            {
                per: 0.50,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    camera.position.set(10, 10, 0);
                    camera.lookAt(0, 0, 0);

                    uv.array[0] = 0.5;
                    uv.array[1] = 0.5;
 
                    uv.array[2] = 0.5;
                    uv.array[3] = 0.5;
 
                    uv.array[4] = 0.5;
                    uv.array[5] = 0.5;
 
                    uv.array[6] = 0.5;
                    uv.array[7] = 0.5;
  

                }
            },
            // sq3 - zoomed back out 
            {
                per: 0.50,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    camera.position.set(10, 10, 0);
                    camera.lookAt(0, 0, 0);

                    var a = 0.5 - 1.5 * partPer,
                    b = 0.5 + 1.5 * partPer;

                    uv.array[0] = a;
                    uv.array[1] = b;
 
                    uv.array[2] = b;
                    uv.array[3] = b;
 
                    uv.array[4] = a;
                    uv.array[5] = a;
 
                    uv.array[6] = b;
                    uv.array[7] = a;
  

                }
            }
        ]
    });
};

// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
    var textCube = scene.userData.textCube;
    textCube.rotation.y = 0;
    textCube.position.set(8, 1, 0);
    textCube.visible = false;
    textCube.material.transparent = true;
    textCube.material.opacity = 0.0;

    var uv = scene.userData.uv;

    // FULL

    uv.array[0] = 0;
    uv.array[1] = 1;
 
    uv.array[2] = 1;
    uv.array[3] = 1;
 
    uv.array[4] = 0;
    uv.array[5] = 0;
 
    uv.array[6] = 1;
    uv.array[7] = 0;


    // zoomed in
/*
    uv.array[0] = 0.25;
    uv.array[1] = 0.75;
 
    uv.array[2] = 0.75;
    uv.array[3] = 0.75;
 
    uv.array[4] = 0.25;
    uv.array[5] = 0.25;
 
    uv.array[6] = 0.75;
    uv.array[7] = 0.25;
*/


   // LOWER LEFT
/*
    uv.array[0] = 0;
    uv.array[1] = 0.5;
 
    uv.array[2] = 0.5;
    uv.array[3] = 0.5;
 
    uv.array[4] = 0;
    uv.array[5] = 0;
 
    uv.array[6] = 0.5;
    uv.array[7] = 0;
*/

    // UPPER RIGHT
/*
    uv.array[0] = 0.5;
    uv.array[1] = 0.0;
 
    uv.array[2] = 0.0;
    uv.array[3] = 0.0;
 
    uv.array[4] = 0.5;
    uv.array[5] = 0.5;
 
    uv.array[6] = 0;
    uv.array[7] = 0.5;
*/

    uv.needsUpdate = true;

    // sequences
    Sequences.update(sm.seq, sm);

};


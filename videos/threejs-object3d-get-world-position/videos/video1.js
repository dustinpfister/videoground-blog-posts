// video1 for threejs-object3d-get-world-position

// scripts
VIDEO.scripts = [
   '../../../js/canvas.js',
   '../../../js/canvas-text-cube.js',
   '../../../js/sequences.js'
];

var createGroup = function (color) {
    color = color || new THREE.Color(1, 1, 1);
    // creating a group
    var group = new THREE.Group();
    // creating and adding a pointer mesh to the group
    var geo = new THREE.CylinderGeometry(0, 0.5, 1, 12);
    geo.rotateX(Math.PI * 0.5);
    var pointer = group.userData.pointer = new THREE.Mesh(
            geo,
            new THREE.MeshNormalMaterial());
    pointer.position.set(0, 0, 0);
    pointer.rotation.y = 1.57; // BY DEFAULT THE POINTER IS NOT POINTING AT THE CUBE
    group.add(pointer);
    // creating and adding a cube
    var cube = group.userData.cube = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.5 }));
    cube.position.set(0, 0, 1);
    group.add(cube);
    // box helper for the group
    group.add(new THREE.BoxHelper(group));
    return group;
};
 
// init method for the video
VIDEO.init = function(sm, scene, camera){
 
    // BACKGROUND
    scene.background = new THREE.Color('#2a2a2a');
    scene.add( new THREE.GridHelper(10, 10, '#ffffff', '#00afaf') );
 
    // LIGHT
    var dl = new THREE.DirectionalLight(0xffffff, 1);
    dl.position.set(1, 1, 1);
    scene.add(dl);

    // TEXT CUBE
    var textCube = scene.userData.textCube = CanvasTextCube.create({
        width: 128,
        height: 128,
        lineWidth: 7,
        lineColor: 'rgba(0,100,128,0.8)',
        lineCount: 9,
        lines: [
            ['Get World Position', 64, 20, 14, 'white'],
            ['in Three.js.', 64, 45, 14, 'white'],
            ['( r135 04/24/2022 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);
 

 
var group = createGroup(0xff0000); // group 1
scene.add(group);
group.position.set(-2.0, 0, 0.0);
var group2 = createGroup(0x00ff00); // group2
scene.add(group2);
group2.position.set(2.0, 0, 0.0);
 
// the first group in am just using the look at method, and passing
// the value of the cube.position instance of vector3. THIS RESULTS IN THE
// CONE NOT POINTING AT THE CUBE, but at the location of the cube if it where
// positioned relative to world space rather than a location relative to the group
group.userData.pointer.lookAt(group.userData.cube.position);
 
// IF I WANT TO HAVE THE POINTER LOOK AT THE CUBE
// THAT IS A CHILD OF THE GROUP, THEN I WILL WANT TO ADJUST
// FOR THAT FOR THIS THERE IS THE getWorldPosition METHOD
var v = new THREE.Vector3(0, 0, 0);
group2.userData.cube.getWorldPosition(v);
group2.userData.pointer.lookAt(v);

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
                    textCube.rotation.y = Math.PI * 2 * partPer;
                    // camera
                    camera.position.set(8, 1, 0);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                per: 0.20,
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
    textCube.rotation.y = 0;
    textCube.position.set(6, 0, 0);
    textCube.visible = false;
    // sequences
    Sequences.update(sm.seq, sm);
};


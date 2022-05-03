// video1 for threejs-basic-material
 
// scripts
VIDEO.scripts = [
   '../../../js/canvas.js',
   '../../../js/canvas-text-cube.js',
   '../../../js/sequences.js',
   '../../../js/datatex.js'
];
// init
VIDEO.init = function(sm, scene, camera){
 
    // BACKGROUND
    scene.background = new THREE.Color('#2a2a2a');

    // GRID
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
            ['Basic material', 64, 17, 14, 'white'],
            ['in', 64, 32, 14, 'white'],
            ['three.js', 64, 47, 14, 'white'],
            ['( r135 05/03/2022 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);

    // box group
    var boxGroup = scene.userData.boxGroup = new THREE.Group();
    scene.add(boxGroup);

    var texture_rnd_white = datatex.seededRandom(32, 32, 1,1,1,[0,255]);

    var texture_dist = datatex.forEachPix(32, 32, function(x, y, w, h, i, stride, data){
        var obj = {};
        var v = new THREE.Vector2(x, y);
        var d = v.distanceTo(new THREE.Vector2(16, 16));
        var per = d / 16;
        per = per > 1 ? 1 : per;
        obj.g = 255 - 250 * per;
        return obj;
    });

    [
        new THREE.MeshBasicMaterial({ color: 0xff0000 }),
        new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent:true, opacity: 0.15 }),
        new THREE.MeshBasicMaterial({ color: 0xffffff, map: texture_rnd_white}),
        new THREE.MeshBasicMaterial({ color: 0xffffff, map: texture_dist}),
        [
            new THREE.MeshBasicMaterial({ color: 0xff0000 }),
            new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
            new THREE.MeshBasicMaterial({ color: 0x0000ff }),
            new THREE.MeshBasicMaterial({ color: 0xff00ff }),
            new THREE.MeshBasicMaterial({ color: 0xffff00 }),
            new THREE.MeshBasicMaterial({ color: 0x00ffff })
        ]
    ].forEach(function(material, i, arr){
        var per = i / (arr.length - 1 );
        // a mesh using the BASIC MATERIAL
        var box = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            material);
        box.position.set(0, 0, 4 - 8 * per);
        boxGroup.add(box);
    });


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
                    camera.position.set(8, 1 + 5 * partPer, 0);
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
    textCube.position.set(6, 0.8, 0);
    textCube.visible = false;
    textCube.material.transparent = true;
    textCube.material.opacity = 0.0;


var boxGroup = scene.userData.boxGroup;
boxGroup.children.forEach(function(box, i, arr){
    var a = i / (arr.length - 1);
    box.rotation.y = Math.PI * 2 * (8 * a) * per;
    box.rotation.x = Math.PI * 2 * per;
});

    // sequences
    Sequences.update(sm.seq, sm);
};


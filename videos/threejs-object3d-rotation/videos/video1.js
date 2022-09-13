// video1 for threejs-object3d-rotation
 
// scripts
VIDEO.scripts = [
   '../../../js/canvas/r0/canvas.js',
   '../../../js/canvas-text-cube/r0/canvas-text-cube.js',
   '../../../js/sequences-hooks/r1/sequences-hooks.js',
   '../../../js/datatex/r0/datatex.js'
];
// init
VIDEO.init = function(sm, scene, camera){
    //-------- ----------
    // DATA TEXTURES - starting data textures to work with
    //-------- ----------
    const texture_rnd1 = datatex.seededRandom(8,8,1,1,1,[ 0, 255]);
    const texture_rnd2 = datatex.seededRandom(32,32,1,1,1,[ 128, 200]);
    const texture_rnd3 = datatex.seededRandom(256,256,1,1,1,[ 64, 128]);
    // from px data textures
    const pal_gray = [
        [0,0,0,255],
        [255,255,255,255],
        [25,25,25,255],
        [50,50,50,255],
        [75,75,75,255],
        [100,100,100,255],
        [125,125,125,255],
        [150,150,150,255],
        [175,175,175,255],
        [200,200,200,255],
        [225,225,225, 255]
    ]
    const texture_square_small = datatex.fromPXDATA([
        2,2,2,2,
        2,1,1,2,
        2,1,1,2,
        2,2,2,2
    ], 4, pal_gray);
    const texture_square_med = datatex.fromPXDATA([
        0,2,2,0,0,2,2,0,
        2,3,3,4,4,3,3,2,
        2,3,4,5,5,4,3,2,
        0,4,5,1,1,5,4,0,
        0,4,5,1,1,5,4,0,
        2,3,4,5,5,4,3,2,
        2,3,3,4,4,3,3,2,
        0,2,2,0,0,2,2,0
    ], 8, pal_gray);
    //-------- ----------
    // LIGHT
    //-------- ----------
    const dl = new THREE.DirectionalLight(0xffffff, 1);
    dl.position.set(3, 2, 1)
    scene.add(dl);
    const al = new THREE.AmbientLight(0xffffff, 0.25);
    scene.add(al);
    //-------- ----------
    // HELPERS
    //-------- ----------
    const makeCube = (size, texture, color) => {
        size = size === undefined ? 1 : size;
        return new THREE.Mesh(
            new THREE.BoxGeometry(size, size, size),
            new THREE.MeshPhongMaterial({
                color: color || new THREE.Color(1, 1, 1),
                map: texture || texture_rnd1
            })
        );
    };
    const degToRad = (deg) => {
         return THREE.MathUtils.degToRad(deg);
    };
    //-------- ----------
    // BACKGROUND
    //-------- ----------
    scene.background = new THREE.Color('#afafaf');


    //-------- ----------
    // CHILD OBJECTS
    //-------- ----------
    var grid = scene.userData.grid = new THREE.GridHelper(50, 50, '#ffffff', '#000000');
    grid.material.linewidth = 3;
    grid.material.transparent = true;
    grid.material.opacity = 0.25;
    scene.add( grid );
    // cube mesh 1
    const mesh1 = makeCube(4, texture_square_med);
    scene.add(mesh1);
    // cube mesh 2
    const mesh2 = makeCube(2, texture_square_med);
    scene.add(mesh2);
    // group of mesh
    const group1 = new THREE.Group();
    scene.add(group1);
    let i = 0, len = 10;
    while(i < len){
        const mesh = makeCube(1, texture_square_small);
        mesh.position.set(-15 + 20 * (i / len), 0, 0);
        group1.add(mesh);
        i += 1;
    };
    group1.position.set(0, 0, -5);


    // sphere
    const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(30, 30, 30), 
        new THREE.MeshPhongMaterial({
           side: THREE.DoubleSide,
           map: texture_rnd3
        })
    );
    scene.add(sphere);


    //-------- ----------
    // TEXT CUBE
    //-------- ----------
    var textCube = scene.userData.textCube = CanvasTextCube.create({
        width: 128,
        height: 128,
        lineWidth: 7,
        lineColor: 'rgba(0,100,128,0.8)',
        lineCount: 9,
        lines: [
            ['Object3d', 64, 17, 14, 'white'],
            ['Rotation in', 64, 32, 14, 'white'],
            ['threejs', 64, 47, 14, 'white'],
            ['( r140 09/13/2022 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);
    // a seq object for textcube
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
    //-------- ----------
    // MAIN SEQ OBJECT
    //-------- ----------
    var seq = scene.userData.seq = seqHooks.create({
        fps: 30,
        beforeObjects: function(seq){

    const vStart = new THREE.Vector3(0, 0, 1);

        // setting rotation of mesh1
        mesh1.rotation.x = degToRad(90 * seq.getBias(1, false) );
        mesh1.rotation.y = degToRad(360) * seq.per;
        mesh1.rotation.z = 0;
 
        // using the state of the rotation of mesh1 to effect the position of mesh2
        let radius = 7 - 3 * seq.getSinBias(4, false);
        mesh2.position.copy(vStart).applyEuler( mesh1.rotation ).normalize().multiplyScalar(radius);
        mesh2.rotation.set(0, Math.PI * 2 * 8 * seq.per, 0);


group1.children.forEach((mesh, mi, arr)=>{

   mesh.rotation.y = Math.PI / 180 * 360 * 16 * ( (mi + 1) / arr.length ) * seq.per;

});

            // text cube and camera
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
                    camera.position.set(8, 1 + 7 * partPer, 8 * partPer);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 25,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(8, 8, 8);
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

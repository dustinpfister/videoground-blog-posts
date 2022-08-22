// video1 for threejs-lambert-material
 
// scripts
VIDEO.scripts = [
   '../../../js/canvas/r0/canvas.js',
   '../../../js/canvas-text-cube/r0/canvas-text-cube.js',
   '../../../js/sequences-hooks/r1/sequences-hooks.js',
   '../../../js/datatex/r0/datatex.js'
];
//******** **********
// dae files
//******** **********
VIDEO.daePaths = [
  '../../../dae/tiny-house-1/tiny-house-1-solid.dae'
];
// init
VIDEO.init = function(sm, scene, camera){
 

    //******** **********
    // ADDING CHILD MESH OBJECTS FROM DAE FILE
    //******** **********
    var dscene = VIDEO.daeResults[0].scene;
    var sourceObj = {};
    var th1 = sourceObj.tree1 = dscene.getObjectByName('tiny-house-1');
    th1.position.set(0, 0, 0);
    // remove child 0 if it is there and a LINE
    var child = th1.children[0];
    if(child){
        if(child.type === 'LineSegments'){
            child.removeFromParent();
        }
    }
    // USE THE LAMBERT MATERIAL
    var daeMaterial = th1.children[0].material;
    var lambert = new THREE.MeshLambertMaterial({
       map: daeMaterial.map
    });
    th1.children[0].material = lambert;
    scene.add(th1);

    //******** **********
    // PLANE MESH
    //******** **********
    var plane = new THREE.Mesh(
        new THREE.PlaneGeometry(50, 50, 1, 1),
        new THREE.MeshLambertMaterial({
            map: datatex.seededRandom(64, 64, 1, 1, 1, [180, 255]),
            color: new THREE.Color(0, 1, 0)
        })
    );
    plane.geometry.rotateX( Math.PI * 1.5 );
    scene.add(plane);

    //******** **********
    // LIGHT
    //******** **********
    var dl = new THREE.DirectionalLight(0xffffff, 1);
    dl.position.set(3, 1, 2);

    var pl = new THREE.PointLight(0xffffff, 0.65);
    pl.position.set(8, 5, -10);
    var helper = new THREE.PointLightHelper(pl);
    scene.add( helper );

    console.log(pl.position);
    console.log(helper.position);

    scene.add( new THREE.AmbientLight(0xffffff, 0.2))
    scene.add(dl);
    scene.add(pl);
 
    // BACKGROUND
    scene.background = new THREE.Color('#00a2a2');

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
            ['The Lambert', 64, 17, 14, 'white'],
            ['Material in', 64, 32, 14, 'white'],
            ['threejs', 64, 47, 14, 'white'],
            ['( r140 08/22/2022 )', 64, 70, 12, 'gray'],
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
            textCube.position.set(10, 5.0, 0);
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
                    textCube.material.opacity = 1.0;
                }
            },
            {
                per: 0.75,
                update: function(seq, partPer, partBias){
                    // move up text cube
                    textCube.visible = true;
                    textCube.position.set(10 - 5 * partPer, 5.0 + 1 * partPer, 0);
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
            camera.position.set(12, 5, 0);
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
                    camera.lookAt(0, 5, 0);
                }
            },
            {
                secs: 1,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(12 + 3 * partPer, 5, 0);
                    camera.lookAt(0, 5 - 1 * partPer, 0);
                }
            },
            {
                secs: 3,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(15, 5, 0);
                    camera.lookAt(0, 4, 0);
                }
            },
            {
                secs: 1,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(15, 5 + 10 * partPer, 15 * partPer);
                    camera.lookAt(0, 4, 0);
                }
            },
            {
                secs: 3,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(15, 15, 15);
                    camera.lookAt(0, 4, 0);
                }
            },
            {
                secs: 1,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(15 - 30 * partPer, 15, 15);
                    camera.lookAt(0, 4, 0);
                }
            },
            {
                secs: 3,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(-15, 15, 15);
                    camera.lookAt(0, 4, 0);
                }
            },
            {
                secs: 1,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(-15, 15, 15 - 30 * partPer);
                    camera.lookAt(0, 4, 0);
                }
            },
            {
                secs: 3,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(-15, 15, -15);
                    camera.lookAt(0, 4, 0);
                }
            },
            {
                secs: 1,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(-15 + 30 * partPer, 15 - 5 * partPer, -15);
                    camera.lookAt(0, 4, 0);
                }
            },
            {
                secs: 3,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(15, 10, -15);
                    camera.lookAt(0, 4, 0);
                }
            },
            {
                secs: 2,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(15 - 17 * partPer, 10 - 5 * partPer, -15 + 15 * partPer);
                    camera.lookAt(5 * partPer, 4, -5 * partPer);
                }
            },
            {
                secs: 5,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(-2, 5, 0);
                    var b = seq.getBias(2);
                    camera.lookAt(5, 4, -5 + 10 * b);
                }
            },
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


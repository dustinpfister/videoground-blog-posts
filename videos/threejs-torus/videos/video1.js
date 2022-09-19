// video1 for threejs-torus
 
// scripts
VIDEO.scripts = [
   '../../../js/canvas/r0/canvas.js',
   '../../../js/canvas-text-cube/r0/canvas-text-cube.js',
   '../../../js/sequences-hooks/r1/sequences-hooks.js'
];
// init
VIDEO.init = function(sm, scene, camera){
 
//-------- ----------
// HELPERS
//-------- ----------
const MAIN_RADIUS = 8,
DOUGHNUT_COUNT = 30;
// create a DOUGHNUT child for a group
const createDoughnutChild = (index, len) => {
    const per = index / len,
    bias = 1 - Math.abs(per - 0.5) / 0.5,
    radius = 0.6 + 2.3 * bias,
    tubeRadius = 0.125 + 0.25 * bias,
    radialSegments = 32,
    tubeSegments = 32;
    const doughnut = new THREE.Points(
        new THREE.TorusGeometry(radius, tubeRadius, radialSegments, tubeSegments),
        new THREE.PointsMaterial({
           color: 0xffffff,
           size: 0.125
        }));
    doughnut.geometry.rotateY(Math.PI * 0.5);
    return doughnut;
};
// create a group of DOUGHNUTs
const createDoughnutGroup = () => {
    let i = 0;
    const len = DOUGHNUT_COUNT,
    group = new THREE.Group();
    while(i < len){
        const per = i / len,
        radian = Math.PI * 2 * per;
        const doughnut = createDoughnutChild(i, len);
        doughnut.position.set(Math.cos(radian) * MAIN_RADIUS, 0, Math.sin(radian) * MAIN_RADIUS);
        doughnut.lookAt(0, 0, 0);
        group.add(doughnut);
        i += 1;
    }
    return group;
};

//-------- ----------
// ADDING GROUP TO SCENE
//-------- ----------
const group1 = createDoughnutGroup();
scene.add(group1);






    // BACKGROUND
    scene.background = new THREE.Color('#2a2a2a');

    // GRID
    var grid = scene.userData.grid = new THREE.GridHelper(10, 10, '#ffffff', '#00afaf');
    grid.material.linewidth = 3;
    scene.add( grid );
 
    // TEXT CUBE
    var textCube = scene.userData.textCube = CanvasTextCube.create({
        width: 128,
        height: 128,
        lineWidth: 7,
        lineColor: 'rgba(0,100,128,0.8)',
        lineCount: 9,
        lines: [
            ['Torus Geometry', 64, 17, 14, 'white'],
            ['in threejs', 64, 32, 14, 'white'],
            ['', 64, 47, 14, 'white'],
            ['( r140 09/19/2022 )', 64, 70, 12, 'gray'],
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
                    camera.lookAt(0, 0, 0);
        const radian = Math.PI * 2 * partPer;
        camera.position.set(Math.cos(radian) * MAIN_RADIUS, 0, Math.sin(radian) * MAIN_RADIUS);
        camera.lookAt(Math.cos(radian + 0.5) * MAIN_RADIUS, Math.sin(radian) * 0.5, Math.sin(radian - 0.5) * MAIN_RADIUS);
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


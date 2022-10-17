// video1 for template9-text-plane
// scripts
VIDEO.scripts = [
   '../../../js/sequences-hooks/r1/sequences-hooks.js',
   '../../../js/canvas/r1/canvas.js',
   '../../../js/canvas-text-cube/r1/canvas-text-cube.js',
   '../../../js/canvas-text-plane/r0/text-plane.js'
];
// init
VIDEO.init = function(sm, scene, camera){
    //-------- ----------
    // MESH
    //-------- ----------
    const plane = TextPlane.createPlane({
        w: 7, h: 5,
        rows: 10, size: 256, palette: ['rgba(0,255,255,0.2)', 'black', 'black']
    });
    plane.position.set(0, 2.5, 0);
    scene.add(plane);
    //-------- ----------
    // TEXT CUBE
    //-------- ----------
    const textCube = CanvasTextCube.create({
        bg: '#0a0a0a',
        size: 128,
        lineWidth: 7,
        lineColor: 'rgba(0,100,0,0.8)',
        lineCount: 9,
        lines: [
            ['template9', 64, 17, 14, 'white'],
            ['', 64, 32, 14, 'white'],
            ['', 64, 47, 14, 'white'],
            ['( r140 dd/mm/yyyy )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);
    //-------- ----------
    // TEXT and textLines
    //-------- ----------
    const text2 = '\n\nThis is just a little demo of my text plane module thus far. \n\nIt is all ready working okay, or at least it seems to be working well thus far. I am sure there may be at least one or two bugs still maybe,this is just r0 of the module after all. \n\nIf all goes well I am sure that I will start using this in a lof of my video projects as a way to add text content to an over all scene. \n'
    const textLines = TextPlane.createTextLines(text2, 25);
    //-------- ----------
    // BACKGROUND, GRID
    //-------- ----------
    scene.background = new THREE.Color('#2a2a2a');
    const grid = scene.userData.grid = new THREE.GridHelper(10, 10, '#ffffff', '#00afaf');
    grid.material.linewidth = 3;
    scene.add( grid );
    //-------- ----------
    // A MAIN SEQ OBJECT
    //-------- ----------
    const seq = scene.userData.seq = seqHooks.create({
        fps: 30,
        beforeObjects: function(seq){
            camera.position.set(0, 4, 8);
            // TEXT PLANE r0
            TextPlane.moveTextLines(plane.userData.canObj.state.lines, textLines, seq.per, 0, 30);
            canvasMod.update(plane.userData.canObj);
            // TEXT CUBE r1
            //const textCube = scene.userData.textCube;
            textCube.rotation.y = 0;
            textCube.position.set(0, 3.7, 6.1);
            textCube.visible = false;
            textCube.material.transparent = true;
            textCube.material.opacity = 0.0;
        },
        afterObjects: function(seq){
        },
        objects: [
            {
                secs: 3,
                update: function(seq, partPer, partBias){
                    // text cube
                    textCube.visible = true;
                    textCube.material.opacity = 1.0;

                    camera.lookAt(0, 2.5, 0);
                }
            },
            {
                secs: 7,
                update: function(seq, partPer, partBias){
                    // text cube
                    textCube.visible = true;
                    textCube.position.set(0, 3.7 + 1 * partPer, 6.1);
                    textCube.rotation.y = Math.PI * 2 * partPer;
                    textCube.material.opacity = 1.0 - partPer;
                    // camera
                    camera.position.set(4 * partPer, 4, 8 - 2 * partPer);
                    camera.lookAt(0, 2.5, 0);
                }
            },
            {
                secs: 3,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(4, 4, 6);
                    camera.lookAt(0, 2.5, 0);
                }
            },
            {
                secs: 17,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(4 - 8 * partPer, 4, 6);
                    camera.lookAt(0, 2.5, 0);
                }
            }
        ]
    });
    console.log('frameMax for main seq: ' + seq.frameMax);
    sm.frameMax = seq.frameMax;
};
 
// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
    const seq = scene.userData.seq;
    seqHooks.setFrame(seq, sm.frame, sm.frameMax);
};
 
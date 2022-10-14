// video1 for template9-text-plane
 
// scripts
VIDEO.scripts = [
   '../../../js/sequences-hooks/r1/sequences-hooks.js',
   '../../../js/canvas/r1/canvas.js',
   '../../../js/text-plane/r0/text-plane.js'
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
            // UPDATE
            TextPlane.moveTextLines(plane.userData.canObj.state.lines, textLines, seq.per, 0, 30);
            canvasMod.update(plane.userData.canObj);
        },
        afterObjects: function(seq){
        },
        objects: [
            {
                secs: 3,
                update: function(seq, partPer, partBias){
                    camera.lookAt(0, 2.5, 0);
                }
            },
            {
                secs: 7,
                update: function(seq, partPer, partBias){
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
 
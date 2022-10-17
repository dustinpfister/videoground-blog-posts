// video1 for threejs-examples-text-plane
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
    // HELPERS
    //-------- ----------
    const setLinesStyle = (lines, lw, fs, f) => {
        lines.forEach((lObj)=>{
            lObj.lw = lw;
            lObj.fs = fs + 'px';
            lObj.f = f;
        });
    };
    // update position attribute
    const updatePlaneGeoPosition = (plane, alpha, opt) => {
        opt = opt || {};
        opt.m = opt.m || new THREE.Vector3(6, 4, 0.2);
        opt.xWaves = opt.xWaves === undefined ? 8 : opt.xWaves;
        opt.yWaves = opt.yWaves === undefined ? 0.5 : opt.yWaves;
        const geo = plane.geometry;
        const pos = geo.getAttribute('position');
        let i = 0;
        const w = geo.parameters.widthSegments + 1;
        const h = geo.parameters.heightSegments + 1;
        while(i < pos.count){
            const x = i % w;
            const y = Math.floor(i / w);
            const px = x / ( w - 1 ) * opt.m.x - ( w - 1 ) *  opt.m.x / 2 / (w - 1 ) ;
            const py = y / ( h - 1 ) * opt.m.y * -1 + ( h - 1 ) *  opt.m.y / 2 / (h - 1);
            //let pz = 0;
            //let pz = Math.sin(i / pos.count * 8 * Math.PI * 2) * 0.2;
            //let pz = Math.sin(i / pos.count * 8 * (Math.PI * (x * 0.6 / w)) * 2) * 0.2;
            let xWaves = opt.xWaves * alpha;
            let yWaves = Math.PI * 2 * (y / h) * opt.yWaves;
            let pz = Math.sin(x / w * xWaves * ( Math.PI + yWaves) * 2) * opt.m.z;
            pos.setXYZ(i, px, py, pz);
            i += 1;
        }
        pos.needsUpdate = true;
        geo.computeVertexNormals();
    };
    //-------- ----------
    // CANVAS OBJECT
    //-------- ----------
    // canvas object 1 will be used for text
    const canObj1 = TextPlane.createCanObj({
        rows: 12, size: 256,
        palette: ['rgba(0,0,0,0)', '#8f8f8f', '#ffffff']
    });
    setLinesStyle( canObj1.state.lines, 1, 31, 'arial');
    // canvas object 2 will use the 'rnd' built in draw method
    // as a way to create a background a little more interesting
    // than just a static background
    let canObj2 = canvasMod.create({
        draw: 'rnd',
        size: 256,
        update_mode: 'canvas',
        state: {
            gSize: 32
        },
        palette: ['#00ff00', '#008800', '#004400', '#00ffaa', '#008844']
    });
    // canvas object 3 will be the final background use for the material
    let canObj3 = canvasMod.create({
        draw: function(canObj, ctx, canvas, state){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // draw down the back canvas
            ctx.globalAlpha = 1;
            ctx.drawImage(canObj2.canvas, 0, 0);
            // black overlay
            ctx.fillStyle = 'rgba(0,0,0,0.7)';
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            // draw the text
            ctx.globalAlpha = 1;
            ctx.drawImage(canObj1.canvas, 0, 0);
        },
        size: 256,
        update_mode: 'canvas',
        state: {
        },
        palette: ['black', 'white']
    });
    //-------- ----------
    // MESH
    //-------- ----------
    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(3.75, 2, 20, 20),
        new THREE.MeshBasicMaterial({
            map: canObj3.texture,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 1
        })
    );
    plane.position.set(0, 0, 0);
    scene.add(plane);
    const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(30, 30, 30),
        new THREE.MeshBasicMaterial({
             wireframe: true,
             wireframeLinewidth: 3
        })
    );
    scene.add(sphere);
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
            ['Text Plane', 64, 17, 14, 'white'],
            ['threejs example', 64, 32, 14, 'white'],
            ['', 64, 47, 14, 'white'],
            ['( r140 10/17/2022 )', 64, 70, 12, 'gray'],
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
    grid.material.transparent = true;
    grid.material.opacity = 0.25;
    scene.add( grid );
    //-------- ----------
    // A MAIN SEQ OBJECT
    //-------- ----------
    const seq = scene.userData.seq = seqHooks.create({
        fps: 30,
        beforeObjects: function(seq){
            // TEXT Plane r0
            TextPlane.moveTextLines(canObj1.state.lines, textLines, seq.bias, 0, 30);
            // TEXT CUBE r1
            textCube.rotation.y = 0;
            textCube.position.set(0, 3.7, 6.1);
            textCube.visible = false;
            textCube.material.transparent = true;
            textCube.material.opacity = 0.0;
            // camera
            camera.position.set(0, 4, 8);
            // geometry of plane
            updatePlaneGeoPosition(plane, seq.per, {
                xWaves : 8 * seq.bias,
                yWaves: 0.15 * seq.per,
                m: new THREE.Vector3(8 + 2 * seq.bias, 6, 1.5)
            });
        },
        afterObjects: function(seq){
            // TEXT PLANE r0
            canvasMod.update(canObj1);
            //canvasMod.update(canObj2);
            canvasMod.update(canObj3);
        },
        objects: [
            {
                secs: 3,
                update: function(seq, partPer, partBias){
                    // text cube
                    textCube.visible = true;
                    textCube.material.opacity = 1.0;
                    // camera
                    camera.lookAt(0, 2.5, 0);
                }
            },
            {
                secs: 2,
                update: function(seq, partPer, partBias){
                    // text cube
                    textCube.visible = true;
                    textCube.position.set(0, 3.7 + 1 * partPer, 6.1);
                    textCube.rotation.y = Math.PI * 2 * partPer;
                    textCube.material.opacity = 1.0 - partPer;
                    // camera
                    camera.position.set(4 * partPer, 4, 8);
                    camera.lookAt(0, 2.5 - 2.5 * partPer, 0);
                }
            },
            {
                secs: 5,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(4, 4, 8);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 20,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(4 - 8 * partPer, 4, 8);
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
    const seq = scene.userData.seq;
    seqHooks.setFrame(seq, sm.frame, sm.frameMax);
};
 
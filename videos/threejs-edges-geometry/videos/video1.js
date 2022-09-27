// video1 for threejs-edges-geometry
 
// scripts
VIDEO.scripts = [
   '../../../js/sequences-hooks/r1/sequences-hooks.js',
   '../../../js/canvas/r0/canvas.js',
   '../../../js/canvas-text-cube/r0/canvas-text-cube.js'
];
// init
VIDEO.init = function(sm, scene, camera){
    //-------- ----------
    // EDGE GEOMETRY CREATED FROM BOX GEOMETRY AND USING WITH THREE.LineSegments
    //-------- ----------

    // line1 is the box geo
    const boxGeo = new THREE.BoxGeometry(5, 5, 5),
    edgeGeo = new THREE.EdgesGeometry(boxGeo),
    line1 = new THREE.LineSegments(
            edgeGeo,
            new THREE.LineBasicMaterial({
                color: new THREE.Color('white'),
                linewidth: 8
            }));
    scene.add(line1);

    // line2 is a sphere geo
    const sphereGeo = new THREE.SphereGeometry(30, 30, 30),
    edgeGeoSphere = new THREE.EdgesGeometry(sphereGeo),
    line2 = new THREE.LineSegments(
            edgeGeoSphere,
            new THREE.LineBasicMaterial({
                color: new THREE.Color('cyan'),
                linewidth: 8,
                transparent: true,
                opacity: 0.15
            }));
    scene.add(line2);

    // line1 is the Torus geo
    const torusGeo = new THREE.TorusGeometry(4, 2.0, 15, 30);
    torusGeo.rotateX(Math.PI * 0.5);
    const edgeGeoTorus = new THREE.EdgesGeometry(torusGeo);
    const line3 = new THREE.LineSegments(
            edgeGeoTorus,
            new THREE.LineBasicMaterial({
                color: new THREE.Color('red'),
                linewidth: 4
            }));
    scene.add(line3);


    // line4 is the Torus Knot geo
    const torusKGeo = new THREE.TorusKnotGeometry(6, 1.75, 100, 8, 2, 3);
    const edgeGeoTorusK = new THREE.EdgesGeometry(torusKGeo);
    const line4 = new THREE.LineSegments(
            edgeGeoTorusK,
            new THREE.LineBasicMaterial({
                color: new THREE.Color('lime'),
                linewidth: 4
            }));
    scene.add(line4);
    //-------- ----------
    // BACKGROUND
    //-------- ----------
    scene.background = new THREE.Color('#000000');
    //-------- ----------
    // GRID
    //-------- ----------
    //var grid = scene.userData.grid = new THREE.GridHelper(10, 10, '#ffffff', '#00afaf');
    //grid.material.linewidth = 3;
    //scene.add( grid );
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
            ['Edges Geometry', 64, 17, 14, 'white'],
            ['in threejs', 64, 32, 14, 'white'],
            ['', 64, 47, 14, 'white'],
            ['( r140 09/27/2022 )', 64, 70, 12, 'gray'],
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
    //-------- ----------
    // A MAIN SEQ OBJECT
    //-------- ----------
    var seq = scene.userData.seq = seqHooks.create({
        fps: 30,
        beforeObjects: function(seq){
            // line1 - cube
            line1.rotation.set(0, 0, 0);
            // line2 - sphere
            line2.rotation.set(0, 0, 0);
            line2.rotation.y = Math.PI * 2 * seq.per;
            // line3 - torus
            line3.position.set(-10, -2, -2);
            line3.rotation.x = Math.PI * 0.5 * seq.per;
            line3.position.y = -2 - 8 * seq.per;
            // line4 - torus
            line4.position.set(-5, -15, -20);
            line4.rotation.y = Math.PI * 2 * seq.getSinBias(1, false);
            let s = 30 - 29.5 * seq.per;
            line4.scale.set(s, s, s);
            // textube, camera
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
                    // line1
                    line1.rotation.y = Math.PI * 2 * partPer;
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
                secs: 3,
                update: function(seq, partPer, partBias){
                    // line1
                    line1.rotation.y = Math.PI * 2 * partPer;
                    // camera
                    camera.position.set(8, 8, 8);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 2,
                update: function(seq, partPer, partBias){
                    // line1
                    line1.rotation.x = Math.PI * 2 * partPer;
                    // camera
                    camera.position.set(8, 8, 8);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 17,
                update: function(seq, partPer, partBias){
                    line1.rotation.x = Math.PI * 2 * partPer;
                    line1.rotation.y = Math.PI * 8 * partPer;
                    // camera
                    camera.position.set(8, 8, 8);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 3,
                update: function(seq, partPer, partBias){
                    // camera
                    const s = 8 - 3 * partPer;
                    camera.position.set(s, s, s);
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


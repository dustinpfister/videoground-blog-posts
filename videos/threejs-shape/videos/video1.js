// video1 for threejs-shape
 
// scripts
VIDEO.scripts = [
   '../../../js/sequences-hooks/r1/sequences-hooks.js',
   '../../../js/canvas/r0/canvas.js',
   '../../../js/canvas-text-cube/r0/canvas-text-cube.js'
];
// init
VIDEO.init = function(sm, scene, camera){
//-------- ----------
// HELPER FUNCTIONS
//-------- ----------
// make a heart shape
const makeHeartShape = (b, mb, sx, sy) => {
    b = b === undefined ? 9: b;
    mb = mb === undefined ? 0.75: mb;
    sx = sx === undefined ? 2.5: sx;
    sy = sy === undefined ? 2.5: sy;
    const shape = new THREE.Shape();
    shape.moveTo( sx, sy );
    shape.bezierCurveTo( sx, sy, 2, 0, 0, 0 );
    shape.bezierCurveTo( -3, 0, -3, 3, -3.0, 3 );
    shape.bezierCurveTo( -3, 5, -1, b * mb, 2, b );
    shape.bezierCurveTo( 6, b * mb, 8, 5, 8, 3 );
    shape.bezierCurveTo( 8, 3, 8, 0, 5, 0 );
    shape.bezierCurveTo( 3, 0, sx, sy, sx, sy );
    return shape;
};
// make a heart geometry
const makeHeartGeo = (b, mb, sx, sy, extrudeSettings) => {
    const shape = makeHeartShape(b, mb, sx, sy);
    extrudeSettings = extrudeSettings || {
        depth: 1.5,
        steps: 2,
        curveSegments: 20,
        bevelEnabled: true,
        bevelThickness: 1.5,
        bevelSize: 1.5,
        bevelOffset: 0,
        bevelSegments: 20
    };
    const geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
    geometry.rotateX(Math.PI * 1);
    geometry.rotateY(Math.PI * 0.5);
    geometry.center();
    return geometry;
};
// update geo
const updateGeo = (geoA, geoB) => {
    const posA = geoA.getAttribute('position');
    const posB = geoB.getAttribute('position');
    posA.array = posA.array.map((n, i)=>{
        return posB.array[i];
    });
    posA.needsUpdate = true;
    geoA.computeVertexNormals();
};
//-------- ----------
// GEOMETRY
//-------- ----------
const geometry = makeHeartGeo();




//-------- ----------
// MESH
//-------- ----------
const mesh = new THREE.Mesh( geometry, new THREE.MeshNormalMaterial() );
let s = 0.5;
mesh.scale.set(s, s, s);
// add the mesh to the scene
scene.add(mesh);




    //-------- ----------
    // BACKGROUND
    //-------- ----------
    scene.background = new THREE.Color('#2a2a2a');
    //-------- ----------
    // GRID
    //-------- ----------
    const grid = scene.userData.grid = new THREE.GridHelper(10, 10, '#ffffff', '#00afaf');
    grid.material.linewidth = 3;
    scene.add( grid );
    //-------- ----------
    // TEXT CUBE
    //-------- ----------
    const textCube = scene.userData.textCube = CanvasTextCube.create({
        width: 128,
        height: 128,
        lineWidth: 7,
        lineColor: 'rgba(0,100,128,0.8)',
        lineCount: 9,
        lines: [
            ['Shapes in', 64, 17, 14, 'white'],
            ['threejs', 64, 32, 14, 'white'],
            ['', 64, 47, 14, 'white'],
            ['( r140 10/10/2022 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);
    // A SEQ FOR TEXT CUBE
    const seq_textcube = seqHooks.create({
        setPerValues: false,
        fps: 30,
        beforeObjects: function(seq){
            const textCube = scene.userData.textCube;
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
    const seq = scene.userData.seq = seqHooks.create({
        fps: 30,
        beforeObjects: function(seq){

    const a = seq.per;
    const ab = 1 - Math.abs(0.5 - a) / 0.5;
    let b = 6 + 6 * ab;
    let mb = 0.75;
    let sy = 1.5  + 1 * ab;
    updateGeo(mesh.geometry, makeHeartGeo(b, mb, 2.5, sy));
    mesh.rotation.y = Math.PI * 4 * a;

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
    const seq = scene.userData.seq;
    seqHooks.setFrame(seq, sm.frame, sm.frameMax);
};
 
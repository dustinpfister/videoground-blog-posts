// video1-morphattributes.js - for threejs-points
VIDEO.scripts = [
   '../../../js/sequences-hooks/r2/sequences-hooks.js',
   '../../../js/canvas/r2/lz-string.js',
   '../../../js/canvas/r2/canvas.js',
   '../../../js/curve/r1/curve.js',
   '../../../js/canvas-text-cube/r1/canvas-text-cube.js'
];
// init
VIDEO.init = function(sm, scene, camera){


// ---------- ----------
// GEOMETRY
// base on this: https://github.com/mrdoob/three.js/blob/master/examples/webgl_morphtargets.html
// ---------- ----------
const geo = new THREE.BoxGeometry(2, 2, 2, 10, 10, 10);
geo.morphAttributes.position = [];
const pos = geo.attributes.position;
const data_pos = [];
const data_color = [];
for ( let i = 0; i < pos.count; i ++ ) {
    const x = pos.getX( i );
    const y = pos.getY( i );
    const z = pos.getZ( i );
    data_pos.push(
        x * Math.sqrt( 1 - ( y * y / 2 ) - ( z * z / 2 ) + ( y * y * z * z / 3 ) ),
        y * Math.sqrt( 1 - ( z * z / 2 ) - ( x * x / 2 ) + ( z * z * x * x / 3 ) ),
        z * Math.sqrt( 1 - ( x * x / 2 ) - ( y * y / 2 ) + ( x * x * y * y / 3 ) )
    );
    const a1 = i / pos.count;
    const r = a1;
    const g = a1 % 0.25 / 0.25;
    const b = a1 % 0.5 / 0.5;;
    data_color.push(r, g, b);
}
geo.morphAttributes.position[ 0 ] = new THREE.Float32BufferAttribute( data_pos, 3 );
geo.setAttribute('color', new THREE.Float32BufferAttribute( data_color, 3 ));
// ---------- ----------
// MATERIAL, POINTS
// ---------- ----------
const material = new THREE.PointsMaterial({ size: 0.25, vertexColors: true });
const points = new THREE.Points(geo, material);
points.scale.set(3, 3, 3);
scene.add(points);
points.morphTargetInfluences[ 0 ] = 1;
// ---------- ----------
// UPDATE HELPER
// ---------- ----------
// update
const updatepoints = function(points, alpha){
    points.morphTargetInfluences[ 0 ] = alpha;
};

    //-------- ----------
    // BACKGROUND - using canvas2 and lz-string to create a background texture
    //-------- ----------
    const canObj = canvasMod.create({
        size: 512,
        draw: 'grid_palette',
        palette: ['#000000', '#1f1f1f', '#00ffff'],
        dataParse: 'lzstring64',
        state: { w: 8, h: 5, data: 'AwGlEYyzNCVgpcmPit1mqvTsg===' }
    });
    // can use LZString to compress and decompress
    //console.log( LZString.decompressFromBase64('AwGlEYyzNCVgpcmPit1mqvTsg===') );
    // I want to repeat the texture
    const texture = canObj.texture;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(32, 24);
    scene.background = texture;
    //-------- ----------
    // GRID
    //-------- ----------
    const grid = scene.userData.grid = new THREE.GridHelper(10, 10, '#ffffff', '#00afaf');
    grid.material.linewidth = 5;
    scene.add( grid );
    //-------- ----------
    // TEXT CUBE
    //-------- ----------
    const textCube = scene.userData.textCube = CanvasTextCube.create({
        bg: '#000000',
        size: 128,
        lineWidth: 7,
        lineColor: 'rgba(0,100,0,0.8)',
        lineCount: 9,
        lines: [
            ['THREE.Points and', 64, 17, 14, 'white'],
            ['Morph Attributes', 64, 32, 14, 'white'],
            ['in threejs', 64, 47, 14, 'white'],
            ['( r146 Feb/23/2023 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);
    //-------- ----------
    // A SEQ FOR TEXT CUBE
    //-------- ----------
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
                    textCube.material.opacity = 0.9;
                }
            },
            {
                per: 0.75,
                update: function(seq, partPer, partBias){
                    // move up text cube
                    textCube.visible = true;
                    textCube.position.set(6, 0.8 + 1 * partPer, 0);
                    textCube.rotation.y = Math.PI * 2 * partPer;
                    textCube.material.opacity = 0.9 - 0.9 * partPer;
                }
            }
        ]
    });
    //-------- ----------
    // A MAIN SEQ OBJECT
    //-------- ----------
    // start options for main seq object
    const opt_seq = {
        fps: 30,
        beforeObjects: function(seq){
            textCube.visible = false;
            camera.position.set(8, 1, 0);
            camera.zoom = 1;
        },
        afterObjects: function(seq){
            camera.updateProjectionMatrix();
        },
        objects: []
    };
    // SEQ 0 - Text cube
    opt_seq.objects[0] = {
        secs: 3,
        update: function(seq, partPer, partBias){
            // POINTS
            updatepoints(points, seq.getSinBias(1));
            // textcube
            if(seq.partFrame < seq.partFrameMax){
               seqHooks.setFrame(seq_textcube, seq.partFrame, seq.partFrameMax);
            }
            // camera
            camera.position.set(8, 1, 0);
            camera.lookAt(0, 0, 0);
        }
    };
    // SEQ 1 - morph up and down a few times, zoom out
    opt_seq.objects[1] = {
        secs: 4,
        update: function(seq, partPer, partBias){
            // POINTS
            updatepoints(points, seq.getSinBias(4));
            // camera
            // camera
            camera.zoom = 1 - 0.5 * partPer;
            camera.position.set(8, 1, 0);
            camera.lookAt(0, 0, 0);
        }
    };
    // SEQ 2 - rotate camera around object in cube state
    opt_seq.objects[2] = {
        secs: 5,
        update: function(seq, partPer, partBias){
            // POINTS
            updatepoints(points, 0);
            // camera
            camera.zoom = 0.5;
            const e = new THREE.Euler();
            e.y = Math.PI * 2 * partPer;
            camera.position.set(8, 1, 0).applyEuler(e);
            camera.lookAt(0, 0, 0);
        }
    };

    // SEQ 3 - rotate camera around object and morph to sphere
    opt_seq.objects[3] = {
        secs: 5,
        update: function(seq, partPer, partBias){
            // POINTS
            updatepoints(points, partPer);
            // camera
            camera.zoom = 0.5;
            const e = new THREE.Euler();
            e.y = Math.PI * 2 * partPer;
            camera.position.set(8, 1, 0).applyEuler(e);
            camera.lookAt(0, 0, 0);
        }
    };
    // SEQ 4 - rotate camera around object and in sphere state
    opt_seq.objects[4] = {
        secs: 5,
        update: function(seq, partPer, partBias){
            // POINTS
            updatepoints(points, 1);
            // camera
            camera.zoom = 0.5;
            const e = new THREE.Euler();
            e.y = Math.PI * 2 * partPer;
            camera.position.set(8, 1, 0).applyEuler(e);
            camera.lookAt(0, 0, 0);
        }
    };
    // SEQ 5 - rotate camera around object and in morph in and out
    opt_seq.objects[5] = {
        secs: 8,
        update: function(seq, partPer, partBias){
            // POINTS
            updatepoints(points, 1 - seq.getSinBias(4));
            // camera
            camera.zoom = 0.5;
            const e = new THREE.Euler();
            e.y = Math.PI * 2 * partPer;
            e.x = Math.PI * 0.25 * partPer;
            camera.position.set(8, 1, 0).applyEuler(e);
            camera.lookAt(0, 0, 0);
        }
    };

    const seq = scene.userData.seq = seqHooks.create(opt_seq);
    console.log('frameMax for main seq: ' + seq.frameMax);
    sm.frameMax = seq.frameMax;
};
// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
    const seq = scene.userData.seq;
    seqHooks.setFrame(seq, sm.frame, sm.frameMax);
};
 
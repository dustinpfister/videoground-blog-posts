// video2 for threejs-examples-lines-sphere-circles

VIDEO.scripts = [
   '../../../js/sequences-hooks/r2/sequences-hooks.js',
   '../../../js/canvas/r1/canvas.js',
   '../../../js/canvas-text-cube/r1/canvas-text-cube.js',
   '../../../js/curve/r0/curve.js',
   'lines-sphere-circles-r1.js'
];
// init
VIDEO.init = function(sm, scene, camera){
//-------- ----------
// LINES
//-------- ----------
const opt = {
    maxRadius: 4,
    pointsPerCircle: 100,
    circleCount: 20,
    linewidth: 15,
    //colors: ['red', 'lime', 'blue', 'yellow', 'green', 'cyan', 'orange', 'pink', 'purple'],
/*
    colors: ['#00ff11','#00ee22','#00dd33','#00cc44','#00bb55',
             '#00aa66','#009977','#008888','#007799','#0066aa',
             '#0055bb','#0044cc','#0033dd','#0022ee','#0011ff'
    ],
*/
    colors: new Array(20).fill('.').map((e, i, arr) => {
        const color = new THREE.Color(0, 0, 0);
        const a1 = i / arr.length;
        color.g = 1 - a1;
        color.b = a1;
        return color.getStyle();
    }),
    forPoint: function(v, s, opt){
        v.x = v.x + -0.25 + 0.5 * Math.random();
        v.z = v.z + -0.25 + 0.5 * Math.random();
        return v;
    }
}
const g1 = LinesSphereCircles.create(opt);
scene.add(g1);

const update = function(frame, frameMax){
    const a1 = frame / frameMax * 2 % 1;
    const a2 = 1 - Math.abs( 0.5 - a1 * 4 % 1 ) / 0.5;
    g1.children.forEach( (line, i, arr) => {
        // rotate
        const count = Math.floor(i + 1);
        line.rotation.z = Math.PI * 2 * count * a1;
        // scale
        const s = 1 - (i / arr.length * 0.5 * a2);
        line.scale.set(s, s, s);
        // material
        const m = line.material;
        m.transparent = true;
        m.opacity = 0.85 - 0.80 * ( i / arr.length);
    });
    LinesSphereCircles.setByFrame(g1, frame, frameMax, opt);
    g1.rotation.y = Math.PI * 2 * a1;
};
    //-------- ----------
    // BACKGROUND
    //-------- ----------
    scene.background = new THREE.Color('#000000');
    //-------- ----------
    // GRID
    //-------- ----------
    //const grid = scene.userData.grid = new THREE.GridHelper(10, 10, '#ffffff', '#00afaf');
    //grid.material.linewidth = 3;
    //scene.add( grid );
    //-------- ----------
    // PATHS
    //-------- ----------
    const v3Array_campos = curveMod.QBV3Array([
        [8,8,8, -8,8,8,    8,4,0,      20]
    ]);
    //scene.add( curveMod.debugPoints( v3Array_campos ) );
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
            ['Sphere Circle Lines', 64, 17, 14, 'white'],
            ['threejs example', 64, 32, 14, 'white'],
            ['', 64, 47, 14, 'white'],
            ['( r140 12/19/2022 )', 64, 70, 12, 'gray'],
            ['video2', 64, 100, 10, 'gray']
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
                    textCube.material.opacity = 0.8;
                }
            },
            {
                per: 0.75,
                update: function(seq, partPer, partBias){
                    // move up text cube
                    textCube.visible = true;
                    textCube.position.set(6, 0.8 + 1 * partPer, 0);
                    textCube.rotation.y = Math.PI * 2 * partPer;
                    textCube.material.opacity = 0.8 - 0.8 * partPer;
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

update(seq.frame, seq.frameMax);

        },
        afterObjects: function(seq){
            camera.updateProjectionMatrix();
        },
        objects: []
    };
    // SEQ 0 - ...
    opt_seq.objects[0] = {
        secs: 3,
        update: function(seq, partPer, partBias){
            // textcube
            if(seq.partFrame < seq.partFrameMax){
               seqHooks.setFrame(seq_textcube, seq.partFrame, seq.partFrameMax);
            }
            // camera
            //camera.position.set(5, 18, 14);
            camera.lookAt(0, 0, 0);
        }
    };
    // SEQ 1 - ...
    opt_seq.objects[1] = {
        secs: 2,
        update: function(seq, partPer, partBias){
            // camera
            const v1 = new THREE.Vector3(8, 1, 0);
            const v2 = new THREE.Vector3(8, 8, 8);
            camera.position.copy( v1.lerp(v2, partPer) );
            camera.lookAt(0, 0, 0);
        }
    };
    // SEQ 2 - ...
    opt_seq.objects[2] = {
        secs: 25,
        v3Paths: [
            { key: 'campos', array: v3Array_campos, lerp: true }
        ],
        update: function(seq, partPer, partBias){
            // camera
            seq.copyPos('campos', camera);
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
 
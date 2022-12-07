// videeo1 for threejs-line-fat-width
VIDEO.scripts = [
   '../../../js/sequences-hooks/r2/sequences-hooks.js',
   '../../../js/canvas/r1/canvas.js',
   '../../../js/canvas-text-cube/r1/canvas-text-cube.js',
   '../../../js/curve/r0/curve.js',
   // Line2 and other needed files
   '../../../js/r140-files/line2/LineSegmentsGeometry.js',
   '../../../js/r140-files/line2/LineGeometry.js',
   '../../../js/r140-files/line2/LineMaterial.js',
   '../../../js/r140-files/line2/LineSegments2.js',
   '../../../js/r140-files/line2/Line2.js'
];
// init
VIDEO.init = function(sm, scene, camera){
    //-------- ----------
    // HELPERS
    //-------- ----------
    // create sin wave position array to use with the setPositions method
    const sinWave = (zStart, zEnd, x, waves, yMax, pointCount, radianOffset) => {
        const pos = [];
        let i = 0;
        while(i < pointCount){
           const a1 = i / (pointCount - 1);
           const z = zStart - (zStart - zEnd) * a1;
           let r = Math.PI * 2 * waves * a1 + radianOffset;
           r = THREE.MathUtils.euclideanModulo(r, Math.PI * 2);
           const y = Math.sin(r) * yMax;
           pos.push(x, y, z);
           i += 1;
        }
        return pos;
    };
    // color trans
    const colorTrans = (color1, color2, posArray, camera) => {
        const colors = [];
        let i = 0;
        const pointCount = posArray.length / 3;
        while(i < pointCount){
           const a1 = i / (pointCount - 1);
           // raw color values
           let r = color1.r * (1 - a1) + color2.r * a1;
           let g = color1.g * (1 - a1) + color2.g * a1;
           let b = color1.b * (1 - a1) + color2.b * a1;
           // vector3 in pos Array
           let v3 = new THREE.Vector3( posArray[i], posArray[i + 1], posArray[i + 2] );
           const d = v3.distanceTo(camera.position);
           let a_d = 0;
           if(d >= camera.near && d <= camera.far){
                a_d = 1 - 1 * (d - camera.near) / ( camera.far - camera.near );
           }
           colors.push(r * a_d, g * a_d, b * a_d);
           i += 1;
        }
        return colors;
    };
    // update line group
    const updateLine2Group = (l2Group, camera, a1 ) => {
        const a2 = 1 - Math.abs(0.5 - a1) / 0.5;
        let i = 0;
        const count = l2Group.children.length;
        const pointCount = 120;
        while(i < count){
            const a_line = i / (count);
            const a_line2 = 1 - Math.abs(0.5 - a_line) / 0.5;
            const line = l2Group.children[i];
            const x = -5 + 10 * a_line;
            const yMax = 1 + 3 * a_line2;
            const radianOffset = Math.PI * 2 / count * i + Math.PI * 2 * a1;
            const posArray = sinWave(5, -5, x, 4, yMax, pointCount, radianOffset);
            line.geometry.setPositions( posArray );
            // color
            const c1 = new THREE.Color(1,0,1 - a_line);
            const c2 = new THREE.Color(a_line, 1, 0);
            const colorArray = colorTrans( c1, c2, posArray, camera );
            line.geometry.setColors( colorArray );
            i += 1;
        }
    };
    const createLine2Group = (count) => {
        const group = new THREE.Group();
        let i = 0;
        while(i < count){
            const a_line = i / (count - 1);
            const geo = new THREE.LineGeometry();
            // use vertex colors when setting up the material
            const line_material = new THREE.LineMaterial({
                linewidth: 0.05, //0.05 - 0.025 * a_line,
                vertexColors: true
            });
            const line = new THREE.Line2(geo, line_material);
            group.add(line);
            i += 1;
        }
        return group;
    };
    //-------- ----------
    // LINE2
    //-------- ----------
    const group = createLine2Group(10);
    scene.add(group);
    updateLine2Group(group, camera, 0);
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
    // PATHS
    //-------- ----------
    const v3Array_campos = curveMod.QBV3Array([
        [8,8,8, 7,-2,-7,    2,0,0,      20],
        [7,-2,-7, -8,4,0,   0,0,0,      25],
        [-8,4,0, 8,8,8,     0,0,0,      50]
    ]);
    scene.add( curveMod.debugPoints( v3Array_campos ) );
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
            ['Fat Lines', 64, 17, 14, 'white'],
            ['in threejs', 64, 32, 14, 'white'],
            ['', 64, 47, 14, 'white'],
            ['( r140 12/07/2022 )', 64, 70, 12, 'gray'],
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
            camera.near = 2;
            camera.far = 20;
        },
        afterObjects: function(seq){
            camera.updateProjectionMatrix();
            updateLine2Group(group, camera, seq.per * 4 % 1);
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
 
// video1 for threejs-object3d
 
// scripts
VIDEO.scripts = [
   '../../../js/canvas.js',
   '../../../js/canvas-text-cube.js',
   '../../../js/sequences-hooks-r1.js'
];
// init
VIDEO.init = function(sm, scene, camera){
 
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
            ['Object3d', 64, 17, 14, 'white'],
            ['in', 64, 32, 14, 'white'],
            ['threejs', 64, 47, 14, 'white'],
            ['( r135 05/18/2022 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);

    //******** **********
    // LINES
    //******** **********

    // just create one circle for a set of circles that form a sphere like shape
    // createSphereCirclePoints(maxRadius, circleCount, circleIndex, pointsPerCircle)
    var createSphereCirclePoints = function(maxRadius, circleCount, circleIndex, pointsPerCircle, randomDelta){
        var points = [];
        var sPer = circleIndex / circleCount;
        var radius = Math.sin( Math.PI * 1.0 * sPer ) * maxRadius;
        var y = Math.cos( Math.PI * 1.0 * sPer ) * maxRadius;
        var i = 0;
        // buch points for the current circle
        while(i < pointsPerCircle){
            // might want to subtract 1 or 0 for this cPer expression
            var cPer =  i / (pointsPerCircle - 1);
            var radian = Math.PI * 2 * cPer;
            var v = new THREE.Vector3();
            v.x = Math.cos(radian) * radius;
            v.y = y;
            v.z = Math.sin(radian) * radius;
            var a = v.clone().normalize().multiplyScalar( maxRadius - randomDelta * THREE.MathUtils.seededRandom() );
            // other cool ideas with deltas
            //var a = v.clone().normalize().multiplyScalar( 1 + maxRadius * (i / (perCircle - 1)) );
            //var a = v.clone().normalize().multiplyScalar( (maxRadius * (cPer * 1.25 + sPer * 5)) * 0.25 );
            points.push(a);
            i += 1;
        }
        return points;
    };

    var createSphereLines = function(maxRadius, circleCount, pointsPerCircle, randomDelta, colors){
        colors = colors || [0xff0000,0x00ff00,0x0000ff]
        var lines = new THREE.Group();
        var i = 1;
        while(i < circleCount + 1){
            var p = createSphereCirclePoints(maxRadius, circleCount + 1, i, pointsPerCircle, randomDelta);
            var geometry = new THREE.BufferGeometry().setFromPoints( p);
            var line = scene.userData.line = new THREE.Line(
                geometry,
                new THREE.LineBasicMaterial({
                    color: colors[i % colors.length],
                    linewidth: 4
                })
            );
            lines.add(line);
            i += 1;
        };
        return lines;
    };

    // single sphere lines group
    var sphereLines = createSphereLines(2, 20, 50, 0.5, [0x00ffff, 0x008800, 0x008888, 0x00ff00]);
    scene.add(sphereLines);

    //******** **********
    // MESH OBJECTS
    //******** **********

    var i = 0, len = 15;
    var meshObjects = new THREE.Group();
    while(i < len){
        var mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({color: 0xffffff}))
        meshObjects.add(mesh);
        i += 1;
    };
    scene.add(meshObjects);

    var meshObjectsEffect = function(per){
        var radius = 5 - 2.5 * per,
        s = 1 - 0.50 * per,
        len = meshObjects.children.length;
        meshObjects.children.forEach(function(mesh, i){
            var mPer = i / len,
            y = 0,
            r = Math.PI * 2 / len * i,
            x = Math.cos(r) * radius,
            z = Math.sin(r) * radius;
            mesh.position.set(x, y, z);
            mesh.scale.set(s, s + s * 8 * mPer * per, s);
            mesh.lookAt(0, 0, 0);
        });
        meshObjects.rotation.y = -Math.PI * 8 * per;
    };


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
            sphereLines.scale.set(1, 1, 1);
            sphereLines.rotation.set( 0, 0, 0);
            sphereLines.position.set( 0, 0, 0);
            grid.scale.set(1, 1, 1);
            // mesh objects effect
            meshObjectsEffect(seq.per);
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
            { // seq1 move to 10, 10, 10
                secs: 3,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(8 + 2 * partPer, 1 + 9 * partPer, 10 * partPer);
                    camera.lookAt(0, 0, 0);
                }
            },
            { // seq2 - rest at 10, 10, 10
                secs: 4,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(10, 10, 10);
                    camera.lookAt(0, 0, 0);
                }
            },
            { // seq3 - rest at 10, 10, 10, scale up sphere lines, scale down grid
                secs: 5,
                update: function(seq, partPer, partBias){
                    // circleLines and grid
                    var s = 1 + 2 * partPer
                    sphereLines.scale.set(s, s, s);
                    var s = 1 - partPer;
                    grid.scale.set(s, s, s);
                    // camera
                    camera.position.set(10 - 20 * partPer, 10, 10);
                    camera.lookAt(0, 0, 0);
                }
            },
            { // seq4 - 
                secs: 15,
                update: function(seq, partPer, partBias){
                    // circleLines and grid
                    sphereLines.rotation.y = Math.PI * 6 * partPer;
                    sphereLines.position.set( 0, 3 * Math.cos(Math.PI * 8 * partPer) * partBias, 0);
                    var s = 3 - 2 * partBias;
                    sphereLines.scale.set(s, 3, s);
                    grid.scale.set(0, 0, 0);
                    // camera
                    camera.position.set(-10, 10, 10);
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


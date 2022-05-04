// video1 for threejs-line
 
// scripts
VIDEO.scripts = [
   '../../../js/canvas.js',
   '../../../js/canvas-text-cube.js',
   '../../../js/sequences.js'
];
// init
VIDEO.init = function(sm, scene, camera){
 
    // BACKGROUND
    scene.background = new THREE.Color('#2a2a2a');

    // GRID
    var grid = scene.userData.grid = new THREE.GridHelper(10, 10, '#ffffff', '#00afaf');
    scene.add( grid );
 
    // TEXT CUBE
    var textCube = scene.userData.textCube = CanvasTextCube.create({
        width: 128,
        height: 128,
        lineWidth: 7,
        lineColor: 'rgba(0,100,128,0.8)',
        lineCount: 9,
        lines: [
            ['Lines in', 64, 17, 14, 'white'],
            ['three.js', 64, 32, 14, 'white'],
            ['( r135 05/04/2022 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);


    // create points helper
    var createPoints = function(len, rotationCount, height, maxRadius){
        rotationCount = rotationCount === undefined ? 8 : rotationCount;  // number of rotations
        height = height === undefined ? 5 : height;
        maxRadius = maxRadius === undefined ? 5 : maxRadius;
        var yDelta = height / len;
        var points = [];
        var i = 0, v, radian, radius, per;
        while(i < len){
            per = i / ( len - 1 );
            radian = Math.PI * 2 * rotationCount * per;
            radius = maxRadius  * per;
            v = new THREE.Vector3();
            v.x = Math.cos(radian) * radius;
            v.z = Math.sin(radian) * radius;
            v.y = i * yDelta;
            points.push(v);
            i += 1;
        };
        return points;
    };


    var lines = new THREE.Group();
    var lineCount = 3;
    var colors = [0x00ff00, 0xff0000, 0x0000ff];
    var i = 0;
    while(i < lineCount){
        var per = i / lineCount;
        var points = createPoints(100, 1 + 0.2 * per, 0, 5);
        var geometry = new THREE.BufferGeometry().setFromPoints( points );
        var line = scene.userData.line = new THREE.Line(
            geometry,
            new THREE.LineBasicMaterial({
                color: colors[i],
                linewidth: 6
            }));
        lines.add(line);
        //lines.push(line);
        //scene.add(line);
        i += 1;
    }
    scene.add(lines);


    // SET UP SEQ OBJECT
    sm.seq = Sequences.create({
        sm: sm,
        part : [
            {
                per: 0,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // text cube
                    textCube.visible = true;
                    textCube.position.set(6, 0.8, 0);
                    textCube.material.opacity = 1.0;
                    // camera
                    camera.position.set(8, 1, 0);
                    camera.lookAt(0, 0, 0);
                    // line
                    //line1.geometry.setFromPoints( createPoints(150, 1, 0, 5) );
                }
            },
            {
                per: 0.10,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // move up text cube
                    textCube.visible = true;
                    textCube.position.set(6, 0.8 + 1 * partPer, 0);
                    textCube.rotation.y = Math.PI * 2 * partPer;
                    textCube.material.opacity = 1.0 - partPer;
                    // camera
                    camera.position.set(8, 1, 0);
                    camera.lookAt(0, 0, 0);
                    // line
                    //line1.geometry.setFromPoints( createPoints(150, 1, 0, 5) );
                }
            },
            // sq1 - move camera and increates height of points
            {
                per: 0.15,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    camera.position.set(8, 1 + 4 * partPer, 8 * partPer);
                    camera.lookAt(0, 0, 0);
                    // line
                    //line1.geometry.setFromPoints( createPoints(150, 1, 4 * partPer, 5) );
                }
            },
            // sq2 - rest
            {
                per: 0.20,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    camera.position.set(8, 5, 8);
                    camera.lookAt(0, 0, 0);
                    // line
                    //line1.geometry.setFromPoints( createPoints(150, 1, 4, 5) );
                }
            },
            // sq3 - rotation count
            {
                per: 0.20,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    camera.position.set(8, 5, 8);
                    camera.lookAt(0, 0, 0);
                    // line
                    //line1.geometry.setFromPoints( createPoints(150, 1 + 4 * partPer, 4, 5) );
                }
            }
        ]
    });
};

// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
    var textCube = scene.userData.textCube;
    textCube.rotation.y = 0;
    textCube.position.set(6, 0.8, 0);
    textCube.visible = false;
    textCube.material.transparent = true;
    textCube.material.opacity = 0.0;
    // sequences
    Sequences.update(sm.seq, sm);
};


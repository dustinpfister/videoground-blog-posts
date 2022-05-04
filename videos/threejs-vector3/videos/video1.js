// video1 for threejs-vector3
 
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
            ['The Vector3', 64, 17, 14, 'white'],
            ['Class in', 64, 32, 14, 'white'],
            ['three.js', 64, 47, 14, 'white'],
            ['( r135 05/04/2022 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);


    // create points helper
    var createPoints = function(len, radius){
        radius = radius === undefined ? 5 : radius;
        var points = [];
        var i = 0, v, radian, per;
        while(i < len){
            per = i / ( len - 1 );
            radian = Math.PI * 2 * per
            v = new THREE.Vector3();
            v.x = Math.cos(radian) * radius;
            v.z = Math.sin(radian) * radius;
            v.y = 0;
            points.push(v);
            i += 1;
        };
        return points;
    };


    var updateLinesGroup = function(lines, r){
        lines.children.forEach(function(line, i, arr){
            var per = (i + 1) / arr.length,
            bias = 1 - Math.abs(0.5 - per) / 0.5;

            line.geometry.setFromPoints( createPoints(150, bias * r) );
            line.position.y = r * -1 + r * 2 * per;
        });
    };



    // create lines group
    var lines = new THREE.Group();
    var lineCount = 12;
    var colors = [0x00ff00, 0xff0000, 0x0000ff, 0xff00ff, 0x00ffff, 0xffff00];
    var i = 0;
    while(i < lineCount){
        //var per = i / lineCount,
        //bias = 1 - Math.abs(0.5 - per) / 0.5;
        var points = createPoints(150, 2 );
        var geometry = new THREE.BufferGeometry().setFromPoints( points );
        var line = scene.userData.line = new THREE.Line(
            geometry,
            new THREE.LineBasicMaterial({
                color: colors[i % colors.length],
                linewidth: 6
            }));
        lines.add(line);
        i += 1;
    }
    scene.add(lines);
    updateLinesGroup(lines, 2);


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
                }
            },
            // sq1 - 
            {
                per: 0.15,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    camera.position.set(8, 1 + 5 * partPer, 0);
                    camera.lookAt(0, 0, 0);
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


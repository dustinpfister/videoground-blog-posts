// video1 for threejs-examples-waves

VIDEO.scripts = [
   '../../../js/canvas.js',
   '../../../js/canvas-text-cube.js',
   '../../../js/sequences.js'
];


    // Wave grid helper
    var waveGrid = function (opt) {
        opt = opt || {};
        opt.width = opt.width || 30;
        opt.depth = opt.depth || 30;
        opt.height = opt.height || 2;
        opt.forPoint = opt.forPoint || function () {};
        opt.context = opt.context || opt;
        opt.xStep = opt.xStep || 0.075;
        opt.yStep = opt.yStep || 0.1;
        opt.zStep = opt.zStep || 0.075;
        opt.waveOffset = opt.waveOffset === undefined ? 0 : opt.waveOffset;
        var points = [],
        radPer,
        x = 0,
        i = 0,
        y,
        z;
        // points
        while (x < opt.width) {
            z = 0;
            while (z < opt.depth) {
                // radian percent
                radPer = (z / opt.depth + (1 / opt.width * x) + opt.waveOffset) % 1;
                // y value of point
                y = Math.cos(Math.PI * 4 * radPer) * opt.height;
                // call forPoint
                opt.forPoint.call(opt.context, x * opt.xStep, y * opt.yStep, z * opt.zStep, i);
                // step z, and point index
                z += 1;
                i += 3;
            }
            x += 1;
        };
    };

   // make a points mesh
    var makePoints = function () {
        var geometry = new THREE.BufferGeometry();
        var points = [],
        opt = {};
        opt.forPoint = function (x, y, z, i) {
            points.push(x, y, z);
        };
        waveGrid(opt);
        var vertices = new Float32Array(points);
        // itemSize = 3 because there are 3 values (components) per vertex
        geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
        return new THREE.Points(
            // geometry as first argument
            geometry,
            // then Material
            new THREE.PointsMaterial({
                size: .125,
                color: new THREE.Color(0.0, 0.25, 0.25)
            }));
    };


    // update points
    var updatePoints = function (points, per) {
        var position = points.geometry.getAttribute('position');
        // update points
        waveGrid({
            waveOffset: per,
            xStep: 0.25,
            zStep: 0.25,
            width: 30,
            depth: 30,
            height: 3,
            forPoint: function (x, y, z, i) {
                position.array[i] = x - 3.7;
                position.array[i + 1] = y;
                position.array[i + 2] = z - 3.7;
            }
        });
        position.needsUpdate = true;
    };

// init method for the video
VIDEO.init = function(sm, scene, camera){
 
    // BACKGROUND
    scene.background = new THREE.Color('#00afaf');

    // GRID
    var grid = scene.userData.grid = new THREE.GridHelper(30, 30, '#00ff00', '#ffffff');
    scene.add( grid );
 
    // TEXT CUBE
    var textCube = scene.userData.textCube = CanvasTextCube.create({
        width: 128,
        height: 128,
        lineWidth: 7,
        lineColor: 'rgba(0,100,128,0.8)',
        lineCount: 9,
        lines: [
            ['Waves', 64, 17, 15, 'white'],
            ['Example', 64, 32, 15, 'white'],
            ['in Three.js.', 64, 47, 15, 'white'],
            ['( r135 04/28/2022 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);

    var points = scene.userData.points = makePoints();
    scene.add(points);

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
                    textCube.position.set(6, 0.8 + 2 * partPer, 0);
                    textCube.rotation.y = Math.PI * 2 * partPer;
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
                    camera.position.set(8 + 2 * partPer, 1 + 8 * partPer, 0);
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

    var points = scene.userData.points;
    updatePoints(points, per * 8 % 1);
    points.scale.set(4 - 3 * per, 1, 4 - 3 * per);

    // sequences
    Sequences.update(sm.seq, sm);

};

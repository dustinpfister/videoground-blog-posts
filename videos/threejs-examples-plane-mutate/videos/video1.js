// video1 for threejs-examples-plane-mutate

VIDEO.scripts = [
   '../../../js/canvas.js',
   '../../../js/canvas-text-cube.js',
   '../../../js/sequences.js'
];

// ADJUST PLANE POINT HELPER
var adjustPlanePoint = function (geo, vertIndex, yAdjust) {
    // get position and normal
    var position = geo.getAttribute('position');
    var normal = geo.getAttribute('normal');
    var i = vertIndex * 3;
    // ADJUSTING POSITION ( Y Only for now )
    position.array[i + 1] = yAdjust;
    position.needsUpdate = true;
    // ADJUSTING NORMALS USING computeVertexNormals method
    geo.computeVertexNormals();
};

var yDeltas = [
    [4, -2],
    [2, -1],
    [0.1, 1],
    [-1.0, 1],
    [-1.0, 1],
    [-2.0, 4],
    [-1.0, 6],
    [-2.0, 1],
    [-2.0, 1]
];

// update plane helper
var updatePlane = function(geo, per){
    per = per === undefined ? 0 : per;
    // for each point in the position attribute
    var pos = geo.getAttribute('position');
    var i = 0,
    len = pos.count;
    while(i < pos.count){
        var yd = yDeltas[i];
        var y = -0.1 + yd[0] + yd[1] * per;
        adjustPlanePoint(geo, i, y);
        i += 1;
    }
};

// init method for the video
VIDEO.init = function(sm, scene, camera){
 
    // BACKGROUND
    scene.background = new THREE.Color('#2a2a2a');
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
            ['Plane Geometry', 64, 17, 15, 'white'],
            ['Mutation of Points', 64, 32, 15, 'white'],
            ['in Three.js.', 64, 47, 15, 'white'],
            ['( r135 04/21/2022 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);

    // LIGHT
    var dl = new THREE.DirectionalLight(0xffffff, 1);
    dl.position.set(0, 6, -9);
    scene.add(dl);
 

    // MESH
    var geo = scene.userData.geo = new THREE.PlaneGeometry(10, 10, 2, 2);
    geo.rotateX(Math.PI * 1.5);
    // USING THREE DATA TEXTURE To CREATE A RAW DATA TEXTURE
    // Using the seeded random method of the MathUtils object
    var width = 16, height = 16;
    var size = width * height;
    var data = new Uint8Array( 4 * size );
    for ( let i = 0; i < size; i ++ ) {
        var stride = i * 4;
        var v = Math.floor( THREE.MathUtils.seededRandom() * 255 );
        data[ stride ] = v;
        data[ stride + 1 ] = v;
        data[ stride + 2 ] = v;
        data[ stride + 3 ] = 255;
    }
    var texture = new THREE.DataTexture( data, width, height );
    texture.needsUpdate = true;
    var plane = scene.userData.plane = new THREE.Mesh(
        geo,
        new THREE.MeshStandardMaterial({ color: 0xffffff, map: texture }));
    plane.position.set(0, 0, 0);
    scene.add(plane);
  
    // call update plane for first time
    updatePlane(geo, 0);

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
                    textCube.position.set(6, 1 + 2 * partPer, 0);
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
                    camera.position.set(8 + 2 * partPer, 1 + 5 * partPer, 10 * partPer);
                    camera.lookAt(0, 0, 0);
                }
            },
            // sq2 - 
            {
                per: 0.5,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    var r = Math.PI * 0.25 + Math.PI * 2 * partPer;
                    var x = Math.cos(r) * 14;
                    var z = Math.sin(r) * 14;
                    camera.position.set(x, 6, z);
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
    textCube.position.set(8, 1, 0);
    textCube.visible = false;

    var geo = scene.userData.geo;
    updatePlane(geo, per);

    // sequences
    Sequences.update(sm.seq, sm);

};

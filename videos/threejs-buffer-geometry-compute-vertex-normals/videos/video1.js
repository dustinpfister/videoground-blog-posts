// video1 for threejs-buffer-geometry-compute-vertex-normals
 
// scripts
VIDEO.scripts = [
   '../../../js/canvas.js',
   '../../../js/canvas-text-cube.js',
   '../../../js/sequences-hooks-r1.js',
   '../../../js/r135-files/VertexNormalsHelper.js'
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
            ['Compute Vertex', 64, 17, 14, 'white'],
            ['Normals in', 64, 32, 14, 'white'],
            ['threejs', 64, 47, 14, 'white'],
            ['( r135 05/22/2022 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);

// LIGHT
var light = new THREE.PointLight(0xffffff, 1);
light.position.set(0, 5, -7);
scene.add(light);

//
// ADJUST PLANE POINT HELPER
var adjustPlanePoint = function (geo, vertIndex, yAdjust) {
    // get position and normal
    var position = geo.getAttribute('position');
    var normal = geo.getAttribute('normal');
    var i = vertIndex * 3;
    // ADJUSTING POSITION ( Y Only for now )
    position.array[i + 1] = yAdjust;
    position.needsUpdate = true;
};
// update a geo
var updatePlaneGeo = function(geo, bias, computeNormals){
    computeNormals = computeNormals || false;
    adjustPlanePoint(geo, 0, 0 + 0.75 * bias);
    adjustPlanePoint(geo, 1, 0.75 - 1.00 * bias);
    adjustPlanePoint(geo, 2, 0.1);
    adjustPlanePoint(geo, 8, -0.4 * bias);
    // ADJUSTING NORMALS USING computeVertexNormals method
    if(computeNormals){
        geo.computeVertexNormals();
    }
};
// create a data texture
var createDataTexture = function (pr, pg, pb) {
    // USING THREE DATA TEXTURE To CREATE A RAW DATA TEXTURE
    // Using the seeded random method of the MathUtils object
    var width = 16,
    height = 16;
    var size = width * height;
    var data = new Uint8Array(4 * size);
    for (let i = 0; i < size; i++) {
        var stride = i * 4;
        var v = Math.floor(THREE.MathUtils.seededRandom() * 255);
        data[stride] = v * pr;
        data[stride + 1] = v * pg;
        data[stride + 2] = v * pb;
        data[stride + 3] = 255;
    }
    var texture = new THREE.DataTexture(data, width, height);
    texture.needsUpdate = true;
    return texture;
};
// MESH
var geo1 = new THREE.PlaneGeometry(1, 1, 2, 2);
geo1.rotateX(Math.PI * 1.5);
var plane1 = new THREE.Mesh(
        geo1,
        new THREE.MeshStandardMaterial({
            color: 0xffffff,
            map: createDataTexture(0,1,0),
            side: THREE.DoubleSide
        }));
plane1.position.set(0.6, 0.01, 0);
scene.add(plane1);
var geo2 = new THREE.PlaneGeometry(1, 1, 2, 2);
geo2.rotateX(Math.PI * 1.5);
var plane2 = new THREE.Mesh(
        geo2,
        new THREE.MeshStandardMaterial({
            color: 0xffffff,
            map: createDataTexture(0,1,1),
            side: THREE.DoubleSide
        }));
plane2.position.set(-0.6, 0.01, 0);
scene.add(plane2);
// USING THE THREE.VertexNormalsHelper method
const helper1 = new THREE.VertexNormalsHelper(plane1, 2, 0x00ff00, 1);
helper1.material.linewidth = 4;
scene.add(helper1);
const helper2 = new THREE.VertexNormalsHelper(plane2, 2, 0x00ffff, 1);
helper2.material.linewidth = 4;
scene.add(helper2);


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

    updatePlaneGeo(geo1, seq.bias, true);
    updatePlaneGeo(geo2, seq.bias, false);
    helper1.update();
    helper2.update();

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
                secs: 2,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(8 - 7 * partPer, 1, 1 * partPer);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 25,
                update: function(seq, partPer, partBias){
                    // camera
                    var s = 1 + 1 * partPer;
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


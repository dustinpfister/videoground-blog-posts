// video1 for threejs-examples-lookat-with-apply-euler
 
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
            ['lookAt + applyEuler', 64, 17, 14, 'white'],
            ['methods in', 64, 32, 14, 'white'],
            ['threejs', 64, 47, 14, 'white'],
            ['( r135 05/06/2022 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);

//******** **********
// LIGHT
//******** **********
var dl = new THREE.DirectionalLight(0xffffff, 1);
dl.position.set(1,3,2);
scene.add(dl);

//******** **********
// HELPER FUNCTIONS
//******** **********
// materuials to use for mesh objects
var materials = [
    new THREE.MeshStandardMaterial({color: new THREE.Color('cyan')}),
    new THREE.MeshStandardMaterial({color: new THREE.Color('red')})
];

// make a part of the object
var mkPart = function(g, partName, w, h, d, x, y, z, mi){
    // the mesh object
    var m = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, d),
    materials[mi === undefined ? 0 : mi]);
    // name of part
    m.name = g.name + '_' + partName;
    // position it
    m.position.set(x, y, z);
    return m;
};

// make the whole group with all parts
var mkModel = function(gName){
    var g = new THREE.Group();
    g.name = gName || 'g-' + g.uuid;
    // add parts
    g.add( mkPart(g, 'body', 1, 1, 4, 0, 0, 0) );
    g.add( mkPart(g, 'tail', 0.5, 1, 1, 0, 1, -1.5, 1) );
    g.add( mkPart(g, 'rwing', 2, 0.5, 1, -1.5, 0, 0) );
    g.add( mkPart(g, 'lwing', 2, 0.5, 1, 1.5, 0, 0) );
    return g;
};

// make a collection of them
var createWrap = function(){
    var wrap = new THREE.Group();
    var i = 0, count = 50;
    while(i < count){
        var g = mkModel('g' + i);
        wrap.add(  g );
        i += 1;
    }
    wrap.scale.set(0.5, 0.5, 0.5);
    return wrap;
};

// position a wrap object
var positionWrap = function(wrap, bias, ringCount, radius){

    bias = bias === undefined ? 1 : bias;
    ringCount = ringCount === undefined ? 5 : ringCount;
    radius = radius === undefined ? 5 : radius;

    var count = wrap.children.length,
    i = 0;
    perRing = count / ringCount;

    var yaStep = 90 / ringCount;
    while(i < count){
        var per = i / count;
        var g = wrap.children[i];
        var ring = Math.floor( i / perRing );
        var rPer = ( i - perRing * ring) / perRing;
        var x = Math.PI * 2 * rPer, 
        s = ring < ringCount / 2 ? 0 : 1;
        y = Math.PI / 180 * yaStep * ring * bias, 
        z = 0;
        var e = new THREE.Euler(x, y, z);
        g.position.set(0, 0, radius).applyEuler( e );
        g.lookAt(0, 0, 0);
        i += 1;
    }
};

//
var wrapA = createWrap();
positionWrap(wrapA, 1);
scene.add(wrapA);

var wrapB = createWrap();
positionWrap(wrapB, -1);
scene.add(wrapB);


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
                    // wrap objects
                    positionWrap(wrapA, 0, 5, 3 );
                    positionWrap(wrapB, 0, 5, 3 );
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
                    // wrap objects
                    positionWrap(wrapA, 0, 5, 3);
                    positionWrap(wrapB, 0, 5, 3);
                }
            },
            // sq1 - 
            {
                per: 0.15,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    camera.position.set(8 + 4 * partPer, 1 + 11 * partPer, 12 * partPer);
                    camera.lookAt(0, 0, 0);
                    // wrap objects
                    positionWrap(wrapA, 0, 5, 3 + 12 * partPer);
                    positionWrap(wrapB, 0, 5, 3 + 12 * partPer);
                }
            },
            // sq2 - 
            {
                per: 0.25,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    camera.position.set(12, 12, 12);
                    camera.lookAt(0, 0, 0);
                    // wrap objects
                    positionWrap(wrapA, 0, 5, 15);
                    positionWrap(wrapB, 0, 5, 15);
                }
            },
            // sq3 - unwrap
            {
                per: 0.35,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    camera.position.set(12, 12, 12);
                    camera.lookAt(0, 0, 0);
                    // wrap objects
                    positionWrap(wrapA, 1 * partPer, 5, 15);
                    positionWrap(wrapB, -1 * partPer, 5, 15);
                }
            },
            // sq4 - rest
            {
                per: 0.45,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    camera.position.set(12, 12, 12);
                    camera.lookAt(0, 0, 0);
                    // wrap objects
                    positionWrap(wrapA, 1, 5, 15);
                    positionWrap(wrapB, -1, 5, 15);
                }
            },
            // sq4 - move camera
            {
                per: 0.55,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    camera.position.set(12 - 24 * partPer, 12 + 3 * partPer, 12);
                    camera.lookAt(0, 7.5 * partPer, 0);
                    // wrap objects
                    positionWrap(wrapA, 1, 5, 15);
                    positionWrap(wrapB, -1, 5, 15);
                }
            },
            // sq5 - move camera
            {
                per: 0.65,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    camera.position.set(-12 + 6 * partPer, 15 - 5 * partPer, 12 - 6 * partPer);
                    camera.lookAt(0, 7.5, 0);
                    // wrap objects
                    positionWrap(wrapA, 1, 5, 15);
                    positionWrap(wrapB, -1, 5, 15);
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


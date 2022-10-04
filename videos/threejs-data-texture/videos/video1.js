// video1 for threejs-data-texture
 
// scripts
VIDEO.scripts = [
   '../../../js/sequences-hooks/r1/sequences-hooks.js',
   '../../../js/canvas/r0/canvas.js',
   '../../../js/canvas-text-cube/r0/canvas-text-cube.js'
];
// init
VIDEO.init = function(sm, scene, camera){

//-------- ----------
// ADD A LIGHT BECUASE THIS IS THE STANDARD MATERIAL THAT I AM USING
//-------- ----------
const light = new THREE.PointLight( new THREE.Color(1, 1, 1), 1 );
light.position.set(4, 2, 10);
scene.add(light);
//-------- ----------
// HELPER FUNCTIONS
//-------- ----------
// create data 
const createData = function(opt){
    opt = opt || {};
    opt.width = opt.width === undefined ? 16: opt.width; 
    opt.height = opt.height === undefined ? 16: opt.height;
    // default for pix method
    opt.forPix = opt.forPix || function(color, x, y, i, opt){
        let v = Math.floor( THREE.MathUtils.seededRandom() * 255 );
        color.r = v;
        color.g = v;
        color.b = v;
        return color;
    };
    let size = opt.width * opt.height;
    let data = new Uint8Array( 4 * size );
    for ( let i = 0; i < size; i ++ ) {
        let stride = i * 4,
        x = i % opt.width,
        y = Math.floor(i / opt.width),
        color = opt.forPix( new THREE.Color(), x, y, i, opt);
        data[ stride ] = color.r;
        data[ stride + 1 ] = color.g;
        data[ stride + 2 ] = color.b;
        data[ stride + 3 ] = 255;
    }
    return data;
};
// create data texture
const createDataTexture = function(opt){
    opt = opt || {};
    opt.width = opt.width === undefined ? 16: opt.width; 
    opt.height = opt.height === undefined ? 16: opt.height;
    const data = createData(opt);
    let texture = new THREE.DataTexture( data, opt.width, opt.height );
    texture.needsUpdate = true;
    return texture;

};
// update a texture
const updateTexture = (texture, opt) => {
    // just updating data array only
    const data = createData(opt);
    texture.image.data = data;
    //!!! old way of doing this where I create a whole new texture object each time
    //const texture_new = createDataTexture(opt);
    //texture.image = texture_new.image;
    texture.needsUpdate = true;
};
// get random from range
const getRndFromRange = (range) => {
    return range[0] + THREE.MathUtils.seededRandom() * ( range[1] - range[0] );
};
// get bias or ping pong method
const getBias = (n, d, count) => {
    const a = n / d * count % 1;
    return 1 - Math.abs(0.5 - a) / 0.5;
};
// make cube
const makeCube = (x, y, z, opt) => {
    const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshStandardMaterial({
            map : createDataTexture(opt)
        })
    );
    mesh.position.set(x, y, z);
    return mesh;
};
//-------- ----------
// CREATE FOR PIX FUNCTIONS
//-------- ----------
const forPix = {};
// better random function
forPix.rndChannel = (r, g, b) => {
   r = r || [0, 255];
   g = g || [0, 255];
   b = b || [0, 255];
   return function(color, x, y, i, opt){
        color.r = getRndFromRange(r);
        color.g = getRndFromRange(g);
        color.b = getRndFromRange(b);
        return color;
    };
};
// better random function
forPix.square = (size, fgColor, bgColor, v2_center) => {
   size = size === undefined ? 2 : size;
   fgColor = fgColor || new THREE.Color(255, 255, 255);
   bgColor = bgColor || new THREE.Color(0, 0, 0);
   v2_center = v2_center || new THREE.Vector2(0, 0);
   // create box2
   const b2 = new THREE.Box2(
       v2_center.clone().add( new THREE.Vector2(size * -1, size * -1) ),
       v2_center.clone().add( new THREE.Vector2(size, size) )
   );
   return function(color, x, y, i, opt){
        color.copy(bgColor);
        // vector2 for current px
        const v2_px = new THREE.Vector2(x, y);
        // is current px inside box2
        if(b2.containsPoint(v2_px)){
            color.r = fgColor.r;
            color.g = fgColor.g;
            color.b = fgColor.b;
        }
        return color;
    };
};
//-------- ----------
// MESH OBJECTS 
//-------- ----------
//let m = makeCube(0, 0, 0, { forPix: forPix.square(), width: 4, height: 4 });
const group = new THREE.Group();
let i = 0;
let w = 5;
let len = w * w;
while(i < len){
    const x = i % w;
    const z = Math.floor(i / w);
    const mesh = makeCube(-3 + x * 1.5, 0, -3 + z * 1.5);
    group.add(mesh);
    i += 1;
}
scene.add(group);


    //-------- ----------
    // BACKGROUND
    //-------- ----------
    scene.background = new THREE.Color('#2a2a2a');
    //-------- ----------
    // GRID
    //-------- ----------
    var grid = scene.userData.grid = new THREE.GridHelper(10, 10, '#ffffff', '#00afaf');
    grid.material.linewidth = 3;
    scene.add( grid );
    //-------- ----------
    // TEXT CUBE
    //-------- ----------
    var textCube = scene.userData.textCube = CanvasTextCube.create({
        width: 128,
        height: 128,
        lineWidth: 7,
        lineColor: 'rgba(0,100,128,0.8)',
        lineCount: 9,
        lines: [
            ['Data textures', 64, 17, 14, 'white'],
            ['in', 64, 32, 14, 'white'],
            ['threejs', 64, 47, 14, 'white'],
            ['( r140 10/04/2022 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);
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
    //-------- ----------
    // A MAIN SEQ OBJECT
    //-------- ----------

const fg1 = new THREE.Color(255, 255, 255),
fg2 = new THREE.Color(0, 255, 0),
bg = new THREE.Color(0, 0, 0),
v2_center = new THREE.Vector2(8, 8);

const update = function(frame, frameMax){
    // update group 
    group.children.forEach( (mesh, i) => {
        // using the update texture method
        updateTexture(mesh.material.map, { forPix: forPix.rndChannel() });
        // square update - size up and down
        if( i % 4 === 0){
            const size = 9 * getBias(frame, frameMax, 2)
            updateTexture(mesh.material.map, { forPix: forPix.square(size, fg1, bg, v2_center) });
        }
        // square update - random pos
        if( i % 3 === 0){
            const size = 4;
            const v2_rnd = new THREE.Vector2(16 * Math.random(), 16 * Math.random())
            updateTexture(mesh.material.map, { forPix: forPix.square(size, fg2, bg, v2_rnd) });
        }
        // !!! this old way of doing it would result in a loss of context
        //mesh.material.map = createDataTexture({ forPix: forPix.rndChannel() });
    });
};

    var seq = scene.userData.seq = seqHooks.create({
        fps: 30,
        beforeObjects: function(seq){

update(seq.frame, seq.frameMax)

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
                secs: 7,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(8, 1 + 7 * partPer, 8 * partPer);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 20,
                update: function(seq, partPer, partBias){
                    // camera
                    var b = seq.getSinBias(2);
                    camera.position.set(8, 8 - 16 * b, 8);
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


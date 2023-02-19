// video2-canvas-update.js - for threejs-emissive-map
VIDEO.scripts = [
   '../../../js/sequences-hooks/r2/sequences-hooks.js',
   '../../../js/canvas/r2/lz-string.js',
   '../../../js/canvas/r2/canvas.js',
   '../../../js/curve/r1/curve.js',
   '../../../js/canvas-text-cube/r1/canvas-text-cube.js'
];
// init
VIDEO.init = function(sm, scene, camera){
	
	//-------- ----------
// DATA TEXTURE METHODS
//-------- ----------
// make a data texture by passing w, h, and a function
// that will be called for each pixel
const datatex = (function () {
    const api = {};
    // mk data texture helper
    api.mkDataTexture = (data, w) => {
        data = data || [];
        w = w || 0;
        const width = w,
        height = data.length / 4 / w;
        const texture = new THREE.DataTexture(data, width, height);
        texture.needsUpdate = true;
        return texture;
    };
    // create a data texture with a method that will be called for each pix
    api.forEachPix = (w, h, forEach) => {
        const width = w === undefined ? 5 : w,
        height = h === undefined ? 5 : h;
        const size = width * height;
        const data = new Uint8Array(4 * size);
        for (let i = 0; i < size; i++) {
            const stride = i * 4;
            const x = i % width;
            const y = Math.floor(i / width);
            let obj = forEach(x, y, w, h, i, stride, data);
            obj = obj || {};
            data[stride] = obj.r || 0;
            data[stride + 1] = obj.g || 0;
            data[stride + 2] = obj.b || 0;
            data[stride + 3] = obj.a === undefined ? 255: obj.a;
        }
        return api.mkDataTexture(data, width)
    };
    // return the api
    return api;
}
    ());
// square texture
const circleTexture = function(t){
    t = t === undefined ? 1 : t;
    return datatex.forEachPix(16, 16, (x, y, w, h, i, stride, data) => {
        const v = new THREE.Vector2(x, y);
        const d = v.distanceTo( new THREE.Vector2(w / 2, h / 2) );
        let cv = d / ( 16 * t ) * 255;
        cv = cv > 255 ? 255 : cv;
        cv = cv < 0 ? 0 : cv;
        return {
            g: Math.round(cv)
        };
    });
};
//  rnd
const rndTexture = function(){
    return datatex.forEachPix(16, 16, (x, y, w, h, i, stride, data) => {
        const cv = Math.round( Math.random() * 255 );
        return {
            r: cv,
            g: cv,
            b: cv
        };
    });
};
//-------- ----------
// LIGHT
//-------- ----------
const dl = new THREE.DirectionalLight(0xafafaf, 0.5);
dl.position.set(8, 10, 2);
scene.add(dl);
const helper = new THREE.DirectionalLightHelper( dl, 5 );
scene.add( helper );
//-------- ----------
// MESH
//-------- ----------
const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(5, 5, 5),
    new THREE.MeshStandardMaterial({
        emissive: new THREE.Color('white'),
        emissiveIntensity: 1
    })
);
scene.add(mesh);
	
	
    //-------- ----------
    // BACKGROUND - using canvas2 and lz-string to create a background texture
    //-------- ----------
    const canObj = canvasMod.create({
        size: 512,
        draw: 'grid_palette',
        palette: ['#000000', '#1f1f1f', '#00ffff'],
        dataParse: 'lzstring64',
        state: { w: 8, h: 5, data: 'AwGlEYyzNCVgpcmPit1mqvTsg===' }
    });
    // can use LZString to compress and decompress
    //console.log( LZString.decompressFromBase64('AwGlEYyzNCVgpcmPit1mqvTsg===') );
    // I want to repeat the texture
    const texture = canObj.texture;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(32, 24);
    scene.background = texture;
    //-------- ----------
    // CURVE PATHS - creating a curve path for the camera
    //-------- ----------
    const cp_campos = curveMod.QBCurvePath([
        [8,1,0, 8,3,8,  5,2,5,    0]
    ]);
    //scene.add( curveMod.debugPointsCurve(cp_campos) )
    //-------- ----------
    // CURVE Alphas
    //-------- ----------
    const getCamPosAlpha = curveMod.getAlphaFunction({
        type: 'curve2',
        ac_points: [0,0.4,  0.6,-0.25,  1]
    });
    //scene.add( curveMod.debugAlphaFunction(getCamPosAlpha) )
    //-------- ----------
    // GRID
    //-------- ----------
    const grid = scene.userData.grid = new THREE.GridHelper(10, 10, '#ffffff', '#00afaf');
    grid.material.linewidth = 3;
    scene.add( grid );
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
            ['Emissive Maps', 64, 17, 14, 'white'],
            ['in threejs', 64, 32, 14, 'white'],
            ['', 64, 47, 14, 'white'],
            ['( r146 02/19/2023 )', 64, 70, 12, 'gray'],
            ['video2', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);
    //-------- ----------
    // A SEQ FOR TEXT CUBE
    //-------- ----------
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

    const a1 = seq.getPer(4, false),
    a2 = 1 - Math.abs(0.5 - a1) / 0.5;
    mesh.material.emissiveMap = circleTexture(a2 * 4);
    // new color map
    mesh.material.map = rndTexture();
    // moving directional light
    var r = Math.PI * 4 * a1,
    x = Math.cos(r) * 4,
    z = Math.sin(r) * 4;
    dl.position.set(x, 4, z);
    helper.update();
			
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
            //camera.position.set(-8, 4, -8);
            camera.lookAt(0, 0, 0);
        }
    };
    // SEQ 1 - ...
    opt_seq.objects[1] = {
        secs: 27,
        update: function(seq, partPer, partBias){
            const a1 = getCamPosAlpha(partPer);
            camera.position.copy( cp_campos.getPoint(a1) );
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
 
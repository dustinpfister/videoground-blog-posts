// video2-minimap.js for threejs-buffer-geometry-attributes-uv
VIDEO.scripts = [
   '../../../js/sequences-hooks/r2/sequences-hooks.js',
   '../../../js/canvas/r2/lz-string.js',
   '../../../js/canvas/r2/canvas.js'
];
// init
VIDEO.init = function(sm, scene, camera){
// ---------- ----------
// HELPER FUNCTIONS
// ---------- ----------
const updateUVRotation = (geometry, a_rotation = 0, radius = 0.5, center = new THREE.Vector2(0.5, 0.5) ) => {
    const att_uv = geometry.getAttribute('uv');
    const radian_start = Math.PI * 2 * a_rotation;
    let i = 0;
    while(i < att_uv.count){
        const a_count = (i / att_uv.count);
        const radian = (radian_start + Math.PI * 2 * a_count) % Math.PI * 2;
        const v = new THREE.Vector2();
        v.x = center.x + Math.cos(radian) * radius;
        v.y = center.y + Math.sin(radian) * radius;
        att_uv.setXY(i, v.x, v.y);
        i += 1;
    }
    att_uv.needsUpdate = true;
};
const createMiniMap = ( pos = new THREE.Vector2(), size = 256, geometry = null) => {
    const minimap = {
        pos: pos,
        size: size,
        v2array: []
    };
    if(geometry){
        setV2array(minimap, geometry);
    }
    return minimap;
};
// create the v2 array for the minimap based on the given geometry
const setV2array = (minimap, geometry) => {
    const att_uv = geometry.getAttribute('uv');
    const v2array = [];
    let i = 0;
    const len = att_uv.count;
    while(i < len){
        v2array.push( new THREE.Vector2( att_uv.getX(i), 1 - att_uv.getY(i) ) );
        i += 1;
    }
    minimap.v2array = v2array;
};
// get a vector2 from the v2 array that is scaled based on size
const getMiniMapV2 = (minimap, i) => {
    return minimap.v2array[i].clone().multiplyScalar(minimap.size);
};
// draw the minimap
const drawMinimap = scene.userData.drawMinimap = (minimap, ctx) => {
    ctx.save();
    ctx.globalAlpha = 0.7;
    ctx.translate(minimap.pos.x, minimap.pos.y);
    ctx.drawImage(canvas_texture, 0, 0, minimap.size, minimap.size);
    let i = 0;
    const len = minimap.v2array.length;
    ctx.strokeStyle = 'black';
    ctx.fillStyle = 'rgba(0,255,255, 0.6)';
    ctx.lineWidth = 4;
    while(i < len){
        const v1 = getMiniMapV2(minimap, i);
        const v2 = getMiniMapV2(minimap, i + 1);
        const v3 = getMiniMapV2(minimap, i + 2);
        ctx.beginPath();
        ctx.moveTo(v1.x, v1.y);
        ctx.lineTo(v2.x, v2.y);
        ctx.lineTo(v3.x, v3.y);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
        i += 3;
    }
    ctx.restore();
};
// ---------- ----------
// TEXTURE
// ---------- ----------
const canvas_texture = document.createElement('canvas');
const ctx_texture = canvas_texture.getContext('2d');
canvas_texture.height = canvas_texture.width = 32;
const gradient = ctx_texture.createLinearGradient(0, 32, 32, 0);
gradient.addColorStop(0.00, 'red');
gradient.addColorStop(0.40, 'yellow');
gradient.addColorStop(0.50, 'lime');
gradient.addColorStop(0.60, 'cyan');
gradient.addColorStop(1.00, 'blue');
ctx_texture.fillStyle = gradient;
ctx_texture.fillRect(0,0, 32, 32);
const texture = new THREE.CanvasTexture(canvas_texture);
// ---------- ----------
// GEOMETRY
// ---------- ----------
const geometry = new THREE.BufferGeometry();
// position
const data_pos = [ -1,-1,0,  -1,1,0,  1,-1,0];
geometry.setAttribute('position', new THREE.BufferAttribute( new Float32Array(data_pos), 3) );
// normal
geometry.computeVertexNormals();
// uv
const data_uv = [
  0.20,0.90,
  0.95,0.90,
  0.01,0.01
];
geometry.setAttribute('uv', new THREE.BufferAttribute( new Float32Array(data_uv), 2) );
// ---------- ----------
// OBJECTS
// ---------- ----------
// mesh1
const material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, map:texture });
const mesh1 = new THREE.Mesh(geometry, material);
scene.add(mesh1);
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
    const texture_bg = canObj.texture;
    texture_bg.wrapS = THREE.RepeatWrapping;
    texture_bg.wrapT = THREE.RepeatWrapping;
    texture_bg.repeat.set(32, 24);
    scene.background = texture_bg;
    //-------- ----------
    // GRID
    //-------- ----------
    const grid = scene.userData.grid = new THREE.GridHelper(10, 10, '#ffffff', '#00afaf');
    grid.material.linewidth = 6;
    scene.add( grid );
    //-------- ----------
    // A MAIN SEQ OBJECT
    //-------- ----------
    const minimap = scene.userData.minimap = createMiniMap( new THREE.Vector2(1280 - 430, 30), 400 );
    // start options for main seq object
    const opt_seq = {
        fps: 30,
        beforeObjects: function(seq){
            camera.position.set(1.2 - 2.4 * seq.per, 1, 2.7);
            camera.lookAt(0.5,0.05,0);
            camera.zoom = 1.05 - 0.17 * seq.per;
        },
        afterObjects: function(seq){
            camera.updateProjectionMatrix();

            setV2array(minimap, geometry);
        },
        objects: []
    };
    // SEQ 0 - ...
    opt_seq.objects[0] = {
        secs: 5,
        update: function(seq, partPer, partBias){
            updateUVRotation(geometry, 0, 0.05 + 0.45 * partPer);
        }
    };
    // SEQ 1 - ...
    opt_seq.objects[1] = {
        secs: 9,
        update: function(seq, partPer, partBias){
            updateUVRotation(geometry, seq.getSinBias(1), 0.5);
        }
    };
    // SEQ 2 - ...
    opt_seq.objects[2] = {
        secs: 4,
        update: function(seq, partPer, partBias){
            updateUVRotation(geometry, 0, 0.5 - 0.4 * partPer);
        }
    };
    // SEQ 3 - ...
    opt_seq.objects[3] = {
        secs: 4,
        update: function(seq, partPer, partBias){
            const v1 = new THREE.Vector2(0.5, 0.5);
            const v2 = v1.clone().lerp( new THREE.Vector2(0.9, 0.75), partPer )
            updateUVRotation(geometry, 0.25 * partPer, 0.1, v2);
        }
    };
    // SEQ 4 - ...
    opt_seq.objects[4] = {
        secs: 4,
        update: function(seq, partPer, partBias){
            const v1 = new THREE.Vector2(0.9, 0.75);
            const v2 = v1.clone().lerp( new THREE.Vector2(0.1, 0.75), partPer )
            updateUVRotation(geometry, 0.25 + 0.125 * partPer, 0.1, v2);
        }
    };
    // SEQ 5 - ...
    opt_seq.objects[5] = {
        secs: 4,
        update: function(seq, partPer, partBias){
            const v1 = new THREE.Vector2(0.1, 0.75);
            const v2 = v1.clone().lerp( new THREE.Vector2(0.1, 0.1), partPer )
            updateUVRotation(geometry, 0.375, 0.1, v2);
        }
    };
    const seq = scene.userData.seq = seqHooks.create(opt_seq);
    console.log('frameMax for main seq: ' + seq.frameMax);
    sm.frameMax = seq.frameMax;
};
// custom render
VIDEO.render = (sm, canvas, ctx, scene, camera, renderer) => {
   const minimap = scene.userData.minimap
   sm.renderer.render(sm.scene, sm.camera);
   ctx.drawImage(sm.renderer.domElement, 0, 0, canvas.width, canvas.height);
   // draw uv minimap
   scene.userData.drawMinimap(minimap, ctx);
};
// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
    const seq = scene.userData.seq;
    seqHooks.setFrame(seq, sm.frame, sm.frameMax);
};
 
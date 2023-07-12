// video3-s5-2-loop-grid for threejs-vector3-wrap

VIDEO.scripts = [
   '../../../js/sequences-hooks/r2/sequences-hooks.js',
   '../../../js/canvas/r2/lz-string.js',
   '../../../js/canvas/r2/canvas.js'
];
// init
VIDEO.init = function(sm, scene, camera){
//-------- ----------
// HELPERS
//-------- ----------
// mod method that just wraps THREE.MathUtils.euclideanModulo
const mod = function (a, b) {
    return THREE.MathUtils.euclideanModulo(a, b);
};
// wrap method using THREE.MathUtils.euclideanModulo mod
const wrap = function (value, a, b){
    const max = Math.max(a, b);
    const min = Math.min(a, b);
    if(max === 0 && min === 0){
        return 0;
    }
    const range = max - min;
    const a_range = mod(value + Math.abs(min), range) / range;
    return min + range * a_range; 
};
// position a group of child objects to a grid
const groupToGrid = function(group, size = 5, divisions = 5, offset = new THREE.Vector2( 0.5, 0.5 ), forChild ){
    let i = 0;
    const len = size * size;
    while(i < len){
        const obj = group.children[i];
        const gx = i % size;
        const gz = Math.floor( i / size );
        obj.position.x = size / 2 * -1 + gx + offset.x;
        obj.position.z = size / 2 * -1 + gz + offset.y;
        obj.position.x = wrap(obj.position.x, size / 2 * -1, size / 2);
        obj.position.z = wrap(obj.position.z, size / 2 * -1, size / 2);
        if(forChild){
            let a_dist = obj.position.distanceTo(group.position) / ( size / 2 );
            a_dist = s_dist = THREE.MathUtils.clamp(a_dist, 0, 1);
            forChild(obj, i, gx, gz, a_dist, group);
        }
        i += 1;
    }
};
// opacity for child effect
const forChild_opacity = (function(){
    const curve_path = new THREE.CurvePath();
    const v1 = new THREE.Vector2(0.00, 1.00);
    const v2 = new THREE.Vector2(0.80, 1.00);
    const v3 = new THREE.Vector2(1.00, 0.00);
    const c1 = v2.clone().lerp(v3, 0.5).add( new THREE.Vector2( 0.0, 1.00) );
    curve_path.add( new THREE.LineCurve( v1, v2 ) );
    curve_path.add( new THREE.QuadraticBezierCurve( v2, c1, v3 ) );
    return (obj, i, gx, gz, a_dist, group) => {
        const v = curve_path.getPoint(a_dist);
        //obj.material.opacity = 1 - a_dist;
        obj.material.opacity = v.y;
    };
}());
// ---------- ----------
// LIGHT
// ---------- ----------
const dl = new THREE.DirectionalLight(0xffffff, 3);
dl.position.set(-3, 2, -1);
scene.add(dl);
// ---------- ----------
// GROUP OF OBJECTS
// ---------- ----------
const size = 10, divisions = 10;
const group = new THREE.Group();
scene.add(group);
let i = 0;
const len = size * size;
while(i < len){
    const a_x = (i % size) / size;
    const a_y = Math.floor(i / size) / size;
    const mesh = new THREE.Mesh(
        new THREE.BoxGeometry( 0.9, 1, 0.9 ),
        new THREE.MeshPhongMaterial({
            color: new THREE.Color(1 - a_x, 0.5, a_y),
            transparent: true
        })
    );
    group.add(mesh);
    i += 1;
}

    //-------- ----------
    // BACKGROUND - using canvas2
    //-------- ----------
    const BG_SCALE = 8;
    const canObj_bg = scene.userData.canObj_bg = canvasMod.create({
        size: 128 * BG_SCALE,
        palette: ['#220000', '#440000', '#880000', '#aa0000', 'red', 
                  'purple',  'orange',  'yellow',  '#22aa00', 'lime', 
                  '#00ffaa', 'cyan',    'blue',    '#0000aa', '#000088', 
                  '#000044', '#000022'],
        draw: (canObj, ctx, canvas, state) => {
            const x0 = 128 * BG_SCALE * state.a_x;
            const x1 = 128 * BG_SCALE - x0;
            const gradient = ctx.createLinearGradient(x0, 0, x1, 72 * BG_SCALE);
            canObj.palette.forEach( (color, i_color, arr) => {
                const a_color = i_color / arr.length * state.a_stops;
                gradient.addColorStop(a_color, color);
            });
            ctx.fillStyle = gradient;
            ctx.fillRect(0,0, canvas.width, canvas.height);
        },
        state: { a_x: 0, a_stops: 1 }
    });
    canObj_bg.canvas.height = 72 * BG_SCALE;
    scene.background = null;
    sm.renderer.setClearColor(null, 0);
    //-------- ----------
    // GRID
    //-------- ----------
    const grid = scene.userData.grid = new THREE.GridHelper(10, 10, '#afafaf', '#afafaf');
    grid.material.linewidth = 3;
    grid.material.transparent = false;
    grid.material.opacity = 1;
    scene.add( grid );
    //-------- ----------
    // A MAIN SEQ OBJECT
    //-------- ----------
// update
const v_offset = scene.userData.v_offset = new THREE.Vector2(0, 0);
const update = function(a_frame){
    const a_y = Math.sin( Math.PI * 2 * a_frame );

    v_offset.x = 0.5 + size * a_frame;
    v_offset.y = 0.5 + size * a_y;
    groupToGrid( group, size, divisions, v_offset, forChild_opacity );
};
    // start options for main seq object
    const opt_seq = {
        fps: 30,
        beforeObjects: function(seq){
update(seq.per);
            camera.zoom = 1;
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
            // camera
            camera.position.set(-8, 4, -8);
            camera.lookAt(0, -1, 0);
        }
    };
    // SEQ 1 - ...
    opt_seq.objects[1] = {
        secs: 27,
        update: function(seq, partPer, partBias){
            // camera
            camera.position.set(-8 + 16 * partPer, 4, -8);
            camera.lookAt(0, -1, 0);
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
// custom render function
VIDEO.render = function(sm, canvas, ctx, scene, camera, renderer){

    const v_offset = scene.userData.v_offset

    // background
    const canObj_bg = scene.userData.canObj_bg;
    canvasMod.update(canObj_bg);
    ctx.drawImage(canObj_bg.canvas, 0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(0,0,0, 0.8)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  
    // update and draw dom element of renderer
    sm.renderer.render(sm.scene, sm.camera);
    ctx.drawImage(sm.renderer.domElement, 0, 0, sm.canvas.width, sm.canvas.height);

    // additional plain 2d overlay for status info
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(0, 0, sm.canvas.width, sm.canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '40px monospace';
    ctx.textBaseline = 'top';
    ctx.fillText('frame: ' + sm.frame + '/' + sm.frameMax, 10, 20);
    ctx.fillText('v_offset: ' + v_offset.x.toFixed(2) + ',' +  v_offset.y.toFixed(2)  , 10, 70);
};
 
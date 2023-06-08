// video1-curveupdate.js - for threejs-tube-geometry
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
const getBiasAlpha = (a1 = 0, count = 1) => {
    return 1 - Math.abs( 0.5 - (a1 * count % 1)) / 0.5;
};
const getCircleVector = (i = 0, id = 0, len = 4, radius = 4, y = 0) => {
    const radian = Math.PI * 2 * ( (i + id) % len / len);
    const x = Math.cos(radian) * radius,
    z = Math.sin(radian) * radius;
    return new THREE.Vector3( x, y, z );
};
// update a single curve
const updateCurve = (i, len, curve, radius_path = 2, radius_control = 3) => {
    const y = 0;
    curve.v0.copy(  getCircleVector(i, 0, len, radius_path, y) );
    curve.v3.copy( getCircleVector(i, 1, len, radius_path, y) );
    curve.v1.copy( getCircleVector(i, 0.25, len, radius_control, y) );
    curve.v2.copy( getCircleVector(i, 0.75, len, radius_control, y) );
};
// create a curve path
const createCurvePath = () => {
    let i = 0;
    const len = 12;
    const curve_path = new THREE.CurvePath();
    while(i < len){
        const curve = new THREE.CubicBezierCurve3();
        updateCurve(i, len, curve, 4, 4.5)
        curve_path.add( curve );
        i += 1;
    }
    return curve_path;
};
const updateCurvePath = (curve_path, radius_path = 2, radius_control = 3) => {
    let i = 0;
    const len = 12;
    while(i < len){
        const curve = curve_path.curves[i];
        updateCurve(i, len, curve, radius_path, radius_control);
        i += 1;
    }
    return curve_path;
};
// update points
const updateGeometry = (geometry, geometry_source) => {
    const att_p = geometry.getAttribute('position');
    const att_ps = geometry_source.getAttribute('position');
    let i = 0;
    while(i < att_p.count){
        att_p.setXYZ( i, att_ps.getX(i), att_ps.getY(i),att_ps.getZ(i) );
        i += 1;
    }
    att_p.needsUpdate = true;
    geometry.computeVertexNormals();
};
// ---------- ----------
// CURVE Path
// ---------- ----------
const curve_path = createCurvePath();
// ---------- ----------
// GEOMETRY
// ---------- ----------
const tubular_segments = 32;
const radius = 0.75;
const radial_segments = 16;
const closed = true;
const geometry = new THREE.TubeGeometry(curve_path, tubular_segments, radius, radial_segments, closed);
// ---------- ----------
// SCENE CHILD OBJECTS
// ---------- ----------
const material = new THREE.MeshNormalMaterial();
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
    const texture = canObj.texture;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(32, 24);
    scene.background = texture;
    
    
    //-------- ----------
    // A MAIN SEQ OBJECT
    //-------- ----------
    // start options for main seq object
    const opt_seq = {
        fps: 30,
        beforeObjects: function(seq){
            camera.position.set(15, 5, 0);
            camera.zoom = 1;

    const a2 = seq.getSinBias(16, false);
    const a3 = seq.getSinBias(1, false);
    updateCurvePath(curve_path, 5 + 1 * a2, 6 - 1 * a2);
    const radiusB = 0.25 + 0.75 * a3;
    const geometry_target = new THREE.TubeGeometry(curve_path, tubular_segments, radiusB, radial_segments, closed);
    updateGeometry(geometry, geometry_target);

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
            camera.position.set(15, 5, 0);
            camera.lookAt(0, 0, 0);
        }
    };
    // SEQ 1 - ...
    opt_seq.objects[1] = {
        secs: 27,
        update: function(seq, partPer, partBias){
            // camera
            camera.position.set(15, 5, 0).lerp( new THREE.Vector3(15, 8, 10), partPer );
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
 
// video1-sphere-group.js for threejs-lod
VIDEO.scripts = [
   '../../../js/sequences-hooks/r2/sequences-hooks.js',
   '../../../js/canvas/r2/lz-string.js',
   '../../../js/canvas/r2/canvas.js',
   '../../../js/curve/r1/curve.js'
];
// init
VIDEO.init = function(sm, scene, camera){
// ---------- ----------
// HELPERS
// ---------- ----------
// crate a single LOD Sphere
const createLODSphere = ( detail_levels = 5, dist_max = 50, seg_max = 30, seg_min = 5, radius = 4 ) => {
    const lod = new THREE.LOD();
    const seg_delta = seg_max - seg_min;
    const material = new THREE.MeshNormalMaterial({ wireframe: true, wireframeLinewidth: 4 });
    for( let i = 0; i < detail_levels; i++ ) {
        const a_level = i / ( detail_levels - 1);
        const widthSegments = Math.floor( seg_max - seg_delta * a_level );
        const heightSegments = Math.floor( seg_max - seg_delta *  a_level );
        const geometry = new THREE.SphereGeometry( radius, widthSegments, heightSegments );
        const mesh = new THREE.Mesh( geometry, material );
        lod.addLevel( mesh, dist_max / detail_levels * i );
    }
    return lod;
};
const updateLODSphereGroup = ( group, alpha ) => {
    const v_home = new THREE.Vector3(1,0,0);
    group.children.forEach( (lod, i, arr) => {
        const a_child = i / arr.length;
        const e = new THREE.Euler();
        e.y = Math.PI * 2 * a_child + Math.PI * 2 * alpha;
        lod.position.copy(v_home).applyEuler(e).normalize().multiplyScalar(4);
    });

};
// create a collecton of LOD Spheres
const createLODSphereGroup = (count = 4 ) => {
    const group = new THREE.Group();
    let i = 0;
    while(i < count){
        const lod = createLODSphere(3, 8, 20, 4, 0.75 );
        group.add(lod);
        i += 1;
    }
    updateLODSphereGroup(group, 0);
    return group;
};
// ---------- ----------
// OBJECTS
// ---------- ----------
// lod object with levels added
const group = createLODSphereGroup(12);
scene.add( group );
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
    // GRID
    //-------- ----------
    const grid = scene.userData.grid = new THREE.GridHelper(10, 10, '#ffffff', '#00afaf');
    grid.material.linewidth = 3;
    scene.add( grid );
    
    //-------- ----------
    // A MAIN SEQ OBJECT
    //-------- ----------
    // start options for main seq object
    const opt_seq = {
        fps: 30,
        beforeObjects: function(seq){
            camera.position.set(8, 1, 0);
            camera.zoom = 1;
            updateLODSphereGroup(group, seq.per);
        },
        afterObjects: function(seq){
            camera.updateProjectionMatrix();
        },
        objects: []
    };
    // SEQ 0 - ...
    opt_seq.objects[0] = {
        secs: 7,
        update: function(seq, partPer, partBias){

            // camera
            camera.position.set(7, 1, 0);
            camera.lookAt(3, 0, 0);

        }
    };
    // SEQ 1 - ...
    opt_seq.objects[1] = {
        secs: 4,
        update: function(seq, partPer, partBias){

            // camera
            camera.position.set(7, 1 + 6 * partPer, 7 * partPer);
            camera.lookAt(3 - 3 * partPer, 0, 0);

        }
    };
    // SEQ 2 - ...
    opt_seq.objects[2] = {
        secs: 7,
        update: function(seq, partPer, partBias){

            // camera
            camera.position.set(7, 7, 7);
            camera.lookAt(0, 0, 0);

        }
    };
    // SEQ 3 - ...
    opt_seq.objects[3] = {
        secs: 4,
        update: function(seq, partPer, partBias){

            // camera
            camera.position.set(7 - 2 * partPer, 7 - 7 * partPer, 7 - 2 * partPer);
            camera.lookAt(0, 0, 0);

        }
    };
    // SEQ 4 - ...
    opt_seq.objects[4] = {
        secs: 8,
        update: function(seq, partPer, partBias){

            // camera
            camera.position.set(5, 0, 5);
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
 
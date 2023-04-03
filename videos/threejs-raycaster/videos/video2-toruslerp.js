// video2-toruslerp.js for threejs-raycaster
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
// HELPERS
//-------- ----------
// set mesh posiiton if we have a hit
const setMeshIfHit = (raycaster, mesh, target, adjustAxis, adjustMulti) => {
    adjustAxis = adjustAxis || 'z';
    adjustMulti = adjustMulti === undefined ? 0.5 : adjustMulti;
    // raycatsre result
    const result = raycaster.intersectObject(target, false);
    //if we have a hit, update mesh pos
    if(result.length > 0){
        const hit = result[0];
        // use distance to, lerp, and bounding box to adjust
        mesh.geometry.computeBoundingBox();
        let v_size = new THREE.Vector3();
        mesh.geometry.boundingBox.getSize(v_size);
        let hh = v_size[adjustAxis] * adjustMulti;
        let d = hit.point.distanceTo(raycaster.ray.origin);
        mesh.position.copy( hit.point ).lerp(raycaster.ray.origin, hh / d);
        //mesh.position.copy( hit.point );
        // can use the origin prop of the Ray class
        mesh.lookAt(raycaster.ray.origin);
   }
};
// get dir
const getDir = (v_origin, v_lookat) => {
    const obj = new THREE.Object3D();
    obj.position.copy(v_origin);
    obj.lookAt(v_lookat);
    const dir = new THREE.Vector3(0, 0, 1);
    dir.applyEuler(obj.rotation).normalize();
    return dir;
};
// get look at vector
const getLookAt = (deg, radius) => {
    let radian = Math.PI / 180 * deg;
    return new THREE.Vector3(1, 0, 0).applyEuler( new THREE.Euler(0, radian, 0) ).multiplyScalar(radius);
};
//-------- ----------
// OBJECTS
//-------- ----------
scene.add(new THREE.GridHelper(10, 10));
const torus_radius = 4;
// the torus mesh
const torus = new THREE.Mesh(
        new THREE.TorusGeometry(torus_radius, 1.25, 40, 40),
        new THREE.MeshNormalMaterial({ transparent: true, opacity: 0.8 }));
torus.geometry.rotateX(Math.PI * 0.5);
scene.add(torus);
// raycaster point mesh
const mesh_ray = new THREE.Mesh(
    new THREE.ConeGeometry(0.25, 2, 10, 10),
    new THREE.MeshNormalMaterial());
mesh_ray.geometry.rotateX(Math.PI * 0.5);
scene.add(mesh_ray);
// create a mesh object
const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 2, 1.25),
    new THREE.MeshNormalMaterial());
mesh.geometry.rotateX(Math.PI * 0.5);
// just translating the geometry works, but I would rather adjust by another means
//box.geometry.translate(0, 0, -0.75);
scene.add(mesh);
//-------- ----------
// RAYCASTER
//-------- ----------
// create raycaster
const raycaster = new THREE.Raycaster();

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
        [8,1,0, 12,3,10,  5,2,5,    0],
        [12,3,10, -12,3,10,  0,0,0,    0]
    ]);
    //scene.add( curveMod.debugPointsCurve(cp_campos) )
    //-------- ----------
    // CURVE Alphas
    //-------- ----------
    const getCamPosAlpha = curveMod.getAlphaFunction({
        type: 'curve2',
        ac_points: [0,0.2,  0.6, -0.15,  1]
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
            ['RayCaster class', 64, 17, 14, 'white'],
            ['Torus Lerp demo', 64, 32, 14, 'white'],
            ['', 64, 47, 14, 'white'],
            ['( r146 APR/03/2023 )', 64, 70, 12, 'gray'],
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
                    textCube.material.opacity = 0.9;
                }
            },
            {
                per: 0.75,
                update: function(seq, partPer, partBias){
                    // move up text cube
                    textCube.visible = true;
                    textCube.position.set(6, 0.8 + 1 * partPer, 0);
                    textCube.rotation.y = Math.PI * 2 * partPer;
                    textCube.material.opacity = 0.9 - 0.9 * partPer;
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
    const a = seq.per;
    let b = 1 - Math.abs(0.5 - a * 2 % 1 ) / 0.5;
    // update raycaster
    let v_lookat = getLookAt(360 * a, torus_radius);
    let v_ray_origin = new THREE.Vector3(0, -5 + 10 * b, 0);
    let v_ray_dir = getDir(v_ray_origin,  v_lookat);
    raycaster.set(v_ray_origin, v_ray_dir);
    // update mesh_ray to have the same position as the raycaster origin
    mesh_ray.position.copy(v_ray_origin);
    mesh_ray.lookAt(v_lookat);
    // if we have a hit, update the mesh object
    setMeshIfHit(raycaster, mesh, torus);

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
 
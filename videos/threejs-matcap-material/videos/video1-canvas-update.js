// video1-canvas-update.js for threejs-matcap-material
//        * based on the source for my s2-1-loop-canvas-update demo in the post
VIDEO.scripts = [
   '../../../js/sequences-hooks/r2/sequences-hooks.js'
];
// init
VIDEO.init = function(sm, scene, camera){
    // ---------- ----------
    // HELPERS
    // ---------- ----------
    // update a texture
    const update_texture = ( texture, v_offset = new THREE.Vector2(1, 1), intensity = 1 ) => {
        const canvas = texture.image;
        const ctx = canvas.getContext('2d');
        const r1 = canvas.width / 2;
        const x1 = r1, y1 = r1, x2 = r1 * v_offset.x, y2 = r1 * v_offset.y, r2 = r1 * ( 0.125 * intensity );
        const gradient = ctx.createRadialGradient(x1, y1, r1, x2, y2, r2);
        gradient.addColorStop(0, 'black');
        gradient.addColorStop(1, 'white');
        ctx.fillStyle = gradient;
        ctx.fillRect(0,0, canvas.width, canvas.height);
        texture.needsUpdate = true;
    };
    // create a canvas texture
    const create_texture = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const texture = new THREE.CanvasTexture( canvas );
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.magFilter = THREE.NearestFilter;
        update_texture(texture);
        return texture;
    };

    const update = (texture, angle = 0.25, length = 0.5, intensity = 1) => {
        const radian = Math.PI * 2 * angle;
        const x = 1 + Math.cos( radian ) * length;
        const y = 1 + Math.sin( radian ) * length;
        const v_offset = new THREE.Vector2( x, y);
        update_texture(texture, v_offset, intensity);
    };
    // ---------- ----------
    // MATERIAL
    // ---------- ----------
    const texture = create_texture();
    const material = new THREE.MeshMatcapMaterial({ matcap: texture });
    // ---------- ----------
    // GEOMETRY, MESH
    // ---------- ----------
    const geometry = new THREE.SphereGeometry(1, 30, 30);
    const mesh = new THREE.Mesh( geometry, material );
    scene.add(mesh);
    //-------- ----------
    // BACKGROUND
    //-------- ----------
    scene.background = null;
    sm.renderer.setClearColor(null, 0);
    //-------- ----------
    // A MAIN SEQ OBJECT
    //-------- ----------
    // start options for main seq object
    const opt_seq = {
        fps: 30,
        beforeObjects: function(seq){
            camera.zoom = 1;
            camera.position.set(0, 0, 3);
            camera.lookAt(0, 0, 0);
            update(texture, seq.per, 0.5, 1);
        },
        afterObjects: function(seq){
            camera.updateProjectionMatrix();
        },
        objects: []
    };
    // SEQ 0 - ...
    opt_seq.objects[0] = {
        secs: 30,
        update: function(seq, partPer, partBias){
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

    // background
    ctx.fillStyle = 'black';
    ctx.fillRect( 0, 0, canvas.width, canvas.height );
  
    // update and draw dom element of renderer
    sm.renderer.render(sm.scene, sm.camera);
    ctx.drawImage(sm.renderer.domElement, 0, 0, sm.canvas.width, sm.canvas.height);

    // additional plain 2d overlay for status info
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(0, 0, sm.canvas.width, sm.canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '60px arial';
    ctx.textBaseline = 'top';
    ctx.fillText('frame: ' + sm.frame + '/' + sm.frameMax, 10, 10);

};
 
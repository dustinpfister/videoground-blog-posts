/*    video2-shader-varying.js for threejs-materials
      * Based on the source code of my varying values demo in the shader section
 */
VIDEO.scripts = [
   '../../../js/sequences-hooks/r2/sequences-hooks.js'
];
var wrapText = function (str, width) {
    var patt = new RegExp('(?![^\\n]{1,' + width + ')([^\\n]{1,' + width + '})\\s', 'g');
    return str.replace(patt, '$1\n');
};
VIDEO.init = function(sm, scene, camera){
    sm.renderer.setClearColor(0x000000, 0.25);

// ---------- ----------
// SHADER MATERIAL
// ---------- ----------
const material1 = new THREE.ShaderMaterial({
    uniforms: {
        intensity: { value: 3.0 }
    },
    vertexShader: `
        uniform float intensity;
        varying vec3 v_color;
        void main() {
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
            v_color = position * intensity;
        }`,
    fragmentShader: `
        varying vec3 v_color;
        void main() {
            gl_FragColor = vec4( v_color, 0.75 );
        }`
});
// ---------- ----------
// GEOMETRY, MESH
// ---------- ----------
const geometry = new THREE.SphereGeometry( 1.25, 30, 30);
const mesh1 = new THREE.Mesh(geometry, material1);
scene.add(mesh1);

    //-------- ----------
    // A MAIN SEQ OBJECT
    //-------- ----------
    // start options for main seq object
    const opt_seq = {
        fps: 30,
        beforeObjects: function(seq){
            camera.zoom = 0.9;

    const a_frame = seq.per;
    a_inten = Math.sin( Math.PI * (a_frame * 9 % 1) );
    material1.uniforms.intensity.value = 1 + (1 + 7 * a_frame) * a_inten;
    material1.needsUpdate = true;


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
            camera.position.set(2, 2, 2);
            camera.lookAt(0, 0, 0);
        }
    };
    const seq = scene.userData.seq = seqHooks.create(opt_seq);
    console.log('frameMax for main seq: ' + seq.frameMax);
    sm.frameMax = seq.frameMax;


    // videoAPI.read can still be used to read a full file like this
    const uri_file = videoAPI.pathJoin(sm.filePath, 'video2-shader-varying.js')
    return videoAPI.read( uri_file, { alpha: 0, buffer_size_alpha: 1} )
    .then( (data) => {
        const text = data
        scene.userData.lines_full = text.split( /\n/ );
    });
};
// custom render function
VIDEO.render = function(sm, canvas, ctx, scene, camera, renderer){
   // plain 2d canvas drawing context for background
   const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
   gradient.addColorStop(0.10, 'black');
   gradient.addColorStop(0.50, '#2a2a2a');
   gradient.addColorStop(0.90, 'black');
   ctx.fillStyle = gradient;
   ctx.fillRect(0,0, canvas.width, canvas.height);
   // text in background loaded using videoAPI.read in int method
   ctx.fillStyle = '#ffffff';
   ctx.strokeStyle = '#8f8f8f';
   ctx.font = '50px monospace';
   scene.userData.lines.forEach( (text, i) => {
       ctx.fillText(text, 0, 50 * i);
       ctx.strokeText(text, 0, 50 * i);
   });
   ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
   ctx.fillRect(0,0, canvas.width, canvas.height);
   ctx.fillStyle = '#ffff00';
   ctx.strokeStyle = '#888800';
   ctx.font = '60px monospace';
   scene.userData.lines_full.forEach( (text, i) => {
       ctx.fillText(text, 0, 60 * i - (400 * 20) * sm.per);
       ctx.strokeText(text, 0, 60 * i - (400 * 20) * sm.per);
   });
   // update and draw dom element of renderer
   sm.renderer.render(sm.scene, sm.camera);
   ctx.drawImage(sm.renderer.domElement, 0, 0, sm.canvas.width, sm.canvas.height);
};
// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
    const seq = scene.userData.seq;
    seqHooks.setFrame(seq, sm.frame, sm.frameMax);

    // R9 now allows for using Promises on a Frame By Frame basis
    const uri_file = '/home/pi/Documents/github/blog_posts/_posts/threejs-materials.md';
    return videoAPI.read( uri_file, { alpha: sm.per * 0.95, buffer_size_alpha: 0.5 } )
    .then( (data) => {
        const text = data;
        scene.userData.lines = wrapText(text, 45).split( /\n/ ); //text.split( /\n/ );
    });
};


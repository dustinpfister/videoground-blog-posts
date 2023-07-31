/*    video1-cup.js for threejs-lathe-geometry
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
// CURVE/V2ARRAY
// ---------- ----------
const v1 = new THREE.Vector2( 0, 0 );
const v2 = new THREE.Vector2( 0.5, 0 );
const v3 = new THREE.Vector2( 0.5, 0.5);
const v4 = new THREE.Vector2( 0.4, 0.5);
const v5 = new THREE.Vector2( 0.2, 0.1);
const v6 = new THREE.Vector2( 0, 0.1);
const vc1 = v2.clone().lerp(v3, 0.5).add( new THREE.Vector2(0.25,-0.1) );
const vc2 = v4.clone().lerp(v5, 0.5).add( new THREE.Vector2(0.25, 0) );
const curve = new THREE.CurvePath();
curve.add( new THREE.LineCurve( v1, v2 ) );
curve.add( new THREE.QuadraticBezierCurve(v2, vc1, v3) );
curve.add( new THREE.LineCurve( v3, v4 ) );
curve.add( new THREE.QuadraticBezierCurve( v4, vc2, v5 ) );
curve.add( new THREE.LineCurve( v5, v6 ) );
const v2array = curve.getPoints(20);
// ---------- ----------
// GEOMETRY
// ---------- ----------
const segments_lathe = 80;
const phi_start = 0;
const phi_length = Math.PI * 2;
const geometry = new THREE.LatheGeometry( v2array, segments_lathe, phi_start, phi_length );
geometry.translate(0,-0.25,0)
// ---------- ----------
// OBJECTS
// ---------- ----------
const dl = new THREE.DirectionalLight(0xffffff, 0.95);
dl.position.set(1, 0, 3)
scene.add(dl);
scene.add( new THREE.AmbientLight(0xffffff, 0.01) );
const material = new THREE.MeshPhongMaterial({
    transparent: true,
    opacity: 0.75,
    color: 0xff0000, 
    specular: 0x8a8a8a, 
    side: THREE.FrontSide
});
const mesh1 = scene.userData.mesh1 = new THREE.Mesh(geometry, material );
scene.add(mesh1);
mesh1.scale.set(2,2,2)

/*
    const material = new THREE.MeshNormalMaterial();
    const mesh1 = scene.userData.mesh1 = new THREE.Mesh( new THREE.BoxGeometry(1, 1, 1), material );
    scene.add(mesh1);
*/
    //-------- ----------
    // A MAIN SEQ OBJECT
    //-------- ----------
    // start options for main seq object
    const opt_seq = {
        fps: 30,
        beforeObjects: function(seq){
            camera.zoom = 0.9;
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
    const uri_file = videoAPI.pathJoin(sm.filePath, 'video1-cup.js')
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
   ctx.font = '40px monospace';
   scene.userData.lines.forEach( (text, i) => {
       ctx.fillText(text, 0, 40 * i);
       ctx.strokeText(text, 0, 40 * i);
   });
   ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
   ctx.fillRect(0,0, canvas.width, canvas.height);
   ctx.fillStyle = '#00ffff';
   ctx.strokeStyle = '#008888';
   ctx.font = '60px courier';
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
    const mesh1 = scene.userData.mesh1;
    mesh1.rotation.x = Math.PI * 2 * per;
    mesh1.rotation.y = Math.PI * 4 * per;

    // R9 now allows for using Promises on a Frame By Frame basis
    const uri_file = '/home/pi/Documents/github/blog_posts/_posts/threejs-lathe-geometry.md';
    return videoAPI.read( uri_file, { alpha: sm.per * 0.95, buffer_size_alpha: 0.25 } )
    .then( (data) => {
        const text = data;
        scene.userData.lines = wrapText(text, 45).split( /\n/ ); //text.split( /\n/ );
    });

};


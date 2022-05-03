# videoground-blog-posts todo list

### () - video1 for threejs-arrow-helper
* (done) start video folder and a video1 file
* (done) start with an example from the post

* (done) adjust position of grid
* move text cube and camera in

* () have an arrow that will point to a mesh object in the scene
* () move the mesh object around in the scene
* () work out a few camera angles

* () export to raw video file
* () create final video file
* () upload to youtube
* () embed in post

<!-- JAVASCRIPT FILES -->

## () -

<!-- DAE FOLDER -->

### () - See about emmisive color?
* so far it seems like it is not possible to export a material with an emmisve color and intensity
```
// I can create a material with an emmisve color like this
let material = new THREE.MeshStandardMaterial({
    emmisive: new THREE.Color('red'),
    emmisiveIntensity : 0.1
});
```
* cube-emmisve-red.dae file for this if I can find a way that is

### () - dae folder geometry groups
* cube-geo-groups.dae - see about more than one material, and haveing groups for th gemoerty of the cube


<!-- NEED VIDEOGROUND r4+ done to do this!! -->
### () - video1 for threejs-camera-orthographic
* (done) start video folder and a video1 file
* () base video off of the state of that cube stack animation that switches between the two cameras
* () A FIX NEEDS TO ME MADE WHERE I CAN CHNAGE WHAT CAMERA IS USED
* () export to raw video file
* () create final video file
* () upload to youtube
* () embed in post

<!-- FROM A-Z YEP -->

### () - video1 for threejs-basic-material
* () start video folder and a video1 file
* () start with an example from the post
* () upload to youtube
* () embed in post

### () - video1 for threejs-box-geometry
* () start video folder and a video1 file
* () start with an example from the post
* () export to raw video file
* () create final video file
* () upload to youtube
* () embed in post

### () - video1 for threejs-box-helper
* () start video folder and a video1 file
* () start with an example from the post
* () export to raw video file
* () create final video file
* () upload to youtube// video1 for threejs-arrow-helper
 
// scripts
VIDEO.scripts = [
   '../../../js/canvas.js',
   '../../../js/canvas-text-cube.js',
   '../../../js/sequences.js'
];
// init
VIDEO.init = function(sm, scene, camera){
 
    // BACKGROUND
    scene.background = new THREE.Color('#2a2a2a');

    // GRID
    var grid = scene.userData.grid = new THREE.GridHelper(10, 10, '#ffffff', '#ffffff');
    grid.position.y = -0.01;
    scene.add( grid );
 
    // TEXT CUBE
    var textCube = scene.userData.textCube = CanvasTextCube.create({
        width: 128,
        height: 128,
        lineWidth: 7,
        lineColor: 'rgba(0,100,128,0.8)',
        lineCount: 9,
        lines: [
            ['Arrow Helpers', 64, 17, 14, 'white'],
            ['in', 64, 32, 14, 'white'],
            ['three.js', 64, 47, 14, 'white'],
            ['( r135 05/02/2022 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);

    // Y ARROW HELPER
    var arrowY = new THREE.ArrowHelper(
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, 0, 0),
        3,
        0x00ff00);
    scene.add(arrowY);
    // X ARROW HELPER
    var arrowX = new THREE.ArrowHelper(
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(0, 0, 0),
        3,
        0x0000ff);
    scene.add(arrowX);
    // Z ARROW HELPER
    var arrowZ = new THREE.ArrowHelper(
        new THREE.Vector3(0, 0, 1),
        new THREE.Vector3(0, 0, 0),
        3,
        0xff0000);
    scene.add(arrowZ);


    //arrow.setDirection(DIR);


    // SET UP SEQ OBJECT
    sm.seq = Sequences.create({
        sm: sm,
        part : [
            {
                per: 0,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // text cube
                    textCube.visible = true;
                    textCube.position.set(6, 0.8, 0);
                    textCube.material.opacity = 1.0;
                    // camera
                    camera.position.set(8, 1, 0);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                per: 0.10,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // move up text cube
                    textCube.visible = true;
                    textCube.position.set(6, 0.8 + 1 * partPer, 0);
                    textCube.rotation.y = Math.PI * 2 * partPer;
                    textCube.material.opacity = 1.0 - partPer;
                    // camera
                    camera.position.set(8, 1, 0);
                    camera.lookAt(0, 0, 0);
                }
            },
            // sq1 - 
            {
                per: 0.15,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // camera
                    camera.position.set(8, 1 + 5 * partPer, 0);
                    camera.lookAt(0, 0, 0);
                }
            }
        ]
    });
};

// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
    var textCube = scene.userData.textCube;
    textCube.rotation.y = 0;
    textCube.position.set(8, 0.8, 0);
    textCube.visible = false;
    textCube.material.transparent = true;
    textCube.material.opacity = 0.0;
    // sequences
    Sequences.update(sm.seq, sm);
};


* () embed in post

### () - video1 for threejs-buffer-geometry
* () start video folder and a video1 file
* () start with an example from the post
* () export to raw video file
* () create final video file
* () upload to youtube
* () embed in post

### () - video1 for threejs-geometry
* () start video folder and a video1 file
* () export to raw video file
* () create final video file
* () upload to youtube
* () embed in post

### () - video1 for threejs-materials
* () start video folder and a video1 file
* () export to raw video file
* () create final video file
* () upload to youtube
* () embed in post

### () - video1 for threejs-emissive-map
* () start video folder and a video1 file
* () upload to youtube
* () embed in post

### () - video1 for threejs-texture-loader
* () start video folder and a video1 file
* () export to raw video file
* () create final video file
* () upload to youtube
* () embed in post

<!-- THREEJS-EXAMPLES -->

### () - video1 for threejs-examples

### () - video1 for threejs-examples-biplane-group
* () start video folder and a video1 file
* () export to raw video file
* () create final video file
* () upload to youtube
* () embed in post

### () - video1 for threejs-examples-build-a-box
* () start video folder and a video1 file
* () export to raw video file
* () create final video file
* () upload to youtube
* () embed in post

### () - video1 for threejs-examples-clock-basic
* () start video folder and a video1 file
* () upload to youtube
* () embed in post

### () - video1 for threejs-examples-dae-tools
* () start video folder and a video1 file
* () export to raw video file
* () create final video file
* () upload to youtube
* () embed in post

### () - video1 for threejs-examples-guy-one
* () start video folder and a video1 file
* () export to raw video file
* () create final video file
* () upload to youtube
* () embed in post

### () - video1 for threejs-examples-land-sections

### () - video1 for threejs-examples-menus

### () - video1 for threejs-examples-position-things-to-sphere-surface

### () - video1 for threejs-examples-scene-shake
* () start video folder and a video1 file
* () export to raw video file
* () create final video file
* () upload to youtube
* () embed in post

### () - video1 for threejs-examples-sphere-mutate

### () - video1 for threejs-examples-tool-source-layer-3d

### () - video1 for threejs-examples-tree-sphere
* () start video folder and a video1 file
* () export to raw video file
* () create final video file
* () upload to youtube
* () embed in post

### () - video1 for threejs-examples-tree-sphere-world
* () start video folder and a video1 file
* () export to raw video file
* () create final video file
* () upload to youtube
* () embed in post

### () - video1 for threejs-examples-weird-walk-guy-two
* () start video folder and a video1 file
* () export to raw video file
* () create final video file
* () upload to youtube
* () embed in post

<!--  TRAFFIC -->

### () - video1 for threejs-line
* () start video folder and a video1 file
* () export to raw video file
* () create final video file
* () upload to youtube
* () embed in post

### () - video1 for threejs-vector3
* () start video folder and a video1 file
* () export to raw video file
* () create final video file
* () upload to youtube
* () embed in post

<!-- DONE -->

### ( done 05/02/2022 ) - video1 for threejs-mesh
* (done) start a video1
* (done) have a sq1 that is just moving a mesh around
* (done) have a sq2 that is just rotation of a mesh
* (done) have a sq3 that is scaling of a mesh
* (done) have a sq4 that is a group of mesh objects pointing at the single mesh and rotating
* (done) upload to youtube
* (done) embed in post

### ( done 05/02/2022 ) - video1 for threejs-examples-cube-stack-grid
* (done) start video folder and a video1 file
* (done) have example from post working
* (done) work out some cool camera angles
* (done) upload to youtube
* (done) embed in post

### ( done 05/02/2022 ) - video1 for threejs-ambientlight
* (done) start video folder and a video1 file
* (done) start with an example from the post
* (done) upload to youtube
* (done) embed in post

### ( done 05/01/2022 ) - video1 for threejs-alpha-map
* (done) start video folder and a video1 file
* (done) start with an example from the post
* (done) update alpha map over time
* (done) update canvas texture
* (done) upload to youtube
* (done) embed in post

### ( done 04/30/2022 ) - video1 for threejs-object3d-traverse
* (done) start video folder and a video1 file
* (done) see about using one of the exmaples in the post and just move on for video1 at least with this
* (done) switch to using the standard material
* (done) have a default color for each mesh be red in update
* (done) use traverse to set color of each mesh
* (done) upload to youtube
* (done) embed in post

### ( done 04/30/2022 ) - video1 for threejs-examples-cube-stack
* (done) start video folder and a video1 file
* (done) upload to youtube
* (done) embed in post

### ( done 04/30/2022 ) - video1 for threejs-geometry-attributes-uv ( 359 - 3mo - 4/11/2022 )
* (done) start a video1
* (done) video one done
* (done) upload to youtube
* (done) embed in post

### ( done 04/30/2022 ) - video1 for threejs-examples-house ( 346 - 3mo - 4/11/2022 )
* (done) start the video folder and video1 file
* (done) have the house displayed in the scene
* (done) work out a few seqs for camera movement, and lookAt changes
* (done) upload to youtube
* (done) embed in post

### ( done 04/28/2022 ) - video1 for threejs-examples-tree
* (done) start a video1
* (done) upload to youtube
* (done) embed in post

### ( done 04/28/2022 ) - video1 for threejs-examples-nested-groups
* (done) start a video1
* (done) upload to youtube
* (done) embed in post

### ( done 04/28/2022 ) - video1 for threejs-examples-waves
* (done) start a video1
* (done) upload to youtube
* (done) embed in post

### ( done 04/28/2022 ) - video1 for threejs-mesh-copy ( 368 - 3mo - 4/11/2022 )
* (done) start a video1
* (done) have functions that can be used to mutate a group (color, position, and so forth)
* (done) upload to youtube
* (done) embed in post

### ( done 04/27/2022 ) - video1 for threejs-examples-backyard
* (done) start a video1
* (done) move wheel in example
* (done) upload to youtube
* (done) embed in post

### ( done 04/27/2022 ) - video1 for threejs-basic-framework
* (done) start a video1
* (done) upload to youtube
* (done) embed in post

### ( done 04/27/2022 ) - video1 for threejs-examples-biplane
* (done) start a video1
* (done) data textures
* (done) upload to youtube
* (done) embed in post

### ( done 04/26/2022 ) - video1 for threejs-scene
* (done) video1 done

### ( done 04/26/2022 ) - video1 for threejs-geometry-attributes-position ( 406 - 3mo - 4/11/2022 )
* start a video1 for position attribute

### ( done 04/24/2022 ) - video1 for threejs-object3d-get-world-position ( 429 - 3mo - 4/11/2022 )
* (done) get world position demo video

### ( done 04/22/2022 ) - video1 for threejs-examples-weird-walk-one
* (done) video1 done for this

### ( done 04/21/2022 ) - video1 for threejs-examples-plane-mutate
* (done) video1 done

### ( done 04/21/2022 ) - video1 for threejs-standard-material
* (done) video1 done

### ( done 04/13/2022 ) - video1 for threejs-materials-transparent ( 447 - 3mo - 4/11/2022 )
* (done) start a video1 

### ( done 04/11/2022 ) - video1 for threejs-object3d-scale
* (done) start a video1 for threejs-object3d-scale

### ( done 04/11/2022 ) - video1 for threejs-object3d-lookat
* (done) start a video1 for threejs-object3d-lookat

### ( done 04/07/2022 ) - video1 for threejs-canvas-texture
* (done) start a videos for threejs-materials-transparent
* (done) finish video1 with at least a few segments

### ( done 04/05/2022 ) - video1 for threejs-grouping-mesh-objects
* (done) start video1 for groups

### ( done 04/04/2022 ) - video1 for threejs-object3d-position
* (done) start a video1 for new threejs-object3d-position post

### ( done 03/22/2022 ) - video1 for threejs-fog
* (done) use  start canvas-text-cube.js file for title at least in video1
* (done) finish video1
* (done) upload video1 to youtube
* (done) embed video1 into threejs-fog blog post

## ( done 03/11/2022 ) - lines feature, edge effect in canvas-text-cube.js;
* (done) have a lines option for drawing custom text to a text cube
* (done) have an edge effect for the cube where color gets weeker from the edge

### ( done 03/11/2022) - start a canvas-text-cube.js javaScript files
* (done) start canvas-text-cube.js file

### ( done 03/10/2022 ) - dae folder cube uv
* (done) have a dea/cube/textures folder to contain images
* (done) cube-uv.dae - this one should export with a uv attribute, and also make use of a texture

### ( done 03/10/2022 ) - dae folder cube color example
* (done) cube-color-red.dae file that will just be a solid color

### ( done 03/10/2022 ) - start a dae folder and cube
* (done) start a dae folder, and start with a simple cube folder
* (done) have a dae/cube/videos folder for any and all VideoGround test videos
* (done) start a README.md file for dae/cube and write notes as needed
* (done) start with a dae/cube/cube-pos.blend file that will just be a cube with position and normals

### ( done 03/07/2022 ) - start js folder
* (done) start a js folder and have the files that I use thus far
* (done) have canvas.js
* (done) have guy.js and guy.canvas

### ( done 03/07/2022 ) - start video folder for threejs-fog
* (done) start a fog-basic example that is just a simple example of THREE.Fog
* (done) start todo list for this and take it from there


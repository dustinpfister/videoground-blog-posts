// video1 for template7-datatex
 
// scripts
VIDEO.scripts = [
   '../../../js/canvas/r0/canvas.js',
   '../../../js/canvas-text-cube/r0/canvas-text-cube.js',
   '../../../js/sequences-hooks/r1/sequences-hooks.js',
   '../../../js/svgmove/r0/svgmove.js',
   '../../../js/r140-files/SVGLoader.js'
];
// init
VIDEO.init = function(sm, scene, camera){
    //-------- ----------
    // LIGHT
    //-------- ----------
    const dl = new THREE.DirectionalLight(0xffffff, 0.85);
    dl.position.set(-3, 2, 1)
    scene.add(dl);
    const al = new THREE.AmbientLight(0xffffff, 0.15);
    scene.add(al);
    //-------- ----------
    // HELPERS
    //-------- ----------
    const makeCube = (size, color) => {
        size = size === undefined ? 1 : size;
        return new THREE.Mesh(
            new THREE.BoxGeometry(size, size, size),
            new THREE.MeshPhongMaterial({
                color: color || new THREE.Color(1, 1, 1)
            })
        );
    };
    //-------- ----------
    // BACKGROUND
    //-------- ----------
    scene.background = new THREE.Color('#afafaf');
    //-------- ----------
    // CHILD OBJECTS
    //-------- ----------
    var grid = scene.userData.grid = new THREE.GridHelper(50, 50, '#ffffff', '#000000');
    grid.material.linewidth = 3;
    grid.material.transparent = true;
    grid.material.opacity = 0.25;
    scene.add( grid );
    // cube mesh 1
    const mesh1 = makeCube(1);
    scene.add(mesh1);
    // sphere
    const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(40, 60, 60), 
        new THREE.MeshPhongMaterial({
           side: THREE.DoubleSide,
           color: 0x00afaf
        })
    );
    scene.add(sphere);
    //-------- ----------
    // TEXT CUBE
    //-------- ----------
    var textCube = scene.userData.textCube = CanvasTextCube.create({
        width: 128,
        height: 128,
        lineWidth: 7,
        lineColor: 'rgba(0,100,128,0.8)',
        lineCount: 9,
        lines: [
            ['template8', 64, 17, 14, 'white'],
            ['', 64, 32, 14, 'white'],
            ['', 64, 47, 14, 'white'],
            ['( r140 dd/mm/yyyy )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);
    //-------- ----------
    // TEXT CUBE SEQ OBJECT
    //-------- ----------
    var seq_textcube = seqHooks.create({
        setPerValues: false,
        fps: 30,
        beforeObjects: function(seq){
            var textCube = scene.userData.textCube;
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
                    textCube.position.set(6, 0.8, 0);
                    textCube.material.opacity = 1.0;
                }
            },
            {
                per: 0.75,
                update: function(seq, partPer, partBias){
                    // move up text cube
                    textCube.visible = true;
                    textCube.position.set(6, 0.8 + 1 * partPer, 0);
                    textCube.rotation.y = Math.PI * 2 * partPer;
                    textCube.material.opacity = 1.0 - partPer;
                }
            }
        ]
    });
    //-------- ----------
    // MAIN SEQ OBJECT
    //-------- ----------
    var seq = scene.userData.seq = seqHooks.create({
        fps: 30,
        beforeObjects: function(seq){
            // mesh1
            mesh1.rotation.x = Math.PI * 2 * 1 * seq.per;
            mesh1.rotation.y = Math.PI * 2 * 4 * seq.per;
            // text cube and camera
            textCube.visible = false;
            camera.position.set(8, 1, 0);
        },
        afterObjects: function(seq){
        },
        objects: [
            {
                secs: 3,
                update: function(seq, partPer, partBias){
                    // textcube
                    if(seq.partFrame < seq.partFrameMax){
                        seqHooks.setFrame(seq_textcube, seq.partFrame, seq.partFrameMax);
                    }
                    // camera
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 2,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(8, 1 + 7 * partPer, 8 * partPer);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 25,
                update: function(seq, partPer, partBias){
                    SVGMove.setToAlpha(camera, partPer);
                }
            }
        ]
    });
    console.log('frameMax for main seq: ' + seq.frameMax);
    sm.frameMax = seq.frameMax;
    //-------- ----------
    // SVG LOADER
    //-------- ----------
    return new Promise((resolve, reject)=>{
        // instantiate a loader
        const loader = new THREE.SVGLoader();
        // load a SVG resource
        loader.load(
            // resource URL
            videoAPI.pathJoin(sm.filePath, '../svg/movement.svg'),
            // called when the resource is loaded
            function ( data ) {
                // SET UP OBJECTS THAT ARE TO BE EFFECTED BY SVGMOVE HERE
                SVGMove.useObj(data, 'cam1', camera);
                // resolve
                resolve();
            },
            // called when loading is in progresses
            function ( xhr ) {
                console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
            },
            // called when loading has errors
            function ( error ) {
                console.log( 'An error happened' );
                console.log(error);
                reject(error);
            }
        );
    });
};
// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
    var seq = scene.userData.seq;
    seqHooks.setFrame(seq, sm.frame, sm.frameMax);
};

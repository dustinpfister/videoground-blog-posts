// video1 for threejs-math-utils
 
// scripts
VIDEO.scripts = [
   '../../../js/canvas/r0/canvas.js',
   '../../../js/canvas-text-cube/r0/canvas-text-cube.js',
   '../../../js/sequences-hooks/r1/sequences-hooks.js',
   '../../../js/datatex/r0/datatex.js'
];
// init
VIDEO.init = function(sm, scene, camera){

    let palette_gray = [
        [0,0,0,255],
        [255,255,255,255],
        [128,128,128,255],
        [64,64,64,255]
    ]

    //-------- ---------- 
    // TEXTURES
    //-------- ----------
    var texture1 = datatex.fromPXDATA([
        2,1,1,1,1,2,
        1,2,2,2,2,1,
        1,2,3,3,2,1,
        1,2,3,3,2,1,
        1,2,2,2,2,1,
        2,1,1,1,1,2
    ], 6, palette_gray);
    var texture2 = datatex.fromPXDATA([
        2,1,1,1,1,1,1,1,1,2,
        1,1,1,1,1,1,1,1,1,1,
        1,1,1,1,0,0,1,1,1,1,
        1,1,1,0,0,0,0,1,1,1,
        1,1,2,3,1,1,3,2,1,1,
        1,1,1,1,1,1,1,1,1,1,
        1,1,2,0,1,1,0,2,1,1,
        1,2,2,0,1,1,0,2,2,1,
        1,1,1,1,1,1,1,1,1,1,
        2,1,1,1,1,1,1,1,1,2
    ], 10, palette_gray);
    var texture3 = datatex.seededRandom(64, 64, 1, 1, 1, [32, 128]);
 
    //-------- ----------
    // LIGHT
    //-------- ----------
    const dl = new THREE.DirectionalLight(0xffffff, 1);
    dl.position.set(1, 2.5, 5);
    scene.add(dl);
    const pl = new THREE.PointLight(0xffffff, 1);
    scene.add(pl);
    const al = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(al);
    //-------- ----------
    // HELPERS
    //-------- ----------
    // Wrap method based off of the method from Phaser3 
    // ( https://github.com/photonstorm/phaser/blob/v3.55.2/src/math/Wrap.js )
    // * Added some code for case: Wrap(0, 0, 0)
    // * Using Math.min and Math.max so that Wrap(value, 2, 10) is same as Wrap(value, 10, 2)
    //
    var wrap = function (value, a, b){
        // get min and max this way
        var max = Math.max(a, b);
        var min = Math.min(a, b);
        // return 0 for Wrap(value, 0, 0);
        if(max === 0 && min === 0){
             return 0;
        }
        var range = max - min;
        return (min + ((((value - min) % range) + range) % range));
    };
    // UPDATE A GROUP USING THREE.mathUtils.smoothstep
    const updateGroupSmooth = (group, secs) => {
        group.children.forEach( (mesh) => {
            const mud = mesh.userData;
            // variable pixles per second using THREE.MathUtils.smoothstep and Vector3.distanceTo
            const d = mesh.position.distanceTo( new THREE.Vector3(0, 0, mesh.position.z) );
            const pps = THREE.MathUtils.smoothstep(d, -5, 5) * mud.maxPPS;
            // stepping posiiton
            mesh.position.x -= pps * secs;
            // wrap
            mesh.position.x = wrap(mesh.position.x, -10, 10);
        });
    };
    // simple update group with fixed pixles per second for sake of something to compare to
    const updateGroup = (group, secs) => {
        group.children.forEach( (mesh) => {
            const mud = mesh.userData;
            // stepping posiiton
            mesh.position.x -= mud.maxPPS * secs;
            // wrap
            mesh.position.x = wrap(mesh.position.x, -10, 10);
        });
    };
    // create a group
    const createGroup = (size, color, texture) => {
        size = size === undefined ? 1 : size;
        color = color || new THREE.Color(1, 1, 1);
        texture = texture || texture1;
        let i = 0;
        const len = 10, group = new THREE.Group();
        while(i < len){
            const mesh = new THREE.Mesh(
                new THREE.BoxGeometry(size, size, size),
                new THREE.MeshPhongMaterial({
                    color: color,
                    map: texture,
                    transparent: true,
                    opacity: 1.0
                }));
            mesh.userData.maxPPS = 3 + 5 * (i / len);
            const x = 10;
            const z = -12 + 17 * (i / len);
            mesh.position.set(x, 0, z);
            group.add(mesh);
            i += 1;
        }
        return group;
    };
    //-------- ----------
    // OBJECTS
    //-------- ----------
    const group1 = createGroup( 1.5, new THREE.Color(0,1,1), texture2 );
    scene.add(group1);
    const group2 = createGroup( 1.5 );
    group2.position.y = -1.6;
    scene.add(group2);
    // BACKGROUND
    scene.background = new THREE.Color('#2a2a2a');

    var plane = new THREE.Mesh( new THREE.PlaneGeometry(50, 50, 1, 1), new THREE.MeshPhongMaterial({
        side: THREE.DoubleSide,
        color: new THREE.Color(0, 1, 0),
        map: texture3
    }) );
    plane.geometry.rotateX(Math.PI * 1.5);
    plane.position.set(0, -3.2, 0);
    scene.add(plane);

    // GRID
    //var grid = scene.userData.grid = new THREE.GridHelper(10, 10, '#ffffff', '#00afaf');
    //grid.material.linewidth = 3;
    //scene.add( grid );
 
    // TEXT CUBE
    var textCube = scene.userData.textCube = CanvasTextCube.create({
        width: 128,
        height: 128,
        lineWidth: 7,
        lineColor: 'rgba(0,100,128,0.8)',
        lineCount: 9,
        lines: [
            ['Math Utils', 64, 17, 14, 'white'],
            ['Object in', 64, 32, 14, 'white'],
            ['threejs', 64, 47, 14, 'white'],
            ['( r140 09/12/2022 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);

    // A SEQ FOR TEXT CUBE
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

    // A MAIN SEQ OBJECT
    var seq = scene.userData.seq = seqHooks.create({
        fps: 30,
        beforeObjects: function(seq){
            textCube.visible = false;
            camera.position.set(8, 1, 0);
            // update groups
            const secs = 1 / 30;
            updateGroupSmooth(group1, secs);
            updateGroup(group2, secs);
            // point light
            //const r = Math.PI * 2 * seq.getPer(1),
            //x = Math.cos(r) * 10,
            //z = Math.sin(r) * 10;
            pl.position.set(7, 7, 7);
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
                    camera.position.set(8 - 3 * partPer, 1 + 4 * partPer, 5 * partPer);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 2,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(5 - 10 * partPer, 5, 5);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 23,
                update: function(seq, partPer, partBias){
                    // camera
                    let s = 5 + 5 * partPer
                    camera.position.set(s * -1, s, s);
                    camera.lookAt(0, 0, 0);
                }
            }
        ]
    });

    console.log('frameMax for main seq: ' + seq.frameMax);
    sm.frameMax = seq.frameMax;

};

// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
    var seq = scene.userData.seq;
    seqHooks.setFrame(seq, sm.frame, sm.frameMax);

};


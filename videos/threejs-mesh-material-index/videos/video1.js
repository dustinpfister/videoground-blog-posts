// video1 for threejs-mesh-material-index
 
// scripts
VIDEO.scripts = [
   '../../../js/canvas/r0/canvas.js',
   '../../../js/canvas-text-cube/r0/canvas-text-cube.js',
   '../../../js/sequences-hooks/r1/sequences-hooks.js',
   '../../../js/datatex/r0/datatex.js'
];
// init
VIDEO.init = function(sm, scene, camera){
    //-------- ----------
    // LIGHT
    //-------- ----------
    const dl = new THREE.DirectionalLight(0xffffff, 1);
    dl.position.set(3, 2, 1);
    scene.add(dl);
    const al = new THREE.AmbientLight(0xffffff, 0.15);
    scene.add(al);
    const pl = new THREE.PointLight(0xffffff, 0.5);
    pl.position.set(-3, 2, -3);
    scene.add(pl);
    //-------- ----------
    // HELPERS
    //-------- ----------
    // create a plane geo with groups set up to work with images
    const createPlaneGeo = () => {
        const geometry = new THREE.PlaneGeometry(10, 10, 16, 16);
        geometry.rotateX(Math.PI * 1.5);
        let pxIndex = 0, len = 256;
        while(pxIndex < len){
            geometry.addGroup(pxIndex * 6, 6, 0);
            pxIndex += 1;
        }
        return geometry;
    };
    // update plane geo to given imageindex and images array
    const updatePlaneGeo = (geometry, images, imageIndex) => {
        const img = images[imageIndex];
        let pxIndex = 0, len = 256;
        while(pxIndex < len){
            const group = geometry.groups[pxIndex]
            group.materialIndex = img[pxIndex];
            pxIndex += 1;
        }
        return geometry;
    };
    const mkMaterial = (color, opacity, texture) => {
        return new THREE.MeshPhongMaterial({
            color: color,
            map: texture || null,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: opacity
        })
    };
    // create plane mesh to use with images
    const createPlaneMesh = (materials) => {
        // new plane geometry
        var geometry = createPlaneGeo(images, 1);
        var mesh = new THREE.Mesh(
            // geometry as first argument
            geometry,
            // array of materials as the second argument
            materials || [
                mkMaterial(0xffffff, 1, null),
                mkMaterial(0x000000, 1, null),
                mkMaterial(0x888888, 1, null)
            ]
        );
        return mesh;
    };
    //-------- ----------
    // BACKGROUND
    //-------- ----------
    scene.background = new THREE.Color('#000000');
//-------- ----------
    // PLANE MATERIAL INDEX DATA
    //-------- ----------
    const images = [
        [
            1,2,2,0,0,0,0,0,0,0,0,0,0,2,2,1,
            2,2,0,0,0,1,1,2,2,1,1,0,0,0,2,2,
            2,0,0,0,1,2,2,0,0,2,2,1,0,0,0,2,
            0,0,0,1,2,0,0,0,0,0,0,2,1,0,0,0,
            0,0,0,2,0,1,2,0,0,2,1,0,2,0,0,0,
            0,0,0,0,0,1,2,0,0,2,1,0,0,0,0,0,
            0,0,0,0,1,1,2,0,0,2,1,1,0,0,0,0,
            0,0,0,0,1,1,2,0,0,2,1,1,0,0,0,0,
            0,0,0,0,2,2,2,1,1,2,2,2,0,0,0,0,
            0,0,0,0,0,0,2,1,1,2,0,0,0,0,0,0,
            0,0,0,0,0,0,2,2,2,0,0,0,0,0,0,0,
            0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,
            0,0,0,0,2,1,1,1,1,1,1,0,0,0,0,0,
            2,0,0,0,0,2,2,1,1,2,2,0,0,0,0,2,
            2,2,0,0,0,0,0,2,2,0,0,0,0,0,2,2,
            1,2,2,0,0,0,0,0,0,0,0,0,0,2,2,1
        ],
        [
            0,0,2,2,2,0,0,0,0,0,0,0,0,0,0,0,
            1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
            0,0,0,0,2,2,2,2,0,0,0,0,0,0,0,0,
            1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
            0,0,0,0,0,0,0,2,2,2,2,2,0,0,0,0,
            1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
            0,0,0,0,0,0,0,0,0,0,0,2,2,2,0,0,
            1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
            0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,
            1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
            0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,
            1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
            0,0,0,0,0,0,0,0,0,0,2,2,2,0,0,0,
            1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
            0,0,0,0,0,0,0,2,2,2,2,0,0,0,0,0,
            1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
            2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0
        ],
        [
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,1,1,1,2,0,1,1,1,2,0,0,0,
            0,0,0,0,0,2,2,1,1,2,2,2,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,1,1,0,2,1,1,0,0,0,0,0,
            0,0,0,1,1,1,1,0,2,1,1,1,1,2,0,0,
            0,0,0,2,2,2,2,2,2,2,2,2,2,0,0,0,
            0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,
            0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,
            0,0,0,0,0,1,2,0,0,2,1,0,0,0,0,0,
            0,0,0,0,0,2,0,0,0,0,2,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
        ],
        [
            0,1,2,1,0,1,0,1,0,1,0,1,0,1,0,1,
            1,0,1,2,1,0,1,0,1,0,1,0,1,0,1,0,
            0,1,0,1,2,1,0,1,0,1,0,1,0,1,0,1,
            1,0,1,0,1,2,1,0,1,0,1,0,1,0,1,2,
            0,1,0,1,2,1,0,1,0,1,0,1,0,1,2,1,
            1,0,1,2,1,0,1,0,1,0,1,0,1,2,1,0,
            0,1,0,1,2,1,0,1,0,1,0,1,2,1,0,1,
            1,2,1,2,1,0,1,0,1,0,1,0,1,2,1,0,
            2,1,0,1,0,1,0,1,0,1,0,1,0,1,2,1,
            1,0,1,0,1,0,1,0,1,0,1,0,1,2,1,0,
            0,1,0,1,0,1,0,1,0,1,0,1,2,1,0,1,
            1,0,1,0,1,0,1,0,1,0,1,2,1,0,1,0,
            0,1,0,1,0,1,0,1,0,1,2,1,0,1,0,1,
            1,0,1,0,1,0,1,0,1,2,1,0,1,0,1,0,
            0,1,0,1,0,1,0,1,0,1,2,1,0,1,0,1,
            1,0,1,0,1,0,1,0,1,0,1,2,1,0,1,0
        ]
    ];
    //-------- ----------
    // TEXTURES
    //-------- ----------
    const pal = [
        [0,0,0,255],
        [0,255,0,255],
        [32,32,32,255],
        [64,64,64,255],
        [128,128,128,255]
    ];
    const texture_rnd1 = datatex.seededRandom(32, 32, 1, 1, 1, [128, 255]);
    const texture_top = datatex.fromPXDATA([
        1,1,1,1,
        1,2,3,3,
        1,2,2,2,
        1,2,3,3
    ], 4, pal);
    const texture_side1 = datatex.fromPXDATA([
        1,1,1,1,
        2,3,2,1,
        3,2,3,1,
        1,1,1,1
    ], 4, pal);
    const texture_side2 = datatex.fromPXDATA([
        1,1,1,1,
        2,2,2,2,
        3,3,3,3,
        3,3,3,3
    ], 4, pal);
    const texture_side3 = datatex.fromPXDATA([
        3,1,2,1,
        3,1,1,1,
        3,2,2,2,
        3,3,3,3
    ], 4, pal);
    const texture_side4 = datatex.fromPXDATA([
        3,1,2,2,
        3,1,1,1,
        2,2,2,1,
        3,3,3,1
    ], 4, pal);
    const texture_bottom = datatex.fromPXDATA([
        2,2,1,3,
        1,1,1,3,
        2,2,2,3,
        3,3,3,3
    ], 4, pal);
    //-------- ----------
    // MESH OBJECTS
    //-------- ----------
    var mesh = new THREE.Mesh(
        // geometry as first argument
        new THREE.BoxGeometry(2, 2, 2),
        // array of materials as the second argument
        [
            mkMaterial(0xffffff, 0.5, texture_side1),
            mkMaterial(0xffffff, 0.5, texture_side3),
            mkMaterial(0xffffff, 0.5, texture_top),
            mkMaterial(0xffffff, 0.5, texture_bottom),
            mkMaterial(0xffffff, 0.5, texture_side2),
            mkMaterial(0xffffff, 0.5, texture_side4)
        ]
    );
    mesh.position.set(0, 1.5, 0);
    scene.add(mesh);
    // plane
    const plane = createPlaneMesh([
       mkMaterial(0xffffff, 1, texture_rnd1),
       mkMaterial(0x222222, 1, texture_rnd1),
       mkMaterial(0x008800, 1, texture_rnd1)
    ]);
    updatePlaneGeo(plane.geometry, images, 0);
    scene.add(plane);
    // sphere
    const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(200, 30, 30),
        new THREE.MeshBasicMaterial({wireframe:true, wireframeLinewidth: 3}))
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
            ['Mesh Objects and', 64, 17, 14, 'white'],
            ['Material Index', 64, 32, 14, 'white'],
            ['values of groups', 64, 47, 14, 'white'],
            ['( r140 09/14/2022 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);
    // a seq object for textcube
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

        const alpha = seq.per;
        updatePlaneGeo(plane.geometry, images, [0,1,2,3,0,1,2,3][ Math.floor(alpha * 8)] );
        mesh.rotation.set(
            Math.PI * 2 * 1 * alpha, 
            Math.PI * 2 * 8 * alpha, 0);
        sphere.rotation.y = Math.PI * 2 * alpha;

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
                secs: 5,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(8 - 13 * partPer, 8 - 3 * partPer, 8 - 3 * partPer);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 5,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(-5, 5, 5);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 5,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(-5, 5 - 3.5 * partPer, 5);
                    camera.lookAt(0, 1.5 * partPer, 0);
                }
            },
            {
                secs: 5,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(-5 + 5 * partPer, 1.5, 5 - 5 * partPer);
                    camera.lookAt(1 * partPer, 1.5, 0);
                }
            },
            {
                secs: 5,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(10 * partPer, 1.5, 0);
                    camera.lookAt(1, 1.5, 0);
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

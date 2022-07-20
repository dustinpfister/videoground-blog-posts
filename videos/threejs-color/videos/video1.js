// video1 for threejs-color
 
// scripts
VIDEO.scripts = [
   '../../../js/canvas.js',
   '../../../js/canvas-text-cube.js',
   '../../../js/sequences-hooks-r1.js'
];
// init
VIDEO.init = function(sm, scene, camera){
 


    // GRID
    var grid = scene.userData.grid = new THREE.GridHelper(10, 10, '#ffffff', '#00afaf');
    grid.material.linewidth = 3;
    scene.add( grid );
 
    // TEXT CUBE
    var textCube = scene.userData.textCube = CanvasTextCube.create({
        width: 128,
        height: 128,
        lineWidth: 7,
        lineColor: 'rgba(0,100,128,0.8)',
        lineCount: 9,
        lines: [
            ['THREE.Color Class', 64, 17, 12, 'white'],
            ['in', 64, 32, 12, 'white'],
            ['threejs', 64, 47, 14, 'white'],
            ['( r135 07/20/2022 )', 64, 70, 11, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);

    // LIGHT
    var dl = new THREE.DirectionalLight(0xffffff, 1);
    dl.position.set(2, 1, 4)
    scene.add(dl);


    //******** **********
    // DATA TEXTURE HELPER
    //******** **********
    // create data texture method
    let createDataTexture = function(opt){
        opt = opt || {};
        opt.width = opt.width === undefined ? 16: opt.width; 
        opt.height = opt.height === undefined ? 16: opt.height;
        // default for pix method
        opt.forPix = opt.forPix || function(color, x, y, i, opt){
            let v = Math.floor( THREE.MathUtils.seededRandom() * 255 );
            color.setRGB(v, v, v);
            return color;
        };
        let size = opt.width * opt.height;
        let data = new Uint8Array( 4 * size );
        for ( let i = 0; i < size; i ++ ) {
            let stride = i * 4,
            x = i % opt.width,
            y = Math.floor(i / opt.width),
            color = opt.forPix( new THREE.Color(), x, y, i, opt);
            data[ stride ] = color.r;
            data[ stride + 1 ] = color.g;
            data[ stride + 2 ] = color.b;
            data[ stride + 3 ] = 255;
        }
        let texture = new THREE.DataTexture( data, opt.width, opt.height );
        texture.needsUpdate = true;
        return texture;
    };

    //******** **********
    // THREE.COLOR
    //******** **********

   // will be using THREE.Color to set and update FOG and background
   var bgColor = new THREE.Color('#ffffff');
   scene.background = bgColor;
   scene.fog = new THREE.Fog(bgColor, 1.0, 17);

   // I will want a number of mesh objects
    var randomColor = function () {
        var r = Math.random(),
        g = Math.random(),
        b = Math.random();
        return new THREE.Color(r, g, b);
    };
    var randomPosition = function () {
        var x = -5 + 10 * Math.random(),
        y = -1 + 2 * Math.random(),
        z = 5 + Math.random() * 10 * -1;
        return new THREE.Vector3(x, y, z);
    };

    // creating a group of mesh object with random colors
    var group = new THREE.Group();
    var i = 0,
    len = 35,
    s = 0.75;
    while (i < len) {
        var box = new THREE.Mesh(
            new THREE.BoxGeometry(s, s, s),
            new THREE.MeshStandardMaterial({
                color: randomColor(),
                map: createDataTexture()
                //emissiveIntensity: 0.8,
                //emissive: randomColor()
            }));
        box.position.copy(randomPosition());
        box.rotation.copy( ( new THREE.Euler() ).setFromVector3( randomPosition() ) )
        group.add(box);
        i += 1;
    }
    scene.add(group);

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
            bgColor = new THREE.Color(1, 1, 1);
            group.rotation.y = Math.PI * 4 * seq.per;
            textCube.visible = false;
            camera.position.set(8, 1, 0);
        },
        afterObjects: function(seq){
             scene.background = bgColor;
             scene.fog = new THREE.Fog(bgColor, 1.0, 17);
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
                secs: 3,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(8, 1 + 7 * partPer, 8 * partPer);
                    camera.lookAt(0, 0, 0);
                }
            },
            // mutate bgColor
            {
                secs: 14,
                update: function(seq, partPer, partBias){
                    bgColor = randomColor();
                    // camera
                    camera.position.set(8, 8, 8);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 10,
                update: function(seq, partPer, partBias){
                    // camera
                    var s = 8 - 16 * partPer;
                    camera.position.set(s, s, s);
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


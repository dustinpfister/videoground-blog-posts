// video1 for threejs-plane
 
// scripts
VIDEO.scripts = [
   '../../../js/canvas/r0/canvas.js',
   '../../../js/canvas-text-cube/r0/canvas-text-cube.js',
   '../../../js/sequences-hooks/r1/sequences-hooks.js',
   //'../../../js/datatex/r0/datatex.js',
   //'../../../js/tile-index.js',
   '../../../js/tilemod/r0/tilemod.js',
   '../../../js/object-grid-wrap/r2/object-grid-wrap.js',
   '../../../js/object-grid-wrap/r2/effects/opacity2.js'
];
// init
VIDEO.init = function(sm, scene, camera){
 // ---------- ----------
    // LIGHT
    // ---------- ----------
    const dl = new THREE.DirectionalLight();
    dl.position.set(0,3,3)
    scene.add(dl);
    // ---------- ----------
    // HELPERS
    // ---------- ----------
    const createData = function(opt){
        opt = opt || {};
        opt.width = opt.width === undefined ? 16: opt.width; 
        opt.height = opt.height === undefined ? 16: opt.height;
        // DEFAULT FOR PIX METOD IS A CHECKER PATTERN HERE
        opt.forPix = opt.forPix || function(color, x, y, i, opt){
            color.setRGB(255, 255, 255);
            if(y % 2 === 0 && x % 2 === 0){
               color.setRGB(32, 32, 32);
            }
            if(y % 2 != 0 && x % 2 != 0){
               color.setRGB(64, 64, 64);
            }
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
        return data;
    };
    // create data texture
    const createDataTexture = function(opt){
        opt = opt || {};
        opt.width = opt.width === undefined ? 16: opt.width; 
        opt.height = opt.height === undefined ? 16: opt.height;
        const data = opt.data || createData(opt);
        let texture = new THREE.DataTexture( data, opt.width, opt.height );
        texture.needsUpdate = true;
        return texture;
    };
    // update a texture
    const updateTexture = (texture, opt) => {
        // just updating data array only
        const data = createData(opt);
        texture.image.data = data;
        texture.needsUpdate = true;
    };
    //-------- ----------
    // TEXTURES
    //-------- ----------
    const opt_data_texture = {
        alpha: 1,
        forPix: function(color, x, y, i, opt){
            const roll = Math.random();
            if(roll < 0.05){
                color.setRGB(255,255,255);
                return color;
            }
            let v = 50 + 100 * opt.alpha + 100 * opt.alpha * Math.random();
            color.setRGB(0, v, 0);
            if(y % 2 === 0 && x % 2 === 0){
               v = 25 + 50 * (1 - opt.alpha) + 25 * Math.random();
               color.setRGB(0, v, 0);
            }
            if(y % 2 != 0 && x % 2 != 0){
               v = 50 + 100 * (1 - opt.alpha) + 50 * Math.random();
               color.setRGB(0, v, 0);
            }
            return color;
        }
    };
    const texture_checker = createDataTexture(opt_data_texture);
    // random texture options
    const opt_data_texture_rnd = {
        forPix: function(color, x, y, i, opt){
            const v = 32 + 200 * Math.random();
            const roll = Math.random();
            if(roll < 0.80){
                color.g = v;
                return color;
            }
            color.setRGB(v, v, v);
            return color;
        }
    };
    const texture_rnd = createDataTexture(opt_data_texture_rnd);
    //-------- ----------
    // MATERIALS
    //-------- ----------
    const MATERIALS = [
        new THREE.MeshStandardMaterial({
            color: 0xffffff,
            map: texture_checker,
            side: THREE.DoubleSide
        }),
        new THREE.MeshStandardMaterial({
            color: 0xffffff,
            map: texture_rnd,
            side: THREE.DoubleSide
        })
    ];
    //-------- ----------
    // GRID SOURCE OBJECTS
    //-------- ----------
    const tw = 8,
    th = 8,
    space = 3.1;
    const ground1 = TileMod.create({w: 3, h: 3, sw: 4, sh: 4, materials: MATERIALS[0]});
    TileMod.setCheckerBoard(ground1);
    const ground2 = TileMod.create({w: 3, h: 3, sw: 4, sh: 4, materials: MATERIALS});
    TileMod.setCheckerBoard(ground2);
    const ground3 = TileMod.create({w: 3, h: 3, sw: 4, sh: 4, materials: MATERIALS[1]});
    TileMod.setCheckerBoard(ground3);
    const array_source_objects = [
        ground1,
        ground2,
        ground3
    ];
    const array_oi = [],
    len = tw * th;
    let i = 0;
    // random index values for source objects?
    while(i < len){
        array_oi.push( Math.floor( array_source_objects.length * THREE.MathUtils.seededRandom() ) );
        i += 1;
    }
    //-------- ----------
    // EFFECT
    //-------- ----------
    (function(){
        ObjectGridWrap.load( {
            EFFECTS : {
                flip : function(grid, obj, objData, ud){
                    const startFlip = grid.userData.startFlip === undefined ? -45: grid.userData.startFlip;
                    const maxFlipDelta = grid.userData.maxFlipDelta === undefined ? 90: grid.userData.maxFlipDelta;
                    obj.rotation.x = Math.PI / 180 * startFlip  + Math.PI / 180 * maxFlipDelta * objData.b;
                }
            }
        });
    }());
    //-------- ----------
    // CREATE GRID
    //-------- ----------
    const grid = ObjectGridWrap.create({
        space: space,
        tw: tw,
        th: th,
        effects: ['opacity2', 'flip'],
        sourceObjects: array_source_objects,
        objectIndices: array_oi
    });
    scene.add(grid);
    // BACKGROUND
    scene.background = new THREE.Color('#2a2a2a');
 
    // TEXT CUBE
    var textCube = scene.userData.textCube = CanvasTextCube.create({
        width: 128,
        height: 128,
        lineWidth: 7,
        lineColor: 'rgba(0,100,128,0.8)',
        lineCount: 9,
        lines: [
            ['Plane Geometry', 64, 17, 14, 'white'],
            ['in', 64, 32, 14, 'white'],
            ['threejs', 64, 47, 14, 'white'],
            ['( r140 10/13/2022 )', 64, 70, 12, 'gray'],
            ['video2', 64, 100, 10, 'gray']
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

            opt_data_texture.alpha = seq.getSinBias(8, false);

            grid.userData.startFlip = 0;
            grid.userData.maxFlipDelta = 0;


            camera.position.set(8, 1, 0);
        },
        afterObjects: function(seq){
            ObjectGridWrap.setPos(grid, 1 - seq.per, 0 );
            ObjectGridWrap.update(grid);

            camera.lookAt(0, 0, 0);
        },
        objects: [
            {
                secs: 3,
                update: function(seq, partPer, partBias){
                    // textcube
                    if(seq.partFrame < seq.partFrameMax){
                        seqHooks.setFrame(seq_textcube, seq.partFrame, seq.partFrameMax);
                    }
                }
            },
            {
                secs: 2,
                update: function(seq, partPer, partBias){
                    camera.position.set(8 + 2 * partPer, 1 + 9 * partPer, 10 * partPer);
                }
            },
            {
                secs: 5,
                update: function(seq, partPer, partBias){
                    grid.userData.startFlip = -250 * partBias;
                    grid.userData.maxFlipDelta = 500 * partBias;
                    camera.position.set(10, 10, 10);
                }
            },
            {
                secs: 20,
                update: function(seq, partPer, partBias){

                    grid.userData.startFlip = -90 * partPer;
                    grid.userData.maxFlipDelta = 180 * partPer;

                    if(seq.frame % 4 === 0){
                        updateTexture(texture_checker, opt_data_texture);
                        updateTexture(texture_rnd, opt_data_texture_rnd);
                    }

                    camera.position.set(10, 10, 10);
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


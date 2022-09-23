// video1 for threejs-cube-texture
 
// scripts
VIDEO.scripts = [
   '../../../js/canvas/r0/canvas.js',
   '../../../js/canvas-text-cube/r0/canvas-text-cube.js',
   '../../../js/sequences-hooks/r1/sequences-hooks.js'
];
// init
VIDEO.init = function(sm, scene, camera){

    //-------- ----------
    // HELPER FUNCTIONS
    //-------- ----------
    // create a canavs texture
    const createCanvasTexture = function (draw, size) {
        const canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d');
        canvas.width = size || 64;
        canvas.height = size || 64;
        draw(ctx, canvas);
        return new THREE.CanvasTexture(canvas);
    };
    // get an px index if x and y are known
    const getIndex = (grid, vx, y) => {
        const px = THREE.MathUtils.euclideanModulo(vx, grid.w);
        const py = THREE.MathUtils.euclideanModulo(y, grid.w);
        const index = py * grid.w + px;
        return index;
    };
    // get Vector2 if index is known but not x and y
    const getVector2 = (grid, i) => {
        let pi = THREE.MathUtils.euclideanModulo(i, grid.pxData.length);
        let pX = pi % grid.w;
        let pY = Math.floor(pi / grid.w);
        let v2 = new THREE.Vector2(pX, pY);
        return v2;
    };
    // create a remaped grid
    const createRemapedGrid = (grid1, r1) => {
        r1 = r1 === undefined ? Math.floor(grid1.w / 4) : r1;
        const hw = grid1.w / 2;
        const vHalf = new THREE.Vector2(hw - 0.5, hw - 0.5);  //!!! May have to adjust this between even and odd
        const mDist = vHalf.distanceTo( new THREE.Vector2(0, 0) );
        const grid2 = {
            w: grid1.w,
            pxData: grid1.pxData.map((currentColorIndex, i) => {
                const v2 = getVector2(grid1, i);
                const dist = v2.distanceTo( vHalf );
                // dist alpha value, and angle to center
                const dAlpha = dist / mDist;
                const a = Math.atan2(v2.y - vHalf.y, v2.x - vHalf.x) + Math.PI;
                // get another color index from closer to center
                const x = v2.x + Math.round(Math.cos(a) * r1 * (1 - dAlpha));
                const y = v2.y + Math.round(Math.sin(a) * r1 * (1 - dAlpha));
                const refIndex = getIndex(grid1, x, y);
                //console.log(i, a.toFixed(2), refIndex);
                //return currentColorIndex;
                return grid1.pxData[refIndex];
            }),
            pal: grid1.pal
        };
        return grid2;
    };
    // get a canvas texture from the given grid
    const getTextureFromGrid = (grid, canvasSize) => {
        canvasSize = canvasSize === undefined ? 64 : canvasSize;
        return createCanvasTexture((ctx, canvas) => {
            ctx.fillStyle='white';
            ctx.fillRect(0,0,canvas.width, canvas.height);
            let i = 0, len = grid.pxData.length;
            while(i < len){
                let pX = i % grid.w;
                let pY = Math.floor(i / grid.w);
                let c = grid.pal[ grid.pxData[i] ];
                let color = new THREE.Color(c[0], c[1], c[2]);
                ctx.fillStyle = color.getStyle();
                let pxW = canvas.width / grid.w;
                let pxH = canvas.height / grid.w;
                ctx.fillRect(pX * pxW, pY * pxH, pxW, pxH);
                i += 1;
            }
        }, canvasSize);
    };
    //-------- ----------
    // GRID AND RE MAPED GRID
    //-------- ----------
    const grid1 = {
        w: 16,
        pxData: [
            0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,
            1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,1,
            0,3,1,1,1,2,2,1,1,2,2,1,1,1,3,0,
            0,3,1,4,4,4,4,4,4,4,4,4,4,1,3,0,
            0,3,1,4,1,1,1,1,1,1,1,1,4,1,3,0,
            0,3,2,4,1,3,3,3,3,3,3,1,4,2,3,0,
            0,3,2,4,1,3,1,1,1,1,3,1,4,2,3,0,
            0,3,1,4,1,3,1,2,2,1,3,1,4,1,3,0,
            0,3,1,4,1,3,1,2,2,1,3,1,4,1,3,0,
            0,3,2,4,1,3,1,1,1,1,3,1,4,2,3,0,
            0,3,2,4,1,3,3,3,3,3,3,1,4,2,3,0,
            0,3,1,4,1,1,1,1,1,1,1,1,4,1,3,0,
            0,3,1,4,4,4,4,4,4,4,4,4,4,1,3,0,
            0,3,1,1,1,2,2,1,1,2,2,1,1,1,3,0,
            1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,1,
            0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,
        ],
        pal: [ [1,1,1], [0,0,0], [0,1,0], [0,0.6,0], [0, 0.3, 0] ]
    };
    const grid2 = createRemapedGrid(grid1, 4);
    //-------- ----------
    // BACKGROUND
    //-------- ----------
    const texture =  getTextureFromGrid(grid2, 256);
    // same texture for all sides
    cubeTexture = new THREE.CubeTexture(new Array(6).fill(texture.image));
    cubeTexture.needsUpdate = true;
    scene.background = cubeTexture;
    //-------- ----------
    // SPHERE
    //-------- ----------
    const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(5, 30, 30), 
        new THREE.MeshBasicMaterial({
           envMap: texture
        }) 
    );
    scene.add(sphere);



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
            ['Cube Textures', 64, 17, 14, 'white'],
            ['in threejs', 64, 32, 14, 'white'],
            ['', 64, 47, 14, 'white'],
            ['( r140 09/23/2022 )', 64, 70, 12, 'gray'],
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

    const update = (vector_unit_length, a, b) => {
        const vs = new THREE.Vector3(8, 1, 0);
        const e = new THREE.Euler();
        e.y = Math.PI * 2 * a;
        e.x = Math.PI / 180 * (60 * b);
        camera.position.copy( vs.clone().normalize().applyEuler(e).multiplyScalar(vector_unit_length) );
        camera.lookAt(0, 0, 0);
    };

    var seq = scene.userData.seq = seqHooks.create({
        fps: 30,
        beforeObjects: function(seq){
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
                    update(8, 0, 0);
                }
            },
            {
                secs: 2,
                update: function(seq, partPer, partBias){
                    update(8 + 12 * partPer, 0, 0);
                }
            },
            {
                secs: 10,
                update: function(seq, partPer, partBias){
                    update(20, partPer, 0);
                }
            },
            {
                secs: 15,
                update: function(seq, partPer, partBias){
                    update(20 - 5 * seq.getSinBias(2), partPer * 4, seq.getSinBias(4));
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


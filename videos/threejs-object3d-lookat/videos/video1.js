// scripts
VIDEO.scripts = [
   '../../../js/canvas.js',
   '../../../js/canvas-text-cube.js',
   '../../../js/sequences.js'
];
 
// init method for the video
VIDEO.init = function(sm, scene, camera){
 
    // BACKGROUND
    scene.background = new THREE.Color('cyan');
 
    // LIGHT
    let light = scene.userData.light = new THREE.Mesh(
        new THREE.SphereGeometry(0.25, 20, 20),
        new THREE.MeshStandardMaterial({
            emissive: 0xffffff
        }));
    light.add(new THREE.PointLight(0xdfdfdf, 0.8));
    light.position.set(0, 50, 50);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 0.15))

    // TEXT CUBE
    var textCube = scene.userData.textCube = CanvasTextCube.create({
        width: 128,
        height: 128,
        lineWidth: 7,
        lineColor: 'rgba(0,100,128,0.8)',
        lineCount: 9,
        lines: [
            ['Object3D.lookAt', 64, 20, 16, 'white'],
            ['in Three.js.', 64, 45, 16, 'white'],
            ['( r135 04/07/2022 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);
 
    // CANVAS DRAW METHODS
    var drawMethods = {};
    drawMethods.basic = {};
    drawMethods.basic.square = function(ctx, canvas, sm, opt){
        ctx.fillStyle = opt.bgStyle || 'black';
        ctx.fillRect(-1, -1, canvas.width + 2, canvas.height + 2);
        ctx.strokeStyle = 'lime';
        ctx.lineWidth = 3;
        ctx.beginPath();
        // the square
        var x = opt.x === undefined ? 0: opt.x,
        y = opt.y === undefined ? 0: opt.y,
        w = opt.w === undefined ? canvas.width: opt.w,
        h = opt.h === undefined ? canvas.height: opt.h;
        ctx.rect(x, y, w, h);
        ctx.stroke();
    };
    drawMethods.basic.noise = function(ctx, canvas, sm, opt){
        ctx.fillStyle = opt.bgStyle || 'white';
        ctx.fillRect(-1, -1, canvas.width + 2, canvas.height + 2);
        var i = 0,
        len = parseInt(canvas.width) * parseInt(canvas.height),
        x = 0, y = 0;
        while(i < len){
            x = i % canvas.width;
            y = Math.floor(i / canvas.width);
            ctx.fillStyle = 'rgb(0,' + Math.floor(128 + 100 * Math.random()) + ',0)';
            ctx.fillRect(x, y, 1, 1);
            i += 1;
        }
    };
  

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
                    textCube.position.set(6, 1 + 2 * partPer, 0);
                    textCube.rotation.y = Math.PI * 2 * partPer;
                    // camera
                    camera.position.set(8, 1, 0);
                    camera.lookAt(0, 0, 0);

                }
            },
            {
                per: 0.20,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    

                }
            }
        ]
    });
};

// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
    var textCube = scene.userData.textCube;
    textCube.rotation.y = 0;
    textCube.position.set(6, 0, 0);
    textCube.visible = false;
 
 
    // sequences
    Sequences.update(sm.seq, sm);
};


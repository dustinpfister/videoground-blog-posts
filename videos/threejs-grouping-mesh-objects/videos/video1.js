// scripts
VIDEO.scripts = [
   '../../../js/canvas.js',
   '../../../js/canvas-text-cube.js',
   '../../../js/sequences.js'
];


var Model = (function () {
    // the constructor
    var Mod = function (opt) {
        // this is what will be added to the Scene
        this.group = new THREE.Group;
        // set default, or use what is given
        opt = opt || {};
        this.radius = opt.radius === undefined ? 4 : opt.radius;
        this.count = opt.count === undefined ? 5 : opt.count;
        this.bxSize = opt.bxSize === undefined ? 1 : opt.bxSize;
        this.color = opt.color === undefined ? 0x00ff00 : opt.color;
        var i = 0,
        bx,
        radian;
        while (i < this.count) {
            bx = new THREE.Mesh(
                    new THREE.BoxGeometry(this.bxSize, this.bxSize, this.bxSize),
                    new THREE.MeshStandardMaterial({
                        color: this.color,
                        emissive: 0x0f0f0f
 
                    }));
            this.group.add(bx);
            i += 1;
        }
        this.update();
        console.log(this.group);
    };
    // update the group
    Mod.prototype.update = function () {
        var i = 0,
        bx,
        radian;
        while (i < this.count) {
            bx = this.group.children[i];
            radian = Math.PI * 2 / this.count * i;
            bx.position.set(
 
                Math.cos(radian) * this.radius,
                0,
                Math.sin(radian) * this.radius);
            bx.lookAt(0, 0, 0);
            i += 1;
        };
    };
    // set radius and update
    Mod.prototype.setRadius = function (radius) {
        this.radius = radius;
        this.update();
    };
    // return the constructor
    return Mod;
}
    ());
 
// init method for the video
VIDEO.init = function(sm, scene, camera){
 
    scene.background = new THREE.Color('#202020');
    scene.add( new THREE.GridHelper(10, 10, 0x00ff00, 0xffffff));
 
    // TEXT CUBE
    var textCube = scene.userData.textCube = CanvasTextCube.create({
        width: 128,
        height: 128,
        lineWidth: 7,
        lineColor: 'rgba(0,128,128,0.8)',
        lineCount: 9,
        lines: [
            ['Groups', 64, 20, 16, 'white'],
            ['in Three.js.', 64, 45, 16, 'white'],
            ['( r135 04/05/2022 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    textCube.material.transparent = true;
    textCube.material.opacity = 0.8;
    scene.add(textCube);
 
    // three instances of the model
    var mod1 = scene.userData.mod1 = new Model({
            count: 8,
            bxSize: 1,
            color: 0xff0000
 
        });
    scene.add(mod1.group);
    var mod2 = new Model({
            count: 16,
            radius: 8,
            bxSize: 1
 
        });
    scene.add(mod2.group); 
    var mod3 = new Model({
            count: 32,
            radius: 9,
            bxSize: 1,
            color: 0x0000ff
 
        });
    mod3.group.rotation.set(Math.PI * 1.5, 0, 0)
    scene.add(mod3.group);

    // light
    var pointLight = new THREE.PointLight(0xffffff, 1.0).add(new THREE.Mesh(
        new THREE.SphereGeometry(0.25, 15, 15),
        new THREE.MeshBasicMaterial({
            color: 0xffffff
        })
    ));
    scene.add(pointLight);
    var dirLight = new THREE.DirectionalLight(0xffffff, 0.4);
    dirLight.position.set(1, 1, 1);
    scene.add(dirLight);
    
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
                    textCube.position.set(14.5, 7.0, 0);
                    // camera
                    camera.position.set(16.5, 7.7, 0);
                    camera.lookAt(0, 1, 0);
                }
            },
            {
                per: 0.10,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    // move up text cube
                    textCube.visible = true;
                    textCube.position.set(14.5, 7.0 + 2 * partPer, 0);
                    textCube.rotation.y = Math.PI * 2 * partPer;
                    // camera
                    camera.position.set(16.5, 7.7, 0);
                    camera.lookAt(0, 1, 0);

                }
            },
            // moving a single lone cube
            {
                per: 0.20,
                init: function(sm){},
                update: function(sm, scene, camera, partPer, partBias){
                    camera.position.set(16.5, 7.7 - 7.7 * partPer, 0);
                    camera.lookAt(0, 1 - partPer, 0);
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
 
    var mod1 = scene.userData.mod1;
    mod1.setRadius(1 + 6 * bias);
    // changing the rotation of the group
    mod1.group.rotation.set(
        Math.PI * 2 * per,
        Math.PI * 4 * per,
        Math.PI * 8 * per);

    // sequences
    Sequences.update(sm.seq, sm);
};


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
        lineColor: 'rgba(0,100,128,0.8)',
        lineCount: 9,
        lines: [
            ['Groups', 64, 20, 16, 'white'],
            ['in Three.js.', 64, 45, 16, 'white'],
            ['( r135 04/04/2022 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    textCube.material.transparent = true;
    textCube.material.opacity = 0.8;
    scene.add(textCube);
 
    // three instances of the model
    var mod1 = new Model({
            count: 8,
            bxSize: 1,
            color: 0xff0000
 
        });
    scene.add(mod1.group);

    // light
    scene.add(new THREE.PointLight().add(new THREE.Mesh(
                new THREE.SphereGeometry(.5, 10, 10),
                new THREE.MeshBasicMaterial({
                    color: 0xffffff
                }))));
 
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
            // moving a single lone cube
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


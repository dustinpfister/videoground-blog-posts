// video1 for threejs-examples-position-things-to-sphere-surface
 
// scripts
VIDEO.scripts = [
   '../../../js/canvas.js',
   '../../../js/canvas-text-cube.js',
   '../../../js/sequences-hooks-r1.js',
   '../js/sphere_wrap.js'
];
// init
VIDEO.init = function(sm, scene, camera){
 
    // BACKGROUND
    scene.background = new THREE.Color('#2a2a2a');

    // GRID
    var grid = scene.userData.grid = new THREE.GridHelper(10, 10, '#ffffff', '#00afaf');
    grid.material.linewidth = 3;
    scene.add( grid );

    //******** **********
    // TEXT CUBE
    //******** **********
    var textCube = scene.userData.textCube = CanvasTextCube.create({
        width: 128,
        height: 128,
        lineWidth: 7,
        lineColor: 'rgba(0,100,128,0.8)',
        lineCount: 9,
        lines: [
            ['Position Things', 64, 17, 14, 'white'],
            ['to Sphere Surface', 64, 32, 14, 'white'],
            ['threejs example', 64, 47, 14, 'white'],
            ['( r140 07/26/2022 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);

    //******** **********
    // HELPERS
    //******** **********

    var createSphereGroup = function(){
        var group = new THREE.Group();
        var ud = group.userData;
        var sphere = ud.sphere = new THREE.Mesh(
            new THREE.SphereGeometry(1.75, 30, 30),
            new THREE.MeshNormalMaterial({wireframe: true})
        );
        group.add(sphere);
        var box = ud.box = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshNormalMaterial()
        );
        group.add(box);
        return group;
    };


    var updateSphereGroup = function(group, per, update){
        var box = group.userData.box,
        sphere = group.userData.sphere;
        // call update method that should return a pos object with lat, long, and alt props
        var pos = update(per, group, box, sphere);
        pos = pos || {};
        pos.lat === undefined ? 0 : pos.lat;
        pos.long === undefined ? 0 : pos.long;
        pos.alt === undefined ? 0 : pos.alt;
        // call position to Sphere
        SphereWrap.positionToSphere(sphere, box, pos.lat, pos.long, pos.alt);
        if(pos.lookAt){
            if(pos.lookAt === 1){
                box.lookAt(sphere.position);
            }
            if(pos.lookAt === 2){
                var v = new THREE.Vector3();
                sphere.getWorldPosition(v);
                box.lookAt(v);
            }
        }
    };

    //******** **********
    // OBJECTS
    //******** **********
    var g1 = createSphereGroup();
    scene.add(g1);

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

            // update g1
            updateSphereGroup(g1, seq.per, function(per, group, box, sphere){
                var b = 1 - Math.abs(0.5 - per) / 0.5;
                return {
                    lat: 0.75 - 0.5 * b,
                    long: per * 4 % 1,
                    alt: 0.5,
                    lookAt: 2
                };
            });
            var r = Math.PI * 2 * seq.per,
            x = Math.cos(r) * 2,
            z = Math.sin(r) * 2;
            g1.position.set(x, 0, z);
            

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
                secs: 7,
                update: function(seq, partPer, partBias){
                    // camera
                    var v1 = new THREE.Vector3(8, 1, 0);
                    var v2 = new THREE.Vector3(5, 5, 5);
                    camera.position.copy(v1).lerp(v2, partPer);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 20,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(5, 5, 5);
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


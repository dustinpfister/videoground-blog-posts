// video1 for threejs-vector3-distance-to
 
// scripts
VIDEO.scripts = [
   '../../../js/canvas/r0/canvas.js',
   '../../../js/canvas-text-cube/r0/canvas-text-cube.js',
   '../../../js/sequences-hooks/r1/sequences-hooks.js',
   '../../../js/tween-many/r0/tween-many.js'
];
//******** **********
// dae files
//******** **********
VIDEO.daePaths = [
  '../../../dae/many-object-tweening/many-object-tweening-1a.dae'
];
// init
VIDEO.init = function(sm, scene, camera){
 
    // create source objects from DAE file
    var sObj = tweenMany.createSourceObj(VIDEO.daeResults[0]);

    // create mesh from source object
    //var mesh = tweenMany.createMesh(sObj, 'box_3');
    //mesh.scale.set(4, 4, 4);
    //scene.add(mesh);

    //-------- ----------
    // HELPER FUNCTIONS FROM OPACITY EXAMPLE IN POST
    //-------- ----------
    // opaicty effect using length method which is distance to origin
    let opacityEffect = (group, mesh) =>  {
        let per = 1 - mesh.position.distanceTo( group.position ) / 5;
        mesh.material.opacity = per;
    };
    // opaicty effect using length method which is distance to origin
    let scaleEffect = (group, mesh) =>  {
        let per = mesh.position.distanceTo( group.position ) / 5;
        mesh.scale.normalize().multiplyScalar(0.25 + 3.75 * per);
    };
    // rotation effect using the distanceTo method
    let rotationEffect = (group, mesh) =>  {
        let ud = mesh.userData;
        let minDist = 2.5;
        mesh.lookAt(0, 0, 0);
        group.children.forEach( (child) => {
            if(child != mesh){
                let d = mesh.position.distanceTo(child.position);
                if(d < minDist){
                    let p = d / minDist;
                    ud.rp += p;
                    ud.rp %= 1;
                    mesh.rotation.z += Math.PI / 180 * ud.maxDegPerChid * ud.rp;
                }
            }
        });
        ud.rpy += 0.05;
        mesh.rotation.y += Math.PI / 180 * 90 * ud.rpy;
        //mesh.rotation.z += Math.PI / 180 * 25;
    };
    // get a start position by passing two values that are 0 - 1
    let getStartPosition = (a, b) => {
        a = a === undefined ? 0 : a;
        b = b === undefined ? 0 : b;
        let pos = new THREE.Vector3( 5, 0, 0);
        let e = new THREE.Euler(0, a * Math.PI * 2, b * Math.PI * 2);
        return pos.applyEuler(e);
    };
    // get a seeded random start position
    let getSeededRandomStartPosition = function(){
        return getStartPosition(
            THREE.MathUtils.seededRandom(), 
            THREE.MathUtils.seededRandom() );
    };
    // set new mesh user data
    let newMeshUserData = (mesh) => {
        // user data
        let ud = mesh.userData;
        ud.startPos = getSeededRandomStartPosition();
        ud.alphaDelta = 0.1 + 0.5 * THREE.MathUtils.seededRandom();
        ud.alpha = 0;
        ud.rp = 0;
        ud.rpy = 0;
        ud.maxDegPerChid = 1 + 5 * THREE.MathUtils.seededRandom();
        ud.b1b2Alpha = THREE.MathUtils.seededRandom();
    };
    // create group
    let createGroup = (count) => {
        count = count === undefined ? 10 : count;
        let group = new THREE.Group();
        let i = 0;
        while(i < count){
            // create mesh object
let mesh = tweenMany.createMesh(sObj, 'box_3');
mesh.material = mesh.material.clone();
mesh.material.transparent = true;

//            let mesh = new THREE.Mesh( 
//                new THREE.BoxGeometry(1,1,1), 
//                new THREE.MeshNormalMaterial({
//                    transparent: true
//                }) );

            // user data
            let ud = mesh.userData;
            newMeshUserData(mesh);
            // start pos, lookAt, add to group
            mesh.position.copy( ud.startPos );
            group.add(mesh);
            i += 1;
        }
        return group;
    };
    // update group
    let updateGroup = function(group, secs){
        secs = secs === undefined ? 0 : secs;
        group.children.forEach( (mesh) => {
            let ud = mesh.userData;
            ud.alpha += ud.alphaDelta * secs;
            ud.alpha = ud.alpha > 1 ? 1 : ud.alpha;
            // new positon using start pos in userData and lerping from there
            mesh.position.copy(ud.startPos).lerp( new THREE.Vector3(), ud.alpha );
            // new data if alpha === 1
            if(ud.alpha === 1){
                newMeshUserData(mesh);
            }
            // opaicty effect
            opacityEffect(group, mesh);
            rotationEffect(group, mesh);
            // tween geo
            ud.b1b2Alpha += 0.05;
            ud.b1b2Alpha %= 1;
            tweenMany.tween(mesh.geometry, [
                [ sObj.box_1.geometry, sObj.box_3.geometry, seqHooks.getSinBias(ud.b1b2Alpha, 1, 1) ]
                //[ sObj.box_1.geometry, sObj.box_4.geometry, 1 ]
            ]);
            scaleEffect(group, mesh);
        });
    };



   var group1 = createGroup(25);
   scene.add(group1);


    // LIGHT
    var dl = new THREE.DirectionalLight(0xffffff, 1);
    dl.position.set(2, 1, 4);
    scene.add(dl);

    // BACKGROUND
    scene.background = new THREE.Color('#2a2a2a');

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
            ['Vector3 distanceTo', 64, 17, 14, 'white'],
            ['method in', 64, 32, 14, 'white'],
            ['threejs', 64, 47, 14, 'white'],
            ['( r140 dd/mm/yyyy )', 64, 70, 12, 'gray'],
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

            updateGroup(group1, 1 / 15);

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
                secs: 3,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(8, 1 + 7 * partPer, 8 * partPer);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 24,
                update: function(seq, partPer, partBias){
                    // camera
                    var s = 8 - 7 * partPer;
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


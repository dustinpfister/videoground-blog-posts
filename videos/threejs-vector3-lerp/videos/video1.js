// video1 for threejs-vector3-lerp
 
// scripts
VIDEO.scripts = [
   '../../../js/sequences-hooks/r1/sequences-hooks.js',
   '../../../js/canvas/r0/canvas.js',
   '../../../js/canvas-text-cube/r0/canvas-text-cube.js'
];
// init
VIDEO.init = function(sm, scene, camera){
    // MESH
    const mkMesh = function(size){
        return new THREE.Mesh(
            new THREE.BoxGeometry(size, size, size), 
            new THREE.MeshNormalMaterial({
            })
        );
    };
    // HELPER METHOD USING LERP AND MATH POW
    const lerpPow = function(a, b, n, alpha){
        let alphaPow = Math.pow( n, 1 + ( ( n - 1 ) * alpha) ) / Math.pow( n, n );
        return a.clone().lerp(b, alphaPow);
    };
    // SET GROUP BY lerp pow
    const setGroupPow = (group, alpha) => {
        let v1 = new THREE.Vector3( 4.5, 0, -4.5);
        let v2 = new THREE.Vector3(-4.5, 0, -4.5);
        group.children.forEach( (mesh, i, arr) => {
            mesh.position.copy( lerpPow(
                v1.clone().add( new THREE.Vector3(0, 0, i) ), 
                v2.clone().add( new THREE.Vector3(0, 0, i) ), 
                2 + 4 * (i / arr.length), alpha) );
        });
    };
    // set group by Euler positions
    const setGroupEuler = (group, alpha) => {
        const vs = new THREE.Vector3(0, 0, 1);
        group.children.forEach( (mesh, i, arr) => {
            const per = i / arr.length;
            const e = new THREE.Euler();
            e.y = Math.PI / 180 * 360 * per;
            e.x = Math.PI / 180 * ( -90 + 180 * Math.sin( Math.PI * 2 * 6 * per ) ) * per;
            const v1 = new THREE.Vector3();
            v1.copy(vs).applyEuler(e).normalize().multiplyScalar(2);
            const v2 = v1.clone().normalize().multiplyScalar(4)
            mesh.position.copy(v1).lerp(v2, alpha);
            mesh.lookAt(group.position);
        });
    };
    const createGroup = (len, size) => {
        // create group
        const group = new THREE.Group();
        let i = 0;
        while(i < len){
            const mesh = mkMesh(size);
            group.add(mesh);
            i += 1;
        };
        return group;
    };

    const group = createGroup(10, 1);
    scene.add(group);
    setGroupPow(group, 1);

    const group2 = createGroup(30, 0.5);
    scene.add(group2);
    setGroupEuler(group2, 1);

    //-------- ----------
    // BACKGROUND
    //-------- ----------
    scene.background = new THREE.Color('#2a2a2a');
    //-------- ----------
    // GRID
    //-------- ----------
    var grid = scene.userData.grid = new THREE.GridHelper(10, 10, '#ffffff', '#00afaf');
    grid.material.linewidth = 3;
    scene.add( grid );
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
            ['Vector3.lerp', 64, 17, 14, 'white'],
            ['method in', 64, 32, 14, 'white'],
            ['threejs', 64, 47, 14, 'white'],
            ['( r140 09/28/2022 )', 64, 70, 12, 'gray'],
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
    //-------- ----------
    // A MAIN SEQ OBJECT
    //-------- ----------
    var seq = scene.userData.seq = seqHooks.create({
        fps: 30,
        beforeObjects: function(seq){
            textCube.visible = false;
            camera.position.set(8, 1, 0);
            setGroupPow(group, seq.getSinBias(4, false));
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
                    // group 2
                    setGroupEuler(group2, 1 - partPer);
                }
            },
            {
                secs: 2,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(8 - 16 * partPer, 1 + 7 * partPer, 8 * partPer);
                    camera.lookAt(0, 0, 0);
                    // group 2
                    setGroupEuler(group2, partPer);
                }
            },
            {
                secs: 25,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(-8, 8, 8 - 16 * partPer);
                    camera.lookAt(0, 0, 0);
                    // group 2
                    setGroupEuler(group2, 1 - seq.getSinBias(6));
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


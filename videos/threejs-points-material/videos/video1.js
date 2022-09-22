// video1 for threejs-points-material
 
// scripts
VIDEO.scripts = [
   '../../../js/canvas/r0/canvas.js',
   '../../../js/canvas-text-cube/r0/canvas-text-cube.js',
   '../../../js/sequences-hooks/r1/sequences-hooks.js'
];
// init
VIDEO.init = function(sm, scene, camera){
 
//-------- ----------
    // HELPERS
    //-------- ----------
    // Vector3 Array to Typed Array
    const Vector3ArrayToTyped = (v3Array) => {
        let i = 0, len = v3Array.length, vertArray = [];
        while(i < len){
            let v = v3Array[i];
            vertArray.push(v.x, v.y, v.z);
            i += 1;
        }
        return new THREE.Float32BufferAttribute(vertArray, 3)
    };
    // Buffer Geometry from v3Array
    const Vector3ArrayToGeometry = (v3Array) => {
        const typedArray = Vector3ArrayToTyped(v3Array);
        const geometry = new THREE.BufferGeometry();
        return geometry.setAttribute('position', typedArray);
    };
    // Vector3 array from geometry
    const Vector3ArrayFromGeometry = (geometry) => {
        const pos = geometry.getAttribute('position');
        let i = 0;
        const len = pos.count, v3Array = [];
        while(i < len){
            const v = new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i))
            v3Array.push(v);
            i += 1;
        }
        return v3Array;
    };
    // lerp two vector3 arrays
    const Vector3ArrayLerp = (v3Array_1, v3Array_2, alpha) => {
        return v3Array_1.map((v, i) => {
            return v.clone().lerp( v3Array_2[i], alpha )
        });
    };
    //-------- ----------
    // POINTS
    //-------- ----------
    // Geometry created with the Torus Geometry Constructor
    const geometry = new THREE.TorusGeometry(2, 0.75, 30, 60);
    //const geometry = new THREE.SphereGeometry(2, 30, 60);
    geometry.rotateX(Math.PI / 180 * 90);
    // array of Vector3 class instances
    const v3Array_1 = Vector3ArrayFromGeometry(geometry);
    // do somehting to the v3 array
    const v3Array_2 = v3Array_1.map((v) => {
        const vd = new THREE.Vector3();
        vd.copy(v).normalize().multiplyScalar(2 + 3 * THREE.MathUtils.seededRandom())
        return v.clone().add(vd);
    });
    const v3Array_3 = Vector3ArrayLerp(v3Array_1, v3Array_2, 0);
    // THREE.Points INSTANCE UISNG THREE.PointsMaterial
    const points = new THREE.Points(
        Vector3ArrayToGeometry(v3Array_3),
        new THREE.PointsMaterial({
        color: 0x00afaf,
        size: 0.25
    }));
    scene.add(points);

    // BACKGROUND
    scene.background = new THREE.Color('#2a2a2a');

    // GRID
    var grid = scene.userData.grid = new THREE.GridHelper(10, 10, '#ffffff', '#ffffff');
    grid.material.linewidth = 3;
    grid.material.transparent = true;
    grid.material.opacity = 0.15;
    scene.add( grid );
 
    // TEXT CUBE
    var textCube = scene.userData.textCube = CanvasTextCube.create({
        width: 128,
        height: 128,
        lineWidth: 7,
        lineColor: 'rgba(0,100,128,0.8)',
        lineCount: 9,
        lines: [
            ['Points Material', 64, 17, 14, 'white'],
            ['in threejs', 64, 32, 14, 'white'],
            ['', 64, 47, 14, 'white'],
            ['( r140 09/22/2022 )', 64, 70, 12, 'gray'],
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

            const v3Array = Vector3ArrayLerp(v3Array_1, v3Array_2, seq.getSinBias(4, false));
            points.geometry.copy( Vector3ArrayToGeometry( v3Array) )

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
                    camera.position.set(8, 1 + 7 * partPer, 8 * partPer);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 20,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(8, 8, 8 - 16 * partPer);
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


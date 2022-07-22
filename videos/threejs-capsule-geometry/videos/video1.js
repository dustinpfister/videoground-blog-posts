// video1 for threejs-capsule-geometry
 
// scripts
VIDEO.scripts = [
   '../../../js/canvas.js',
   '../../../js/canvas-text-cube.js',
   '../../../js/sequences-hooks-r1.js'
];
// init
VIDEO.init = function(sm, scene, camera){
 
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
            ['Capsule Geometry', 64, 17, 14, 'white'],
            ['in', 64, 32, 14, 'white'],
            ['threejs', 64, 47, 14, 'white'],
            ['( r140 07/22/2022 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);


//******** **********
// HELPERS
//******** **********
// update a capsule line group with the given array of vector3 class instances
var updateCapsuleLine = function(group, vectors, thickness){
    // defaults for arguments
    vectors = vectors || [];
    thickness = thickness === undefined ? 0.25: thickness;
    var i = 0,
    len = vectors.length;
    while(i < len - 1){
        var v = vectors[i] || new THREE.Vector3(),
        nv = vectors[i + 1] || new THREE.Vector3(),
        d = v.distanceTo(nv); // distance from current vector to next vector
        var mesh = group.children[i];
        // set scale
        mesh.scale.set(thickness, thickness, d / 2.0);
        // position should be a mid point between v and nv
        var mv = v.clone().add(nv).divideScalar(2);
        mesh.position.copy(mv);
        //  and set rotation
        mesh.lookAt(nv);
        i += 1;
    }

};
// create and return a new group of mesh objects using the capsule geometry
// using a aray of vector3 class instances
var createCapsuleLine = function(vectors, material, capsuleGeo){
    // defaults for arguments
    vectors = vectors || [];
    material = material || new THREE.MeshNormalMaterial({});
    capsuleGeo = capsuleGeo || new THREE.CapsuleGeometry(0.25, 1.5, 20, 20);
    // create a group and add that to the scene
    var group = new THREE.Group();
    // make mesh objects and add them to the group
    var i = 0,
    len = vectors.length;
    while(i < len - 1){
        var v = vectors[i] || new THREE.Vector3(),
        nv = vectors[i + 1] || new THREE.Vector3(),
        d = v.distanceTo(nv); // distance from current vector to next vector
        var mesh = new THREE.Mesh(
            capsuleGeo,
            material);
        // adjust geo to work well with lookAt
        mesh.geometry.rotateX(Math.PI * 0.5);
        group.add(mesh);
        i += 1;
    }
    // update for first time
    updateCapsuleLine(group, vectors, 1);
    // return the group
    return group;
};
// array of array of axis values to array of Vector3 class instances
// if it is all ready an array of vector3S then return clones
var vectorArrayToVector3Array = function(vectorArray){
    return vectorArray.map(function(a){
        if(a instanceof Array){
            return new THREE.Vector3( a[0], a[1], a[2] );
        }
        // assume that it is all ready a Vector3 and return a clone
        return a.clone();
    });
};
//******** **********
// VECTORS AND CAPSULE GROUP ONE
//******** **********
var vectors1 = vectorArrayToVector3Array([
    [0, 0, 0 ],
    [ 0, -5, -5 ],
    [ 0, -5, 0 ],
    [ 0, 1, 4 ],
    [ 4, 1, 4 ],
    [ 4, 5, 4 ],
    [ 4, 5, -5 ],
    [ -5, 5, -5 ]
]);
var vectors2 = vectorArrayToVector3Array([
    [0, 3, 0 ],
    [ 10, -6, -8 ],
    [ -5, -5, 0 ],
    [ 0, -2, 4 ],
    [ 8, 1, 4 ],
    [ 0, 5, 4 ],
    [ 4, 6, -5 ],
    [ -5, -5, -5 ]
]);
var vectors = vectorArrayToVector3Array(vectors1);
var g1 = createCapsuleLine(vectors, new THREE.MeshStandardMaterial());
scene.add( g1 );


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

        // lerp between vectors1 and vectors2 for vectors
        vectors = vectors.map(function(v, i){
            var v1 = vectors1[i],
            v2 = vectors2[i];
            return v1.clone().lerp(v2, seq.bias);
        });
        // update g1 with current state of vectors
        updateCapsuleLine(g1, vectors, 2 - 1.5 * seq.bias);

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
                    camera.position.set(8, 8, 8);
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


// video3-geometry-lerp for threejs-object3d-position
// based on the code for the lerp geometry section demo
// scripts
VIDEO.scripts = [
   '../../../js/sequences-hooks/r2/sequences-hooks.js'
];
// init
VIDEO.init = function(sm, scene, camera){
//-------- ----------
// HELPER FUNCTIONS
//-------- ----------
// get a geo position vector3 by a given alpha value
const getGeoPosByAlpha = (geo, alpha) => {
    const pos = geo.getAttribute('position');
    const count = pos.count;
    const index = Math.round( ( count - 1 ) * alpha );
    const v = new THREE.Vector3();
    v.x = pos.getX(index);
    v.y = pos.getY(index);
    v.z = pos.getZ(index);
    return v;
};
// create a 'pointer' mesh object
const createPointerMesh = () => {
    return new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 20, 20),
        new THREE.MeshNormalMaterial()
    );
};
// create a colleciton of pointer mesh objects
const createPointerCollection = (count = 100) => {
    const group = new THREE.Group();
    let i = 0;
    while(i < count){
        const mesh = createPointerMesh();
        group.add(mesh);
        i += 1;
    }
    return group;
};
// create a colleciton of pointer mesh objects
const updatePointerCollection = (group, geo1, geo2, alpha) => {
    let i = 0;
    const len = group.children.length;
    while(i < len){
        const a_child = i / len;
        const v1 = getGeoPosByAlpha(geo1, a_child);
        const v2 = getGeoPosByAlpha(geo2, a_child);
        const mesh = group.children[i];
        mesh.position.copy(v1).lerp(v2, alpha);
        i += 1;
    }
};
//-------- ----------
// GEOMERTY FOR POSITIONS
//-------- ----------
const GEO = [
    new THREE.BoxGeometry(4, 4, 4, 4, 3, 3),
    new THREE.SphereGeometry(2, 9, 9),
    new THREE.TorusGeometry(2, 0.5, 5, 16),
    new THREE.ConeGeometry(2, 4, 8, 9)
];
console.log(GEO.map( (geo) => { return geo.getAttribute('position').count; }) );
//-------- ----------
// POINTER MESH COLLECTION
//-------- ----------
const group1 = createPointerCollection(100);
scene.add(group1);

    //-------- ----------
    // BACKGROUND
    //-------- ----------
    scene.background = new THREE.Color('#2a2a2a');
    //-------- ----------
    // A MAIN SEQ OBJECT
    //-------- ----------
    // start options for main seq object
    const opt_seq = {
        fps: 30,
        beforeObjects: function(seq){
            camera.position.set(10, 1, 0);
            camera.lookAt(0,0,0)
            camera.zoom = 1;
            group1.rotation.x = Math.PI * 2 * seq.per;
            group1.rotation.y = Math.PI * 8 * seq.per;
        },
        afterObjects: function(seq){
            camera.updateProjectionMatrix();
        },
        objects: []
    };
    // SEQ 0 - Cube State
    opt_seq.objects[0] = {
        secs: 6,
        update: function(seq, partPer, partBias){
            updatePointerCollection(group1, GEO[0], GEO[1], 0);

        }
    };
    // SEQ 1 - Cube To Sphere
    opt_seq.objects[1] = {
        secs: 3,
        update: function(seq, partPer, partBias){
            updatePointerCollection(group1, GEO[0], GEO[1], partPer);
        }
    };
    // SEQ 2 - Sphere State
    opt_seq.objects[2] = {
        secs: 5,
        update: function(seq, partPer, partBias){
            updatePointerCollection(group1, GEO[0], GEO[1], 1);
        }
    };

    // SEQ 3 - Sphere to Torus
    opt_seq.objects[3] = {
        secs: 3,
        update: function(seq, partPer, partBias){
            updatePointerCollection(group1, GEO[1], GEO[2], partPer);
        }
    };

    // SEQ 4 - Torus state
    opt_seq.objects[4] = {
        secs: 5,
        update: function(seq, partPer, partBias){
            updatePointerCollection(group1, GEO[1], GEO[2], 1);
        }
    };

    // SEQ 5 - Torus to cone
    opt_seq.objects[5] = {
        secs: 3,
        update: function(seq, partPer, partBias){
            updatePointerCollection(group1, GEO[2], GEO[3], partPer);
        }
    };

    // SEQ 6 - Torus state
    opt_seq.objects[6] = {
        secs: 5,
        update: function(seq, partPer, partBias){
            updatePointerCollection(group1, GEO[2], GEO[3], 1);
        }
    };


    const seq = scene.userData.seq = seqHooks.create(opt_seq);
    console.log('frameMax for main seq: ' + seq.frameMax);
    sm.frameMax = seq.frameMax;
};
// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
    const seq = scene.userData.seq;
    seqHooks.setFrame(seq, sm.frame, sm.frameMax);
};
 
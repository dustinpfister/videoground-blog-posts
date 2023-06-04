// video2-curve-update for threejs-buffer-geometry-attributes-position
VIDEO.scripts = [
   '../../../js/sequences-hooks/r2/sequences-hooks.js'
];
// init
VIDEO.init = function(sm, scene, camera){
    //-------- ----------
    // HELPERS
    //-------- ----------
    // update a curve by radian, radius, and a control vector
    const updateCurve = (curve, degree = 0, radius = 3, v_control = new THREE.Vector3(0,2,0) ) => {
        const e = new THREE.Euler();
        const radian = Math.PI / 180 * degree;
        e.y = radian;
        curve.v0.set(1, 0, 0).applyEuler(e).multiplyScalar(radius);
        curve.v1.copy(v_control);
        e.y = radian + Math.PI;
        curve.v2.set(1, 0, 0).applyEuler(e).multiplyScalar(radius);
    };
    // create and return a curve ( HREE.QuadraticBezierCurve3 )
    const createCurve = (degree = 45, radius = 3, y = 5) => {
        const curve = new THREE.QuadraticBezierCurve3();
        updateCurve(curve, Math.PI / 180 * degree, radius, new THREE.Vector3(0, y, 0) );
        return curve;
    };
    // create a curve geometry
    const createCurveGeometry = ( curve = createCurve() ) => {
        const geometry = new THREE.BufferGeometry().setFromPoints( curve.getPoints(19) );
        geometry.userData.curve = curve;
        const len = geometry.getAttribute('position').count;
        const color_array = [];
        let i = 0;
        while(i < len){
            const a1 = i / len;
            const a2 = 1 - Math.abs(0.5 - a1) / 0.5;
            color_array.push(a1, a2, 1 - a2);
            i += 1;
        }
        const color_attribute = new THREE.BufferAttribute(new Float32Array(color_array), 3);
        geometry.setAttribute('color', color_attribute);
        return geometry;
    };
    // update a curve geometry to the given curve, or userData.curve of there
    const updateCurveGeometry = (geometry, curve) => {
        curve = curve || geometry.userData.curve || createCurve();
        const att_pos = geometry.getAttribute('position');
        let i = 0;
        while(i < att_pos.count){
            const v = curve.getPoint(i / ( att_pos.count - 1 ));
            att_pos.setXYZ(i, v.x, v.y, v.z);
            i += 1;
        }
        att_pos.needsUpdate = true;
    };
    const getBiasAlpha = (a1, count) => {
        let a = 1 - Math.abs(0.5 - (a1 * count % 1) ) / 0.5;
        return a;
    };
    //-------- ----------
    // GEOMETRY
    //-------- ----------
    const geometry = createCurveGeometry();
    //-------- ----------
    // POINTS
    //-------- ----------
    const points = new THREE.Points(geometry, new THREE.PointsMaterial({size: 1.25, vertexColors: true }));
    scene.add(points);
    //-------- ----------
    // GRID
    //-------- ----------
    const grid = scene.userData.grid = new THREE.GridHelper(10, 10, '#ffffff', '#00afaf');
    grid.material.linewidth = 5;
    scene.add( grid );
    //-------- ----------
    // A MAIN SEQ OBJECT
    //-------- ----------
    // start options for main seq object
    const opt_seq = {
        fps: 30,
        beforeObjects: function(seq){
            camera.position.set(7.7, 2, 7.7);
            camera.lookAt(0, -0.5, 0);
            camera.zoom = 1;
        },
        afterObjects: function(seq){
            camera.updateProjectionMatrix();
        },
        objects: []
    };
    // SEQ 0 - move y control up from 0 to 5
    opt_seq.objects[0] = {
        secs: 3,
        update: function(seq, partPer, partBias){
            const deg = 90;
            const radius = 5;
            const v_control = new THREE.Vector3(0, 5 * partPer, 0);
            updateCurve(geometry.userData.curve, deg, radius, v_control);
            updateCurveGeometry(geometry);
        }
    };
    // SEQ 1 - keep y control at 5, but move z control from 0 to 5
    opt_seq.objects[1] = {
        secs: 1,
        update: function(seq, partPer, partBias){
            const deg = 90;
            const radius = 5;
            const v_control = new THREE.Vector3(0, 5, 5 * partPer);
            updateCurve(geometry.userData.curve, deg, radius, v_control);
            updateCurveGeometry(geometry);
        }
    };
    // SEQ 2 - keep y control at 5, move z control from 5 to -5 and back again
    opt_seq.objects[2] = {
        secs: 3,
        update: function(seq, partPer, partBias){
            const deg = 90;
            const radius = 5;
            const v_control = new THREE.Vector3(0, 5, 5 - 10 * getBiasAlpha(partPer, 5));
            updateCurve(geometry.userData.curve, deg, radius, v_control);
            updateCurveGeometry(geometry);
        }
    };
    // SEQ 3 - start moving x control, start rotation
    opt_seq.objects[3] = {
        secs: 3,
        update: function(seq, partPer, partBias){
            const deg = 90 - 90 * partPer;
            const radius = 5;
            const x = -5 * partPer 
            const z = 5 - 10 * getBiasAlpha(partPer, 5);
            const v_control = new THREE.Vector3(x, 5, z );
            updateCurve(geometry.userData.curve, deg, radius, v_control);
            updateCurveGeometry(geometry);
        }
    };
    // SEQ 4 - rotate
    opt_seq.objects[4] = {
        secs: 20,
        update: function(seq, partPer, partBias){
            const deg = 360 * 4 * partPer;
            const radius = 5 - 3 * partPer;
            const x = -5 + 10 * getBiasAlpha(partPer, 12);
            const y = 5 - 10 * getBiasAlpha(partPer, 32);
            const z = 5 - 10 * getBiasAlpha(partPer, 5);
            const v_control = new THREE.Vector3(x, y, z );
            updateCurve(geometry.userData.curve, deg, radius, v_control);
            updateCurveGeometry(geometry);
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
 
// video1-tri12-butterfly-hardcode.js - for threejs-object-loader
// based on the source code on the s2-1-tri12-butterfly
VIDEO.scripts = [
    '../../../js/sequences-hooks/r2/sequences-hooks.js'
];
// init
VIDEO.init = function (sm, scene, camera) {
    // ---------- ----------
    // TRI12 butterfly - /json/tri12-butterfly/set1-object/2.json as hard coded string with much that is not needed cut out
    // ---------- ----------
    const mesh_json = `{
    "metadata": {
        "version": 4.5,
        "type": "Object",
        "generator": "Hand Coded"
    },
    "geometries": [{
            "uuid": "07d25b15-9d12-43f1-8322-5fc6794af50b",
            "type": "BufferGeometry",
            "data": {
                "attributes": {
                    "position": {
                        "itemSize": 3,
                        "type": "Float32Array",
                        "array": [0, 0, 0, -1, 2, 0, -1, 0.5, 0, 1, 2, 0, 1, 0.5, 0, -0.7, -1, 0, -0.7, -0.1, 0, 0.7, -1, 0, 0.7, -0.1, 0],
                        "normalized": false
                    },
                    "normal": {
                        "itemSize": 3,
                        "type": "Float32Array",
                        "array": [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
                        "normalized": false
                    },
                    "uv": {
                        "itemSize": 2,
                        "type": "Float32Array",
                        "array": [0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1],
                        "normalized": false
                    }
                },
                "index": {
                    "type": "Uint16Array",
                    "array": [0, 1, 2, 0, 4, 3, 0, 6, 5, 0, 7, 8]
                },
                "morphAttributes": {
                    "position": [{
                            "itemSize": 3,
                            "type": "Float32Array",
                            "array": [0, 0, 0, 0, 0, -0.8, 0, 0, -0.8, 0, 0, -0.8, 0, 0, -0.8, 0, 0, -0.4, 0, 0, -0.4, 0, 0, -0.4, 0, 0, -0.4],
                            "normalized": false
                        }
                    ]
                },
                "morphTargetsRelative": true
            }
        }
    ],
    "materials": [{
            "uuid": "fcac10b3-e11a-49c9-94b8-575042930338",
            "type": "MeshPhongMaterial",
            "color": 16777215,
            "map": "6e281008-fce7-4145-b7e5-afb64421ba51",
            "side": 2
        }
    ],
    "animations": [{
            "name": "flap",
            "duration": 1,
            "tracks": [{
                    "name": ".morphTargetInfluences[0]",
                    "times": [0, 0.25, 0.5, 0.75, 1],
                    "values": [0, 0.30000001192092896, 0.5, 0.15000000596046448, 0],
                    "type": "number"
                }
            ],
            "uuid": "024eb45e-f782-443b-9fde-522a2897b585",
            "blendMode": 2500
        }
    ],
    "textures": [{
            "uuid": "6e281008-fce7-4145-b7e5-afb64421ba51",
            "image": "336e0dfd-4b72-4589-91e6-5c7d26498267"
        }
    ],
    "images": [{
            "uuid": "336e0dfd-4b72-4589-91e6-5c7d26498267",
            "url": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAWpJREFUWEftl0tLAlEYhud4ydJJR7xMSmAjJkFJE7QookUtolXb/mV0+QFCqy4Y0aqblViipWmMqJSXtj7+gbM5s3v4ZuDlfd/5OEecpqyRNvZsTpvjqHXNGtj7zbl79h7zpscAd0ZzYLPfBAslQLoDrbV5dKD0+4OMLCcD/pp5AQfdWXDR1QIn6kmwZ4GdEkqAdAeOt8LowEF5EZlpbYy1h+gU5gOjAi77huA9kQIfNf64B5QA6Q6cW9sIORBsI6OLdy/YDvvAoXiBnRmyI/nOMub7+kQHlADpDjTEBjpwFSgis2osAd6Nv4EvNRu8XuL3ujeNueE8cg8oAdIdeM6Y6EA6GkRGNw7PeNXex8QZkLv/sBLFvG67wPmnATugBEh34DobQQdWEl1kdFLPgXeMHvizy/d1wQ4k3TwvvJZ4rxBKgHQHzpa4B2IR7v5ao89d7ufdLnfL9+9W+d9bft4Tqk6Ie0AJkO3APz5+fQwL8GRoAAAAAElFTkSuQmCC"
        }
    ],
    "object": {
        "uuid": "ea2f929d-85b7-4167-b5fd-c841702e0d1e",
        "type": "Mesh",
        "geometry": "07d25b15-9d12-43f1-8322-5fc6794af50b",
        "material": "fcac10b3-e11a-49c9-94b8-575042930338",
        "animations": ["024eb45e-f782-443b-9fde-522a2897b585"]
    }
}
`
        const mesh = new THREE.ObjectLoader().parse(JSON.parse(mesh_json));
    scene.add(mesh);

    const mixer = new THREE.AnimationMixer(mesh);
    const action = mixer.clipAction(mesh.animations[0]);
    action.play();

    //-------- ----------
    // HELPERS
    //-------- ----------
    // mod method that just wraps THREE.MathUtils.euclideanModulo
    const mod = function (a, b) {
        return THREE.MathUtils.euclideanModulo(a, b);
    };
    // wrap method using THREE.MathUtils.euclideanModulo mod
    const wrap = function (value, a, b) {
        const max = Math.max(a, b);
        const min = Math.min(a, b);
        if (max === 0 && min === 0) {
            return 0;
        }
        const range = max - min;
        const a_range = mod(value + Math.abs(min), range) / range;
        return min + range * a_range;
    };
    // position a group of child objects to a grid
    const groupToGrid = function (group, size = 5, divisions = 5, offset = new THREE.Vector2(0.5, 0.5), forChild) {
        let i = 0;
        const len = size * size;
        while (i < len) {
            const obj = group.children[i];
            const gx = i % size;
            const gz = Math.floor(i / size);
            obj.position.x = size / 2 * -1 + gx + offset.x;
            obj.position.z = size / 2 * -1 + gz + offset.y;
            obj.position.x = wrap(obj.position.x, size / 2 * -1, size / 2);
            obj.position.z = wrap(obj.position.z, size / 2 * -1, size / 2);
            if (forChild) {
                let a_dist = obj.position.distanceTo(group.position) / (size / 2);
                a_dist = s_dist = THREE.MathUtils.clamp(a_dist, 0, 1);
                forChild(obj, i, gx, gz, a_dist, group);
            }
            i += 1;
        }
    };
    // opacity for child effect
    const forChild_opacity = (function () {
        const curve_path = new THREE.CurvePath();
        const v1 = new THREE.Vector2(0.00, 1.00);
        const v2 = new THREE.Vector2(0.80, 1.00);
        const v3 = new THREE.Vector2(1.00, 0.00);
        const c1 = v2.clone().lerp(v3, 0.5).add(new THREE.Vector2(0.0, 1.00));
        curve_path.add(new THREE.LineCurve(v1, v2));
        curve_path.add(new THREE.QuadraticBezierCurve(v2, c1, v3));
        return (obj, i, gx, gz, a_dist, group) => {
            const v = curve_path.getPoint(a_dist);
            //obj.material.opacity = 1 - a_dist;
            obj.material.opacity = v.y;
        };
    }
        ());
    // ---------- ----------
    // LIGHT
    // ---------- ----------
    const dl = new THREE.DirectionalLight(0xffffff, 3);
    dl.position.set(3, 2, 1);
    scene.add(dl);
    const pl = new THREE.PointLight(0xffffff, 0.5);
    pl.position.set(0,0,1);
    scene.add(pl);
    // ---------- ----------
    // GROUP OF OBJECTS
    // ---------- ----------
    const size = 25,
    divisions = 25;
    const group = new THREE.Group();
    const group2 = new THREE.Group();
    group.position.y = -3;
    group2.position.y = 3;
    scene.add(group);
    scene.add(group2);
    let i = 0;
    const len = size * size;
    while (i < len) {
        const a_x = (i % size) / size;
        const a_y = Math.floor(i / size) / size;
        const mesh = new THREE.Mesh(
                new THREE.BoxGeometry(0.7, 1, 0.7),
                new THREE.MeshPhongMaterial({
                    color: new THREE.Color(1 - a_x, 0.5, a_y),
                    transparent: true
                }));
        group.add(mesh);
        group2.add(mesh.clone())
        i += 1;
    }
    //-------- ----------
    // BACKGROUND
    //-------- ----------
    scene.background = null;
    sm.renderer.setClearColor(null, 0);
    //-------- ----------
    // A MAIN SEQ OBJECT
    //-------- ----------
    // update
    const v_offset = scene.userData.v_offset = new THREE.Vector2(0, 0);
    const update = function (a_frame) {
        const a_y = Math.sin(Math.PI * 2 * a_frame);
        v_offset.x = 0.5 + size * a_frame;
        v_offset.y = 0.5 + size * a_y;
        groupToGrid(group, size, divisions, v_offset, forChild_opacity);
        groupToGrid(group2, size, divisions, v_offset, forChild_opacity);
    };
    // start options for main seq object
    const opt_seq = {
        fps: 30,
        beforeObjects: function (seq) {
            const a_frame = seq.per;
            camera.zoom = 1;
            mixer.setTime(30 * a_frame);
            // camera
            camera.position.set(4, 3, 4);
            camera.lookAt(0, 0.5, 0);
            // update grid
            update(seq.per);
        },
        afterObjects: function (seq) {
            camera.updateProjectionMatrix();
        },
        objects: []
    };
    // SEQ 0 - ...
    opt_seq.objects[0] = {
        secs: 15,
        update: function (seq, partPer, partBias) {
            const e = new THREE.Euler();
            e.y = Math.PI / 180 * (-45 - 90 * partPer);
            e.z = Math.PI / 180 * 20;
            camera.position.set(1, 0, 0).normalize().applyEuler(e).multiplyScalar(5);
            camera.lookAt(0, 0.5, 0);
        }
    };
    // SEQ 1 - ...
    opt_seq.objects[1] = {
        secs: 15,
        update: function (seq, partPer, partBias) {
            const e = new THREE.Euler();
            e.y = Math.PI / 180 * (-135 + 90 * partPer);
            const a_sin = Math.sin(Math.PI * (partPer * 2 % 1));
            e.z = Math.PI / 180 * (20 - 40 * a_sin);
            camera.position.set(1, 0, 0).normalize().applyEuler(e).multiplyScalar(5);
            camera.lookAt(0, 0.5, 0);
        }
    };
    const seq = scene.userData.seq = seqHooks.create(opt_seq);
    console.log('frameMax for main seq: ' + seq.frameMax);
    sm.frameMax = seq.frameMax;
};
// update method for the video
VIDEO.update = function (sm, scene, camera, per, bias) {
    const seq = scene.userData.seq;
    seqHooks.setFrame(seq, sm.frame, sm.frameMax);
};
// custom render function
VIDEO.render = function (sm, canvas, ctx, scene, camera, renderer) {

    // background
    ctx.fillStyle = '#4a4a4a';
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // update and draw dom element of renderer
    sm.renderer.render(sm.scene, sm.camera);
    ctx.drawImage(sm.renderer.domElement, 0, 0, sm.canvas.width, sm.canvas.height);

    // additional plain 2d overlay for status info
    //ctx.fillStyle = 'rgba(0,0,0,0.2)';
    //ctx.fillRect(0, 0, sm.canvas.width, sm.canvas.height);
    //ctx.fillStyle = 'white';
    //ctx.font = '60px arial';
    //ctx.textBaseline = 'top';
    //ctx.fillText('frame: ' + sm.frame + '/' + sm.frameMax, 10, 10);

};

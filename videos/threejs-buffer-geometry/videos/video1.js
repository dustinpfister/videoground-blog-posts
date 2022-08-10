// video1 for threejs-buffer-geometry
 
// scripts
VIDEO.scripts = [
   '../../../js/canvas/r0/canvas.js',
   '../../../js/canvas-text-cube/r0/canvas-text-cube.js',
   '../../../js/sequences-hooks/r1/sequences-hooks.js',
   '../../../js/datatex/r0/datatex.js'
];
// init
VIDEO.init = function(sm, scene, camera){
 
    // BACKGROUND
    scene.background = new THREE.Color('#2a2a2a');

    // LIGHT
    var dl = new THREE.DirectionalLight(0xffffff, 1);
	dl.position.set(3, 2, 1);
	scene.add(dl);

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
            ['Buffer Geometry', 64, 17, 14, 'white'],
            ['in', 64, 32, 14, 'white'],
            ['threejs', 64, 47, 14, 'white'],
            ['( r140 08/09/2022 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);

    //******** **********
    // THREE MESH OBJECTS WITH CUSTOM GEOMETRY ( mesh1, mesh2, and mesh3 )
    //******** **********

    var customTri = new THREE.Group();
    scene.add(customTri);

    // mesh1 - position only with basic material
    var geometry1 = new THREE.BufferGeometry();
    var vertices = new Float32Array([
                0, 0, 0,
                1, 0, 0,
                1, 1, 0
            ]);
    geometry1.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry1.translate(-0.5, 0, 0);
    var mesh1 = new THREE.Mesh(
            geometry1,
            new THREE.MeshBasicMaterial({
                side: THREE.DoubleSide
            }));
    mesh1.rotateY(Math.PI * 0.25);
    mesh1.position.x  = -1.50;
    customTri.add(mesh1);

    // mesh2 - position and normal attributes with normal material
    var geometry2 = new THREE.BufferGeometry();
    var vertices = new Float32Array([
                0,0,0,
                1,0,0,
                1,1,0
            ]);
    // create position property
    geometry2.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    // compute vertex normals
    geometry2.computeVertexNormals();
    geometry2.translate(-0.5, 0, 0);
    var mesh2 = new THREE.Mesh(
            geometry2,
            new THREE.MeshNormalMaterial({
                side: THREE.DoubleSide
            }));
    mesh2.rotateY(Math.PI * 0.25);
    mesh2.position.x  = 0.0;
    customTri.add(mesh2);

    // mesh3 - position, normal, and uv attributes using basic material with data texture for map
    var geometry3 = new THREE.BufferGeometry();
    var vertices = new Float32Array([
                0, 0, 0,
                1, 0, 0,
                1, 1, 0
            ]);
    // create position property
    geometry3.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    // compute vertex normals
    geometry3.computeVertexNormals();
    // creating a uv
    var uvs = new Float32Array([
                0, 1, 1, 0.5
            ]);
    geometry3.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    geometry3.translate(-0.5, 0, 0);
    var texture = datatex.seededRandom(5, 5, 1, 1, 1, [128, 250]);
    var mesh3 = new THREE.Mesh(
            geometry3,
            new THREE.MeshBasicMaterial({
                map: texture,
                side: THREE.DoubleSide
            }));
    mesh3.rotateY(Math.PI * 0.25);
    mesh3.position.x = 1.5;
    customTri.add(mesh3);

    //******** **********
    // MESH OBJECTS FOR ROTATION DEMO
    //******** **********
    var rotationDemo = new THREE.Group();
    scene.add(rotationDemo); 
    rotationDemo.position.set(-1, 0, -7);
    var mesh4 = new THREE.Mesh(
        new THREE.ConeGeometry(0.25, 2, 30, 30),
        new THREE.MeshNormalMaterial()
    );
    mesh4.position.set(-1.5, 0, 0);
    rotationDemo.add(mesh4);
    var mesh5 = new THREE.Mesh(
        new THREE.ConeGeometry(0.25, 2, 30, 30),
        new THREE.MeshNormalMaterial()
    );
    mesh5.position.set(1.5, 0, 0);
    rotationDemo.add(mesh5);
    // CHILD MESH OBEJECTS
    var childMaterial = new THREE.MeshNormalMaterial({ 
        transparent: true,
        opacity: 0.5
    });
    mesh4.add( new THREE.Mesh(
        new THREE.BoxGeometry(2, 2, 2),
        childMaterial) );
    mesh5.add( new THREE.Mesh(
        new THREE.BoxGeometry(2, 2, 2),
        childMaterial) );

    // UPDATE GEOMETRY DEMO

    // ADJUST PLANE POINT HELPER
var adjustPlanePoint = function (geo, vertIndex, yAdjust) {
    // get position and normal
    var position = geo.getAttribute('position');
    var normal = geo.getAttribute('normal');
    var i = vertIndex * 3;
    // ADJUSTING POSITION ( Y Only for now )
    position.array[i + 1] = yAdjust;
    position.needsUpdate = true;
    // ADJUSTING NORMALS USING computeVertexNormals method
    geo.computeVertexNormals();
};

var geo6 = new THREE.PlaneGeometry(5, 5, 6, 6);
geo6.rotateX(Math.PI * 1.5);
    var texture = datatex.seededRandom(20, 20, 1, 1, 1, [128, 250]);
var mesh6 = new THREE.Mesh(
        geo6,
        new THREE.MeshStandardMaterial({ color: 0xffffff, map: texture }));
mesh6.position.set(0,0,4)
scene.add(mesh6);
// USING THE THREE.VertexNormalsHelper method
//const helper = new THREE.VertexNormalsHelper( plane, 2, 0x00ff00, 1 );
//scene.add(helper);


var pos = geo6.getAttribute('position');
var yAdjust = [];
var i = pos.count;
while(i--){
    yAdjust.push( -1 + 2 * THREE.MathUtils.seededRandom() );
}
var updateGeoDemo = function(per){

    var a = per * 8 % 1;
	var b = 1 - Math.abs(0.5 - a) / 0.5;

	var i = pos.count;
    while(i--){
		adjustPlanePoint(geo6, i, yAdjust[i] * b);
    }
	
	
	/*
	adjustPlanePoint(geo6, 0, 0);
	adjustPlanePoint(geo6, 1, 0);
	adjustPlanePoint(geo6, 2, 0);
	adjustPlanePoint(geo6, 3, 0);
	adjustPlanePoint(geo6, 4, 0)
	adjustPlanePoint(geo6, 5, 0)
	adjustPlanePoint(geo6, 6, 1)
	*/
	
};
updateGeoDemo(0);

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
            // rotate each mesh in customTri group
            customTri.children.forEach(function(mesh, i){
                mesh.rotation.y = Math.PI * 2 * 8 * seq.per;
            });

            // ROTATION OF GEOMETRY COMPARED TO MESH
            var rx = Math.PI * 2 * seq.per,
            rz = Math.PI * 8 * seq.per;
            // USING COPY AND ROTATION METHODS
            mesh4.geometry.copy( new THREE.ConeGeometry(0.25, 2, 30, 30) );
            mesh4.geometry.rotateX( rx );
            mesh4.geometry.rotateZ( rz );
            // USING OBJECT3D ROTATION PROPERTY OF MESH2 to ROTATE THE MESH OBJECT
            // RATHER THAN THE GEOMETRY
            mesh5.rotation.set(rx ,0, rz);
			
			// update demo
			updateGeoDemo(seq.per);

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
            // sq1 - move to view basic triangles
            {
                secs: 1,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(8 - 6 * partPer, 1 + 1 * partPer, 2 * partPer);
                    camera.lookAt(0, 0, 0);
                }
            },
            // sq2 - view basic triangles
            {
                secs: 5,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(2, 2, 2);
                    camera.lookAt(0, 0, 0);
                }
            },
            // sq3 - move to view rotation demo
            {
                secs: 1,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(2 - 4 * partPer, 2, 2 - 4 * partPer);
                    camera.lookAt(-1.25, 0, -6 * partPer);
                }
            },
            // sq4 - view rotation demo
            {
                secs: 5,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(-2, 2, -2);
                    camera.lookAt(-1.25, 0, -6);
                }
            },
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


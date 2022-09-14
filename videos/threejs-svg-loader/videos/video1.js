// video1 for threejs-svg-loader
 
// scripts
VIDEO.scripts = [
   '../../../js/canvas/r0/canvas.js',
   '../../../js/canvas-text-cube/r0/canvas-text-cube.js',
   '../../../js/sequences-hooks/r1/sequences-hooks.js',
   '../../../js/datatex/r0/datatex.js',
   '../../../js/r140-files/SVGLoader.js'
];
// init
VIDEO.init = function(sm, scene, camera){
    //-------- ----------
    // LIGHT
    //-------- ----------
    const dl = new THREE.DirectionalLight(0xffffff, 1);
    dl.position.set(3, 2, 1)
    scene.add(dl);
    const al = new THREE.AmbientLight(0xffffff, 0.25);
    scene.add(al);
    //-------- ----------
    // GRID
    //-------- ----------
    var grid = scene.userData.grid = new THREE.GridHelper(10, 10, '#ffffff', '#ffffff');
    grid.material.linewidth = 6;
    grid.material.transparent = true;
    grid.material.opacity = 0.5;
    scene.add( grid );
    //-------- ----------
    // BACKGROUND
    //-------- ----------
    scene.background = new THREE.Color('#000000');
    //-------- ----------
    // HELPERS
    //-------- ----------
    // create an array of Extrude geometry from SVG data loaded with the SVGLoader
    const createExtrudeGeosFromSVG = (data) => {
        const paths = data.paths;
        const geoArray = [];
        for ( let i = 0; i < paths.length; i ++ ) {
            const path = paths[ i ];
            // create a shape
            const shapes = THREE.SVGLoader.createShapes( path );
            // for each shape create a mesh and add it to the group
            for ( let j = 0; j < shapes.length; j ++ ) {
                const shape = shapes[ j ];
                geoArray.push( new THREE.ExtrudeGeometry( shape, {
                    depth: 16
                }));
            }
        }
        return geoArray;
    };
    // create mesh group from SVG
    const createMeshGroupFromSVG = (data) => {
        const geoArray = createExtrudeGeosFromSVG(data);
        const group = new THREE.Group();
        geoArray.forEach( (geo, i) => {
            // each mesh gets its own material
            const material = new THREE.MeshPhongMaterial( {
                color: data.paths[i].color // using paths data for color
            });
            const mesh = new THREE.Mesh( geo, material );
            group.add(mesh);
        });
        return group;
    };
    //-------- ----------
    // OBJECTS
    //-------- ----------
    let group;
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
            ['SVG Loader', 64, 17, 14, 'white'],
            ['in', 64, 32, 14, 'white'],
            ['threejs', 64, 47, 14, 'white'],
            ['( r140 09/14/2022 )', 64, 70, 12, 'gray'],
            ['video1', 64, 100, 10, 'gray']
        ]
    });
    scene.add(textCube);
    // a seq object for textcube
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
    // MAIN SEQ OBJECT
    //-------- ----------
    var seq = scene.userData.seq = seqHooks.create({
        fps: 30,
        beforeObjects: function(seq){
            grid.material.opacity = 0.5;
            group.rotation.y = 0;
            // text cube and camera
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
                secs: 1,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(8 - 5 * partPer, 1 + 2 * partPer, 3 * partPer);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 1,
                update: function(seq, partPer, partBias){
                    // camera
                    camera.position.set(3, 3, 3);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 1,
                update: function(seq, partPer, partBias){
                    // camera
                    let s = 3 - 0.75 * partPer
                    camera.position.set(s, s, s);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 1,
                update: function(seq, partPer, partBias){
                    // camera
                    let s = 2.25;
                    camera.position.set(s, s, s);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 3,
                update: function(seq, partPer, partBias){
                    // camera
                    let s = 2.25;
                    camera.position.set(s - s * 2 * partPer, s, s);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 3,
                update: function(seq, partPer, partBias){
                    // camera
                    let s = 2.25;
                    camera.position.set(s * -1, s, s);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 3,
                update: function(seq, partPer, partBias){
                    // camera
                    group.rotation.y = Math.PI * 2 * partPer
                    let s = 2.25;
                    camera.position.set(s * -1, s, s);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 3,
                update: function(seq, partPer, partBias){
                    grid.material.opacity = 0.5 - 0.5 * partPer;
                    // camera
                    group.rotation.y = Math.PI * 2 * partPer
                    let s = 2.25;
                    camera.position.set(s * -1 + s * partPer, s - s * partPer, s + s * 1 * partPer);
                    camera.lookAt(0, 0, 0);
                }
            },
            {
                secs: 11,
                update: function(seq, partPer, partBias){
                    grid.material.opacity = 0;
                    group.rotation.y = Math.PI * 4 * partPer;
                    // camera
                    let s = 2.25;
                    camera.position.set(0, 0, s * 2);
                    camera.lookAt(0, 0, 0);
                }
            }
        ]
    });
    console.log('frameMax for main seq: ' + seq.frameMax);
    sm.frameMax = seq.frameMax;
    //-------- ----------
    // SVG LOADER
    //-------- ----------
    return new Promise((resolve, reject)=>{
        // instantiate a loader
        const loader = new THREE.SVGLoader();
        // load a SVG resource
        loader.load(
            // resource URL
            videoAPI.pathJoin(sm.filePath, '../svg/fff.svg'),
            // called when the resource is loaded
            function ( data ) {
                group = createMeshGroupFromSVG(data);
                // get min and max of children
                let xMin = Infinity, xMax = -Infinity;
                let yMin = Infinity, yMax = -Infinity;
                let zMin = Infinity, zMax = -Infinity;
                group.children.forEach( (mesh) => {
                    const geo = mesh.geometry;
                    geo.computeBoundingBox();
                    const b = geo.boundingBox;
                    xMin = b.min.x < xMin ? b.min.x: xMin;
                    xMax = b.max.x > xMax ? b.max.x: xMax;
                    yMin = b.min.y < yMin ? b.min.y: yMin;
                    yMax = b.max.y > yMax ? b.max.y: yMax;
                    zMin = b.min.z < zMin ? b.min.z: zMin;
                    zMax = b.max.z > zMax ? b.max.z: zMax;
                });
                const xRange = xMax - xMin;
                const yRange = yMax - yMin;
                const zRange = zMax - zMin;
                group.children.forEach( (mesh) => {
                    mesh.geometry.translate(xRange / 2 * -1, yRange / 2 * -1, zRange / 2 * -1);
                    mesh.rotateX(Math.PI)
                });
                group.scale.normalize().multiplyScalar(0.025);
                scene.add(group);
                // resolve
                resolve();
            },
            // called when loading is in progresses
            function ( xhr ) {
                console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
            },
            // called when loading has errors
            function ( error ) {
                console.log( 'An error happened' );
                console.log(error);
                reject(error);
            }
        );
    });
};
// update method for the video
VIDEO.update = function(sm, scene, camera, per, bias){
    var seq = scene.userData.seq;
    seqHooks.setFrame(seq, sm.frame, sm.frameMax);
};

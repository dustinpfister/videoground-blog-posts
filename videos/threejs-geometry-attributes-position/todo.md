## threejs-geometry-attributes-position video todo list

## () - just work soemthing out for video 1
* find a system for moving each face
* this syetm can involve creating an array of vectors based on the position geomerty
```
    // I HAVE THIS THUS FAR
    // NOW I THINK I JUST NEED TO GET A MEAN VECTOR for the VECTORS ARRAY
    // add see abotu using that to translate face points
    var face = cube.userData.face = [];
    var i = 0, len = 6;
    while(i < len){
        var vectors = posVectors.slice(i,  i + 4);
        face.push({
           si: i,
           ei: i + 4,
           vectors: vectors
        });
        i += 1;
    }
    console.log(face);
```

## ( done 04/13/2022 ) - start video1
* (done) have a box geometry
* (done) using normals as a way to move points

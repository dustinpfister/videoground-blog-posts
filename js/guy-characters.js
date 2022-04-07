var GuyCharacters = (function () {
    
    var api = {};

    var create = {};

    create.guy1 = function(scene){
        var guy1 = new Guy();
        scene.userData.guy1 = guy1;
        scene.userData.obj1 = guy1.group;
        scene.add(guy1.group);
        var guy1_canvasObj = scene.userData.guy1_canvasObj = CanvasMod.createCanvasObject(sm, GuyCanvasMethods);
        guy1_canvasObj.draw({
           drawClass: 'face',
           drawMethod: 'talk',
           mouthPer: 0.5,
           leftEyeXPer: 0.5, rightEyeXPer: 0.5
        });
        guy1.head.material[1] = guy1.head.material[1] = new THREE.MeshStandardMaterial({ 
            map:  guy1_canvasObj.texture
        });
        var hat_canvasObj = CanvasMod.createCanvasObject(sm, GuyCanvasMethods);
        hat_canvasObj.draw({drawClass: 'hat', drawMethod: 'stripes'});
        var hatMaterial = new THREE.MeshStandardMaterial({
            map: hat_canvasObj.texture
        });
        var hat = new THREE.Mesh(
            new THREE.ConeGeometry(0.80, 1.5),
            hatMaterial
        );
        hat.rotation.x = THREE.MathUtils.degToRad(-30);
        hat.position.set(0, 0.83 ,-0.6)
        guy1.head.add(hat);
        // using hat texture for body and arms
        guy1.body.material = hatMaterial;
        guy1.arm_right.material = hatMaterial;
        guy1.arm_left.material = hatMaterial;
    };


    api.create = function(scene, guyID){
        create[guyID](scene);
    };


    return api;
}
    ());

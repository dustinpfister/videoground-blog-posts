var Sequences = (function () {
    
    var api = {};

    var create = {};



    api.create = function(opt){
        opt = opt || {};
        var seq = {
           partIndex: 0,
           sm: opt.sm || {},
           part: opt.part || []
        };
        seq.part.forEach(function(partObj, i){
            var nextPerObj = seq.part[i + 1] || null;
            partObj.endPer = 1;
            if(nextPerObj){
                partObj.endPer = nextPerObj.per;
            }
        });
        return seq;
    };
 
    // get current part index helper
    var getCurrentPartIndex = function(seq){
        var i = 0,
        len = seq.part.length;
        while(i < len){
            var partObj = seq.part[i];
            if(seq.sm.per < partObj.per){
                return i - 1;
            }
            // else take a look at the next partObj
            i += 1;
        }
        // there should always be one part, so this should not present a problem
        return len - 1;
    };

    api.update = function(seq, sm){
        var sm = seq.sm;
        // get the current index
        var currentIndex = getCurrentPartIndex(seq);
        // if currentIndex equals partIndex then just call update of current part
        // else update sm.partIndex and call init
        var partObj = seq.part[sm.partIndex];
        if(!(currentIndex === sm.partIndex && sm.frame != 0)){
            // else set sm.partIndex
            sm.partIndex = currentIndex;
            var partObj = seq.part[sm.partIndex];
            partObj.init(sm);
        }
        var partPer = (sm.per - partObj.per) / (partObj.endPer - partObj.per),
        partBias = 1 - Math.abs(0.5 - partPer) / 0.5;
        partObj.update(sm, sm.scene, sm.camera, partPer, partBias);
    };
    return api;
}
    ());

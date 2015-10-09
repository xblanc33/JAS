module.exports.State = State;

var sid = 0;

function State(name, type, inst) {
    this.parents = []; //set of parent node
    this.name = name;
    this.inst = inst;
    this.type = type;

    this.sid = 's' + sid;
    sid++;

    //these properties are attached by the engine according to the goal of the analysis
    this.lattice;
    this.smap;

    //this function will also be attached by the engine according to the type
    this.f;



    //join the values of the map lattice from parents
    //can (should) be used by f
    this.joinParentsMap = function() {
        // console.log('joinParentsMap');
        // console.log(this.parents.length+ ' parents');
        // console.log(this.sid);
        // console.log(this.type);
        var changed = false;

        for (var i = 0; i < this.parents.length; i++) {
            if (this.parents[i].smap) {
                if (this.smap.join(this.parents[i].smap, this.lattice)) changed = true;
            };
        };
        //console.log(changed);
        return changed;

    };

    this.updateKeyValue = function(k, v) {
        // console.log('updateKeyValue');
        // console.log(k);
        // console.log(v);
        return this.smap.put(k, v);
    };

    this.addKeyValue = function(k, v) {
        // console.log('addKeyValue');
        // console.log(this.sid);
        return this.smap.putTop(k, v);
    };

    //get the value of k only from parent nodes
    this.getParentsValue = function(k) {
        // console.log('getParentValue:' + k);
        var parents_v = [];
        for (var i = 0; i < this.parents.length; i++) {
            if (this.parents[i].smap.containsKey(k))
                parents_v.push(this.parents[i].getValue(k));
        };
        if (parents_v.length === 0) return this.lattice.getBottom();
        else return this.lattice.getLeastUpper(parents_v);
    };

    //get the value after a join and after F
    this.getValue = function(k) {
        return this.smap.get(k);
    };

    //get the label of the variables
    this.getVariables = function() {
        return this.smap.keySet();
    };

};

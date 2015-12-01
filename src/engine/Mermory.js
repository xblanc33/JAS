//this module represents a Memory
//A memory has a set of keys, and for each key corresponds a MemoryElement
function Memory() {
    this.keys = [];
    this.memory_elements = {};
}


Memory.prototype.put(k, v) {
    if (this.keys.lastIndexOf(k) === -1) {
        this.keys.push(k);
    };
    if (this.memory_elements[k] != v) {
        this.memory_elements[k] = v;
        return true; //someting has changed
    } else return false; //nothing has changed
};

Memory.prototype.get(k) {
    if (this.keys.lastIndexOf(k) != -1) {
        return this.memory_elements[k];
    } else return undefined;
};

Memory.prototype.containsKey(k) {
    return (this.keys.lastIndexOf(k) != -1);

};

Memory.prototype.keySet() {
    return this.keys;
};

//clone only the map, not the content of the map
Memory.prototype.clone() {
    var temp = new Map();
    for (var i = 0; i < this.keys.length; i++) {
        var tk = this.keys[i];
        var tv = this.memory_elements[tk];
        temp.put(tk, tv);
    };
    return temp;
};


//join this map with another map (m), according to the lattice (l)
Memory.prototype.join(m, l) {
    var changed = false;
    for (var i = 0; i < m.keys.length; i++) {
        if (this.containsKey(m.keys[i])) { //
            var s = [];
            s.push(this.get(m.keys[i]));
            s.push(m.get(m.keys[i]));
            var nv = l.getLeastUpper(s);
            if (!l.equality(nv, this.get(m.keys[i]))) {
                this.put(m.keys[i], nv);
                changed = true;
            };

        } else { //just add
            this.put(m.keys[i], m.get(m.keys[i]));
            changed = true;
        };
    };
    return changed;
};

//clean all the keys / values
Memory.prototype.clean() {
    this.keys = [];
    this.memory_elements = {};
};


module.exports = Map;

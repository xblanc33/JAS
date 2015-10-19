function Map() {
    this.keys = [];
    this.values = {};

    this.put = function(k, v) {
        if (this.keys.lastIndexOf(k) === -1) {
            this.keys.push(k);
        };
        if (this.values[k] != v) {
            this.values[k] = v;
            return true; //someting has changed
        } else return false; //nothing has changed
    };

    this.get = function(k) {
        if (this.keys.lastIndexOf(k) != -1) {
            return this.values[k];
        } else return undefined;
    };

    this.containsKey = function(k) {
        return (this.keys.lastIndexOf(k) != -1);

    };

    this.keySet = function() {
        return this.keys;
    };

    //clone only the map, not the content of the map
    this.clone = function() {
        var temp = new Map();
        for (var i = 0; i < this.keys.length; i++) {
            var tk = this.keys[i];
            var tv = this.values[tk];
            temp.put(tk, tv);
        };
        return temp;
    };


    //join this map with another map (m), according to the lattice (l)
    this.join = function(m, l) {
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
    this.clean = function() {
        this.keys = [];
        this.values = {};
    };
};

module.exports = Map;

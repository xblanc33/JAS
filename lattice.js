set = require('./set.js')

module.exports.Lattice = Lattice;

//create a lattice
//s_elements contains all the elements of the lattice 
//set the order between the elements with addOrder()
//make the lattice with make()
function Lattice(s_elements) {
    //elements contains all the elements of the Lattice with Top and Bottom
    //Bottom is the first element
    //Top is the last element
    this.elements = [];
    for (var i = 0; i < s_elements.length; i++) {
        this.elements.push(s_elements[i]);
    };

    //Size contains the size of the Lattice
    this.size = this.elements.length;

    //Orders is the internal structure of the Lattice
    this.orders = [];

    for (var i = 0; i < this.size; i++) {
        this.orders.push([]);
        for (var j = 0; j < this.size; j++) {
            this.orders[i].push(0);
        };
    };

    //return the bottom element
    this.getBottom = function() {
        return this.elements[0];
    };


    //return the bottom element
    this.getTop = function() {
        return this.elements[this.elements.length - 1];
    };

    //return all the elements of the lattice
    this.getElements = function() {
        var els = [];
        for (var i = 0; i < this.elements.length; i++) {
            els.push(this.elements[i]);
        };
        return els;
    };

    //return the number of elements contained in the lattice
    this.getSize = function() {
        return this.size;
    };

    //set a new order in the lattice between the x and y element (x < y)
    this.addOrder = function(x, y) {
        var x_i = this.elements.indexOf(x);
        var y_i = this.elements.indexOf(y);
        if (x_i !== -1 && y_i !== -1) {
            this.orders[x_i][y_i] = -1;
        };
    };


    //set the matrix and enforce reflexivity
    this.enforceReflexivity = function() {
        for (var i = 0; i < this.size; i++) {
            for (var j = 0; j < this.size; j++) {
                if (i === j) { //bottom
                    this.orders[i][j] = -1; //low
                };
            };
        };
    };

    //set the matrix and enforce symmetry
    this.enforceSymmetry = function() {
        //enforce symmetry
        for (var i = 0; i < this.size; i++) {
            for (var j = 0; j < this.size; j++) {
                if (i !== j) this.orders[j][i] = -this.orders[i][j];
            };
        };
    };


    //set the matrix and enforce transitivity
    this.enforceTransitivity = function() {
        //enforce transitivity
        var changed = true;
        while (changed) { //should improve that point !
            changed = false;
            for (var i = 0; i < this.size; i++) {
                for (var j = 0; j < this.size; j++) {
                    if (this.orders[i][j] === -1) {
                        for (var k = 0; k < this.size; k++) {
                            if ((this.orders[j][k] === -1) && (this.orders[i][k] !== -1)) {
                                this.orders[i][k] === -1;
                                changed = true;
                            };
                        };
                    };
                };
            };
        };
    };


    //set the matrix and enforce all
    this.enforceAll = function() {
        this.enforceReflexivity();
        this.enforceSymmetry();
        this.enforceTransitivity();
    };

    //add a new bottom element (b)
    this.lift = function(b) {
        var tmp_elements = [];
        tmp_elements.push(b);
        for (var i = 0; i < this.elements.length; i++) {
            tmp_elements.push(this.elements[i]);
        };

        this.elements = tmp_elements;

        //Size contains the size of the Lattice
        this.size = this.elements.length;

        //Orders is the internal structure of the Lattice
        var tmp_orders = [];

        for (var i = 0; i < this.size; i++) {
            tmp_orders.push([]);
            for (var j = 0; j < this.size; j++) {
                if (i === 0) tmp_orders[i].push(-1)
                else if (j === 0) tmp_orders[i].push(1)
                else tmp_orders[i].push(this.orders[i - 1][j - 1]);
            };
        };
        this.orders = tmp_orders;
    };

    //add a new top element (t)
    this.down = function(t) {
        var tmp_elements = [];
        for (var i = 0; i < this.elements.length; i++) {
            tmp_elements.push(this.elements[i]);
        };
        tmp_elements.push(t);

        this.elements = tmp_elements;

        //Size contains the size of the Lattice
        this.size = this.elements.length;

        //Orders is the internal structure of the Lattice
        var tmp_orders = [];

        for (var i = 0; i < this.size; i++) {
            tmp_orders.push([]);
            for (var j = 0; j < this.size; j++) {
                if (i === this.size - 1) tmp_orders[i].push(1)
                else if (j === this.size - 1) tmp_orders[i].push(-1)
                else tmp_orders[i].push(this.orders[i][j]);
            };
        };
        tmp_orders[this.size - 1][this.size - 1] = -1;
        this.orders = tmp_orders;
    };

    //obtain the order between x and y
    this.getOrder = function(x, y) {
        return this.orders[this.elements.indexOf(x)][this.elements.indexOf(y)];
    };


    //return true iff x <= y
    this.isLower = function(x, y) {
        if (this.getOrder(x, y) === -1) return true
        else return false;
    };

    //return true iff x > y
    this.isUpper = function(x, y) {
        if (this.getOrder(x, y) === 1) return true
        else return false;
    };

    this.equality = function(e1, e2) {
        return e1 == e2;
    };

    //return all elements that are upper of x
    this.getElementAllUppers = function(x) {
        var allUppers = [];
        var x_index = this.elements.indexOf(x);
        if (x_index != -1) {
            for (var i = 0; i < this.orders[x_index].length; i++) {
                if (this.orders[x_index][i] === -1) allUppers.push(this.elements[i]);
            };
            return allUppers;
        } else return [this.getBottom()];
    };

    //return all elements that are upper of all elements in s
    this.getElementsAllUppers = function(s) {
        var allUppers = this.elements;
        for (var i = 0; i < s.length; i++) {
            allUppers = set.inter(allUppers, this.getElementAllUppers(s[i]));
        };
        return allUppers;
    };

    //get the least upper element of s (a set of elements)
    this.getLeastUpper = function(s) {
        var allUppers = this.getElementsAllUppers(s);
        var least = [];
        for (var i = 0; i < allUppers.length; i++) {
            var u_i = this.elements.indexOf(allUppers[i]);
            var isLeast = true;
            for (var j = 0; j < allUppers.length; j++) {
                var u_j = this.elements.indexOf(allUppers[j]);
                if (this.orders[u_i][u_j] != -1) isLeast = false;
            };
            if (isLeast) least.push(allUppers[i]);
        };
        return least[0];
    };


    //get the lowers elements of x
    this.getElementAllLowers = function(x) {
        var allLowers = [];
        var x_index = this.elements.indexOf(x);
        for (var i = 0; i < this.orders[x_index].length; i++) {
            if (this.orders[x_index][i] === 1) allLowers.push(this.elements[i]);
        };
        return allLowers;
    };

    //get the lowers elements of a set of elements (s)
    this.getElementsAllLowers = function(s) {
        var allLowers = this.elements;
        for (var i = 0; i < s.length; i++) {
            allLowers = set.inter(allLowers, this.getElementAllLowers(s[i]));
        };
        return allLowers;
    };

    //get the greatest lower element of a set of elements (s)
    this.getGreatestLower = function(s) {
        var allLowers = this.getElementsAllLowers(s);
        var greatest = [];
        for (var i = 0; i < allLowers.length; i++) {
            var u_i = this.elements.indexOf(allLowers[i]);
            var isGreatest = true;
            for (var j = 0; j < allLowers.length; j++) {
                var u_j = this.elements.indexOf(allLowers[j]);
                if ((u_i != u_j) && (this.orders[u_i][u_j] != 1)) isGreatest = false;
            };
            if (isGreatest) greatest.push(allLowers[i]);
        };
        return greatest;
    };
};


// function powerLattice(l1, l2) {
//     var s_elements = [];
//     els_l1 = l1.getElements();
//     els_l2 = l2.getElements();

//     for (var i = 0; i < els_l1.length; i++) {
//         for (var j = 0; j < els_l2.length; j++) {
//             var es = els_l1[i] + els_l2[j];
//             s_elements.push(es);
//         };
//     };

//     var la = new Lattice(s_elements);

//     console.log(la.getElements());
//     console.log(la.getSize());

//     for (var i = 0; i < els_l1.length; i++) {
//         for (var j = 0; j < els_l2.length; j++) {
//             var ei = els_l1[i] + els_l2[j];
//             for (var k = 0; k < els_l1.length; k++) {
//                 for (var l = 0; l < els_l2.length; l++) {
//                     var ej = els_l1[k] + els_l2[l];
//                     var l1Bool = l1.isLower(els_l1[i], els_l1[k]);
//                     var l2Bool = l2.isLower(els_l2[j], els_l2[l]);
//                     if (l1Bool && l2Bool) {
//                         la.addOrder(ei, ej);
//                     };
//                 };
//             };
//         };
//     };

//     la.enforceAll();

//     return la;

// };


// module.exports.powerLattice = powerLattice;

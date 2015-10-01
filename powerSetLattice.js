set = require('./set.js')

module.exports.PowerSetLattice = PowerSetLattice;

//create a lattice
//s_elements contains all the elements of the lattice 
//set the order between the elements with addOrder()
//make the lattice with make()
function PowerSetLattice(s_elements) {
    //elements contains all the elements of the Lattice with Top and Bottom
    //Bottom is the first element
    //Top is the last element
    this.elements = [];

    //Size contains the size of the Lattice
    this.size = this.elements.length;

    //add a new element
    this.addElement = function(e) {
        if (this.elements.indexOf(e) === -1) this.elements.push(e);
    };

    //return the bottom element
    this.getBottom = function() {
        return [];
    };

    //return the bottom element
    this.getTop = function() {
        return this.elements;
    };


    //get the least upper element of s (a set of elements)
    this.getLeastUpper = function(s) {
        //for PowerSetLattice s is an array of array
        var union = [];
        for (var i = 0; i < s.length; i++) {
            for (var j = 0; j < s[i].length; j++) {
                union.push(s[i][j]);
            };
        };
        return set.toSet(union);
    };

    this.equality = function(e1, e2) {      
        // console.log('equality');
        // console.log(e1);
        // console.log(e2); 
        for (var i = 0; i < e1.length; i++) {
            if (e2.lastIndexOf(e1[i]) === -1) {
                // console.log('false');
                return false;
            };
        };
        for (var i = 0; i < e2.length; i++) {
            if (e1.lastIndexOf(e2[i]) === -1) {
                // console.log('false');
                return false;
            };
        };
        // console.log('true');
        return true;
    }

};

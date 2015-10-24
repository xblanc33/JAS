# JAS

I am trying to build a Static Analysis for JS in JS.

Right now, everything is in beta (early early beta).

To install it, you should firt execute `npm install`.

Then, most of the samples are in the `tests/source` directory. 

To run a sample, you can execute `node tests/SourceTest.js the-file-you-want-to-test.js`.

For instance, `node tests/SourceTest.js anonymousCall.js` will run the Static Analysis with the anonymousCall.js sample.

The SourceTest.js generates a dot graph in the `tests/graph` directory.

To create a corresponding PNG file, I personnaly execute dot. For example `dot -Tpng tests/graph/innerFunction.js.gv -o tests/graph/innerFunction.png` creates the PNG file for the innerFunction.js sample.

If you want to look into the souce code, here is some informations:
* rewriteJS.js translates JS AST into an internal format
* stateBuilder.js creates the nodes of the call graph
* callBuilder.js links the nodes of the call graph (callee and caller)
* State.js is a state
* ScopeMap.js is the map to store values of variables
* functionLattice.js is the lattice I use to create the call graph
* simpleIntegerLattice.js is a simple lattice I use to know if integer variables


Don't hesitate to contact me for any comment, or even if you want to join this project !


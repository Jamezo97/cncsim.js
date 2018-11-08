# CNC Simulator - JS
I began making this to aid my understanding, and it hasn't been touched for almost a year (end of 2017).

It's a simple 3 axis CNC milling machine. It supports drilling commands, tool-offset, arcs, lines, drill sizes, spindle speeds etc

Based on a FAUNC controller, IIRC

It uses a height-field to machine the part; simply a 2D grid of heights. When the tool intersects the part, the height-field is modified and the model is updated.


## How to use
Simply clone / download this repository, and open `index.html` in your browser.
Requires WebGL

## ToDo... One day
 - Remove hard-coded 3D models, generate then dynamically
 - Use proper classes with prototypes
 - Use webpack or similar to transpile es5 classes to more compatible code, in a single file
 - Fix radius offsets
 - Fix Memory issues, seems to lag after a while...
 - Implement pause and resume functionality
 - Improve phone-compatibility? Maybe, not really suited for phones.
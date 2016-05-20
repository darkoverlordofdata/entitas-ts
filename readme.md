# Entitas ECS

### Entitas cli
use entitas cli to generate empty components, extensions & typescript declarations:


    Usage:
    entitas init namespace [-t name]
    entitas create -c name field:type... 
    entitas create -s name interface...
    entitas create -e name 
    entitas create -x class name field:type...
    entitas generate [-p <html5|csharp|fsharp>]
    
    Options:
    -t  [--template]  # template name
    -c  [--component] # create a component
    -s  [--system]    # create a system
    -e  [--entity]    # create an entity
    -x  [--extension] # extend a class
    -p  [--platform]  # target platform for generated code: 
                            html5 - typescript & javascript combination (default)
                            scala & scalaJs
                            kotlin - libGDX compatable
                            csharp ** Unity compatable
                            fsharp ** Unity compatable
                            
    ** = experimental: not finished or fully supported                        

Components classes are generated from json configuration, enforcing data oriented design.

### Install

    git clone git@github.com:darkoverlordofdata/entitas-ts.git
    cd entitas-ts
    npm install . -g


### Generate Doc

    tools/configure
    tools/ts2goog
    npm run jsodc
    
    
### Entitas RunTime
For CSharp, use the original: https://github.com/sschmid/Entitas-CSharp
This repository includes a Typescript implementation

    https://github.com/darkoverlordofdata/entitas-ts
    https://github.com/darkoverlordofdata/entitas-fsharp
    https://github.com/darkoverlordofdata/entitas-kotlin
    https://github.com/darkoverlordofdata/entitas-scala

### Entitas ECS
Entitas ECS

    +------------------+
    |       Pool       |
    |------------------|
    |    e       e     |      +-----------+
    |        e     e---|----> |  Entity   |
    |  e        e      |      |-----------|
    |     e  e       e |      | Component |
    | e            e   |      |           |      +-----------+
    |    e     e       |      | Component-|----> | Component |
    |  e    e     e    |      |           |      |-----------|
    |    e      e    e |      | Component |      |   Data    |
    +------------------+      +-----------+      +-----------+
      |
      |
      |     +-------------+  Groups:
      |     |      e      |  Subsets of entities in the pool
      |     |   e     e   |  for blazing fast querying
      +---> |        +------------+
            |     e  |    |       |
            |  e     | e  |  e    |
            +--------|----+    e  |
                     |     e      |
                     |  e     e   |
                     +------------+

### Live Demos
* https://darkoverlordofdata.com/entitas-ts-example/
    port of https://github.com/sschmid/Entitas-CSharp-Example
* https://darkoverlordofdata.com/entitas-ts-match-one/
    port of https://github.com/sschmid/Match-One
* [Spaceship Warriors](https://darkoverlordofdata.com/entitas-ts/example.html) 
    port of artemis https://github.com/Flet/spaceship-warrior-redux
* [Scala.js Example](https://darkoverlordofdata.com/entitas-scala-js/)
    new experiment...


### Visual Debugging
See https://darkoverlordofdata.com/entitas-ts-example/

Include dat.gui, and entitas-ts will display live stats for entities, pools, and systems.
 * http://code.google.com/p/dat-gui


    
# MIT License

Copyright (c) 2015-2016 Bruce Davidson &lt;darkoverlordofdata@gmail.com&gt;

Copyright (c) 2014 Simon Schmid

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

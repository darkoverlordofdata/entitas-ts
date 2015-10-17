#!/usr/bin/env coffee
###
 * Entitas code generation
 *
 * emulate the partial class strategy for extensions
 * used by Entitas_CSharp
 *
###
fs = require('fs')

module.exports =
#
# create a new component or system
#
# @param  [String]  project namespace
# @return none
#
  run: (namespace) ->

    template = """
{
  "namespace":"#{namespace}",
  "entitas": "web/entitas.d.ts",
  "output": {
    "javascript": "web/src/example/extensions.js",
    "typescript": "example/src/generated.ts",
    "declaration": "example/ext/generated.d.ts"
  },
  "components": {
    "Acceleratable": false,
    "Accelerating": false,
    "Destroy": false,
    "Move": ["speed:number", "maxSpeed:number"],
    "Position": ["x:number","y:number","z:number"],
    "FinishLine": false,
    "Resource": ["name:string"],
    "View": ["sprite:Object"]
  },
  "systems": {
    "Accelerate":false,
    "Destroy":false,
    "Input":true,
    "Move":true,
    "ReachedFinish":false,
    "RenderPosition":false,
    "AddView":false,
    "RemoveView":false,
    "CreatePlayerSystem": false,
    "CreateOpponentsSystem": false,
    "CreateFinishLineSystem": false
  },
  "entities": {
    "Accelerating": true,
    "FinishLine": true
  }
}
"""
    fs.writeFileSync("#{process.cwd()}/entitas.json", template)

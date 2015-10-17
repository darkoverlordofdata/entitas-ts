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
  "src": "lib/src",
  "output": {
    "javascript": "extensions.js",
    "typescript": "generated.ts",
    "declaration": "generated.d.ts"
  },
  "components": {
  },
  "systems": {
  },
  "entities": {
  }
}
"""
    fs.writeFileSync("#{process.cwd()}/entitas.json", template)

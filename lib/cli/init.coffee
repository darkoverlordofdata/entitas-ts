#!/usr/bin/env coffee
###
 * Entitas code generation
 *
 * emulate the partial class strategy for extensions
 * used by Entitas_CSharp
 *
###
fs = require('fs')
path = require('path')
liquid = require('liquid.coffee')
mkdirp = require('mkdirp')

module.exports =
#
# create a new component or system
#
# @param  [String]  project namespace
# @param  [String]  flag -t/--template
# @param  [String]  type
# @return none
#
  run: (namespace, flag, type) ->

    flag = flag || '-t'
    type = type || 'default'

    content = """
{
  "namespace":"#{namespace}",
  "src": "lib/src",
  "output": {
    "javascript": "web/src/#{namespace}/generatedExtensions.js",
    "typescript": "lib/src/generatedComponents.ts",
    "declaration": "lib/ext/#{namespace}.d.ts"
  },
  "alloc": 100,
  "components": {
  },
  "systems": {
  },
  "entities": {
  }
}
"""
    if type is 'none'
      fs.writeFileSync("#{process.cwd()}/entitas.json", content)
      return

    # source template folder
    tf = "#{__dirname}/tpl/#{type}"

    # generate entitas.json from Liquid template
    tpl = liquid.Template.parse(fs.readFileSync("#{tf}/entitas.json", 'utf8'))
    content = tpl.render(namespace:namespace)
    config = JSON.parse(content)
    fs.writeFileSync("#{process.cwd()}/entitas.json", content)
    console.log "#{type}:config #{process.cwd()}/entitas.json"

    # ensure that the project has a tsconfig
    if not fs.existsSync("#{process.cwd()}/tsconfig.json")
      tpl = liquid.Template.parse(fs.readFileSync("#{tf}/tsconfig.json", 'utf8'))
      tsconfig = JSON.parse(tpl.render(namespace:namespace))
      tsconfig.files = []
      fs.writeFileSync("#{process.cwd()}/tsconfig.json", JSON.stringify(tsconfig, null, 2))



    # generate list of source files from Liquid templates
    cfg = JSON.parse(fs.readFileSync("#{tf}/tsconfig.json", 'utf8'))
    for file in cfg.files
      tpl = liquid.Template.parse(fs.readFileSync("#{tf}/#{file}", 'utf8'))
      content = tpl.render(namespace:namespace)
      folder = path.dirname(file)
      base = path.basename(file, '.tpl')
      mkdirp.sync "#{process.cwd()}/#{config.src}/#{folder}"
      fs.writeFileSync("#{process.cwd()}/#{config.src}/#{folder}/#{base}", content)
      console.log "#{type}:source #{process.cwd()}/#{config.src}/#{folder}/#{base}"

      # update the project
      tsconfig = JSON.parse(fs.readFileSync("#{process.cwd()}/tsconfig.json", 'utf8'))
      if tsconfig.files.indexOf("#{config.src}/#{folder}/#{base}") is -1
        tsconfig.files.push "#{config.src}/#{folder}/#{base}"
        fs.writeFileSync("#{process.cwd()}/tsconfig.json", JSON.stringify(tsconfig, null, 2))





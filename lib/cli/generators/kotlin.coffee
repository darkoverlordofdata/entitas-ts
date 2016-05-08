#!/usr/bin/env coffee
###
 * Entitas code generation
 *
 * Generate Kotlin stubs for
 * use with libGDX
 *
 * Demo: 
 * https://github.com/darkoverlordofdata/Bosco.ECS
 * https://github.com/darkoverlordofdata/shmupwarz-unity
 *
###
fs = require('fs')
path = require('path')
mkdirp = require('mkdirp')
config = require("#{process.cwd()}/entitas.json")
location = "#{config.src}/#{config.namespace.replace(/\./g,'/')}/"
liquid = require('liquid.coffee')

getType = (arg) ->
  switch arg
    when 'Int'      then 'Int'
    when 'Float'    then 'Float'
    when 'String'   then 'String'
    when 'Boolean'  then 'Boolean'
    else arg+'?'

getDefault = (arg) ->
  switch arg
    when 'Int'      then '0'
    when 'Float'    then '0f'
    when 'String'   then '""'
    when 'Boolean'  then 'false'
    else 'null'
    

params = (args) ->
  s = []
  for arg in args
    name = arg.split(':')[0]
    type = getType(arg.split(':')[1]).replace('?', '')
    s.push "#{name}:#{type}"
    
  s.join(', ') 

filename = (name) ->
    if config.output? then if config.output[name]? then config.output[name] else "#{name}.kt" 

module.exports =
#
# generate GeneratedComponents.kt from Liquid template
#
# @return none
#
  run: (flags...) ->


    
    # define some custom filters
    liquid.Template.registerFilter class
        @defaultValue: (field) -> getDefault getType(field.split(':')[1]).replace('?', '')
        @camel: (str) -> str.charAt(0).toLowerCase() + str.substr(1)
        @property: (str) -> str.split(':')[0]
        @params: params
    
    # generate the template
    tpl = liquid.Template.parse(fs.readFileSync("#{__dirname}/kotlin.tpl", 'utf8'))
    kotlin = tpl.render(config).replace(/\n\n/g, '\n') # strip out empty lines
    
    # Components - overwrite
    fs.writeFileSync(path.join(process.cwd(), location, filename("generated")), kotlin)
    


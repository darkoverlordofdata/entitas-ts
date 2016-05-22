#!/usr/bin/env coffee
###
 * Entitas code generation
 *
 * Generate Entitas Stubs
 *
 *
###
fs = require('fs')
path = require('path')
mkdirp = require('mkdirp')
config = require("#{process.cwd()}/entitas.json")
location = "#{config.src}/#{config.namespace.replace(/\./g,'/')}/"
sysloc = if config.output.systems? then config.output.systems else "systems"
liquid = require('liquid.coffee')

getType = (arg) ->
  switch arg
    when 'Int'      then 'Int'
    when 'Float'    then 'Float'
    when 'String'   then 'String'
    when 'Boolean'  then 'Boolean'
    else arg

getDefault = (arg) ->
  switch arg
    when 'Int'      then '0'
    when 'Float'    then '0f'
    when 'String'   then '""'
    when 'Boolean'  then 'false'
    when 'int'      then '0'
    when 'float32'  then '0.0f'
    when 'boolean'  then 'false'
    when 'string'   then '""'
    
    else 'null'
    

params = (args) ->
  s = []
  for arg in args
    name = arg.split(':')[0]
    type = getType(arg.split(':')[1]).replace('?', '') 
    s.push "#{name}:#{type}"
    
  s.join(', ') 

paramsonly = (args) ->
  s = []
  for arg in args
    name = arg.split(':')[0]
    s.push "#{name}"
    
  s.join(', ') 

filename = (name) ->
    if config.output? then if config.output[name]? then config.output[name] else "#{name}.#{lang}" 
    
merge = (config, options) ->
  result = {}
  result[key] = value for key, value of config
  result[key] = value for key, value of options
  result
  

module.exports =
#
# generate code using Liquid template
#
# @return none
#
  run: (lang, flags...) ->

    # define some custom filters
    liquid.Template.registerFilter class
        @defaultValue: (field) -> getDefault getType(field.split(':')[1]).replace('?', '')
        @camel: (str) -> str.charAt(0).toLowerCase() + str.substr(1)
        @property: (str) -> str.split(':')[0]
        @params: params
        @paramsonly: paramsonly
    
    # generate the template
    tpl = liquid.Template.parse(fs.readFileSync("#{__dirname}/lang/#{lang}.components.tpl", 'utf8'))
    code = tpl.render(config)
    
    # Components - overwrite
    fs.writeFileSync(path.join(process.cwd(), location, filename("generated")), code)
    
    
    # systems
    tpl = liquid.Template.parse(fs.readFileSync("#{__dirname}/lang/#{lang}.systems.tpl", 'utf8'))
    for Name, interfaces of config.systems
      name = path.join(process.cwd(), location, "#{sysloc}/#{Name}.#{lang}")
      unless fs.existsSync(name)
        code = tpl.render(merge(config, name:Name, interfaces:interfaces))
        fs.writeFileSync(name, code) 



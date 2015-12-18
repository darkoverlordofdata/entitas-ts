#!/usr/bin/env coffee
###
 * Entitas code generation
 *
 * Generate FSharp stubs for
 * use by ecs-fsharp in Unity
 *
###
fs = require('fs')
path = require('path')
mkdirp = require('mkdirp')
config = require("#{process.cwd()}/entitas.json")

getType = (arg) ->
  switch arg
    when 'number'   then 'float'
    when 'string'   then 'string'
    when 'boolean'  then 'bool'
    when 'any'      then 'Object'
    else arg

getDefault = (arg) ->
  switch arg
    when 'boolean'  then 'false'
    when 'string'   then '""'
    when 'number'   then '0f'
    when 'any'      then 'null'
    else arg
    

params = (args) ->
  sb = []
  for arg in args
    name = arg.split(':')[0]
    type = getType(arg.split(':')[1])
    sb.push "#{type} #{name}"
    
  if sb.length then ', ' + sb.join(', ') else ''
  

module.exports =
#
# generate entity extensions
#
# @return none
#
  run: (flags...) ->

    sb = []
    sb.push "open Entitas"
    sb.push "open System"
    sb.push "open System.Collections.Generic"
    sb.push "open Microsoft.FSharp.Reflection"
    
    sb.push ""
    sb.push "type ComponentIds = "
    for Name, properties of config.components
      name = Name[0].toLowerCase()+Name[1...]
      sb.push "  | #{Name}Component of #{Name}Component"    
    sb.push ""
    sb.push "let Components = FSharpType.GetUnionCases typeof<ComponentIds>"   
    sb.push ""
  
    for Name, properties of config.components
      name = Name[0].toLowerCase()+Name[1...]
      sb.push ""
      sb.push "type #{Name}Component() ="
      sb.push "    inherit Component()"
      if properties is false 
        sb.push "    member val active = false with get, set"
      else
        for p in properties
          name = p.split(':')[0]
          value = getDefault(p.split(':')[1])
          sb.push "    member val #{name} = #{value} with get, set"
      
    for Name, interfaces of config.systems
      name = Name[0].toLowerCase()+Name[1...]
      sb.push ""
      sb.push "type #{Name}(world) ="
      
      found = false
      for iface in interfaces

        if 'IExecuteSystem' is iface
          sb.push "    interface IExecuteSystem with"
          sb.push "        member this.Execute() ="
          sb.push "            ()"
          found = true
          
        if 'IInitializeSystem' is iface
          sb.push "    interface IInitializeSystem with"
          sb.push "        member this.Initialize() ="
          sb.push "            ()"
          found = true

      sb.push "    ()" unless found 
               
          
    console.log sb.join('\n')          
    
    
    # mkdirp.sync path.join(process.cwd(), 'build/')
    # fs.writeFileSync(path.join(process.cwd(), "build/#{Name}.fs"), sb.join('\n'))

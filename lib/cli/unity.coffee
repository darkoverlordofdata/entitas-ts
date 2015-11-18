#!/usr/bin/env coffee
###
 * Entitas code generation
 *
 * Generate CSharp stubs for
 * use by Entitas_CSharp
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

  
    for Name, properties of config.components
      name = Name[0].toLowerCase()+Name[1...]
      sb = []
      sb.push "using Entitas;"
      sb.push ""
      if config.entities[Name]?
        sb.push "[Core, SingleEntity]"
      else
        sb.push "[Core]"
      sb.push "public class #{Name}Component : IComponent {"
      for p in properties
        name = p.split(':')[0]
        type = getType(p.split(':')[1])
        sb.push "    public #{type} #{name};"
      sb.push "}"
      
      mkdirp.sync path.join(process.cwd(), 'build/Sources/Features')
      fs.writeFileSync(path.join(process.cwd(), "build/Sources/Features/#{Name}Components.cs"), sb.join('\n'))
      
    
    for Name, interfaces of config.systems
      name = Name[0].toLowerCase()+Name[1...]
      sb = []
      sb.push "using Entitas;"
      sb.push "using System.Collections.Generic;"
      sb.push "public class #{Name} : #{interfaces.join(', ')} {"
      sb.push ""
      
      if interfaces.indexOf('IReactiveSystem') isnt -1
        sb.push "    public TriggerOnEvent trigger { get { return Matcher.Component.OnEntityAddedOrRemoved(); } }"
        sb.push ""

      if interfaces.indexOf('IMultiReactiveSystem') isnt -1
        sb.push "    public TriggerOnEvent[] triggers { get { return new [] { }; } }"
        sb.push ""

      if interfaces.indexOf('IEnsureComponents') isnt -1
        sb.push "    public IMatcher ensureComponents { get { return Matcher.Components; } }"
        sb.push ""
            
      if interfaces.indexOf('IExcludeComponents') isnt -1
        sb.push "    public IMatcher excludeComponents { get { return Matcher.Components; } }"
        sb.push ""

      if interfaces.indexOf('IClearReactiveSystem') isnt -1
        sb.push "    public bool clearAfterExecute() { get { return true;} }"
        sb.push ""
        
      if interfaces.indexOf('ISetPool') isnt -1
        sb.push "    Pool _pool;"
        sb.push "    Group _group;"
        sb.push ""
        sb.push "    public void SetPool(Pool pool) {"
        sb.push "        _pool = pool;"
        sb.push "        _group = pool.GetGroup(Matcher.AllOf(Matcher.Component));"
        sb.push "    }"
        sb.push ""
        
      if interfaces.indexOf('IMultiReactiveSystem') isnt -1
        sb.push "    public void Execute(List<Entity> entities) {"
        sb.push "        foreach (var e in entities) {"
        sb.push "        }"
        sb.push "    }"
        sb.push ""

      if interfaces.indexOf('IReactiveSystem') isnt -1
        sb.push "    public void Execute(List<Entity> entities) {"
        sb.push "        foreach (var e in entities) {"
        sb.push "        }"
        sb.push "    }"
        sb.push ""
      
      if interfaces.indexOf('IExecuteSystem') isnt -1
        sb.push "    public void Execute() {"
        if 'ISetPool' in interfaces
          sb.push "        foreach (var e in _group.GetEntities()) {"
          sb.push "        }"
        sb.push "    }"
        sb.push ""
      
      
      if interfaces.indexOf('IInitializeSystem') isnt -1
        sb.push "    public void Initialize() {"
        sb.push "    }"
        sb.push ""
      
      
      sb.push "}"
      
      mkdirp.sync path.join(process.cwd(), 'build/Sources/Features')
      fs.writeFileSync(path.join(process.cwd(), "build/Sources/Features/#{Name}.cs"), sb.join('\n'))


    for Name, klass of config.extensions
      name = Name[0].toLowerCase()+Name[1...]
      sb = []
      sb.push "using Entitas;"
      sb.push "using UnityEngine;"
      sb.push ""
      sb.push "public static class #{Name}Extensions {"

      for method, args of klass
        [method, type] = method.split(':')
        Method = method[0].toUpperCase()+method[1...]
        sb.push "    public static #{type} #{Method}(this #{Name} #{name}#{params(args)}){"
        sb.push "        return null;"
        sb.push "    }"


      sb.push "}"
      mkdirp.sync path.join(process.cwd(), 'build/Sources/Extensions')
      fs.writeFileSync(path.join(process.cwd(), "build/Sources/Extensions/#{Name}Extensions.cs"), sb.join('\n'))

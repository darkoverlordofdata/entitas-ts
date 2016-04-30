#!/usr/bin/env coffee
###
 * Entitas code generation
 *
 * emulate the partial class strategy for extensions
 * used by Entitas_CSharp
 *
###
fs = require('fs')
mkdirp = require('mkdirp')
config = require("#{process.cwd()}/entitas.json")

module.exports =
#
# create a new entity, component or system
#
# @param  [String]  type to create
# @param  [Array<String>]  remaining arguments
# @return none
#
  run: (type, name, args...) ->

    switch type
      when '-e' or '--entity'
        create.entity(name, args...)

      when '-c' or '--component'
        create.component(name, args...)

      when '-s' or '--system'
        create.system(name, args...)

      when '-x' or '--extension'
        create.extension(name, args...)


  
###
 *
 * Create E/C/S
 *
###
create =
  entity:(name) ->
    config.entities[name] = true
    fs.writeFileSync("#{process.cwd()}/entitas.json", JSON.stringify(config, null, 2))

  component:(name, args...) ->
    args = if args.length is 0 then false else args
    config.components[name] = args
    fs.writeFileSync("#{process.cwd()}/entitas.json", JSON.stringify(config, null, 2))

  system:(name, args...) ->
    config.systems[name] = args
    console.log config.systems[name]
    fs.writeFileSync("#{process.cwd()}/entitas.json", JSON.stringify(config, null, 2))
    
    # - moved to generate
    # template = systemTemplate(name, args)
    # mkdirp.sync "#{process.cwd()}/#{config.src}/systems"
    # fs.writeFileSync("#{process.cwd()}/#{config.src}/systems/#{name}.ts", template)

    # # update the project
    # tsconfig = JSON.parse(fs.readFileSync("#{process.cwd()}/tsconfig.json", 'utf8'))
    # if tsconfig.files.indexOf("#{config.src}/systems/#{name}.ts") is -1
    #   tsconfig.files.push "#{config.src}/systems/#{name}.ts"
    #   fs.writeFileSync("#{process.cwd()}/tsconfig.json", JSON.stringify(tsconfig, null, 2))

  extension:(name, method, args...) ->
    config.extensions = config.extensions || {}
    config.extensions[name] = config.extensions[name] || {}
    config.extensions[name][method] = args
    fs.writeFileSync("#{process.cwd()}/entitas.json", JSON.stringify(config, null, 2))



# deprecated - moved to generate
systemTemplate = (name, interfaces) ->
  sb = [] # StringBuilder

  sb.push "module #{config.namespace} {"
  sb.push ""
  sb.push "  import Pool = entitas.Pool;"
  sb.push "  import Group = entitas.Group;"
  sb.push "  import Entity = entitas.Entity;"
  sb.push "  import Matcher = entitas.Matcher;"
  sb.push "  import Exception = entitas.Exception;"
  sb.push "  import TriggerOnEvent = entitas.TriggerOnEvent;"
  for iface in interfaces
    sb.push "  import #{iface} = entitas.#{iface};"
  sb.push ""
  sb.push "  export class #{name} implements #{interfaces.join(', ')} {"

  sb.push ""
  for iface in interfaces
    switch iface
      when 'ISetPool'
        sb.push "    protected pool:Pool;"
        sb.push "    protected group:Group;"

  sb.push ""
  for iface in interfaces
    switch iface
      when 'IMultiReactiveSystem'
        sb.push "    public get triggers():TriggerOnEvent[] {"
        sb.push "    }"
        sb.push "    "
        sb.push "    public execute(entities:Array<Entity>) {"
        sb.push "      for (var i = 0, l = entities.length; i < l; i++) {"
        sb.push "        var e = entities[i];"
        sb.push "      }"
        sb.push "    }"
        sb.push "    "

      when 'IReactiveSystem'
        sb.push "    public get trigger():TriggerOnEvent {"
        sb.push "      return null;"
        sb.push "    }"
        sb.push "    "
        sb.push "    public execute(entities:Array<Entity>) {"
        sb.push "      for (var i = 0, l = entities.length; i < l; i++) {"
        sb.push "        var e = entities[i];"
        sb.push "      }"
        sb.push "    }"
        sb.push "    "

      when 'IExecuteSystem'
        sb.push "    public execute() {"
        if 'ISetPool' in interfaces
          sb.push "      var entities = this.group.getEntities();"
          sb.push "      for (var i = 0, l = entities.length; i < l; i++) {"
          sb.push "        var e = entities[i];"
          sb.push "      }"
        sb.push "    }"
        sb.push "    "

      when 'IInitializeSystem'
        sb.push "    public initialize() {"
        sb.push "    }"
        sb.push "    "

      when 'IEnsureComponents'
        sb.push "    public get ensureComponents():IMatcher {"
        sb.push "    }"
        sb.push "    "

      when 'IExcludeComponents'
        sb.push "    public get excludeComponents():IMatcher {"
        sb.push "    }"
        sb.push "    "

      when 'IClearReactiveSystem'
        sb.push "    public get clearAfterExecute():boolean {"
        sb.push "    }"
        sb.push "    "

      when 'ISetPool'
        sb.push "    public setPool(pool:Pool) {"
        sb.push "      this.pool = pool;"
        sb.push "      this.group = pool.getGroup(Matcher.allOf());"
        sb.push "    }"
        sb.push "    "

  sb.push ""
  sb.push ""
  sb.push "  }"
  sb.push "}"
  sb.join('\n')



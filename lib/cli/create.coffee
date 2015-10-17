#!/usr/bin/env coffee
###
 * Entitas code generation
 *
 * emulate the partial class strategy for extensions
 * used by Entitas_CSharp
 *
###
fs = require('fs')
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
    config.components[name] = args
    fs.writeFileSync("#{process.cwd()}/entitas.json", JSON.stringify(config, null, 2))

  system:(name, args...) ->
    path = args.shift()
    config.systems[name] = true
    fs.writeFileSync("#{process.cwd()}/entitas.json", JSON.stringify(config, null, 2))
    template = systemTemplate(name, args)
    fs.writeFileSync("#{process.cwd()}/#{path}/#{name}.ts", template)


systemTemplate = (name, interfaces) ->
    """
module #{config.namespace} {

  import Pool = entitas.Pool;
  import Group = entitas.Group;
  import Entity = entitas.Entity;
  import Matcher = entitas.Matcher;
  import ISetPool = entitas.ISetPool;
  import Exception = entitas.Exception;
  import CoreMatcher = entitas.CoreMatcher;
  import TriggerOnEvent = entitas.TriggerOnEvent;
  import IReactiveSystem = entitas.IReactiveSystem;

  export class #{name} implements #{interfaces.join(', ')} {

    public get trigger():TriggerOnEvent {
    }

    public setPool(pool:Pool) {
    }

    public execute(entities:Array<entitas.Entity>) {
      if (entities.length !== 1) {
        throw new Exception("Expected exactly one entity but found " + entities.length);
      }
      for (var i=0, l=entities.length; i<l; i++) {
        var e:Entity = <Entity>entities[i];
      }
    }
  }

}
"""


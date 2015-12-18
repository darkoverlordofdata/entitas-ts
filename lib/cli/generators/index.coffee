#+--------------------------------------------------------------------+
#| entitas.coffee
#+--------------------------------------------------------------------+
#| Copyright DarkOverlordOfData (c) 2015
#+--------------------------------------------------------------------+
#|
#| This file is a part of Entitas
#|
#| Entitas is free software; you can copy, modify, and distribute
#| it under the terms of the MIT License
#|
#+--------------------------------------------------------------------+
#
# entitas command dispatch
#

Object.defineProperties module.exports,

  html5:  # initialize the entitas ecs project
    get: ->
      require('./html5.coffee').run

  csharp: # generate entity extensions
    get: ->
      require('./csharp.coffee').run

  fsharp: # create entity/component/system
    get: ->
      require('./fsharp.coffee').run
      

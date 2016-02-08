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
# languages supported:
#
#   html5 - this is the default. Generates a combination of typescript
#           and javascript
#   csharp - WIP just generates components and systems from json. Then use Entitas-CSharp
#           to finish generating helper code in unity. Used once to migrate Shmup Warz from
#           web to unity
#   fsharp - generates fsharp code for Bosco.ECS, which is entitas based. 
#   vala - generates vala code for Bosco.ECS, which is entitas based. 
#
#

module.exports =
  run: (flag, lang, args...) ->

    if flag is '-p' or flag is '--platform'
      require("../cli/generators/#{lang}.coffee").run args...

    else
      require("../cli/generators/html5.coffee").run args...
    
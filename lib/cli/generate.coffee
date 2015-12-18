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
#   fsharp - WIP generates fsharp code for ecs-fsharp, which is entitas based. 
#   nemerle - someday...a lot of possiblity. nemerle replaces roslyn as code generator
#   funscript - maybe...if it works, might be one code base for both web & unity! 
#
#
generate = require("./generate")

module.exports =
  run: (flag, lang, args...) ->

    if flag is '-p' or flag is '--platform'
      require("./generate/#{lang}.coffee").run args...

    else
      require("./generate/html5.coffee").run args...
    
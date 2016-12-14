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
#   html5   - this is the default. Generates a combination of typescript
#           and javascript
#   csharp  - just generate components. Use the Entitas-CSharp runtime to generate the rest
#   kotlin
#   scala
#   fsharp
#   gs 
#   vala
#
#

module.exports =
  run: (flag, lang, args...) ->

    if flag is '-p' or flag is '--platform'
      switch lang 
        # when 'csharp' then require("../cli/generators/csharp.coffee").run args... 
        # when 'vala' then require("../cli/generators/vala.coffee").run args... 
        when 'nim' then require("../cli/generators/nim.coffee").run args... 
        else require("../cli/generators/platform.coffee").run lang, args...

    else
      require("../cli/generators/html5.coffee").run args...
    
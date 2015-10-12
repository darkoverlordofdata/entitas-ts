###
#+--------------------------------------------------------------------+
#| Cakefile
#+--------------------------------------------------------------------+
#| Copyright DarkOverlordOfData (c) 2014-2015
#+--------------------------------------------------------------------+
#|
#| workflow
#|
#| workflow is free software; you can copy, modify, and distribute
#| it under the terms of the MIT License
#|
#+--------------------------------------------------------------------+
#
# | -- .settings              for vscode
# |     | -- launch.json      F5 to run
# |     | -- settings.json    ide preferences
# |     + -- tasks.json       npm script runner
# | -- bin                    public tools
# | -- build                  compiled output
# | -- example                example using the lib
# | -- lib                    sources for this project - library or application
# | -- node_modules           npm dependencies
# | -- packages               local repository
# | -- test                   unit tests
# | -- tools                  private tools
# |     | -- compiler.jar     closure compiler
# |     | -- convert.coffee   coffee2closure script
# |     | -- diff.coffee      diff_match_patch script
# |     + -- server.js        for F5 in vscode
# | -- web                    application root. For library, this uses example
# |     | -- index.html       default web page
# |     | -- main.js*         cocos2d default script
# |     | -- project.json*    cocos2d manifest
# |     | -- frameworks*      cocos2d lib
# |     | -- res              resources
# |     + -- src              transpiler target, respository pre-builts
# |           | -- {lib}
# |           | -- example
# |           + -- ...
# | -- .bowerrc               defines ./packages repository
# | -- travis.yaml*           ci template
# | -- bower.json             module name, packages
# | -- Cakefile               misc tasks
# | -- changes.md             change log
# | -- conf.json*             jsdoc configuration
# | -- csconfig.json*         coffeescript source file list
# | -- gulpfile.js            npm script runner for webstorm ide
# | -- index.js               require entry point
# | -- jsconfig.json          javascript source file list
# | -- LF                     insert \n between source files with cat
# | -- license.md             take your pick - MIT/GPL3 
# | -- package.json           node project info
# + -- tsconfig.json*         typescript project file
#
###


###
 * config
 *
 * inject scripts into package.json 
 * 
###
task 'config', 'generate package.json:scripts', (options) ->
  project = require('./package.json')
  scripts = require('./package.scripts')
  
  for name, script of scripts(project, options)
    
    if Array.isArray(script)
      script = script.join(' & ')
    project.scripts[name] = (script || '').split('\n').join(' && ')
  
  require('fs').writeFileSync('./package.json', JSON.stringify(project, null, '  '), 'utf8')

###
 * cocos
 *
 * run cocos to build android apk
###
task 'cocos', 'run the cocos2d generator', (options) ->

  require('child_process').exec """
    cd web && cocos compile -p android --ndk-mode debug --android-studio
  """, (err, out) ->
    throw err if err
    console.log out
  

###
 * get patch
 *
 * get dependencies
###
task 'get', 'get dependencies from bower repository', (options) ->

  #patch "web/src/jmatch3/jmatch3.js", "tools/patch/jmatch3.js.patch"
  #patch "web/src/tween.ts/tween.min.js", "tools/patch/tween.min.js.patch"

###
 * Patch
 *
 * @see https://code.google.com/p/google-diff-match-patch/
 *
 * @param {string} source filename
 * @param {string} changes patch filename
###
patch = (source, changes) ->
  DiffMatchPatch = require('./tools/diff_match_patch/javascript/diff_match_patch_uncompressed.js').diff_match_patch
  dmp = new DiffMatchPatch()

  orig = fs.readFileSync(source, 'utf8')
  delta = fs.readFileSync(changes, 'utf8')
  results = dmp.patch_apply(dmp.patch_fromText(delta), orig)
  fs.writeFileSync(source, results[0])


###
 * version bump
 *
 * bump the version number
 * write the version source file
 *
 * cake -v patch version
 * cake -v minor version
 * cale -v major version
###
task 'version', 'bump the version', (options) ->

  options.version ?= 'patch'

  project = require('./package.json')
  ###
   *
   * Q but doesn't npm already do thsi?
   * A if fails from the ide because I track my workspace in git
  ###
  project.version = require('semver').inc(project.version, options.version)
  fs.writeFileSync('./package.json', JSON.stringify(project, null, '    '))

  liquid = require('liquid.coffee')
  tpl = fs.readFileSync('./lib/src/build.ts.tpl', 'utf8')
  fs.writeFileSync('./lib/src/build.ts', liquid.Template.parse(tpl).render(VERSION: project.version))


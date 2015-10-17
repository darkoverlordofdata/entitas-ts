###
#+--------------------------------------------------------------------+
#| package.scripts.coffee
#+--------------------------------------------------------------------+
#| Copyright DarkOverlordOfData (c) 2014-2015
#+--------------------------------------------------------------------+
#|
#| Generate package.script
#|
#| ash.coffee is free software; you can copy, modify, and distribute
#| it under the terms of the MIT License
#|
#+--------------------------------------------------------------------+
###
fs = require('fs')

# projectTypes enum:
JavaScript      = 0   # javascript
TypeScript      = 1   # typescript
CoffeeScript    = 2   # coffeescript
BabelScript     = 4   # es6
ClosureCompiler = 8   # plovr

# paths:
LIB_NAME        = require('./package.json').name
PLOVR           = "tools/plovr.jar"
COMPILER_JAR    = "packages/closure-compiler/lib/vendor/compiler.jar"
LIB_ASH         = "packages/ash.coffee/goog/lib"
LIB_ASTEROIDS   = "goog/asteroids"
CLOSURE_HOME    = "packages/google-closure-library"
CLOSURE_BIN     = "#{CLOSURE_HOME}/closure/bin/build"
GOOG_BASE       = "../../../.."
ANDROID_ASSETS  = "./web/frameworks/runtime-src/proj.android-studio/app/assets"
CSCONFIG        = "./csconfig.json"
JSCONFIG        = "./jsconfig.json"
TSCONFIG        = "./tsconfig.json"

###
# Generate package.script
###
module.exports = (project, options = {}) ->

  # get project config
  csconfig = if fs.existsSync(CSCONFIG) then require(CSCONFIG) else files: []
  jsconfig = if fs.existsSync(JSCONFIG) then require(JSCONFIG) else files: []
  tsconfig = if fs.existsSync(TSCONFIG) then require(TSCONFIG) else files: []
  projectType = if tsconfig.files.length>0 then TypeScript else if csconfig.files.length>0 then CoffeeScript else JavaScript
  isClosure = fs.existsSync('./config.js')
  isCocos2d = fs.existsSync('./web/project.json')

  ### VS Code ctrl-shift-b ###
  _vscode_build: do ->
    switch projectType
      when TypeScript then "tsc --watch"
      when CoffeeScript then "coffee -o web/src/#{LIB_NAME} -cm lib "
      # when CoffeeScript then "coffee -o web/src/#{LIB_NAME} -wcm lib "

  ### Build the android asset folder ###
  android: do ->
    options.compile ?= 'WHITESPACE_ONLY'
    
    step = []

    if isCocos2d
      files = getCocos2dFiles(false).join(' LF ')
      step.push """
        cp -f lib/src/cclib-rt.js web/src/#{LIB_NAME}/cclib-rt.js
        cp -f web/main.js #{ANDROID_ASSETS}/main.js
        cp -f web/project_android.json #{ANDROID_ASSETS}/project.json
      """

      if options.compile?
        step.push """
          cat #{files} | java -jar #{COMPILER_JAR} \
            --warning_level=QUIET \
            --compilation_level #{options.compile} \
            --js_output_file #{ANDROID_ASSETS}#{LIB_NAME}.js
        """
      else
        step.push """
          cp -fr web/src #{ANDROID_ASSETS}/src
        """

    return step

  ### build the project ###
  build: do ->
    options.compile ?= 'ADVANCED_OPTIMIZATIONS'
    
    step = [].concat(project.config.build)
      
    if isCocos2d
      ###
      # Use cocos2d project.json to build the target
      ###
      files = getCocos2dFiles(true).join(' LF ')
      if options.compile?
        step.push """
          cat #{files} | java -jar #{COMPILER_JAR} \
            --jscomp_error=checkTypes \
            --warning_level=QUIET \
            --compilation_level #{options.compile} \
            --js_output_file build/web/main.js
        """
      else
        step.push """
          cp -fr web/src build/web/src
          mkdir build/web/frameworks
          cp -fr web/frameworks/cocos2d-html5 build/web/frameworks/cocos2d-html5
        """
    
    else if projectType is CoffeeScript
      ###
      # Build after recompiling all coffeescript together
      ###
      files = require(CSCONFIG).files.join(" LF ")
      step.push """
        cat #{files} | coffee -cs > build/#{LIB_NAME}.js 
        cat #{files} | coffee -cs | \
          java -jar #{COMPILER_JAR} \
            --compilation_level #{options.compile} \
            --js_output_file build/#{LIB_NAME}.min.js
      """
      
    else
      ###
      # Build directly from the raw transpiled javascript
      ###
      files = require(JSCONFIG).files.join(" LF ")
      step.push """
        cat #{files} > build/#{LIB_NAME}.js 
        cat #{files} | \
          java -jar #{COMPILER_JAR} \
            --compilation_level #{options.compile} \
            --js_output_file build/#{LIB_NAME}.min.js
      """
        
    return step
      
  ### delete the prior build items ###
  clean: """
    rm -rf build/*
    mkdir -p build
    mkdir -p build/web
    mkdir -p build/lib
  """

  ### closure build ###
  closure: """
    npm run transpile
    tools/convert
    java -jar #{PLOVR} build config.js
  """
  
  ### copy the output to downstream project ###
  deploy: """
    cp -rf web/res #{ANDROID_ASSETS}
    cp -rf web/src #{ANDROID_ASSETS}
    cp -f web/main.js #{ANDROID_ASSETS}
    cp -f web/project.json #{ANDROID_ASSETS}
  """

  ### collect dependencies for closure compiler ###
  depswriter: """
    python #{CLOSURE_BIN}/depswriter.py \
      --root_with_prefix='#{LIB_ASH} #{GOOG_BASE}/#{LIB_ASH}' \
      --root_with_prefix='#{LIB_ASTEROIDS} #{GOOG_BASE}/#{LIB_ASTEROIDS}' \
      --root_with_prefix='web #{GOOG_BASE}/web' \
      > web/#{LIB_NAME}.dep.js
  """

  ### process bower dependencies ###
  get: """
    bower-installer
    cake get
  """

  ### publish gh-pages ###
  publish: """
    gulp publish
  """

  ###  create documentation ###
  jsdoc: """
    jsdoc goog/lib -r \
      --template ../jaguarjs-jsdoc \
      --configure ./conf.json \
      --readme ./readme.md \
      --destination ./build/web
  """

  ### create appcache manifest for build ###
  manifest: """
    gulp manifest
  """

  ### update the cocos2d project file? ###
  postbuild: do ->
    if isCocos2d
      return "cp -f web/project_build.json build/web/project.json"
    else
      return ""

  postclosure: """
    cp -f web/asteroids.min.js build/web
  """
    
  ### prepare for android build ###
  preandroid: """
    npm run predeploy
    npm run transpile
    npm run resources
    cp -fr web/res #{ANDROID_ASSETS}
  """

  ### prepare for build ###
  prebuild: """
    bower install
    npm run get
    npm run clean -s
  """

  ### remove prior deployment ###
  predeploy: """
    rm -rf #{ANDROID_ASSETS}/res
    rm -rf #{ANDROID_ASSETS}/src
    rm -f #{ANDROID_ASSETS}/main.js
    rm -f #{ANDROID_ASSETS}/project.json
  """

  ### copy the resources ###
  resources: do ->
    if project.config.resources?
      return [].concat(project.config.resources)
    else 
      return ''

  ### run the dev version of the app ###
  start: """
    tools/server web
  """

  ### run the build version of the app ###
  serve: """
    tools/server build/web
  """

  ### run the unit tests ###
  test: """
    NODE_ENV=test mocha \
      --compilers coffee:coffee-script \
      --require test/test_helper.js \
      --recursive
  """

  ### generate javascript ###
  transpile: do ->
    switch projectType
      when TypeScript 
        step = "tsc"
        return step
      when CoffeeScript 
        step = []
        step.push "coffee -o web/src/#{LIB_NAME} -cm lib"
        step.push "coffee -o web/src/example -cm example" if fs.existsSync('./example')
        return step
        


###
 *
 * Get Cocos2d Files
 *
 * get list of source files for cocos2d projects
 *
 * @param {boolean} standalone - include cocos2d libraries + main
 * @return {Array<string>} list of file names
###
getCocos2dFiles = (standalone=false) ->

  return [] unless fs.existsSync("./web/project.json")

  cocos2d = require("./web/project.json")

  root: "./web/#{cocos2d.engineDir}"
  if standalone # include the framework
    moduleConfig = require("#{root}/moduleConfig.json")
    files = ["#{root}/#{moduleConfig.bootFile}"]
    for module in cocos2d.modules
      for name, value of moduleConfig.module[module]
        for file in moduleConfig.module[value]
          files.push("#{root}/#{file}") unless moduleConfig.module[file]?
  else files = []

  for file in cocos2d.jsList
    files.push("./web/#{file}")

  files.push("./web/main.js") unless standalone
  return files



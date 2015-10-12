#!/usr/bin/env coffee

fs = require('fs')
path = require('path')
DiffMatchPatch = require('./diff_match_patch/javascript/diff_match_patch_uncompressed.js').diff_match_patch

cwd = process.cwd()
path1 = path.resolve(cwd, 'packages', process.argv[2])
path2 = path.resolve(cwd, 'web/src', process.argv[3])
name = path.resolve('./tools/patch', path.basename(path1))

text1 = fs.readFileSync(path1, 'utf8')
text2 = fs.readFileSync(path2, 'utf8')

dmp = new DiffMatchPatch()

diff = dmp.diff_main(text1, text2)
if diff.length > 2
	dmp.diff_cleanupSemantic(diff)
patch_list = dmp.patch_make(text1, text2, diff)
patch_text = dmp.patch_toText(patch_list)

console.log name	
fs.writeFileSync(name+'.patch', patch_text)
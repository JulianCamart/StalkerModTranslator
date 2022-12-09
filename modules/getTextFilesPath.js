// Module to return arrays with all xml translation files of given language
// It's return asynchronously array by each mod
'use strict'
const fs = require('fs')
const path = require('path')

module.exports = (dirPath, languageSource, callback) => {
  fs.readdir(dirPath, { withFileTypes: true }, (err, modFiles) => {
    if (err) return callback(err)

    modFiles.forEach((modFile => {

      if(modFile.isDirectory()) {
        fs.readdir(
          `${dirPath}${modFile.name}/gamedata/configs/text/${languageSource}`,
          (err, textFileListFromMod) => {
            if (err) return callback(null, [], modFile.name)

            callback(null, textFileListFromMod
              .filter(file => path.extname(file) == '.' + 'xml')
              .map((file) => `${dirPath}${modFile.name}/gamedata/configs/text/${languageSource}/${file}`)),
              modFile.name
          }
        )
      }
        
    }))
  })
}
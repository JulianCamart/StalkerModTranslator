// Module to return arrays with all xml translation files of given language
// It's return asynchronously array by each mod
'use strict'
const fs = require('fs')
const path = require('path')

module.exports = (dirPath, languageSource, callback) => {
  fs.readdir(dirPath, (err, modFiles) => {
    if (err) return callback(err)

    modFiles.forEach((modFile => {
      fs.readdir(
        `${dirPath}${modFile}/gamedata/configs/text/${languageSource}`,
        (err, textFileListFromMod) => {
          if (err) return callback(null, [], modFile)
          else {
            callback(null, textFileListFromMod
              .filter(file => path.extname(file) == '.' + 'xml')
              .map((file) => `${dirPath}${modFile}/gamedata/configs/text/${languageSource}/${file}`)),
              modFile
          }
        }
      )
    }))
  })
}
// Run this file with two parameters:
// ex: node index.js eng GAMMA/mods/

const fs = require('fs')

const sourceLanguageFile = process.argv[2]
const modsDirPath = process.argv[3]
const targetLanguage = process.argv[4]

const getTextFilesPath = require('./modules/getTextFilesPath')
const formatXML = require('./modules/formatXML')
const translateTextFiles = require('./modules/translateTextFiles')

getTextFilesPath(modsDirPath, sourceLanguageFile, (err, files) => {
  if (err) console.error(err)

  files.forEach((file) => formatXML(file, (err, json, file) => {
    if (err) console.error(err)

    translateTextFiles(JSON.parse(json), targetLanguage, (jsonTranslated) => {

      console.log(jsonTranslated, file)
    
    })
  }))
})

// Run this file with three parameters: "node index.js [SOURCE_LANGAGE] [MODS_PATH] [OUTPUT_PATCH]"
// ex: node index.js eng GAMMA/mods/ ~/Documents

const fs = require('fs')
const path = require('path')
const dotenv = require('dotenv');
dotenv.config();

const modsDirPath = process.argv[2]
const targetLanguage = process.argv[3]
const outputPatch = process.argv[4]
const SOURCE_LANGUAGE_FILE = process.env.SOURCE_LANGUAGE_FILE


const getTextFilesPath = require('./modules/getTextFilesPath')
const formatXMLToJson = require('./modules/formatXMLToJson')
const translateTextFiles = require('./modules/translateTextFiles')
const createXMLFromJson = require('./modules/createXMLFromJson')


getTextFilesPath(modsDirPath, SOURCE_LANGUAGE_FILE, (err, XMLFileList, modFile) => {
  if (err) console.error(err)

  XMLFileList.forEach((XMLFile) => formatXMLToJson(XMLFile, (err, json) => {
    if (err) console.error(err)

    translateTextFiles(JSON.parse(json), targetLanguage, (jsonTranslated) => {
      const newTranslatedXMLFile = path.normalize(`${outputPatch}patch_${targetLanguage}/` + XMLFile.replace(`/${SOURCE_LANGUAGE_FILE}/`, `/${targetLanguage}/`))

      createXMLFromJson(jsonTranslated, newTranslatedXMLFile, (err, result) => {
        if (err) console.error(err)
        console.log(result)
      })
    })
  }))
})

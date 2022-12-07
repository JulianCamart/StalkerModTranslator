'use strict'
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
const readXML = require('./modules/readXML')
const getTranslatedJson = require('./modules/getTranslatedJson')
const createXMLFromJson = require('./modules/createXMLFromJson')

//Todo add progress bar with this count
//let countModFileToTranslate = 0
//let countModFileTranslated = 0

getTextFilesPath(modsDirPath, SOURCE_LANGUAGE_FILE, (err, XMLFileList, modFile) => {
  if (err) console.error(err)
  if (XMLFileList.length == 0) console.warn('[WARNING] No text files for mod: ' + modFile)

  //countModFileToTranslate += XMLFileList.length

  XMLFileList.forEach((XMLFile) => readXML(XMLFile, (err, data) => {
    console.log(XMLFile)
    if(XMLFile != "./GAMMA/mods/Darkasleif's Nimble Upgrades Guns/gamedata/configs/text/eng/st_dialogs_zaton.xml") return
    if (err) console.error(err)

    getTranslatedJson(data, targetLanguage, (jsonTranslated) => {
      const newTranslatedXMLFile = path.normalize(`${outputPatch}patch_${targetLanguage}/` + XMLFile.replace(`/${SOURCE_LANGUAGE_FILE}/`, `/${targetLanguage}/`))

      createXMLFromJson(jsonTranslated, newTranslatedXMLFile, (err, result) => {
        if (err) console.error(err)
        //countModFileTranslated++
        console.log(result)
      })
    })
  }))
})

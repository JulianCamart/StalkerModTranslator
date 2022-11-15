// Run this file with two parameters:
// ex: node index.js eng GAMMA/mods/

const fs = require('fs')

const languageSource = process.argv[2]
const modsDirPath = process.argv[3]

const getTextFilesPath = require('./modules/getTextFilesPath')

getTextFilesPath(modsDirPath, languageSource, (err, files) => {
  if (err) console.error(err)

  files.forEach((file) => console.log(file))
})

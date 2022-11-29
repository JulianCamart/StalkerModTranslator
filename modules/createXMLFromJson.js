// Module to create new xml file from translated json data and paths

const fs = require('fs')
const path = require('path')
const parser = require('xml2json')

module.exports = (jsonTranslated, outputPatch, callback) => {
  
  fs.mkdir(path.dirname(outputPatch), { recursive: true }, (err) => {
    if (err) return callback('ERR: ' + err + '\n')

    fs.appendFile(outputPatch, parser.toXml(jsonTranslated), (err) => {

      if (err) return callback('ERR: ' + err + '\n')
  
      callback(null, 'OK: '+ outputPatch + 'created \n')
    })

  });
}
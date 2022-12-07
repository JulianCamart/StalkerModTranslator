// Module to create new xml file from translated json data and paths
'use strict'
const fs = require('fs')
const path = require('path')
const parser = require('xml2json')

module.exports = (jsonTranslated, outputPatch, callback) => {
  
  fs.mkdir(path.dirname(outputPatch), { recursive: true }, (err) => {
    if (err) return callback('[ERROR] ' + err)

    fs.appendFile(outputPatch, parser.toXml(jsonTranslated), 'utf8', (err) => {

      if (err) return callback('[ERROR] ' + err)
  
      callback(null, '[OK] '+ outputPatch + ' created')
    })

  });
}
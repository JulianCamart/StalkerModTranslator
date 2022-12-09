// Module to return js object from xml file
'use strict'
const fs = require('fs')
const parser = require('xml2json')

module.exports = (xml, callback) => {
  fs.readFile( `./${xml}`, (err, data) => {
    if (err) return callback(err)
    try {
      let jsObject = parser.toJson(data.toString('utf-8'), {object: true, reversible: true, trim: false, arrayNotation: true})
      
      callback(null, jsObject)
    } catch (err) {
      callback("xml2json cant handle this file: " + xml)
    }
  })
}
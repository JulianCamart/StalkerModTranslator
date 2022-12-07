// Module to return js object from xml file
'use strict'
const fs = require('fs')
const parser = require('xml2json')

module.exports = (xml, callback) => {
  fs.readFile( `./${xml}`, (err, data) => {
    if (err) return callback(err)
    callback(null, parser.toJson(data.toString('utf-8'), {object: true, reversible: true, trim: false, arrayNotation: true}))
  })
}
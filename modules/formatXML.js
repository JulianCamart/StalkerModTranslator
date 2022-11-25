// Module to return json from xml file

const fs = require('fs')
const parser = require('xml2json')

module.exports = (xml, callback) => {
  fs.readFile( `./${xml}`, (err, data) => {
    if (err) return callback(err)
    callback(null, parser.toJson(data), xml)
  })
}
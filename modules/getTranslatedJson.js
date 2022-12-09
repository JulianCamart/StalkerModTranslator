// Module to translate all texts from given data
// given format for data is js object:
// {
//   string_table: [{
//     string: [
//       {id: "id", text:[{$t: "text"}]}, [Object], [Object]...
//     ]
//   }]
// }
// CHUNK_SIZE determine texts count sended to translation service
'use strict'
const {TranslationServiceClient} = require('@google-cloud/translate');

const CREDENTIALS = JSON.parse(process.env.CREDENTIALS)
const CHUNK_SIZE = process.env.CHUNK_SIZE
const MAX_BYTES_PAYLOAD = process.env.MAX_BYTES_PAYLOAD

const translationClient = new TranslationServiceClient({
  credentials: CREDENTIALS,
  projectId: CREDENTIALS.project_id
});

const request = {
  parent: `projects/${CREDENTIALS.project_id}/locations/global`,
  mimeType: 'text/plain',
};

async function translateData(chunk, targetLanguage) {
  request.contents = chunk
  request.targetLanguageCode = targetLanguage

  const [response] = await translationClient.translateText(request);
  let translatedData = []

  for (const translation of response.translations) {
    translatedData.push(translation.translatedText)
  }

  return translatedData
}

async function translateByChunk(values, targetLanguage) {

  let resultValues = []
  
  for (let i = 0; i < values.length; i += CHUNK_SIZE) {
    
    const chunk = values.slice(i, i + CHUNK_SIZE)
    const translatedChunk = await translateData(chunk.map(item => item.text[0].$t), targetLanguage)

    let j = 0
    translatedChunk.forEach(text => {
      resultValues.push({id: chunk[j].id, text: {$t: text}})
      j++
    })
  }

  return resultValues
}

module.exports = async (data, targetLanguage, callback) => {
  let translatedData = []

  let items = data.string_table[0].string
  if (!items) return callback('Empty file')

  let values = items.map(item => item.text[0].$t)

  try {
    if(JSON.stringify(values).replace(/[\[\]\,\"]/g,'').length < MAX_BYTES_PAYLOAD) {
      translatedData = await translateData(values, targetLanguage)
    } else {
      translatedData = await translateByChunk(items, targetLanguage)
    }
  } catch (err) {
    return callback(err.details)
  } 

  data.string_table[0].string = translatedData
  callback(null, JSON.stringify(data))
}

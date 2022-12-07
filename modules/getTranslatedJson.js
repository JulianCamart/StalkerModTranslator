// Module to translate all texts from given data
// given format for data is js object:
// {
//   string_table: [{
//     string: [
//       {id: "id", text:[{$t: "text"}]}, [Object], [Object]...
//     ]
//   }]
// }
// CHUNK_SIZE determine items count sended to translation service
'use strict'
const {TranslationServiceClient} = require('@google-cloud/translate');

const CREDENTIALS = JSON.parse(process.env.CREDENTIALS)
const CHUNK_SIZE = process.env.CHUNK_SIZE

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
  
  let translatedChunk = []
  for (const translation of response.translations) {
    translatedChunk.push(translation.translatedText)
  }
  return translatedChunk
}

module.exports = async (data, targetLanguage, callback) => {
  let translatedData = []

  let values = data.string_table[0].string
    for (let i = 0; i < values.length; i += CHUNK_SIZE) {

      const chunk = values.slice(i, i + CHUNK_SIZE)    
      const translatedChunk = await translateData(chunk.map(item => item.text[0].$t), targetLanguage)
  
      let j = 0
      translatedChunk.forEach(text => {
        translatedData.push({id: chunk[j].id, text: {$t: text}})
        j++
      })
    }

  data.string_table[0].string = translatedData
  callback(JSON.stringify(data))
}

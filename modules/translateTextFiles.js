// Module to translate all texts from given data
// given format for data is js object:
// {
//   string_table: {
//     string: [
//       [Object], [Object]...
//     ]
//   }
// }
// CHUNK_SIZE determine items count sended to translation service

/*const dotenv = require('dotenv');
dotenv.config();*/

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

  for (let i = 0; i < data.string_table.string.length; i += CHUNK_SIZE) {

    const chunk = data.string_table.string.slice(i, i + CHUNK_SIZE)

    const translatedChunk = await translateData(chunk.map(item => item.text), targetLanguage)

    let j = 0
    translatedChunk.forEach(text => {
      translatedData.push({id: chunk[j].id, text: text})
      j++
    })
  }

  data.string_table.string = translatedData
  callback(JSON.stringify(data))
}
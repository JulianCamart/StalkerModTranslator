# StalkerModTranslator
A little tool to auto translate any stalker Anomaly mod

## How it's work ?
Just exec `node index.js [PATH_MODS_DIRECTORY] [TARGET_LANGUAGE] [OUTPUTPATCH]`
exemple to translate to french --> `node index.js ./GAMMA/mods/ fr ./`

it will read all mods inside ./GAMMA/mods and create the patch at ./

### Config
CREDENTIALS=

You have to add GCloud credentials with translate api activated

CHUNK_SIZE=10

You can adjust the size of each chunk sended to api

SOURCE_LANGUAGE_FILE=eng

You can choose to translate from rus file but it could not work properly because actually only utf-8 is supported

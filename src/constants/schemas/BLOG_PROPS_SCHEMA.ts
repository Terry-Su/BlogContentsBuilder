import { UNIQUE_HTML_NAME } from './../names';
import { NAME, CREATE_TIME, TAGS, INTRODUCTION } from '../names';

export default {
  type: 'object',
  patternProperties: {
    [ NAME ]: {
      type: 'string'
    },
    [ CREATE_TIME ]: {
      type: 'string'
    },
    [ TAGS ]: {
      type: 'array',
      items: [
        {
          type: 'string'
        }
      ]
    },
    [ INTRODUCTION ]: {
      type: 'string',
    },
    [ UNIQUE_HTML_NAME ]: {
      type: 'string',
    },
    

  }
}
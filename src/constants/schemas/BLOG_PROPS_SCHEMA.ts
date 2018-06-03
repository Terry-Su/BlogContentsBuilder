import { NAME, CREATE_TIME, TAGS } from '../names';

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
  }
}
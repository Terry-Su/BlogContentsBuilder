import { CATEGORY_SEQUENCE, TAGS } from './../constants/names';
import { NAME, CREATE_TIME, CONFIG } from '../constants/names';
import { ClientDetailConfig } from './ClientDetailConfig';

interface ClientBlogGV {
  [NAME]: string
  [CREATE_TIME]: string
  [CATEGORY_SEQUENCE]: string[]
  [TAGS]: string[],
  [ CONFIG ]: ClientDetailConfig
}
import { CATEGORY_SEQUENCE, TAGS, UNIQUE_HTML_NAME, BLOG_PROPS } from './../constants/names';
import { NAME, CREATE_TIME, CONFIG } from '../constants/names';
import { ClientDetailConfig } from './ClientDetailConfig';
import { BlogProps } from './BlogProps';

interface ClientBlogGV {
  [NAME]: string
  [CREATE_TIME]: string
  [CATEGORY_SEQUENCE]: string[]
  [TAGS]: string[],
  [ CONFIG ]: ClientDetailConfig,
  [UNIQUE_HTML_NAME]: string,
  [BLOG_PROPS]: BlogProps
}
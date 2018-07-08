import { MARKED_HTML, UNIQUE_HTML_NAME, BLOG_PROPS } from './../constants/names';
import { RELATIVE_CLIENT_URL, CATEGORY_SEQUENCE, RELATIVE_CLIENT_PROPS_URL } from '../constants/names';
import {
  NAME,
  CREATE_TIME,
  TAGS,
  NAME_PATH,
  INTRODUCTION
} from "../constants/names"
import { BlogProps } from './BlogProps';

interface BlogInfo {
  [NAME_PATH]: string
  [RELATIVE_CLIENT_URL]: string,
  [RELATIVE_CLIENT_PROPS_URL]: string,
  [NAME]: string
  [MARKED_HTML]: string
  [CREATE_TIME]: string
  [CATEGORY_SEQUENCE]: string[]
  [TAGS]: string[]
  [INTRODUCTION]: string,
  [UNIQUE_HTML_NAME]: string
  [BLOG_PROPS]: BlogProps
}

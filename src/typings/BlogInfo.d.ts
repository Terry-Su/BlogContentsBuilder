import { MARKED_HTML } from './../constants/names';
import { RELATIVE_CLIENT_URL, CATEGORY_SEQUENCE, RELATIVE_CLIENT_PROPS_URL } from '../constants/names';
import {
  NAME,
  CREATE_TIME,
  TAGS,
  NAME_PATH,
  INTRODUCTION
} from "../constants/names"

interface BlogInfo {
  [NAME_PATH]: string
  [RELATIVE_CLIENT_URL]: string,
  [RELATIVE_CLIENT_PROPS_URL]: string,
  [NAME]: string
  [MARKED_HTML]: string
  [CREATE_TIME]: string
  [CATEGORY_SEQUENCE]: string[]
  [TAGS]: string[]
  [INTRODUCTION]: string
}

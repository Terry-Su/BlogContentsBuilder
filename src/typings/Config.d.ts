import { LANG } from './../constants/configNames';
import { BLOGS_HTMLS_DIRECTORY_NAME, NAV_META_DESCRIPTION } from '../constants/configNames';
import {
  TOP_DIRECTORY_NAME,
  NAME_NEWEST_BLOGS_COUNT,
  NAV_HTML_TITLE,
  NAV_SCRIPTS,
  DETAIL_SCRIPTS,
  NAME_OF_DIRECTORY_PLACING_DATA_EXCEPT_NAV_HTML
} from "../constants/configNames"

interface Config {
  [NAV_HTML_TITLE]: string
  [TOP_DIRECTORY_NAME]: string
  [NAME_NEWEST_BLOGS_COUNT]: number
  [NAV_SCRIPTS]: string[]
  [NAV_META_DESCRIPTION]: string,
  [DETAIL_SCRIPTS]: string[],
  [NAME_OF_DIRECTORY_PLACING_DATA_EXCEPT_NAV_HTML]: string,
  [BLOGS_HTMLS_DIRECTORY_NAME]: string,
  [LANG]: string,
}

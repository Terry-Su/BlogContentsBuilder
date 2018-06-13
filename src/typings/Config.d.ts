import {
  TOP_DIRECTORY_NAME,
  NAME_NEWEST_BLOGS_COUNT,
  NAV_HTML_TITLE,
  NAV_SCRIPTS,
  DETAIL_SCRIPTS
} from "../constants/configNames"

interface Config {
  [NAV_HTML_TITLE]: string
  [TOP_DIRECTORY_NAME]: string
  [NAME_NEWEST_BLOGS_COUNT]: number
  [NAV_SCRIPTS]: string[]
  [DETAIL_SCRIPTS]: string[]
}

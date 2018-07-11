import {
  LANG,
  GET_NAV_META_DESCRIPTION,
  SITEMAP_FILE_NAME,
  SITEMAP_ROOT_WEBSITE,
  FILES_COPY_TO_OUTPUT
} from "./../constants/configNames"
import {
  BLOGS_HTMLS_DIRECTORY_NAME,
  NAV_META_DESCRIPTION
} from "../constants/configNames"
import {
  TOP_DIRECTORY_NAME,
  NAME_NEWEST_BLOGS_COUNT,
  NAV_HTML_TITLE,
  NAV_SCRIPTS,
  DETAIL_SCRIPTS,
  NAME_OF_DIRECTORY_PLACING_DATA_EXCEPT_NAV_HTML
} from "../constants/configNames"
import { NAV, DETAIL } from "../constants/names"

interface Config {
  /**
   * System
   */
  [BLOGS_HTMLS_DIRECTORY_NAME]: string

  [NAME_OF_DIRECTORY_PLACING_DATA_EXCEPT_NAV_HTML]: string

  [TOP_DIRECTORY_NAME]: string

  [LANG]: string

  [SITEMAP_FILE_NAME]: string

  [SITEMAP_ROOT_WEBSITE]: string

  [FILES_COPY_TO_OUTPUT]: string[]

  /**
   * Nav
   */
  [NAV]: {
    [NAV_HTML_TITLE]: string

    [NAME_NEWEST_BLOGS_COUNT]: number

    [NAV_SCRIPTS]: string[]

    [NAV_META_DESCRIPTION]: string

    [GET_NAV_META_DESCRIPTION]( info: any ): string
  }

  /**
   * Detail
   */
  [DETAIL]: {
    [DETAIL_SCRIPTS]: string[]
  }
}

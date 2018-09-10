import { NAV, DETAIL } from "./../names"
import { ALL, BLOG, EN } from "../names"
import { Config } from "../../typings/Config"
import { DEFAULT_NEWEST_BLOGS_COUNT } from "../numbers"
import {
  BLOGS_HTMLS_DIRECTORY_NAME,
  LANG,
  NAV_META_DESCRIPTION,
  GET_NAV_META_DESCRIPTION,
  SITEMAP_FILE_NAME,
  SITEMAP_ROOT_WEBSITE,
  FILES_COPY_TO_OUTPUT
} from "../configNames"
import {
  TOP_DIRECTORY_NAME,
  NAME_NEWEST_BLOGS_COUNT,
  NAV_SCRIPTS,
  DETAIL_SCRIPTS,
  NAV_HTML_TITLE,
  NAME_OF_DIRECTORY_PLACING_DATA_EXCEPT_NAV_HTML
} from "../configNames"

export const DEFAULT_CONFIG: Config = {
  /**
   * System
   */
  [ BLOGS_HTMLS_DIRECTORY_NAME ]: DETAIL,

  [ NAME_OF_DIRECTORY_PLACING_DATA_EXCEPT_NAV_HTML ]: null,

  [ TOP_DIRECTORY_NAME ]: ALL,

  [ LANG ]: EN,

  [ SITEMAP_FILE_NAME ]: null,

  [ SITEMAP_ROOT_WEBSITE ]: null,

  [ FILES_COPY_TO_OUTPUT ]: [],

  /**
   * Nav
   */
  [ NAV ]: {
    [ NAV_HTML_TITLE ]          : BLOG,
    [ NAME_NEWEST_BLOGS_COUNT ] : DEFAULT_NEWEST_BLOGS_COUNT,
    [ NAV_SCRIPTS ]             : [],
    [ NAV_META_DESCRIPTION ]    : undefined,
    [ GET_NAV_META_DESCRIPTION ]: undefined
  },

  /**
   * Detail
   */
  [ DETAIL ]: {
    [ DETAIL_SCRIPTS ]: []
  }
}

import { isDirectoryType, filterIsDirectoryType } from "./dirTree"
import {
  isBlogDirectoryInfo,
  getBlogPropsFilePath,
  getBlogFilePath
} from "./getBlogsInfo"
import readJsonFromFile from "../utils/readJsonFromFile"
import BLOG_PROPS_SCHEMA from "../constants/schemas/BLOG_PROPS_SCHEMA"
import { notNil } from "../utils/lodash"
import getFileNameWithoutItsExtension from "../utils/getFileNameWithoutItsExtension"
import { BlogProps } from "../typings/BlogProps"
import {
  NAME,
  CREATE_TIME,
  TAGS,
  NAME_PATH,
  INTRODUCTION,
  DOT_JSON
} from "../constants/names"
import * as FS from "fs-extra"
import { BLOG_INTRODUCTION_CHARS_COUNT } from "../constants/numbers"
import * as PATH from "path"
import * as marked from "marked"
import { CLIENT_CATEGORY_RELATIVE_PATH } from "../constants/path"
import { UTF8 } from '../constants/names';
import { ClientNavBlog } from "../typings/ClientNavBlog"
import getBlogDetailHtml from "../constants/dynamic/getBlogDetailHtml";
import { BlogInfo } from "../typings/BlogInfo";
import { readFileSync } from "../utils/fs";
const dirTree = require( "directory-tree" )

export default class UtilGetters {
  getClientCategoryJsonPath( upperDirectoryPath: string ): string {
    return PATH.resolve( upperDirectoryPath, CLIENT_CATEGORY_RELATIVE_PATH )
  }

  getClientTagJsonFileName( tagName: string ) {
    return `${tagName}${DOT_JSON}`
  }

  getBlogIntroduction( blogPath: string ) {
    const string: string =  readFileSync( blogPath )
    return notNil( string ) ?
      string.trim().substr( 0, BLOG_INTRODUCTION_CHARS_COUNT ) :
      ""
  }

  isSameFileTextsWithText( filePath: string, text: string ) {
    const fileText: string = readFileSync( filePath )
    return notNil( fileText ) ? fileText === text : false 
  }
}

import { NAME_PATH } from "./../constants/names"
import { isDirectoryType, filterIsDirectoryType } from "./dirTree"
import {
  isBlogDirectoryInfo,
  getBlogPropsFilePath,
  getBlogFilePath
} from "./getBlogsInfo"
import readJsonFromFile from "../utils/readJsonFromFile"
import { notNil } from "../utils/lodash"
import getFileNameWithoutItsExtension from "../utils/getFileNameWithoutItsExtension"
import { BlogProps } from "../typings/BlogProps"
import { CREATE_TIME, TAGS, INTRODUCTION, DOT_JSON } from "../constants/names"
import * as FS from "fs-extra"
import { BLOG_INTRODUCTION_CHARS_COUNT } from "../constants/numbers"
import * as PATH from "path"
import * as marked from "marked"
import { CLIENT_CATEGORY_RELATIVE_PATH } from "../constants/path"
import {
  UTF8,
  CATEGORY_SEQUENCE,
  RELATIVE_CLIENT_PROPS_URL
} from "../constants/names"
import { ClientNavBlog } from "../typings/ClientNavBlog"
import { BlogInfo } from "../typings/BlogInfo"
import { readFileSync } from "../utils/fs"
import { ClientBlogProps } from "../typings/ClientBlogProps"
import { NAME, CONFIG, NAV } from "../constants/names"
import { mapValues, isPlainObject } from "lodash"
import { isString, isArray } from "util"
const dirTree = require( "directory-tree" )

export default class UtilGetters {
  getClientCategoryJsonPath( upperDirectoryPath: string ): string {
    return PATH.resolve( upperDirectoryPath, CLIENT_CATEGORY_RELATIVE_PATH )
  }

  getClientTagJsonFileName( tagName: string ) {
    return `${tagName}${DOT_JSON}`
  }

  getBlogIntroduction( blogPath: string ) {
    const string: string = readFileSync( blogPath )
    return notNil( string ) ?
      string.trim().substr( 0, BLOG_INTRODUCTION_CHARS_COUNT ) :
      ""
  }

  isSameFileTextsWithText( filePath: string, text: string ) {
    const fileText: string = readFileSync( filePath )
    return notNil( fileText ) ? fileText === text : false
  }

  getClientBlogPropsBy( blogInfo: BlogInfo ): ClientBlogProps {
    const {
      [ NAME ]: name,
      [ CREATE_TIME ]: createTime,
      [ CATEGORY_SEQUENCE ]: categorySequence,
      [ TAGS ]: tags
    } = blogInfo
    return {
      [ NAME ]             : name,
      [ CREATE_TIME ]      : createTime,
      [ CATEGORY_SEQUENCE ]: categorySequence,
      [ TAGS ]             : tags
    }
  }

  /**
   * // Blog info
   */
  getCategorySequenceBy(
    blogPath: string,
    rootCategoryPath: string,
    topDirectoryName: string
  ): string[] {
    const upperTwicePath = PATH.resolve( blogPath, "../../" )
    const string = PATH.relative( rootCategoryPath, upperTwicePath )
    let res = string.split( "/" )
    res = [ topDirectoryName, ...res ]
    return res
  }

  getBlogName( blogProps: BlogProps, blogPath: string ): string {
    const { [ NAME ]: name } = blogProps
    return notNil( blogProps[ NAME ] ) ?
      blogProps[ NAME ] :
      getFileNameWithoutItsExtension( blogPath )
  }

  getStringWithHyphenConnected( string: string ) {
    return string.replace( / /g, "-" )
  }

  /**
   * Client nav html
   */
  getClientPreRenderHtml( GV: any = {} ): string {
    const { [ CONFIG ]: clientNavConfig, [ NAV ]: clientNav } = GV
    let html = ""
    recurToGetHtml( GV )

    return `
<div id="preRender" style="width:1px;height:1px;overflow:hidden;">${html}</div>`
    function recurToGetHtml( object: any = {} ) {
      if ( isString( object ) ) {
        const removedHtmlTagsString = removeHtmlTags( object )
        html = `${html}<p>${removedHtmlTagsString}</p>`
        return
      }

      if ( isPlainObject( object ) ) {
        mapValues( object, value => {
            recurToGetHtml( value )
        } )
        return
      }

      if ( isArray( object ) ) {
        object.map( value => recurToGetHtml( value ) )
        return
      }
    }

    function removeHtmlTags( string: string ) {
      return string.replace(/\</g, '').replace(/\>/g, '').replace(/\//g, '')
    }
  }
}

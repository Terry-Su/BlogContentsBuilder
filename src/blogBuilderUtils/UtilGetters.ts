import { CLIENT_META_DESCRIPTION_MAX_LENGTH } from "./../constants/numbers"
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
import {
  CREATE_TIME,
  TAGS,
  INTRODUCTION,
  DOT_JSON,
  CATEGORIES
} from "../constants/names"
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
import { NAME, CONFIG, NAV, BLOG } from '../constants/names';
import { mapValues, isPlainObject, uniq } from "lodash"
import { isString, isArray } from "util"
const dirTree = require( "directory-tree" )
import * as htmlToText from "html-to-text"
import { Tag, Category } from "../typings/Store"
import { ClientCategory } from "../typings/ClientCategory"
import { sliceWordsString, removeHtmlPunctions, isEmptyString } from "../utils/string"
import { ClientBlogGV } from "../typings/ClientBlogGV"

export default class UtilGetters {
  /**
   * // General
   */
  isSameFileTextsWithText( filePath: string, text: string ) {
    const fileText: string = readFileSync( filePath )
    return notNil( fileText ) ? fileText === text : false
  }

  getCommonHtmlToText( html: string ): string {
    return htmlToText
      .fromString( html )
      .replace( /\r\n/g, " " )
      .replace( /\r/g, " " )
      .replace( /\n/g, " " )
      .replace( /\t/g, " " )
      .replace( /\s{2,}/g, " " )
  }

  getHtmlToMetaDescriptionText( html: string ): string {
    return this.getMetatDescriptionText( this.getCommonHtmlToText( html ) )
  }

  getMetatDescriptionText( string: string ): string {
    // replace html tags and quote symbol: " and limit length
    const mainString = string
      .replace( /\</g, "" )
      .replace( /\>/g, "" )
      .replace( /\//g, "" )
      .replace( /\"/g, "" )
    const slicedString = sliceWordsString(
      mainString,
      CLIENT_META_DESCRIPTION_MAX_LENGTH
    )
    return `${slicedString}`
  }

  /**
   * // Client
   */
  getHtmlWrappingData( data: any = {} ): string {
    let html = ""
    recurToGetHtml( data )

    return `
<div id="preRender" style="width:1px;height:1px;overflow:hidden;">${html}</div>`

    function recurToGetHtml( object: any = {} ) {
      if ( isString( object ) ) {
        const removedHtmlPunctionsString = removeHtmlPunctions( object )
        html = `${html}<p>${removedHtmlPunctionsString}</p>`
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
  }

  getCommonDataText( data: any = {} ): string {
    let text = ""
    recurToGetHtml( data )

    return `${text}`
    function recurToGetHtml( object: any = {} ) {
      if ( isString( object ) ) {
        const removedHtmlPunctionsString = removeHtmlPunctions( object )
        text = `${text}${ isEmptyString( text ) ? '' : ' ' }${removedHtmlPunctionsString}`
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
  }

  /**
   * // Client nav
   */
  getClientCategoryJsonPath( upperDirectoryPath: string ): string {
    return PATH.resolve( upperDirectoryPath, CLIENT_CATEGORY_RELATIVE_PATH )
  }

  getClientTagJsonFileName( tagName: string ) {
    return `${tagName}${DOT_JSON}`
  }

  getClientCategoryKeys( category: ClientCategory ): string[] {
    let res: string[] = []

    recurToGetRes( category )

    res = uniq( res )
    return res

    function recurToGetRes( category: ClientCategory ) {
      if ( category ) {
        const { [ NAME ]: name, [ CATEGORIES ]: categories } = category
        res.push( name )

        categories.map( subCategory => recurToGetRes( subCategory ) )
      }
    }
  }

  /**
   * // Client detail
   */
  getClientBlogMarkedHtml( blogPath: string ): string {
    const string = readFileSync( blogPath )

    if ( !string ) {
      return ""
    }

    const markedHtml = marked( string )
    return markedHtml
  }

  getBlogIntroduction( markedHtml: string ) {
    const mainString = this.getCommonHtmlToText( markedHtml )
    const slicedString = sliceWordsString(
      mainString,
      BLOG_INTRODUCTION_CHARS_COUNT
    )
    let res = slicedString
    if ( mainString.length >= BLOG_INTRODUCTION_CHARS_COUNT ) {
      res = `${res}...`
    }
    return res
  }

  getClientBlogDataForMetaDescription( GV: ClientBlogGV ): any {
    const {
      [ CATEGORY_SEQUENCE ]: categorySequence,
      [ TAGS ]: tags,
      [ CONFIG ]: clientDetailConfig
    } = GV

    return [BLOG, categorySequence, tags ]
  }

  getClientBlogMetaDescription( GV: ClientBlogGV,  markedHtml: string ) {
    const { [NAME]: title } = GV
    const data = this.getClientBlogDataForMetaDescription( GV )
    const dataText = this.getCommonDataText( data )
    const htmlText = this.getHtmlToMetaDescriptionText( markedHtml )
    return this.getMetatDescriptionText( `${ title } ${dataText} ${htmlText}` )
  }

  getClientBlogPropsBy( blogInfo: BlogInfo ): ClientBlogProps {
    const {
      [ NAME ]: name,
      [ CREATE_TIME ]: createTime,
      [ CATEGORY_SEQUENCE ]: categorySequence,
      [ TAGS ]: tags,
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

  getBlogDirectoryName( blogPath: string ): string {
    const supperPath = PATH.resolve( blogPath, '../' )
    return PATH.basename( supperPath )
  }

  getStringWithHyphenConnected( string: string ) {
    return string.replace( / /g, "-" )
  }


  // /**
  //  * // Sitemap
  //  */
  // getSitemapContent( sitemap_root_website: string ) {
  //   return sitemap_root_website
  // }
}

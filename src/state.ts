import {
  isDirectoryType,
  filterIsDirectoryType
} from "./blogBuilderUtils/dirTree"
import {
  isBlogDirectoryInfo,
  getBlogFilePath,
  getBlogPropsFilePath
} from "./blogBuilderUtils/getBlogsInfo"
import { notNil } from "./utils/lodash"
import getFileNameWithoutItsExtension from "./utils/getFileNameWithoutItsExtension"
import BLOG_PROPS_SCHEMA from "./constants/schemas/BLOG_PROPS_SCHEMA"
import readJsonFromFile from "./utils/readJsonFromFile"
import { isValidDateString } from "./blogBuilderUtils/validate"
import { isNil, cloneDeep, uniqWith, take, mapValues, includes, uniq } from "lodash"
import { DEFAULT_CONFIG } from "./constants/default/index"
import BlogBuilder from "./BlogBuilder"
import UtilGetters from "./blogBuilderUtils/UtilGetters"
import { notEmpty, isEmpty } from "./utils/array"
import { ClientNav } from "./typings/ClientNav"
import { Category, Tag } from "./typings/Store"
import { Config } from "./typings/Config"
import * as FS from "fs-extra"
import * as PATH from "path"
import {
  CLIENT_NAV_JSON_RELATIVE_PATH,
  CLIENT_CATEGORY_RELATIVE_PATH
} from "./constants/path"
import { outputJSONSync } from "fs-extra"
import { ClientNavCategory } from "./typings/ClientNavCategory"
import {
  NEWEST_BLOGS,
  CATEGORY,
  NAME,
  BLOGS,
  CATEGORIES,
  CREATE_TIME,
  INTRODUCTION,
  NAME_PATH,
  CLIENT_NAV,
  UNIQUE_HTML_NAME,
  CLIENT_NAV_CONFIG
} from "./constants/names"
import { ClientNavBlog } from "./typings/ClientNavBlog"
import { BlogProps } from "./typings/BlogProps"
import { BlogInfo } from "./typings/BlogInfo"
import { ClientTag } from "./typings/ClientTag"
import {
  CLIENT_NAV_TAGS_DIRECTORY_PATH,
  CLIENT_CONFIG_JSON_RELATIVE_PATH
} from "./constants/path"
import {
  RELATIVE_CLIENT_URL,
  DOT_HTML,
  MARKED_HTML,
  CATEGORY_SEQUENCE
} from "./constants/names"
import { ClientCategory } from "./typings/ClientCategory"
import { readFileSync } from "./utils/fs"
import * as marked from "marked"
import {
  CONFIG,
  CLIENT_CONFIG,
  RELATIVE_CLIENT_PROPS_URL
} from "./constants/names"
import { ALL_BLOGS, NAV, CLIENT_DETAIL_CONFIG, CLIENT_NAV_GV, TAGS } from './constants/names';
import {
  NAME_NEWEST_BLOGS_COUNT,
  TOP_DIRECTORY_NAME,
  NAV_HTML_TITLE
} from "./constants/configNames"
import * as CONFIG_NAMES_COLLECTION from "./constants/configNames"
import { CLIENT_BLOG_PROPS_JSON } from "./constants/fileNames"
import {
  DETAIL_SCRIPTS,
  NAV_SCRIPTS,
  NAME_OF_DIRECTORY_PLACING_DATA_EXCEPT_NAV_HTML
} from "./constants/configNames"
import { ClientBlogProps } from "./typings/ClientBlogProps"
import { notEmtyString } from "./utils/js"
import { CLIENT_NAV_CONFIG_NAMES } from "./constants/configNames"
import {
  BLOGS_HTMLS_DIRECTORY_NAME,
  LANG,
  NAV_META_DESCRIPTION
} from "./constants/configNames"
import { ClientDetailConfig } from "./typings/ClientDetailConfig"
import { ClientNavConfig } from "./typings/ClientNavConfig"
import { ClientNavGV } from "./typings/clientNavGV";
import { ClientBlogGV } from "./typings/ClientBlogGV";

var Ajv = require( "ajv" )
var ajv = new Ajv()

const dirTree = require( "directory-tree" )

export class Store {
  root: string
  output: string
  config: Config = DEFAULT_CONFIG
  blogsInfo: BlogInfo[] = []
}

export class Getters {
  store: Store

  blogBuilder: BlogBuilder

  constructor( store: Store, blogBuilder: BlogBuilder ) {
    this.store = store
    this.blogBuilder = blogBuilder
  }

  get rootDirectoryName() {
    const { root } = this.store
    return PATH.basename( root )
  }

  get utilGetters(): UtilGetters {
    return this.blogBuilder.utilGetters
  }

  get category(): Category {
    const self = this
    const { utilGetters, store } = this
    const { root, config, blogsInfo } = store

    const { [ TOP_DIRECTORY_NAME ]: topDirectoryName } = config

    let res: Category = {
      [ NAME ]      : topDirectoryName,
      [ BLOGS ]     : this.getBlogsInfo( root ),
      [ ALL_BLOGS ] : this.getAllBlogsInfo( root ),
      [ CATEGORIES ]: []
    }

    resolveRoot( root )

    return res

    function resolveRoot( path: string ) {
      const directoryInfo = dirTree( path )

      if ( directoryInfo ) {
        const { type } = directoryInfo
        const { [ CATEGORIES ]: passingCategories } = res
        isDirectoryType( type ) &&
          resolveDirectoryInfo( directoryInfo, passingCategories, true )
      }
    }

    function resolveDirectoryInfo(
      directoryInfo: any,
      paramPassingCategories?: Category[],
      isRoot: boolean = false
    ) {
      const { name } = directoryInfo

      let passingCategories: Category[] = []

      const isTheBlogDirectoryInfo = isBlogDirectoryInfo( directoryInfo )

      if ( !isTheBlogDirectoryInfo ) {
        const { children, name, path } = directoryInfo

        if ( isRoot ) {
          passingCategories = paramPassingCategories
        }

        !isRoot &&
          paramPassingCategories.push( {
            [ NAME ]      : name,
            [ BLOGS ]     : self.getBlogsInfo( path ),
            [ ALL_BLOGS ] : self.getAllBlogsInfo( path ),
            [ CATEGORIES ]: passingCategories
          } )

        children
          .filter( filterIsDirectoryType )
          .map( ( directoryInfo: any ) =>
            resolveDirectoryInfo( directoryInfo, passingCategories )
          )
      }
    }
  }

  get tags(): Tag[] {
    let res: Tag[] = []
    let excessiveRes: Tag[] = []

    const { blogsInfo } = this.store

    blogsInfo.map( updateExcessiveRes )

    return res

    function updateExcessiveRes( blogInfo: BlogInfo ) {
      const { [ TAGS ]: tags } = blogInfo

      tags.map( ( tagString: string ) => {
        let tagInRes: Tag = res.filter(
          ( { [ NAME ]: theName }: Tag ) => theName === tagString
        )[ 0 ]

        if ( tagInRes ) {
          tagInRes[ BLOGS ] = [ ...tagInRes[ BLOGS ], blogInfo ]
        }
        if ( !tagInRes ) {
          const tag: Tag = {
            [ NAME ] : tagString,
            [ BLOGS ]: [ blogInfo ]
          }
          res.push( tag )
        }
      } )
    }
  }

  

  get clientNavGV(): ClientNavGV{
    const {
      [ CLIENT_NAV_CONFIG ]: clientNavConfig,
      [ CLIENT_NAV ]: clientNav,
    } = this
    return {
      [ CONFIG ]: clientNavConfig,
      [ NAV ]   : clientNav
    }
  }

  get clientDataForMetaDescription(): any {
    const { utilGetters } = this
    const {
      [ NAV ]   : clientNav = {},
    } = this.clientNavGV

    const {
    [CATEGORY]: category,
    [TAGS]: tags=[],
    [NEWEST_BLOGS]: newestBlogs

    } = <any>clientNav

    const categoryKeys = utilGetters.getClientCategoryKeys( category )
    const keys = uniq( [ ...categoryKeys, ...tags ] )

    return [ keys, newestBlogs ]
  }

  get clientNavPreRenderHtml(): string {
    const { utilGetters, clientNavGV } = this
    return utilGetters.getHtmlWrappingData( clientNavGV )
  }

  get defaultClientNavMetaDescription(): string {
    const {
      [ NAV_HTML_TITLE ]: title,
    } = this.store.config

    const { clientDataForMetaDescription, utilGetters } = this
    const text = utilGetters.getCommonDataText( clientDataForMetaDescription )

    return utilGetters.getMetatDescriptionText( `${title} ${text}` )
  }

  get clientNavHtml(): string {
    const {
      [ CLIENT_NAV_CONFIG ]: clientNavConfig,
      [ CLIENT_NAV ]: clientNav,
      [CLIENT_NAV_GV]: clientNavGV,
      defaultClientNavMetaDescription,
      clientNavPreRenderHtml
    } = this
    const {
      [ NAV_HTML_TITLE ]: title,
      [ NAV_SCRIPTS ]: scripts,
      [ NAV_META_DESCRIPTION ]: navMetaDescription = defaultClientNavMetaDescription
    } = this.store.config
    

    let scriptsString = ""
    scripts.map( ( scriptString: string ) => {
      scriptsString = scriptsString + scriptString
    } )

    const GVJsonString = JSON.stringify( clientNavGV )


    return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="description" content="${navMetaDescription}">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>${title}</title>
  </head>
  <body>
    ${clientNavPreRenderHtml}
    <div id="app"></div>
  
    
    <script>window.GV=${GVJsonString}</script>
    ${scriptsString}
  </body>
  </html>
  `
  }


  get [CLIENT_NAV_CONFIG](): ClientNavConfig {
    let res: any = {
      ...this.store.config
    }

    const exceptionalKeys: any[] = CLIENT_NAV_CONFIG_NAMES

    removeSomeResKeys( res, CONFIG_NAMES_COLLECTION )

    return res

    function removeSomeResKeys( res: any = {}, object: any = {} ) {
      mapValues( object, ( key: string ) => {
        if ( !includes( exceptionalKeys, key ) ) {
          delete res[ key ]
        }
      } )
    }
  }

  get clientNavNewestBlogs(): ClientNavBlog[] {
    const { blogsInfo, config } = this.store
    const {
      [ NAME_NEWEST_BLOGS_COUNT ]: count,
      [ TOP_DIRECTORY_NAME ]: topDirectoryName
    } = config
    const all: ClientNavBlog[] = blogsInfo
      .map(
        ( {
          [ NAME_PATH ]: blogPath,
          [ RELATIVE_CLIENT_URL ]: relativeClientUrl,
          [ NAME ]: name,
          [ CREATE_TIME ]: createTime,
          [ INTRODUCTION ]: introduction
        } ) => ( {
          [ NAME ]               : name,
          [ RELATIVE_CLIENT_URL ]: relativeClientUrl,
          [ CREATE_TIME ]        : createTime,
          [ INTRODUCTION ]       : introduction
        } )
      )
      .sort( sort )

    const res: ClientNavBlog[] = take( all, count )
    return res

    function sort(
      { [ CREATE_TIME ]: timeString1 }: ClientNavBlog,
      { [ CREATE_TIME ]: timeString2 }: ClientNavBlog
    ) {
      if ( isValidDateString( timeString1 ) && isValidDateString( timeString2 ) ) {
        const t1 = Date.parse( timeString1 )
        const t2 = Date.parse( timeString2 )
        return t2 - t1
      }
      return 0
    }
  }

  get clientNavCategory(): ClientNavCategory {
    const { category } = this
    let res: any = cloneDeep( category )
    resolveCategory( res )
    recurCategories( res[ CATEGORIES ] )

    return res

    function recurCategories( categories: Category[] ) {
      categories.map( category => {
        resolveCategory( category )
        recurCategories( category[ CATEGORIES ] )
      } )
    }

    function resolveCategory( category: Category ) {
      delete category[ BLOGS ]
      delete category[ ALL_BLOGS ]
    }
  }

  get clientNavTags(): string[] {
    return this.tags.map( ( { [ NAME ]: name }: Tag ) => name )
  }

  get [CLIENT_NAV](): ClientNav {
    const { clientNavNewestBlogs, clientNavCategory, clientNavTags } = this
    return {
      [ NEWEST_BLOGS ]: clientNavNewestBlogs,
      [ CATEGORY ]    : clientNavCategory,
      [ TAGS ]        : clientNavTags
    }
  }

  get clientCategory(): ClientCategory {
    const { category } = this
    let res: any = cloneDeep( category )
    resolveCategory( res )
    recurCategories( res[ CATEGORIES ] )

    return res

    function recurCategories( categories: Category[] ) {
      categories.map( category => {
        resolveCategory( category )
        recurCategories( category[ CATEGORIES ] )
      } )
    }

    function resolveCategory( category: Category ) {
      const { [ BLOGS ]: theBlogs } = category
      const blogs = theBlogs.map( ( theBlog: any ) => {
        delete theBlog[ NAME_PATH ]
        delete theBlog[ TAGS ]
        delete theBlog[ RELATIVE_CLIENT_PROPS_URL ]
        return theBlog
      } )

      category[ BLOGS ] = blogs
    }
  }

  get clientTags(): ClientTag[] {
    const { tags } = this
    let res: Tag[] = cloneDeep( tags )
    res.forEach( resoveTag )

    return <ClientTag[]>res

    function resoveTag( tag: Tag ) {
      const { [ BLOGS ]: theBlogs } = tag
      const blogs = theBlogs.map( ( theBlog: any ) => {
        delete theBlog[ NAME_PATH ]
        delete theBlog[ TAGS ]
        delete theBlog[ RELATIVE_CLIENT_PROPS_URL ]
        return theBlog
      } )

      tag[ BLOGS ] = blogs
    }
  }

  get clientOutputDirectory(): string {
    return
  }

  get clientNavHtmlPath(): string {
    const { output, config } = this.store
    const {
      [ NAME_OF_DIRECTORY_PLACING_DATA_EXCEPT_NAV_HTML ]: nameOfDirectoryPlacingDataExceptNavHtml
    } = config

    if (
      notNil( nameOfDirectoryPlacingDataExceptNavHtml ) &&
      notEmtyString( nameOfDirectoryPlacingDataExceptNavHtml )
    ) {
      const basicOutputPath = PATH.resolve( output, "../" )
      return PATH.resolve( basicOutputPath, "./index.html" )
    }
    return PATH.resolve( output, "./index.html" )
  }

  get clientConfigJsonPath(): string {
    const { output } = this.store
    return PATH.resolve( output, CLIENT_CONFIG_JSON_RELATIVE_PATH )
  }

  get clientNavJsonPath(): string {
    const { output } = this.store
    return PATH.resolve( output, CLIENT_NAV_JSON_RELATIVE_PATH )
  }

  get clientNavTagsDirectoryPath(): string {
    const { output } = this.store
    return PATH.resolve( output, CLIENT_NAV_TAGS_DIRECTORY_PATH )
  }

  get [CLIENT_DETAIL_CONFIG](): ClientDetailConfig {
    const { store } = this
    const { [ LANG ]: lang } = store[ CONFIG ]
    return {
      [ LANG ]: lang
    }
  }

  getBlogInfo( directoryInfo: any ): BlogInfo {
    const { root, config } = this.store
    const { utilGetters } = this
    const { [ TOP_DIRECTORY_NAME ]: topDirectoryName } = config

    const isTheBlogDirectoryInfo = isBlogDirectoryInfo( directoryInfo )

    if ( isTheBlogDirectoryInfo ) {
      const blogPropsFilePath: string = getBlogPropsFilePath( directoryInfo )
      const potentialBlogProps: any = readJsonFromFile( blogPropsFilePath )

      const isValid = ajv.validate( BLOG_PROPS_SCHEMA, potentialBlogProps )
      if ( isValid ) {
        const blogProps: BlogProps = potentialBlogProps
        const blogPath: string = getBlogFilePath( directoryInfo )

        const name: string = utilGetters.getBlogName( blogProps, blogPath )

        const markedHtml: string = utilGetters.getClientBlogMarkedHtml( blogPath )

        const relativeClientUrl = this.getBlogRelativeClientUrl( blogProps, name )
        const relativeClientPropsUrl = this.getBlogRelativeClientPropsUrl(
          blogPath
        )
        const createTime: string = notNil( blogProps[ CREATE_TIME ] ) ?
          blogProps[ CREATE_TIME ] :
          null
        const categorySequence: string[] = utilGetters.getCategorySequenceBy(
          blogPath,
          root,
          topDirectoryName
        )
        const tags: string[] = notNil( blogProps[ TAGS ] ) ? blogProps[ TAGS ] : []

        const introduction: string = notNil( blogProps[ INTRODUCTION ] ) ?
          blogProps[ INTRODUCTION ] :
          utilGetters.getBlogIntroduction( markedHtml )

        const blogInfo: BlogInfo = {
          [ NAME_PATH ]                : blogPath,
          [ RELATIVE_CLIENT_URL ]      : relativeClientUrl,
          [ RELATIVE_CLIENT_PROPS_URL ]: relativeClientPropsUrl,
          [ NAME ]                     : name,
          [ MARKED_HTML ]: markedHtml,
          [ CREATE_TIME ]              : createTime,
          [ CATEGORY_SEQUENCE ]        : categorySequence,
          [ TAGS ]                     : tags,
          [ INTRODUCTION ]             : introduction
        }

        return blogInfo
      }
      return null
    }
  }

  /**
   * Get the info of the blogs whose upper path is the paramater path
   */
  getBlogsInfo( path: string ): BlogInfo[] {
    const self = this
    const { utilGetters } = this
    let res: BlogInfo[] = []

    resolveRoot( path )

    return res

    function resolveRoot( path: string ) {
      const directoryInfo = dirTree( path )

      if ( directoryInfo ) {
        const { children } = directoryInfo
        children.filter( filterIsDirectoryType ).map( resolveDirectoryInfo )
      }
    }

    function resolveDirectoryInfo( directoryInfo: any ) {
      const blogInfo = self.getBlogInfo( directoryInfo )
      blogInfo && res.push( blogInfo )
    }
  }

  getAllBlogsInfo( path: string ): BlogInfo[] {
    const self = this
    const { utilGetters } = this
    let res: BlogInfo[] = []

    resolveRoot( path )

    return res

    function resolveRoot( path: string ) {
      const directoryInfo = dirTree( path )

      if ( directoryInfo ) {
        const { type } = directoryInfo
        isDirectoryType( type ) && resolveDirectoryInfo( directoryInfo )
      }
    }

    function resolveDirectoryInfo( directoryInfo: any ) {
      const isTheBlogDirectoryInfo = isBlogDirectoryInfo( directoryInfo )

      if ( isTheBlogDirectoryInfo ) {
        const blogInfo = self.getBlogInfo( directoryInfo )
        blogInfo && res.push( blogInfo )
      }
      if ( !isTheBlogDirectoryInfo ) {
        const { children } = directoryInfo
        children.filter( filterIsDirectoryType ).map( resolveDirectoryInfo )
      }
    }
  }

  getClientBlogDetailHtml( blogInfo: BlogInfo ): string {
    const {
      utilGetters,
      store,
      [ CLIENT_DETAIL_CONFIG ]: clientDetailConfig
    } = this
    const {
      [ DETAIL_SCRIPTS ]: scripts,
      [ LANG ]: lang,
      [ NAV_HTML_TITLE ]: title,
    } = store[ CONFIG ]
    const { [ NAME_PATH ]: blogPath, [ NAME ]: blogName, [MARKED_HTML]: markedHtml } = blogInfo

    const string = readFileSync( blogPath )

    let scriptsString = ""
    scripts.map( ( scriptString: string ) => {
      scriptsString = scriptsString + scriptString
    } )

    const clientBlogProps = utilGetters.getClientBlogPropsBy( blogInfo )

    const GV: ClientBlogGV = {
      ...clientBlogProps,
      [ CONFIG ]: clientDetailConfig
    }
    const GVJsonString = JSON.stringify( GV )

    const preRenderHtml = utilGetters.getHtmlWrappingData( GV )

    const metaDescription = utilGetters.getClientBlogMetaDescription( GV, markedHtml )

    return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="description" content="${metaDescription}">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>${blogName} ${title}</title>
  </head>
  <body>
    ${preRenderHtml}
    <div id="markedHtml" style="display: none;">${markedHtml}</div>
    <div id="app"></div>
  
    
    <script>window.GV=${GVJsonString}</script>
    ${scriptsString}
  </body>
  </html>
  `
  }

  getBlogRelativeClientUrl( blogProps: BlogProps = {}, blogName: string = "" ) {
    const { utilGetters } = this
    const { config, root } = this.store
    const {
      [ TOP_DIRECTORY_NAME ]: topDirectoryName,
      [ NAME_OF_DIRECTORY_PLACING_DATA_EXCEPT_NAV_HTML ]: nameOfDirectoryPlacingDataExceptNavHtml,
      [ BLOGS_HTMLS_DIRECTORY_NAME ]: blogsHtmlsDirectoryName
    } = config

    const top =
      notNil( nameOfDirectoryPlacingDataExceptNavHtml ) &&
      notEmtyString( nameOfDirectoryPlacingDataExceptNavHtml ) ?
        `${nameOfDirectoryPlacingDataExceptNavHtml}/${blogsHtmlsDirectoryName}` :
        `${blogsHtmlsDirectoryName}`

    const { [ UNIQUE_HTML_NAME ]: uniqueHtmlName = blogName } = blogProps
    const unique = utilGetters.getStringWithHyphenConnected( uniqueHtmlName )

    // const extension: string = PATH.extname( blogPath )
    // const r: RegExp = new RegExp( `${extension}$` )
    // const targetBlogHtmlPath = blogPath.replace( r, DOT_HTML )

    return `${top}/${unique}${DOT_HTML}`
  }

  getBlogRelativeClientPropsUrl( blogPath: string ) {
    const { config, root } = this.store
    const { [ TOP_DIRECTORY_NAME ]: topDirectoryName } = config
    const upperPath = PATH.resolve( blogPath, "../" )
    const targetPath = PATH.resolve( upperPath, CLIENT_BLOG_PROPS_JSON )

    return `${topDirectoryName}/${PATH.relative( root, targetPath )}`
  }

  getClientTagJsonPath( tagName: string ): string {
    const { clientNavTagsDirectoryPath, utilGetters } = this
    const tagJsonFileName = utilGetters.getClientTagJsonFileName( tagName )
    return PATH.resolve( clientNavTagsDirectoryPath, tagJsonFileName )
  }

  getBlogDetailPageHtmlPath( relativeClientUrl: string ) {
    const { output } = this.store
    const { config } = this.store
    const {
      [ NAME_OF_DIRECTORY_PLACING_DATA_EXCEPT_NAV_HTML ]: nameOfDirectoryPlacingDataExceptNavHtml
    } = config

    if (
      notNil( nameOfDirectoryPlacingDataExceptNavHtml ) &&
      notEmtyString( nameOfDirectoryPlacingDataExceptNavHtml )
    ) {
      const originalOutput = PATH.resolve( output, "../" )
      return PATH.resolve( originalOutput, relativeClientUrl )
    }

    return PATH.resolve( output, relativeClientUrl )
  }

  getClientBlogPropsJsonPath( relativeClientPropsUrl: string ): string {
    const { output } = this.store
    return PATH.resolve( output, relativeClientPropsUrl )
  }
}

export class Mutations {
  store: Store
  getters: Getters

  constructor( getters: Getters ) {
    this.store = getters.store
    this.getters = getters
  }

  UPDATE_ROOT( root: string ) {
    this.store.root = root
  }

  UPDATE_OUTPUT( output: string ) {
    this.store.output = output
  }

  UPDATE_CONFIG( config: Config ) {
    this.store.config = config
  }

  UPDATE_BLOGS_INFO( blogsInfo: BlogInfo[] ) {
    this.store.blogsInfo = blogsInfo
  }
}

export class Actions {
  store: Store
  getters: Getters
  mutations: Mutations

  constructor( mutations: Mutations ) {
    this.store = mutations.getters.store
    this.getters = mutations.getters
    this.mutations = mutations
  }

  get utilGetters(): UtilGetters {
    return this.getters.utilGetters
  }

  build( config?: Config ) {
    const { mutations, store, getters } = this
    const { root, [ CONFIG ]: currentConfig } = store

    const combinedConfig = {
      ...currentConfig,
      ...config
    }

    notNil( config ) && mutations.UPDATE_CONFIG( combinedConfig )

    const {
      [ NAME_OF_DIRECTORY_PLACING_DATA_EXCEPT_NAV_HTML ]: nameOfDirectoryPlacingDataExceptNavHtml
    } = this.store.config

    if (
      notNil( nameOfDirectoryPlacingDataExceptNavHtml ) &&
      notEmtyString( nameOfDirectoryPlacingDataExceptNavHtml )
    ) {
      const { output } = store
      const newOutput = PATH.resolve(
        output,
        nameOfDirectoryPlacingDataExceptNavHtml
      )
      mutations.UPDATE_OUTPUT( newOutput )
    }

    const blogsInfo: BlogInfo[] = getters.getAllBlogsInfo( root )
    mutations.UPDATE_BLOGS_INFO( blogsInfo )

    this.buildNavHtml()
    this.buildCategories()
    this.buildTags()
    this.buildBlogDetailPages()
  }

  buildNavHtml() {
    const { getters } = this
    const { clientNavHtmlPath, clientNavHtml } = getters

    FS.outputFileSync( clientNavHtmlPath, clientNavHtml )
  }

  buildCategories() {
    const { utilGetters } = this
    const { output } = this.store
    const { clientCategory } = this.getters

    outputCategory( clientCategory, output )

    function outputCategory(
      category: ClientCategory,
      upperDirectoryPath: string
    ) {
      const {
        [ NAME ]: name,
        [ BLOGS ]: blogs,
        [ CATEGORIES ]: categories
      } = category
      const categoryJsonDirectoryPath = PATH.resolve( upperDirectoryPath, name )
      const outputPath: string = utilGetters.getClientCategoryJsonPath(
        categoryJsonDirectoryPath
      )
      const json = {
        [ BLOGS ]: blogs
      }
      FS.outputJson( outputPath, json )

      categories.map( ( category: Category ) =>
        outputCategory( category, categoryJsonDirectoryPath )
      )
    }
  }

  buildTags() {
    const self = this
    const { clientTags } = this.getters

    clientTags.map( outputTag )

    function outputTag( { [ NAME ]: tagName, [ BLOGS ]: blogs }: ClientTag ) {
      const outputPath = self.getters.getClientTagJsonPath( tagName )
      const json = {
        [ BLOGS ]: blogs
      }
      FS.outputJson( outputPath, json )
    }
  }

  buildBlogDetailPages() {
    const self = this
    const { getters, store } = this
    const { blogsInfo } = store
    const { utilGetters } = getters

    blogsInfo.map( output )

    function output( blogInfo: BlogInfo ) {
      const { [ RELATIVE_CLIENT_URL ]: relativeClientUrl } = blogInfo

      /**
       * Build html
       */
      const outputHtmlPath = self.getters.getBlogDetailPageHtmlPath(
        relativeClientUrl
      )
      const html = getters.getClientBlogDetailHtml( blogInfo )
      if ( !utilGetters.isSameFileTextsWithText( outputHtmlPath, html ) ) {
        FS.outputFileSync( outputHtmlPath, html )
      }
    }
  }
}

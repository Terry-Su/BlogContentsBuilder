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
import { isNil, cloneDeep, uniqWith, take, mapValues } from "lodash"
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
  TAGS,
  NAME,
  BLOGS,
  CATEGORIES,
  CREATE_TIME,
  INTRODUCTION,
  NAME_PATH,
  CLIENT_NAV
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
import GET_BLOG_DETAIL_HTML from "./constants/dynamic/GET_BLOG_DETAIL_HTML"
import { CONFIG,CLIENT_CONFIG, RELATIVE_CLIENT_PROPS_URL } from './constants/names';
import { ALL_BLOGS } from "./constants/names"
import {
  NAME_NEWEST_BLOGS_COUNT,
  TOP_DIRECTORY_NAME,
  NAV_HTML_TITLE
} from "./constants/configNames"
import * as CONFIG_NAMES_COLLECTION from "./constants/configNames"
import { CLIENT_BLOG_PROPS_JSON } from "./constants/fileNames";
import { DETAIL_SCRIPTS, NAV_SCRIPTS } from './constants/configNames';

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


  get clientNavHtml(): string {
    const { [NAV_HTML_TITLE]: title, [ NAV_SCRIPTS ]: scripts, } = this.store.config
    const {
      [ CLIENT_CONFIG ]: clientConfig,
      [ CLIENT_NAV ]: clientNav
    } = this



    let scriptsString = ""
    scripts.map( ( scriptString: string ) => {
      scriptsString = scriptsString + scriptString
    } )
  
    const GV = {
      [ CONFIG ]    : clientConfig,
      [ CLIENT_NAV ]: clientNav
    }
    const GVJsonString = JSON.stringify( GV )
  
    return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>${title}</title>
  </head>
  <body>
    <div id="app"></div>
  
    
    <script>window.GV=${GVJsonString}</script>
    ${scriptsString}
  </body>
  </html>
  `
  }

  get [CLIENT_CONFIG](): any {
    let res: any = {
      ...this.store.config
    }

    removeResKeys( res, CONFIG_NAMES_COLLECTION )

    return res

    function removeResKeys( res: any = {}, object: any = {} ) {
      mapValues( object, ( key: string ) => {
        delete res[ key ]
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
        return theBlog
      } )

      tag[ BLOGS ] = blogs
    }
  }

  get clientNavHtmlPath(): string {
    const { output } = this.store
    return PATH.resolve( output, './index.html' )
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

        const relativeClientUrl = this.getBlogRelativeClientUrl( blogPath )
        const relativeClientPropsUrl = this.getBlogRelativeClientPropsUrl( blogPath )
        const name: string = notNil( blogProps[ NAME ] ) ?
          blogProps[ NAME ] :
          getFileNameWithoutItsExtension( blogPath )
        const createTime: string = notNil( blogProps[ CREATE_TIME ] ) ?
          blogProps[ CREATE_TIME ] :
          null
        const categorySequence: string[] = utilGetters.getCategorySequenceBy( blogPath, root, topDirectoryName  )
        const tags: string[] = notNil( blogProps[ TAGS ] ) ? blogProps[ TAGS ] : []

        const introduction: string = notNil( blogProps[ INTRODUCTION ] ) ?
          blogProps[ INTRODUCTION ] :
          utilGetters.getBlogIntroduction( blogPath )

        const blogInfo: BlogInfo = {
          [ NAME_PATH ]          : blogPath,
          [ RELATIVE_CLIENT_URL ]: relativeClientUrl,
          [ RELATIVE_CLIENT_PROPS_URL ]: relativeClientPropsUrl,
          [ NAME ]               : name,
          [ CREATE_TIME ]        : createTime,
          [ CATEGORY_SEQUENCE ]  : categorySequence,
          [ TAGS ]        : tags,
          [ INTRODUCTION ]: introduction
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

  getBlogRelativeClientUrl( blogPath: string ) {
    const { config, root } = this.store
    const { [ TOP_DIRECTORY_NAME ]: topDirectoryName } = config

    const extension: string = PATH.extname( blogPath )
    const r: RegExp = new RegExp( `${extension}$` )
    const targetBlogHtmlPath = blogPath.replace( r, DOT_HTML )

    return `${topDirectoryName}/${PATH.relative( root, targetBlogHtmlPath )}`
  }

  getBlogRelativeClientPropsUrl( blogPath: string ) {
    const { config, root } = this.store
    const { [ TOP_DIRECTORY_NAME ]: topDirectoryName } = config
    const upperPath = PATH.resolve( blogPath, '../' )
    const targetPath = PATH.resolve( upperPath, CLIENT_BLOG_PROPS_JSON  )

    return `${topDirectoryName}/${PATH.relative( root, targetPath )}`
  }


  getClientTagJsonPath( tagName: string ): string {
    const { clientNavTagsDirectoryPath, utilGetters } = this
    const tagJsonFileName = utilGetters.getClientTagJsonFileName( tagName )
    return PATH.resolve( clientNavTagsDirectoryPath, tagJsonFileName )
  }

  getBlogDetailPageHtmlPath( relativeClientUrl: string ) {
    const { output } = this.store
    return PATH.resolve( output, relativeClientUrl )
  }

  getClientBlogPropsJsonPath( relativeClientPropsUrl: string ): string {
    const { output } = this.store
    return PATH.resolve( output, relativeClientPropsUrl )
  }

  getBlogDetailPageHtml( blog: BlogInfo ): string {
    const { [ DETAIL_SCRIPTS ]: detailScripts } = this.store.config
    const { [ NAME_PATH ]: blogPath, [ NAME ]: blogName, [ RELATIVE_CLIENT_PROPS_URL ]: relativeClientPropsUrl } = blog
    const string = readFileSync( blogPath )
    if ( string ) {
      const markedHtml = marked( string )

      return GET_BLOG_DETAIL_HTML( {
        [ NAME ]            : blogName,
        [ MARKED_HTML ]     : markedHtml,
        [ DETAIL_SCRIPTS ]: detailScripts,
        [ RELATIVE_CLIENT_PROPS_URL ]: relativeClientPropsUrl 
      } )
    }
    return ""
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
      const { [RELATIVE_CLIENT_URL]: relativeClientUrl, [RELATIVE_CLIENT_PROPS_URL]: relativeClientPropsUrl } = blogInfo
      

      /**
       * Build html
       */
      const outputHtmlPath = self.getters.getBlogDetailPageHtmlPath( relativeClientUrl )
      const html = getters.getBlogDetailPageHtml( blogInfo )
      if ( !utilGetters.isSameFileTextsWithText( outputHtmlPath, html ) ) {
        FS.outputFileSync( outputHtmlPath, html )
      }

      /**
       * Build props.json
       */
      const clientBlogProps = utilGetters.getClientBlogPropsBy( blogInfo )
      const clientBlogPropsJsonPath = getters.getClientBlogPropsJsonPath( relativeClientPropsUrl )
      FS.outputJSONSync( clientBlogPropsJsonPath, clientBlogProps )
    }
  }
}

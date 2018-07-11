import build from "../../index"
import {
  NAV_SCRIPTS,
  DETAIL_SCRIPTS,
  NAME_OF_DIRECTORY_PLACING_DATA_EXCEPT_NAV_HTML,
  LANG,
  NAV_META_DESCRIPTION,
  GET_NAV_META_DESCRIPTION,
  SITEMAP_FILE_NAME,
  SITEMAP_ROOT_WEBSITE,
  FILES_COPY_TO_OUTPUT
} from "../../constants/configNames"
import { CN, NAV, DETAIL } from "../../constants/names"

const PATH = require( "path" )

describe( `GetBlogsOriginInfo`, function() {
  it( `Test`, function() {
    const root = PATH.resolve( __dirname, "./rootCategory" )
    const output = PATH.resolve( __dirname, "./output" )
    const textLogo = "Custom Blog"
    const slogan = "Custom slogan"
    const other = "other"
    const sitemapFileName = "sitemap.txt"
    const sitemapRootWebsite = "http://testWebsite.io"

    build( root, output, {
      textLogo,
      other,

      // [ NAME_OF_DIRECTORY_PLACING_DATA_EXCEPT_NAV_HTML ]: "nameOfDirectoryPlacingDataExceptNavHtml",
      [ LANG ]: CN,

      [ SITEMAP_FILE_NAME ]   : sitemapFileName,
      [ SITEMAP_ROOT_WEBSITE ]: sitemapRootWebsite,

      [ NAV ]: {
        [ NAV_SCRIPTS ]             : [ '<script src="nav.test.js" />' ],
        // [ NAV_META_DESCRIPTION ]: 'Custom nav meta description',
        [ GET_NAV_META_DESCRIPTION ]: ( { title, text }: any ) => {
          return `${title} ${slogan} ${text}`
        }
      },

      [ DETAIL ]: {
        [ DETAIL_SCRIPTS ]: [ '<script src="detail.test.js" />' ]
      },

      [ FILES_COPY_TO_OUTPUT ]: [ PATH.resolve(__dirname, 'copyingFile.txt') ]

      
    } )
    expect( true ).toBe( false )
  } )
} )

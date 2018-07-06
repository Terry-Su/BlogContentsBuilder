import build from "../../index"
import {
  NAV_SCRIPTS,
  DETAIL_SCRIPTS,
  NAME_OF_DIRECTORY_PLACING_DATA_EXCEPT_NAV_HTML,
  LANG,
  NAV_META_DESCRIPTION,
  GET_NAV_META_DESCRIPTION
} from "../../constants/configNames"
import { CN } from "../../constants/names"

const PATH = require( "path" )

describe( `GetBlogsOriginInfo`, function() {
  it( `Test`, function() {
    const root = PATH.resolve( __dirname, "./rootCategory" )
    const output = PATH.resolve( __dirname, "./output" )

    const slogan = "Custom slogan"

    build( root, output, {
      [ NAV_SCRIPTS ]             : [ '<script src="nav.test.js" />' ],
      // [ NAV_META_DESCRIPTION ]: 'Custom nav meta description',
      [ GET_NAV_META_DESCRIPTION ]: ( { title, text }: any ) => {
        return `${title} ${slogan} ${text}`
      },
      [ DETAIL_SCRIPTS ]                                : [ '<script src="detail.test.js" />' ],
      textLogo                                          : "Custom Blog",
      [ NAME_OF_DIRECTORY_PLACING_DATA_EXCEPT_NAV_HTML ]:
        "nameOfDirectoryPlacingDataExceptNavHtml",
      [ LANG ]: CN
    } )
    expect( true ).toBe( false )
  } )
} )

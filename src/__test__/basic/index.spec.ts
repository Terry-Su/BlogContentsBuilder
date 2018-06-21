import build from "../../index"
import { NAV_SCRIPTS, DETAIL_SCRIPTS, NAME_OF_DIRECTORY_PLACING_DATA_EXCEPT_NAV_HTML, LANG } from '../../constants/configNames';
import { CN } from "../../constants/names";

const PATH = require( "path" )

describe( `GetBlogsOriginInfo`, function() {
  it( `Test`, function() {
    const root = PATH.resolve( __dirname, "./rootCategory" )
    const output = PATH.resolve( __dirname, "./output" )
    build( root, output, {
      [ NAV_SCRIPTS ]: [ '<script src="nav.test.js" />' ],
      [ DETAIL_SCRIPTS ]: [ '<script src="detail.test.js" />' ],
      textLogo                : "Custom Blog",
      slogan                  : "Custom slogan",
      [ NAME_OF_DIRECTORY_PLACING_DATA_EXCEPT_NAV_HTML ]: 'nameOfDirectoryPlacingDataExceptNavHtml',
      [LANG]: CN
    } )
    expect( true ).toBe( true )
  } )
} )

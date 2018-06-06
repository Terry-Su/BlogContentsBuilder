import build from "../../index"
import { INSERTED_SCRIPTS, CLIENT_TEXT_LOGO, CLIENT_SLOGAN } from '../../constants/names';

const PATH = require( "path" )

describe( `GetBlogsOriginInfo`, function() {
  it( `Test`, function() {
    const root = PATH.resolve( __dirname, "./rootCategory" )
    const output = PATH.resolve( __dirname, "./output" )
    build( root, output, { [ INSERTED_SCRIPTS ]: [ '<script src="test.js" />' ], [CLIENT_TEXT_LOGO]: 'Custom Blog', [CLIENT_SLOGAN]: 'Custom slogan' } )
    expect( true ).toBe( true )
  } )
} )

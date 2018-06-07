import build from "../../index"
import { INSERTED_SCRIPTS } from '../../constants/configNames';

const PATH = require( "path" )

describe( `GetBlogsOriginInfo`, function() {
  it( `Test`, function() {
    const root = PATH.resolve( __dirname, "./rootCategory" )
    const output = PATH.resolve( __dirname, "./output" )
    build( root, output, { [ INSERTED_SCRIPTS ]: [ '<script src="test.js" />' ], textLogo: 'Custom Blog', slogan: 'Custom slogan' } )
    expect( true ).toBe( true )
  } )
} )

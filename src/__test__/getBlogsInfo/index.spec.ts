import build from "../../index";

const PATH = require( "path" )

describe( `GetBlogsOriginInfo`, function() {
  it( `Test`, function() {
    const root = PATH.resolve( __dirname, './category1' )
    const output = PATH.resolve( __dirname, './output' )
    build( root, output )
    expect( true ).toBe( true )
  } )
} )

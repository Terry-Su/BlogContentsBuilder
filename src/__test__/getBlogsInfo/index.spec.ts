import build from "../../index";
import { INSERTED_SCRIPTS } from '../../constants/names';

const PATH = require( "path" )

describe( `GetBlogsOriginInfo`, function() {
  it( `Test`, function() {
    const root = PATH.resolve( __dirname, './category1' )
    const output = PATH.resolve( __dirname, './output' )
    build( root, output, { [ INSERTED_SCRIPTS ]: [ '<script src="test.js" />' ] } )
    expect( true ).toBe( true )
  } )
} )

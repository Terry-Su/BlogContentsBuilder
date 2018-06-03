import * as FS from 'fs-extra'

export default function ( path: string ) {
  let res: string = null

  try {
    const json =  FS.readJsonSync( path )
    res = json
  } catch( e ) {
    console.log( e )
  }

  return res
}
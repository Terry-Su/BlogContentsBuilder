import * as FS from "fs-extra"

export function readFileSync( path: string ) {
  try {
    return  FS.readFileSync( path, { encoding: 'utf8' } )
  } catch( e ) {
    return null
  }  
}
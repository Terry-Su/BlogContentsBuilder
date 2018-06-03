import * as PATH from 'path';


export default function ( path: string ) {
  return PATH.basename( path, PATH.extname( path ) )
}
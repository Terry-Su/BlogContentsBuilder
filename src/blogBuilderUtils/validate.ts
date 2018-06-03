import { DOT_MD } from "../constants/fileExtension";
import { isNaN } from 'lodash';


export const isMarkdownFileName = ( filename: string ): boolean => {
  const r = new RegExp( `${ DOT_MD }$` )
  return r.test( filename )
}

export const isValidDateString = ( string: string ) => ! isNaN( Date.parse( string ) )
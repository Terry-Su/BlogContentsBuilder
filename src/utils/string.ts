export function isEmptyString( string: string ) {
  return string === ""
}

export function sliceWordsString( string: string, limitCount: number ) {
  const strings = string.split( "" )
  let target = limitCount
  strings &&
    strings.some( ( string, index ) => {
      const count = index + 1
      if ( count > limitCount && string === " " ) {
        target = count - 1
        return true
      }
    } )

  return string.substr( 0, target )
}

export function removeHtmlPunctions( string: string ) {
  let res = string
  res
    .replace( /\</g, "" )
    .replace( /\>/g, "" )
    .replace( /\//g, "" )
  return res
}

export function sliceWordsString(string: string, limitCount: number) {
  const strings = string.split( ' ' )
  let total = 0

  strings && strings.map( string => {
    if ( total <= limitCount ) {
      const count = string.length
      total = total + count
    }
  } )
  return string.substr( 0, total )
}

export function removeHtmlPunctions( string: string ) {
  let res = string
  res
    .replace( /\</g, "" )
    .replace( /\>/g, "" )
    .replace( /\//g, "" )
  return res
}
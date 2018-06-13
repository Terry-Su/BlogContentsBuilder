import { NAME, MARKED_HTML } from "../names"
import { DETAIL_SCRIPTS } from "../configNames"
export default function( data: any ) {
  const {
    [ NAME ]: name,
    [ MARKED_HTML ]: markedHtml,
    [ DETAIL_SCRIPTS ]: scripts
  } = data

  let scriptsString = ""
  scripts.map( ( scriptString: string ) => {
    scriptsString = scriptsString + scriptString
  } )

  const GV = {}
  const GVJsonString = JSON.stringify( GV )

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>${name}</title>
</head>
<body>
  <div id="markedHtml" style="display: none;">${markedHtml}</div>
  <div id="app"></div>

  
  <script>window.GV=${GVJsonString}</script>
  ${scriptsString}
</body>
</html>
`
}

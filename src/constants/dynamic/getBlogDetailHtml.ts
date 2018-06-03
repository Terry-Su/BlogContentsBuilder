import { INSERTED_SCRIPTS, NAME, MARKED_HTML } from "../names";
export default function({
  [NAME]: name,
  [MARKED_HTML]: markedHtml,
  [INSERTED_SCRIPTS]: insertedScripts
}: any) {
  let insertedScriptsString = ''
  insertedScripts.map( ( scriptString: string ) => {
    insertedScriptsString = insertedScriptsString + scriptString
  } )

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
  ${markedHtml}

  ${insertedScriptsString}
</body>
</html>
`;
}

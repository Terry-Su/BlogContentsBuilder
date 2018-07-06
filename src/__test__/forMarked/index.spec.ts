import * as marked from 'marked'


describe( `For marked`, () => {
  it( 'Test', () => {
    const markdownText = `
### 123
<div>123</div>
`

    const markedHtml = marked( markdownText )

    console.log( markedHtml )

    expect( true ).toBe( true )
  } )
})
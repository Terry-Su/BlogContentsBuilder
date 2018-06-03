import BlogBuilder from './BlogBuilder';

function build( root: string, output: string ) {
  const builder = new BlogBuilder( root, output )

  builder.build()
}
export default build
// module.exports = build
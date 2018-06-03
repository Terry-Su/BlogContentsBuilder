import BlogBuilder from './BlogBuilder';

function build( root: string, output: string, config?: any ) {
  const builder = new BlogBuilder( root, output )

  builder.build( config )
}
export default build
// module.exports = build
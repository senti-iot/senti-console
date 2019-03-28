const reqSvgs = require.context ( 'assets/img/loginImages', true, /\.svg$/ )
const paths = reqSvgs.keys ()

const svgs = paths.map( path => reqSvgs ( path ) )


export default svgs
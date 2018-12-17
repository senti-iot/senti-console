import { red, green, yellow } from '@material-ui/core/colors'

const colorFunc = (status) => {
	switch (status) {
		case 0: {
			return { primary: red[700], secondary: red[100] }
		}
		case 1: {
			return { primary: yellow[600], secondary: yellow[100] }
		}
		case 2: {
			return { primary: green[700], secondary: green[100] }
		}
		default:
			return { primary: green[700], secondary: green[100] }
	}
}

export const MarkerIcon = (status) => {
	let color = colorFunc(status)
	return (`<?xml version='1.0' encoding='UTF-8' standalone='no'?>
<svg
   xmlns:dc='http://purl.org/dc/elements/1.1/'
   xmlns:cc='http://creativecommons.org/ns#'
   xmlns:rdf='http://www.w3.org/1999/02/22-rdf-syntax-ns#'
   xmlns:svg='http://www.w3.org/2000/svg'
   xmlns='http://www.w3.org/2000/svg'
   id='svg6'
   version='1.1'
   viewBox='0 0 24 24'
   height='24'
   width='24'>
  <metadata
     id='metadata12'>
    <rdf:RDF>
      <cc:Work
         rdf:about=''>
        <dc:format>image/svg+xml</dc:format>
        <dc:type
           rdf:resource='http://purl.org/dc/dcmitype/StillImage' />
        <dc:title></dc:title>
      </cc:Work>
    </rdf:RDF>
  </metadata>
  <defs
     id='defs10' />
  <path
     id='path2'
     fill='none'
     d='M0 0h24v24H0z' />
  <path
	 id='path4'
	 style='fill:${color.primary}'
     d='M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z' />
  <path
     id='path822'
     d='M 7.0293273,12.003107 V 5.0286315 H 12 16.970673 v 6.9744755 6.974475 H 12 7.0293273 Z'
     style='fill:${color.secondary};fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:0.0310667' />
</svg>
`)
}

export default MarkerIcon

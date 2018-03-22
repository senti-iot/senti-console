export default function MapMarker(color, size) {
	return (
		`<?xml version="1.0" standalone="no"?>
				<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 20010904//EN"
 					"http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">
					<svg version="1.0" xmlns="http://www.w3.org/2000/svg"
						 width="${size}" height="${size}" viewBox="0 0 50.000000 82.000000"
						 preserveAspectRatio="xMidYMid meet">
						 <defs>
						 <linearGradient id="gradient" x1="0%" y1="100%" x2="100%" y2="0%">  
							 <stop offset="0" stop-color="white" stop-opacity="0.25" />  
							 <stop offset="1" stop-color="white" stop-opacity="1" />  
						   </linearGradient>
						   <mask id="easyMask" x="0" y="0" width="1" height="1"
						   maskContentUnits="objectBoundingBox">
						 	  <rect x="0" y="0" width="1" height="1"
							   style="fill-opacity: 1; fill: url(#gradient);"/>
					 		 </mask> 
						 </defs> 
							<g transform="translate(0.000000,82.000000) scale(0.050000,-0.050000)"
								fill="${color}" mask="url(#easyMask)" stroke="none">
							<path d="M340 1578 c-238 -94 -371 -335 -317 -575 29 -128 441 -953 477 -953
									 32 0 412 751 462 914 117 382 -262 756 -622 614z m271 -347 c150 -150 -69
									 -374 -223 -229 -102 95 -28 278 112 278 39 0 80 -18 111 -49z"/>
							</g>
					</svg>`
	)
}
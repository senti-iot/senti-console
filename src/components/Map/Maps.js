import React from 'react';
import { compose, withProps } from 'recompose';
import {
	withScriptjs,
	withGoogleMap,
} from 'react-google-maps';
import { CircularLoader } from 'components';
import MapComponent from 'components/Map/MapComponent';

export const Maps = compose(
	withProps({
		googleMapURL:
			'https://maps.googleapis.com/maps/api/js?key=' + process.env.REACT_APP_SENTI_MAPSKEY + '&v=3.exp&libraries=visualization,geometry,drawing,places',
		loadingElement: <CircularLoader notCentered />,
		containerElement: <div style={{ height: `calc(100vh - 166px)`, width: '100%' }} />,
		mapElement: <div id={'map'} style={{ height: `100%` }} />,
	}),
	withScriptjs,
	withGoogleMap
)(MapComponent)

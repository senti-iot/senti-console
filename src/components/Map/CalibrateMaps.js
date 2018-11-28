import React from 'react';
import { compose, withProps } from 'recompose';
import {
	withScriptjs,
	withGoogleMap,
} from 'react-google-maps';
import { CircularLoader } from 'components';
import CalibrateMapComponent from 'components/Map/CalibrateMapComponent';

export const CalibrateMap = compose(
	withProps({
		googleMapURL:
			'https://maps.googleapis.com/maps/api/js?key=' + process.env.REACT_APP_SENTI_MAPSKEY + '&v=3.exp&libraries=visualization,geometry,drawing,places',
		loadingElement: <CircularLoader notCentered />,
		containerElement: <div style={{ height: `400px`, width: '100%' }} />,
		mapElement: <div id={'map'} style={{ height: `100%` }} />,
	}),
	withScriptjs,
	withGoogleMap
)(CalibrateMapComponent)

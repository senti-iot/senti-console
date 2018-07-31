import React from 'react';
import { TextF } from '..';
const { compose, withProps, lifecycle } = require("recompose");
const {
	withScriptjs,
} = require("react-google-maps");
const { StandaloneSearchBox } = require("react-google-maps/lib/components/places/StandaloneSearchBox");

export const PlacesWithStandaloneSearchBox = compose(
	withProps({
		googleMapURL: 
			"https://maps.googleapis.com/maps/api/js?key=" + process.env.REACT_APP_SENTI_MAPSKEY + "&v=3.exp&libraries=geometry,drawing,places",
		loadingElement: <div style={{ height: `100%` }} />,
		containerElement: <div style={{ height: `400px` }} />,
	}),
	lifecycle({
		componentWillMount() {
			const refs = {}
			this.setState({
				places: [],
				onSearchBoxMounted: ref => {
					refs.searchBox = ref;
				},
				handleChange: (e) => {
					this.props.handleChange(e)
				}
			})
		},
	}),
	withScriptjs  
)(props => { 
	return 	<StandaloneSearchBox
		ref={props.onSearchBoxMounted}
		bounds={props.bounds}
		onPlacesChanged={props.onPlacesChanged}
	>
		<TextF
			id={"calibrate-address"}
			label={"Address"}
			handleChange={props.handleChange}
			noFullWidth
		/>
	</StandaloneSearchBox>

}
);

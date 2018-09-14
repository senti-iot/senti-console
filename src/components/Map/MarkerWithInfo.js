import React, { Component } from 'react'
import { InfoWindow, Marker } from 'react-google-maps';
import { MarkerIcon } from './MarkerIcon';
import { ItemGrid, Info } from '..';

export class MarkerWithInfo extends Component {
	constructor(props) {
	  super(props)
	
	  this.state = {
		 isOpen: false
	  }
	}
	onToggleOpen = () => {
		this.setState({ isOpen: !this.state.isOpen })
	}
	render() {
		const { m, i  } = this.props
		const { isOpen } = this.state
		return (
			<Marker icon={{ url: `data:image/svg+xml,${MarkerIcon(m.liveStatus)}` }} onClick={this.onToggleOpen} key={i} position={{ lat: m.lat, lng: m.long }}>
				{isOpen && <InfoWindow onCloseClick={this.onToggleOpen}
					options={{
						alignBottom: true,
						boxStyle: {
							width: '500px'
						},
						closeBoxURL: ``,
						enableEventPropagation: true
					}}>
					<ItemGrid container noMargin>
						<ItemGrid>
							<Info>
								{m.id}
							</Info>
						</ItemGrid>
					</ItemGrid>
				</InfoWindow>}
			</Marker>
		)
	}
}

export default MarkerWithInfo

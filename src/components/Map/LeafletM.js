

import L from 'leaflet'
import React from 'react'

import { MapLayer, LeafletProvider, withLeaflet } from 'react-leaflet'


class Marker extends MapLayer {
	
	createLeafletElement(props) {
		let options = this.getOptions(props)
		const el = new L.Marker(props.position, options)
		this.contextValue = { ...props.leaflet, popupContainer: el }
		return el
	}

	updateLeafletElement(fromProps, toProps) {
		if (toProps.position !== fromProps.position) {
			this.leafletElement.setLatLng(toProps.position)
		}
		if (toProps.icon !== fromProps.icon) {
			this.leafletElement.setIcon(toProps.icon)
		}
		if (toProps.zIndexOffset !== fromProps.zIndexOffset) {
			this.leafletElement.setZIndexOffset(toProps.zIndexOffset)
		}
		if (toProps.opacity !== fromProps.opacity) {
			this.leafletElement.setOpacity(toProps.opacity)
		}
		if (toProps.draggable !== fromProps.draggable) {
			if (toProps.draggable === true) {
				this.leafletElement.dragging.enable()
			} else {
				this.leafletElement.dragging.disable()
			}
		}
	}

	render() {
		const { children } = this.props
		return children == null || this.contextValue == null ? null : (
			<LeafletProvider value={this.contextValue}>{children}</LeafletProvider>
		)
	}
}

export default withLeaflet(Marker)

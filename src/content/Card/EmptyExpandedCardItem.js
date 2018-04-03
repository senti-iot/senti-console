import React, { Component } from 'react'
import {
	HorizontalControls,
	VerticalControls, VerticalButton, HorizontalButton, HorizontalControlsDrawer, ControlButton, VerticalControlsButtons, /* ProjectBarContainer, ProjectBarLabel,
	ProjectBar, */
} from './CardItemStyles'

import {
	ExpandedShadow, Overlay, OverlayPreventPropagation,
	OpenSesame
} from './ExpandedCardStyles'

import { Icon } from 'odeum-ui'

export default class ExpandedCardItem extends Component {
	constructor(props) {
		super(props)

		this.state = {
			expand: false
		}
	}
	preventPropagation = () => e => {
		e.stopPropagation()
	}
	render() {
		// const { item } = this.props
		const horizontalExpand = false
		return (
			<Overlay onClick={this.props.handleVerticalExpand} pose={this.props.cardExpand ? 'open' : 'close'}>
				<OpenSesame pose={this.props.cardExpand ? 'open' : 'close'}>
					<OverlayPreventPropagation onClick={this.preventPropagation()}>
						<ExpandedShadow>
							<ExpandedShadow>
								{this.props.children}
							</ExpandedShadow>
							<HorizontalControls expand={horizontalExpand} >
								<HorizontalControlsDrawer expand={horizontalExpand}>
									<ControlButton><Icon icon={'mode_edit'} iconSize={30} /></ControlButton>
									<ControlButton><Icon icon={'mode_edit'} iconSize={30} /></ControlButton>
									<ControlButton><Icon icon={'mode_edit'} iconSize={30} /></ControlButton>
								</HorizontalControlsDrawer>
								<HorizontalButton expand={horizontalExpand} onClick={this.handleHorizontalExpand}>
									<div style={{ transform: 'perspective(20px) rotateX(20deg)' }}>
										{'\u2022 \u2022 \u2022'}
									</div>
								</HorizontalButton>
							</HorizontalControls>
							<VerticalControls onClick={this.handleVerticalExpand}>
								<VerticalControlsButtons>
									<VerticalButton>{'\u2022'}</VerticalButton>
									<VerticalButton>{'\u2022'}</VerticalButton>
									<VerticalButton>{'\u2022'}</VerticalButton>
								</VerticalControlsButtons>
							</VerticalControls>

						</ExpandedShadow>

					</OverlayPreventPropagation>
				</OpenSesame>
			</Overlay>
		)
	}
}

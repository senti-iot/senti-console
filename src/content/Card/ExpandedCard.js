import React, { Component } from 'react'
import {
	HorizontalControls,
	VerticalControls, VerticalButton, HorizontalButton, HorizontalControlsDrawer, ControlButton, VerticalControlsButtons, Wheels, /* ProjectBarContainer, ProjectBarLabel,
	ProjectBar, */
} from './CardItemStyles'

import {
	ExpandedShadow, Overlay, OverlayPreventPropagation,
	OpenSesame
} from './ExpandedCardStyles'

import { Icon } from 'odeum-ui'

export default class ExpandedCard extends Component {
	constructor(props) {
		super(props)

		this.state = {
			expand: false,
			horizontalExpand: false
		}
	}
	handleHorizontalExpand = () => {
		// e.preventDefault()
		this.setState({ horizontalExpand: !this.state.horizontalExpand })
	}
	preventPropagation = () => e => {
		e.stopPropagation()
	}
	handleOverlay = () => e => {
		if (this.props.handleVerticalExpand)
			this.props.handleVerticalExpand(false)(e)
		this.setState({ horizontalExpand: false })

	}
	render() {
		const { horizontalExpand } = this.state
		return (
			<Overlay onClick={this.handleOverlay()} pose={this.props.cardExpand ? 'open' : 'close'}>
				<OpenSesame pose={this.props.cardExpand ? 'open' : 'close'}>
					<OverlayPreventPropagation onClick={this.preventPropagation()}>
						<ExpandedShadow>
							<ExpandedShadow>
								{this.props.children}
							</ExpandedShadow>
							<HorizontalControls>
								<Wheels pose={horizontalExpand ? 'drawerOpen' : 'drawerClosed'}>
									<HorizontalControlsDrawer >
										<ControlButton><Icon icon={'mode_edit'} iconSize={30} /></ControlButton>
										<ControlButton><Icon icon={'mode_edit'} iconSize={30} /></ControlButton>
										<ControlButton><Icon icon={'mode_edit'} iconSize={30} /></ControlButton>
									</HorizontalControlsDrawer>
									<HorizontalButton onClick={this.handleHorizontalExpand}>
										<div style={{ transform: 'perspective(40px) rotateX(20deg)' }}>
											{'\u2022 \u2022 \u2022'}
										</div>
									</HorizontalButton>
								</Wheels>
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

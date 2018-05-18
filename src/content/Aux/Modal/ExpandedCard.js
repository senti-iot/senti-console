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
	handleOverlay = () => {
		if (this.props.handleVerticalExpand)
			this.props.handleVerticalExpand(false)
		else {
			this.setState({ horizontalExpand: false })
		}

	}
	render() {
		const { horizontalExpand } = this.state
		return (
			<Overlay onClick={this.handleOverlay} pose={this.props.cardExpand ? 'open' : 'close'}>
				<OpenSesame pose={this.props.cardExpand ? 'open' : 'close'}>
					<OverlayPreventPropagation width={this.props.width} height={this.props.height} onClick={this.preventPropagation()}>
						<ExpandedShadow width={this.props.width} height={this.props.height}>
							<ExpandedShadow>
								{this.props.children}
							</ExpandedShadow>
							{this.props.horizontalControls ? <HorizontalControls>
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
							</HorizontalControls> : null}
							{this.props.verticalControls ? <VerticalControls onClick={this.handleVerticalExpand}>
								<VerticalControlsButtons>
									<VerticalButton>{'\u2022'}</VerticalButton>
									<VerticalButton>{'\u2022'}</VerticalButton>
									<VerticalButton>{'\u2022'}</VerticalButton>
								</VerticalControlsButtons>
							</VerticalControls>
								: null}

						</ExpandedShadow>

					</OverlayPreventPropagation>
				</OpenSesame>
			</Overlay>
		)
	}
}
ExpandedCard.defaultProps = {
	verticalControls: true,
	horizontalControls: true,
	height: '80%',
	width: '80%'
}
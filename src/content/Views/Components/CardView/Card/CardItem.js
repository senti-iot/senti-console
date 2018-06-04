import React, { Component } from 'react'
import { Icon } from 'odeum-ui'
import {
	Text, FormCardContainer, FormImg, ProjectInfoContainer, ProjectInfoCategory, ProjectInfo, ProjectInfoTitle, HorizontalControls,
	VerticalControls, VerticalButton, HorizontalButton, HorizontalControlsDrawer, Shadow, ControlButton, ProjectBarContainer, ProjectBarLabel,
	ProjectBar,
	VerticalControlsButtons,
	HorizontalButtonText,
	Wheels,
	CardImg
} from '../../../../Aux/Modal/CardItemStyles'
import ExpandedCardInfo from './ExpandedCardInfo'
// import {  } from '../../../../Aux/Modal/CardItemStyles'
import { LoaderSmall } from 'LoginStyles'
import { SmallLoaderContainer } from '../../ListView/List/ListStyles'
import PropTypes from 'prop-types'

export default class FormCard extends Component {

	constructor(props) {
		super(props)
		this.state = {
			horizontalExpand: false,
			expand: false,
			img: false
		}
	}
	handleHorizontalExpand = () => {
		this.setState({ horizontalExpand: !this.state.horizontalExpand })
	}
	handleControlExpand = () => {
		this.setState({ expand: true, horizontalExpand: false })
		// console.log(this.state)
	}
	handleOpenCard = () => {
		this.setState({ expand: true, horizontalExpand: false })
	}
	handleOverlay = (open) => {
		this.setState({ expand: open, horizontalExpand: false })
	}
	render() {
		const { horizontalExpand, expand, img } = this.state
		const { item } = this.props
		return (
			<React.Fragment>
				<ExpandedCardInfo {...this.props} expand={expand} handleOverlay={this.handleOverlay} />
				<FormCardContainer>
					<Shadow>
						<CardImg>
							{!img ? <SmallLoaderContainer><LoaderSmall /></SmallLoaderContainer> : null}
							<FormImg src={item.img ? item.img : 'https://picsum.photos/1920/1404/?random=0'} onLoad={() => this.setState({ img: true })} />

						</CardImg>
						<div style={{ display: 'flex', height: 30, fontSize: 26, width: '100%', justifyContent: 'flex-start', alignItems: 'center', margin: 4 }}>
							<Text style={{ marginLeft: 8 }} title={item.title}>{item.title}</Text>
						</div>
						<ProjectInfoContainer>
							<ProjectInfoCategory>
								<ProjectInfoTitle>
									{'Seneste Registering'}
								</ProjectInfoTitle>
								<ProjectInfo>
									{item.seneste_reg/* .toLocaleDateString() */}
								</ProjectInfo>
							</ProjectInfoCategory>
							<ProjectInfoCategory>
								<ProjectInfoTitle>
									{'Kontakt'}
								</ProjectInfoTitle>
								<ProjectInfo>
									{/* {item.user.name} */}
								</ProjectInfo>
							</ProjectInfoCategory>
						</ProjectInfoContainer>
						<ProjectBarContainer>
							<ProjectBarLabel progress={item.progress}>{item.progress ? item.progress + '%' : '0%'}</ProjectBarLabel>
							<ProjectBar progress={item.progress} />
						</ProjectBarContainer>
					</Shadow>
					<HorizontalControls >
						<Wheels pose={horizontalExpand ? 'drawerOpen' : 'drawerClosed'}>
							<HorizontalControlsDrawer>
								<ControlButton><Icon icon={'mode_edit'} iconSize={30} onClick={this.handleOpenCard} /></ControlButton>
								<ControlButton><Icon icon={'mode_edit'} iconSize={30} /></ControlButton>
								<ControlButton><Icon icon={'mode_edit'} iconSize={30} /></ControlButton>
							</HorizontalControlsDrawer>
							<HorizontalButton onClick={this.handleHorizontalExpand}>
								<HorizontalButtonText>
									{'\u2022 \u2022 \u2022'}
								</HorizontalButtonText>
							</HorizontalButton>
						</Wheels>
					</HorizontalControls>
					<VerticalControls onClick={this.handleOpenCard}>
						<VerticalControlsButtons>
							<VerticalButton>{'\u2022'}</VerticalButton>
							<VerticalButton>{'\u2022'}</VerticalButton>
							<VerticalButton>{'\u2022'}</VerticalButton>
						</VerticalControlsButtons>
					</VerticalControls>
				</FormCardContainer>
			</React.Fragment>
		)
	}
}

FormCard.propTypes = {
	item: PropTypes.object.isRequired,
	column: PropTypes.array.isRequired
}
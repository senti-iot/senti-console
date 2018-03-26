import React, { Component } from 'react'
import {
	HorizontalControls,
	VerticalControls, VerticalButton, HorizontalButton, HorizontalControlsDrawer, ControlButton, /* ProjectBarContainer, ProjectBarLabel,
	ProjectBar, */
} from './CardItemStyles'

import { ExpandedShadow, Overlay, OverlayPreventPropagation, 
/* 	ExpandedProjectInfoContainer, ExpSection, ExpHeader, ExpFormImg, ExpTitle, ExpAddress, UserContainer, Username, Avatar, ExpProjectInfoTitle, ExpProjectInfo, ExpProjectInfoItem  */} from './ExpandedCardStyles'

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
			<Overlay onClick={this.props.handleVerticalExpand}>
				<OverlayPreventPropagation onClick={this.preventPropagation()}>
					<ExpandedShadow>
						<ExpandedShadow>
							{/* <ExpFormImg img={item.img ? item.img : 'https://picsum.photos/1920/1404/?random=0'} />
							<ExpHeader>
								<ExpTitle title={item.title}>{item.title}
									<ExpAddress>{item.address}</ExpAddress>
								</ExpTitle>

								<UserContainer>
									<Username>{item.user.name}</Username>
									<Avatar src={item.user.img} alt="" />
								</UserContainer>
							</ExpHeader>
							<ExpandedProjectInfoContainer>


								<ExpSection>
									<ExpProjectInfoTitle>
										{'Enheder'} ({item.devices.length})
									</ExpProjectInfoTitle>
									<ExpProjectInfo>
										<ExpProjectInfoItem>
											{item.devices[0].toString()}
										</ExpProjectInfoItem>
										<ExpProjectInfoItem>
											{item.devices[1].toString()}
										</ExpProjectInfoItem>
										<ExpProjectInfoItem>
											{item.devices[2].toString()}
										</ExpProjectInfoItem>
									</ExpProjectInfo>
								</ExpSection>

								<ExpSection>

									<ExpProjectInfoTitle>
										{'Seneste Registering'}
									</ExpProjectInfoTitle>
									<ExpProjectInfo>
										<ExpProjectInfoItem>
											{item.seneste_reg.toLocaleDateString()}
										</ExpProjectInfoItem>
										<ExpProjectInfoItem>
											{item.seneste_reg.toLocaleDateString()}
										</ExpProjectInfoItem>
										<ExpProjectInfoItem>
											{item.seneste_reg.toLocaleDateString()}
										</ExpProjectInfoItem>

									</ExpProjectInfo>
								</ExpSection>


								<ExpSection>
									<ExpProjectInfoTitle>
										{'Nøgletal for projekt'}
									</ExpProjectInfoTitle>
									<ExpProjectInfo>
										<ExpProjectInfoItem>
											Total hits:	{item.hits}
										</ExpProjectInfoItem>
										<ExpProjectInfoItem>
											{item.seneste_reg.toLocaleDateString()}
										</ExpProjectInfoItem>
										<ExpProjectInfoItem>
											{item.seneste_reg.toLocaleDateString()}
										</ExpProjectInfoItem>

									</ExpProjectInfo>
								</ExpSection>
							</ExpandedProjectInfoContainer>
							<ProjectBarContainer>
								<ProjectBarLabel progress={item.progress}>{item.progress ? item.progress + '%' : '0%'}</ProjectBarLabel>
								<ProjectBar progress={item.progress} />
							</ProjectBarContainer> */}
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
							<div
								style={{
									display: 'flex',
									flexFlow: 'column nowrap',
									transform: 'perspective(40px) rotateY(-20deg)'
								}}>
								<VerticalButton>{'\u2022'}</VerticalButton>
								<VerticalButton>{'\u2022'}</VerticalButton>
								<VerticalButton>{'\u2022'}</VerticalButton>
							</div>
						</VerticalControls>

					</ExpandedShadow>

				</OverlayPreventPropagation>

			</Overlay>
		)
	}
}

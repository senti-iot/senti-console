import React, { Component } from 'react'
import { Icon } from 'odeum-ui'
import {
	Text, FormCardContainer, FormImg, ProjectInfoContainer, ProjectInfoCategory, ProjectInfo, ProjectInfoTitle, HorizontalControls,
	VerticalControls, VerticalButton, HorizontalButton, HorizontalControlsDrawer, Shadow, ControlButton, ProjectBarContainer, ProjectBarLabel,
	ProjectBar
} from './CardItemStyles'

export default class FormCard extends Component {
	constructor(props) {
		super(props)

		this.state = {
			horizontalExpand: false,
			verticalExpand: false
		}
	}
	handleHorizontalExpand = () => {
		this.setState({ horizontalExpand: !this.state.horizontalExpand })
	}
	render() {
		const { horizontalExpand, /* verticalExpand */ } = this.state
		const { item, /* column */ } = this.props
		return (
			<FormCardContainer>
				<Shadow>
					<FormImg img={item.img ? item.img : 'https://picsum.photos/1920/1404/?random=0'} />
					<div style={{ display: 'flex', height: 30, fontSize: 26, width: '100%', justifyContent: 'flex-start', alignItems: 'center', margin: 4 }}>
						<Text style={{ marginLeft: 8 }} title={item.title}>{item.title}</Text>
					</div>
					<ProjectInfoContainer>
						{/* {Object.keys(item).map((i, index) =>
							column[index].visible ?
								<ProjectInfoCategory key={index}>
									<ProjectInfoTitle title={item[i].toString()}>
										{column[index].column.charAt(0).toUpperCase() + column[index].column.slice(1)}
									</ProjectInfoTitle>
									<ProjectInfo>
										{item[i] instanceof Date ? item[i].toLocaleDateString() : item[i].toString()}
									</ProjectInfo>
								</ProjectInfoCategory> : null
						)} */}
						<ProjectInfoCategory>
							<ProjectInfoTitle>
								{'Seneste Registering'}
							</ProjectInfoTitle>
							<ProjectInfo>
								{item.seneste_reg.toLocaleDateString()}
							</ProjectInfo>
						</ProjectInfoCategory>
						<ProjectInfoCategory>
							<ProjectInfoTitle>
								{'Kontakt'}
							</ProjectInfoTitle>
							<ProjectInfo>
								{item.user.name}
							</ProjectInfo>
						</ProjectInfoCategory>
					</ProjectInfoContainer>
					<ProjectBarContainer>
						<ProjectBarLabel progress={item.progress}>{item.progress ? item.progress + '%' : '0%'}</ProjectBarLabel>
						<ProjectBar progress={item.progress} />
					</ProjectBarContainer>
				</Shadow>
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
				<VerticalControls>
					<div style={{
						display: 'flex', flexFlow: 'column nowrap', transform: 'perspective(40px) rotateY(-20deg)'
					}}>
						<VerticalButton>{'\u2022'}</VerticalButton>
						<VerticalButton>{'\u2022'}</VerticalButton>
						<VerticalButton>{'\u2022'}</VerticalButton>
					</div>
				</VerticalControls>
			</FormCardContainer>
		)
	}
}

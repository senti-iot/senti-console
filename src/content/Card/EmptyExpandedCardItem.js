import React, { Component } from 'react'
import {
	/*Text,  FormCardContainer FormImg, ProjectInfoContainer, ProjectInfoCategory , ProjectInfo, ProjectInfoTitle,*/ HorizontalControls,
	VerticalControls, VerticalButton, HorizontalButton, HorizontalControlsDrawer, /* ShadowControlButton, ProjectBarContainer, ProjectBarLabel, */
	// ProjectBar,
	ExpandedShadow,
	ControlButton,
	// ExpandedSection,
	// ExpandedProjectInfoContainer
} from './CardItemStyles'
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
		// const { /* item,  *//* column */ } = this.props
		const horizontalExpand = false
		return (
			<div onClick={this.props.handleVerticalExpand} style={{ position: 'absolute', zIndex: 10, top: '0', left: '0', width: '100%', height: '100%', background: '#ffffff99', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
				<div style={{ width: '80%', height: '80%', background: 'white' }} onClick={this.preventPropagation()}>
					<ExpandedShadow>
						<ExpandedShadow>
							{/* <FormImg img={item.img ? item.img : 'https://picsum.photos/1920/1404/?random=0'} style={{ height: '40%' }} />
							<div style={{ display: 'flex', height: 50, fontSize: 26, width: '100%', justifyContent: 'flex-start', alignItems: 'flex-start', margin: 4, flexFlow: 'row nowrap' }}>
								<div style={{ marginLeft: 8, display: 'flex', flexFlow: 'column', maxHeight: '' }} title={item.title}>{item.title}
									<div style={{ fontSize: '12px', maxHeight: '', maxWidth: '' }}>{item.address}</div>
								</div>

								<Text style={{ marginLeft: 'auto', position: 'relative', overflow: 'visible', display: 'flex', alignItems: 'center' }}>
									<Text style={{ marginRight: 8 }}>{item.user.name}</Text>
									<img style={{ borderRadius: '50%',  }} src={item.user.img} height="30px" alt="" />
								</Text>
							</div>
							<ExpandedProjectInfoContainer>
								<div style={{ width: '80%', height: '80%', display: 'flex', justifyContent: 'space-between' }}>

									<ExpandedSection style={{ background: '#fbfbfb', height: '100%', flexFlow: 'column', flex: 1, marginLeft: 20 }}>
										<ProjectInfoTitle style={{ width: '100%', display: 'flex', justifyContent: 'center', fontSize: 22, fontWeight: 700 }}>
											{'Enheder'} ({item.devices.length})
										</ProjectInfoTitle>
										<ProjectInfo style={{ display: 'flex', flexFlow: 'column' }}>
											<div style={{ background: '#dfdfdf', padding: 4, marginTop: 4, borderRadius: 4 }}>
												{item.devices[0].toString()}
											</div>
											<div style={{ background: '#dfdfdf', padding: 4, marginTop: 4, borderRadius: 4 }}>
												{item.devices[1].toString()}
											</div>
											<div style={{ background: '#dfdfdf', padding: 4, marginTop: 4, borderRadius: 4 }}>
												{item.devices[2].toString()}
											</div>
										</ProjectInfo>
									</ExpandedSection>

									<ExpandedSection style={{ background: '#fbfbfb', height: '100%', flexFlow: 'column', flex: 1, marginLeft: 20 }}>

										<ProjectInfoTitle style={{ width: '100%', display: 'flex', justifyContent: 'center', fontSize: 22, fontWeight: 700 }}>
											{'Seneste Registering'}
										</ProjectInfoTitle>
										<ProjectInfo style={{ display: 'flex', flexFlow: 'column' }}>
											<div style={{ background: '#dfdfdf', padding: 4, marginTop: 4, borderRadius: 4 }}>
												{item.seneste_reg.toLocaleDateString()}
											</div>
											<div style={{ background: '#dfdfdf', padding: 4, marginTop: 4, borderRadius: 4 }}>
												{item.seneste_reg.toLocaleDateString()}
											</div>
											<div style={{ background: '#dfdfdf', padding: 4, marginTop: 4, borderRadius: 4 }}>
												{item.seneste_reg.toLocaleDateString()}
											</div>

										</ProjectInfo>
									</ExpandedSection>


									<ExpandedSection style={{ background: '#fbfbfb', height: '100%', flexFlow: 'column', flex: 1, marginLeft: 20 }}>

										<ProjectInfoTitle style={{ width: '100%', display: 'flex', justifyContent: 'center', fontSize: 22, fontWeight: 700 }}>
											{'Nøgletal for projekt'}
										</ProjectInfoTitle>
										<ProjectInfo style={{ display: 'flex', flexFlow: 'column' }}>
											<div style={{ background: '#dfdfdf', padding: 4, marginTop: 4, borderRadius: 4 }}>
												Total hits:	{item.hits}
											</div>
											<div style={{ background: '#dfdfdf', padding: 4, marginTop: 4, borderRadius: 4 }}>
												{item.seneste_reg.toLocaleDateString()}
											</div>
											<div style={{ background: '#dfdfdf', padding: 4, marginTop: 4, borderRadius: 4 }}>
												{item.seneste_reg.toLocaleDateString()}
											</div>

										</ProjectInfo>
									</ExpandedSection>
								</div>
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

				</div>

			</div>
		)
	}
}

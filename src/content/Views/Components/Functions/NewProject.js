import React, { Component } from 'react'
// import Dropzone from 'react-dropzone'
import { ExpFormImg, ExpHeader, ExpTitle, /* ExpAddress */ UserContainer, Username, Avatar, ExpandedProjectInfoContainer, ExpSection } from '../../../Card/ExpandedCardStyles'
import { StyledDropzone, TitleInput } from './NewProjectStyles'
import { ProjectBarContainer, ProjectBarLabel, ProjectBar } from '../../../Card/CardItemStyles'
import { Input } from '../../ViewStyles'
import DatePicker from '../DatePicker/DatePicker'
// import { Icon } from 'odeum-ui'
export default class NewProject extends Component {
	constructor(props) {
		super(props)

		this.state = {
			img: undefined
		}
	}
	handleDrop = (acceptedFiles) => {
		console.log(acceptedFiles)
		this.setState({ img: acceptedFiles[0].preview })
	}
	render() {
		const { img } = this.state
		return (
			<React.Fragment>
				<StyledDropzone img={this.state.img} onDrop={this.handleDrop} accept="image/jpeg,image/jpg,image/png" multiple={false}>
					{img ? <ExpFormImg img={img} alt={''} /> : <p style={{ color: '#9e9e9e', fontSize: 30 }}>Click Here to upload a picture</p>}
				</StyledDropzone>
				<ExpHeader>
					<ExpTitle>
						<TitleInput >
							{/* <Icon icon={'search'} iconSize={20} style={{ margin: 3, paddingRight: 3, borderRight: '1px solid #cecece' }} /> */}
							<div style={{ padding: '0px 4px' }}>
								<Input placeholder={'Title'} style={{ fontSize: 18 }} innerRef={this.createInputRef} onChange={this.handleSearch} onBlur={() => this.state.inputFocus ? this.setState({ inputFocus: false }) : null} />
							</div>
						</TitleInput>
						{/* <ExpAddress><TitleInput placeholder={'Address'} /></ExpAddress> */}
					</ExpTitle>
					<DatePicker style={{ fontSize: 16 }} />
					<UserContainer>
						<Username>'UNAME-REDUX'</Username>
						<Avatar src={''} alt={'AVATAR-REDUX'}></Avatar>
					</UserContainer>
				</ExpHeader>
				<ExpandedProjectInfoContainer>
					<ExpSection style={{ flex: 3 }}>
						List with Vaelg Periode
					</ExpSection>
					<ExpSection style={{ flex: 1 }}>
						Nogletal for project
					</ExpSection>
				</ExpandedProjectInfoContainer>
				<ProjectBarContainer>
					<ProjectBarLabel progress={0}>
						GennemFort
						<ProjectBar progress={0} />

					</ProjectBarLabel>
				</ProjectBarContainer>
			</React.Fragment>


		)
	}
}

import React, { Component } from 'react'
import { Container } from '../Management/ManagementStyles'
import { updateUser } from 'utils/data'
import { AppContext } from 'Login'
import MyProfile from './MyProfile'
import { withTheme } from 'styled-components'

class MyProfileSettings extends Component {
	constructor(props) {
		super(props)
		this.defaultState = {
			error: false,
			success: false,
			EditUserFields: {
				iUserID: '',
				vcUserName: '',
				vcPassword: '',
				vcFirstName: '',
				vcLastName: '',
				vcEmail: '',
				vcPhone: '',
				iOrgID: 0
			}
		}
		this.state = this.defaultState
	}
	editDefaultForm = (user) => {
		this.setState({
			EditUserFields: {
				iUserID: user.iUserID,
				vcUserName: user.vcUserName,
				vcPassword: user.vcPassword,
				vcFirstName: user.vcFirstName,
				vcLastName: user.vcLastName,
				vcEmail: user.vcEmail,
				vcPhone: user.vcPhone,
				iOrgID: user.organisation.iOrgID ? user.organisation.iOrgID : 0
			}
		})
	}

	handleEditUserInput = (input) => e => {
		e.preventDefault()
		this.setState({
			EditUserFields: {
				...this.state.EditUserFields,
				["vc" + input]: e.target.value
			}
		})

	}

	handleEditUser = async () => {
		var success = await updateUser(this.state.EditUserFields)
		if (success)
			this.setState({ success: true })

		else {
			this.setState({ error: true })
		}
	}
	closeAndReset = () => {
		// this.props.closeModal()
		this.setState({ success: false })

	}
	render() {
		return (
			<Container>
				<AppContext.Consumer>
					{(context) =>
						<MyProfile
							success={this.state.success}
							error={this.state.error}
							context={context}
							EditUserFields={this.state.EditUserFields}
							handleEditUserInput={this.handleEditUserInput}
							handleEditUser={this.handleEditUser}
							user={context.user}
							editDefaultForm={this.editDefaultForm}
							theme={this.props.theme}
							reset={this.closeAndReset}
						/>}
				</AppContext.Consumer>
			</Container>
		)
	}
}

export default withTheme(MyProfileSettings)
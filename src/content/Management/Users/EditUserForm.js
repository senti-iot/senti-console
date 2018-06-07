import React, { Component } from 'react'
import { AppContext } from 'Login'
import { Button } from 'odeum-ui'
import { withTheme } from 'styled-components'
import { updateUser } from 'utils/data'
import {
	Container, SuccessContainer,
	ErrorContainer, FormContainer,
	Header, FormInputCont,
	ButtonContainer, FormInput, Select
} from '../ManagementStyles'

class EditUserForm extends Component {
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

	// componentWillReceiveProps = (nextProps) => {
	// 	try {
	// 		var uId = this.props.user.iUserID
	// 		var prevuId = nextProps.user.iUserID
	// 		if (uId !== prevuId) {
	// 			this.editDefaultForm(nextProps.user)
	// 		}
	// 	}
	// 	catch (e) {
	// 		if (prevuId)
	// 			this.editDefaultForm(nextProps.user)
	// 	}
	// }
	componentDidUpdate = (prevProps, prevState) => {
		try {
			var uId = this.props.user.iUserID
			var prevuId = prevProps.user.iUserID
			if (uId !== prevuId) {
				this.editDefaultForm(this.props.user)
			}
		}
		catch (e) {
			if (uId)
				this.editDefaultForm(this.props.user)
		}
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
	handleOrgSelect = e => {
		this.setState({
			EditUserFields: {
				...this.state.EditUserFields,
				iOrgID: e.target.value
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
		this.props.closeModal()
		this.setState({ success: false })

	}
	render() {
		return (
			<Container>

				<AppContext.Consumer>
					{(context) =>
						<FormContainer>
							<Header>Edit User</Header>
							<FormInputCont>
								<FormInput
									onChange={this.handleEditUserInput("FirstName")}
									placeholder={"FirstName"}
									value={this.state.EditUserFields.vcFirstName}
								/>
							</FormInputCont>
							<FormInputCont>
								<FormInput
									onChange={this.handleEditUserInput("LastName")}
									placeholder={"LastName"}
									value={this.state.EditUserFields.vcLastName}
								/>
							</FormInputCont>
							<FormInputCont>
								<FormInput
									onChange={this.handleEditUserInput("Email")}
									placeholder={"Email"}
									value={this.state.EditUserFields.vcEmail}
								/>
							</FormInputCont>
							<FormInputCont>
								<FormInput
									onChange={this.handleEditUserInput("Phone")}
									placeholder={"Phone"}
									value={this.state.EditUserFields.vcPhone}
								/>
							</FormInputCont>
							<Select onChange={this.handleOrgSelect} value={this.state.EditUserFields.iOrgID} >
								<option value={0}> No Organisation </option>
								{context.orgs ? context.orgs.map((org, i) => {
									return <option key={i} value={org.iOrgID}> {org.vcName} </option>
								}) : null}
							</Select>
							{this.state.success ? <SuccessContainer> Success ! </SuccessContainer> : null}
							{this.state.error ? <ErrorContainer> Error! Please check your input and try again. </ErrorContainer> : null}
							<ButtonContainer style={{ marginTop: '30px' }}>
								<Button
									icon={this.state.success ? 'close' : 'person'}
									iconSize={20}
									style={{ color: "white" }}
									color={this.props.theme.button.background}
									label={this.state.success ? 'Close' : 'Edit User'}
									onClick={this.state.success ? this.closeAndReset : this.handleEditUser} />
							</ButtonContainer>
						</FormContainer>}
				</AppContext.Consumer>
			</Container>
		)
	}
}

export default withTheme(EditUserForm)
import React, { Component } from 'react'
import { AppContext } from 'Login'
import { Button } from 'odeum-ui'
import { withTheme } from 'styled-components'
import { createUser } from 'utils/data'
import {
	Container, SuccessContainer,
	ErrorContainer, FormContainer,
	Header, FormInputCont,
	CreateButtonContainer, FormInput, Select
} from './ManagementStyles'

class CreateUser extends Component {
	constructor(props) {
		super(props)
		this.defaultState = {
			error: false,
			success: false,
			createUserFields: {
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
	handleCreateUserInput = (input) => e => {
		e.preventDefault()
		this.setState({
			createUserFields: {
				...this.state.createUserFields,
				["vc" + input]: e.target.value
			}
		})

	}
	handleOrgSelect = e => {
		this.setState({
			createUserFields: {
				...this.state.createUserFields,
				iOrgID: e.target.value
			}
		})
	}

	handleCreateUser = async () => {
		var success = await createUser(this.state.createUserFields)
		if (success)
			this.setState({ ...this.defaultState, success: true })

		else {
			this.setState({ error: true })
		}
	}
	render() {
		return (
			<Container>
				{this.state.success ? <SuccessContainer> Success ! </SuccessContainer> : null}
				{this.state.error ? <ErrorContainer> Error! Please check your input and try again. </ErrorContainer> : null}
				<AppContext.Consumer>
					{(context) =>
						<FormContainer>
							<Header>Create User</Header>
							<FormInputCont>
								<FormInput
									onChange={this.handleCreateUserInput("UserName")}
									placeholder={"Username"}
									value={this.state.createUserFields.vcUserName}
								/>
							</FormInputCont>
							<FormInputCont>
								<FormInput
									onChange={this.handleCreateUserInput("Password")}
									placeholder={"Password"}
									value={this.state.createUserFields.vcPassword}
									type={'password'}
								/>
							</FormInputCont>
							<FormInputCont>
								<FormInput
									onChange={this.handleCreateUserInput("FirstName")}
									placeholder={"FirstName"}
									value={this.state.createUserFields.vcFirstName}
								/>
							</FormInputCont>
							<FormInputCont>
								<FormInput
									onChange={this.handleCreateUserInput("LastName")}
									placeholder={"LastName"}
									value={this.state.createUserFields.vcLastName}
								/>
							</FormInputCont>
							<FormInputCont>
								<FormInput
									onChange={this.handleCreateUserInput("Email")}
									placeholder={"Email"}
									value={this.state.createUserFields.vcEmail}
								/>
							</FormInputCont>
							<FormInputCont>
								<FormInput
									onChange={this.handleCreateUserInput("Phone")}
									placeholder={"Phone"}
									value={this.state.createUserFields.vcPhone}
								/>
							</FormInputCont>
							<Select onChange={this.handleOrgSelect}>
								<option value={0}> No Organisation </option>
								{context.orgs ? context.orgs.map((org, i) => {
									return <option key={i} value={org.iOrgID}> {org.vcName} </option>
								}) : null}
							</Select>
							<CreateButtonContainer style={{ marginTop: '30px' }}>
								<Button
									icon={this.state.success ? 'close' : 'person'}
									iconSize={20}
									style={{ color: "white" }}
									color={this.props.theme.button.background}
									label={this.state.success ? 'Close' : 'Create User'}
									onClick={this.state.success ? this.props.closeModal : this.handleCreateUser} />
							</CreateButtonContainer>
						</FormContainer>}
				</AppContext.Consumer>
			</Container>
		)
	}
}

export default withTheme(CreateUser)
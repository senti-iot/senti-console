import React, { Component } from 'react'
import { AppContext } from 'Login'
import { TitleInput as InputCont } from '../Views/Components/Functions/NewProject/NewProjectStyles'
import { Button } from 'odeum-ui'
import { Input } from '../Views/ViewStyles'
import { withTheme } from 'styled-components'
import { createUser } from 'utils/data'

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
			<div>
				{this.state.success ? <div style={{ margin: 5, border: "1px solid" + this.props.theme.tab.selected, padding: 2, borderRadius: 5, color: this.props.theme.tab.selected }}>
					Success !
				</div> : null}
				{this.state.error ? <div style={{ margin: 5, border: "1px solid crimson", padding: 2, borderRadius: 4, color: 'crimson' }}> Error! Please check your input and try again. </div> : null}
				<AppContext.Consumer>
					{(context) =>
						<div style={{ height: 'inherit', width: 'inherit', overflow: 'auto', margin: 5 }}>
							<h3 style={{ margin: "0.3rem 0.4rem 0.3rem 0.4rem" }}>Create User</h3>
							<InputCont style={{ height: 35, margin: "0.3rem 0.4rem 0.3rem 0.4rem", maxWidth: '300px' }}><Input onChange={this.handleCreateUserInput("UserName")} style={{ width: '100%', padding: '0px 4px', fontSize: 18, color: '#2C3E50' }} placeholder={"Username"} value={this.state.createUserFields.vcUserName} /></InputCont>
							<InputCont style={{ height: 35, margin: "0.3rem 0.4rem 0.3rem 0.4rem", maxWidth: '300px' }}><Input onChange={this.handleCreateUserInput("Password")} style={{ width: '100%', padding: '0px 4px', fontSize: 18, color: '#2C3E50' }} placeholder={"Password"} value={this.state.createUserFields.vcPassword} type={'password'} /></InputCont>
							<InputCont style={{ height: 35, margin: "0.3rem 0.4rem 0.3rem 0.4rem", maxWidth: '300px' }}><Input onChange={this.handleCreateUserInput("FirstName")} style={{ width: '100%', padding: '0px 4px', fontSize: 18, color: '#2C3E50' }} placeholder={"FirstName"} value={this.state.createUserFields.vcFirstName} /></InputCont>
							<InputCont style={{ height: 35, margin: "0.3rem 0.4rem 0.3rem 0.4rem", maxWidth: '300px' }}><Input onChange={this.handleCreateUserInput("LastName")} style={{ width: '100%', padding: '0px 4px', fontSize: 18, color: '#2C3E50' }} placeholder={"LastName"} value={this.state.createUserFields.vcLastName} /></InputCont>
							<InputCont style={{ height: 35, margin: "0.3rem 0.4rem 0.3rem 0.4rem", maxWidth: '300px' }}><Input onChange={this.handleCreateUserInput("Email")} style={{ width: '100%', padding: '0px 4px', fontSize: 18, color: '#2C3E50' }} placeholder={"Email"} value={this.state.createUserFields.vcEmail} /></InputCont>
							<InputCont style={{ height: 35, margin: "0.3rem 0.4rem 0.3rem 0.4rem", maxWidth: '300px' }}><Input onChange={this.handleCreateUserInput("Phone")} style={{ width: '100%', padding: '0px 4px', fontSize: 18, color: '#2C3E50' }} placeholder={"Phone"} value={this.state.createUserFields.vcPhone} /></InputCont>
							<select onChange={this.handleOrgSelect} style={{ margin: "0.3rem 0.4rem 0.3rem 0.4rem", background: this.props.theme.header.background, color: 'white', padding: '4px 4px', border: 'none', borderRadius: '4px', maxWidth: '284px' }}>
								<option value={0}> No Organisation </option>
								{context.orgs ? context.orgs.map((org, i) => {
									return <option key={i} value={org.iOrgID}> {org.vcName} </option>
								}) : null}
							</select>
							<Button icon={this.state.success ? 'close' : 'person'} color={this.props.theme.button.background} label={this.state.success ? 'Close' : 'Create User'} onClick={this.state.success ? this.props.closeModal : this.handleCreateUser} />

						</div>}
				</AppContext.Consumer>
			</div>
		)
	}
}

export default withTheme(CreateUser)
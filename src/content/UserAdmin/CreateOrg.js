import React, { Component } from 'react'
import { createOrg } from 'utils/data'
import { AppContext } from 'Login'
import { TitleInput as InputCont } from '../Views/Components/Functions/NewProject/NewProjectStyles'
import { Button } from 'odeum-ui'
import { Input } from '../Views/ViewStyles'
import { withTheme } from 'styled-components'

class CreateOrganisation extends Component {
	constructor(props) {
		super(props)
		this.defaultState = {
			error: false,
			success: false,
			createOrgFields: {
				vcName: '',
				vcAddress: '',
				vcCity: '',
				vcCountry: '',
				vcURL: ''
			}
		}
		this.state = this.defaultState
	}
	handleCreateUserInput = (input) => e => {
		e.preventDefault()
		this.setState({
			createOrgFields: {
				...this.state.createOrgFields,
				["vc" + input]: e.target.value
			}
		})

	}
	handleOrgSelect = e => {
		this.setState({
			createOrgFields: {
				...this.state.createOrgFields,
				iOrgID: e.target.value
			}
		})
	}

	handleCreateUser = async () => {
		var success = await createOrg(this.state.createOrgFields)
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
							<InputCont style={{ height: 35, margin: "0.3rem 0.4rem 0.3rem 0.4rem", maxWidth: '300px' }}><Input onChange={this.handleCreateUserInput("Name")} style={{ width: '100%', padding: '0px 4px', fontSize: 18, color: '#2C3E50' }} placeholder={"Name"} value={this.state.createOrgFields.vcName} /></InputCont>
							<InputCont style={{ height: 35, margin: "0.3rem 0.4rem 0.3rem 0.4rem", maxWidth: '300px' }}><Input onChange={this.handleCreateUserInput("Address")} style={{ width: '100%', padding: '0px 4px', fontSize: 18, color: '#2C3E50' }} placeholder={"Address"} value={this.state.createOrgFields.vcAddress} type={'password'} /></InputCont>
							<InputCont style={{ height: 35, margin: "0.3rem 0.4rem 0.3rem 0.4rem", maxWidth: '300px' }}><Input onChange={this.handleCreateUserInput("City")} style={{ width: '100%', padding: '0px 4px', fontSize: 18, color: '#2C3E50' }} placeholder={"City"} value={this.state.createOrgFields.vcCity} /></InputCont>
							<InputCont style={{ height: 35, margin: "0.3rem 0.4rem 0.3rem 0.4rem", maxWidth: '300px' }}><Input onChange={this.handleCreateUserInput("Country")} style={{ width: '100%', padding: '0px 4px', fontSize: 18, color: '#2C3E50' }} placeholder={"Country"} value={this.state.createOrgFields.vcCountry} /></InputCont>
							<InputCont style={{ height: 35, margin: "0.3rem 0.4rem 0.3rem 0.4rem", maxWidth: '300px' }}><Input onChange={this.handleCreateUserInput("URL")} style={{ width: '100%', padding: '0px 4px', fontSize: 18, color: '#2C3E50' }} placeholder={"Website"} value={this.state.createOrgFields.vcURL} /></InputCont>
							<Button icon={this.state.success ? 'close' : 'group_add'} color={this.props.theme.button.background} label={this.state.success ? 'Close' : 'Create Organisation'} onClick={this.state.success ? this.props.closeModal : this.handleCreateUser} />

						</div>}
				</AppContext.Consumer>
			</div>
		)
	}
}
export default withTheme(CreateOrganisation)
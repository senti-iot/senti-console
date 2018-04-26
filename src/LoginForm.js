import React, { Component } from 'react'
import ExpandedCard from './content/Card/ExpandedCard'
import { withTheme } from 'styled-components'
import { Input } from 'content/Views/ViewStyles'
import { TitleInput } from 'content/Views/Components/Functions/NewProjectStyles'
import { Button } from 'odeum-ui'
class LoginForm extends Component {

	constructor(props) {
		super(props)

		this.state = {
			username: '',
			password: '',
			userInput: false,
			passInput: false
		}
	}
	inputOnFocus = (input) => e => {
		e.preventDefault()
		this.setState({ [input]: true })
	}
	inputOnBlur = (input) => e => {
		e.preventDefault()
		this.setState({ [input]: false })
	}
	handleInput = (input) => e => {
		e.preventDefault()
		this.setState({ [input]: e.target.value })
	}
	render() {
		return (
			<div style={{ width: '100vw', height: '100vh', background: this.props.theme.header.background }}>
				<ExpandedCard cardExpand={true} horizontalControls={false} verticalControls={false}>
					<div style={{ width: '100%', height: '400px', display: 'flex', alignItems: 'center', flexFlow: 'column nowrap' }}>
						<img src={this.props.theme.logo.default} alt={'logo'} width={300} style={{ background: this.props.theme.header.background, borderRadius: '4px', margin: 5, padding: 10 }} />
						<div style={{ display: 'flex', height: '130px', flexFlow: 'column nowrap', margin: 5, justifyContent: 'space-between', alignItems: 'center' }}>
							<TitleInput active={this.state.userInput} onClick={this.inputOnFocus("userInput")}>
								<Input placeholder={'Username'} style={{ padding: '0px 4px', fontSize: 18, color: '#2C3E50' }} onBlur={this.inputOnBlur("userInput")} onChange={this.handleInput("username")} />
							</TitleInput>
							<TitleInput active={this.state.passInput} onClick={this.inputOnFocus("passInput")}>
								<Input placeholder={'Password'} style={{ padding: '0px 4px', fontSize: 18, color: '#2C3E50' }} onBlur={this.inputOnBlur("passInput")} onChange={this.handleInput("password")} type={'password'} />
							</TitleInput>
							<Button color={this.props.theme.button.background} label={'Login'} onClick={this.props.login} />
						</div>
					</div>
				</ExpandedCard>
			</div>
		)
	}
}
export default withTheme(LoginForm)
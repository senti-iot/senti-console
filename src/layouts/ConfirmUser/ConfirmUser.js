import React from "react";
// material-ui components
import {/*  InputAdornment, */ withStyles, CardContent, Collapse, Button } from "@material-ui/core";
// @material-ui/icons
// import { LockOutlined, Person } from "@material-ui/icons";
// core components
import { GridContainer, ItemGrid, Info, /* Warning,  */Danger } from "components";
// import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";
// import CustomInput from "components/CustomInput/CustomInput.js";

import loginPageStyle from "assets/jss/material-dashboard-react/loginPageStyle.js";
// import { loginUser } from "variables/dataLogin";
// import { setToken } from 'variables/data'
// import cookie from "react-cookies";
// import classNames from 'classnames';
import CircularLoader from "components/Loader/CircularLoader";
import withLocalization from "components/Localization/T";
import { connect } from 'react-redux';
import { getSettings } from 'redux/settings';
import TextF from '../../components/CustomInput/TextF';
import { changeLanguage } from 'redux/localization';
import { confirmUser } from 'variables/dataUsers';
import cookie from 'react-cookies';
import { setToken } from 'variables/data';

class ConfirmUser extends React.Component {
	constructor(props) {
		super(props);
		// we use this to make the card to appear after the page has been rendered
		this.state = {
			cardAnimaton: "cardHidden",
			password: '',
			confirmPassword: '',
			loggingIn: false,
			error: false
		};
		this.input = React.createRef()
	}
	handleKeyPress = (event) => {
		if (event.key === 'Enter') {
			this.confirmUser()
		}
	}
	componentWillUnmount = () => {
		this._isMounted = 0
		window.removeEventListener('keypress', this.handleKeyPress, false)
	}

	componentDidMount() {
		this._isMounted = 1
		window.addEventListener('keypress', this.handleKeyPress, false)
		let lang = this.props.match.params.lang
		this.token = this.props.match.params.token
		if (lang) {
			this.props.changeLanguage(lang)
		}
		if (this.inputRef.current) { this.inputRef.current.focus() }
		setTimeout(
			function () {
				return this._isMounted ? this.setState({ cardAnimaton: "" }) : '';
			}.bind(this),
			300
		);
	}
	handleInput = (e) => {
		this.setState({ [e.target.id]: e.target.value })
		if (this.state.error) {
			this.setState({ error: false })
		}
	}
	createRef = (ref) => {
		this.input = ref
		return this.input
	}
	validatePassword = () => {
		const { t } = this.props
		const { password, confirmPassword } = this.state
		if (password === confirmPassword && password !== '' && confirmPassword !== '') {
			return true
		}
		else {
			this.setState({
				error: true,
				errorMessage: t("confirmUser.passwordMismatch")
			})
		}
	}
	confirmUser = async () => {
		if (this.validatePassword()) {
			const { password } = this.state
			const { t } = this.props
			let session = await confirmUser({ newPassword: password, passwordToken: this.token })
			if (session)
				this.loginUser(session)
			else {
				this.setState({
					error: true,
					errorMessage: t("confirmUser.networkError")
				})
			}
		}
	}
	loginUser = async (session) => {
		const { t } = this.props
		this.setState({ loggingIn: true })
		setTimeout(
			async () => {

				cookie.save('SESSION', session, { path: '/' })
				if (session.isLoggedIn) {
					if (setToken()) {
						await this.props.getSettings()
						this.props.history.push("/dashboard")
					}
				}

				else {
					this.setState({
						error: true,
						errorMessage: t("confirmUser.networkError"),
						loggingIn: false
					})
				}
			}, 1000)
	}


	handleChange = prop => e => {
		this.setState({
			...this.state,
			[prop]: e.target.value
		})
		if (this.state.error)
			this.setState({
				error: false
			})
	}
	inputRef = (ref) => {
		this.input = ref
	}
	render() {
		const { classes, t } = this.props;
		const { error, password, confirmPassword, errorMessage } = this.state
		return (
			<div>
				<div
					className={classes.pageHeader}
					style={{
						backgroundColor: "#1a1b32",
						backgroundSize: "cover",
						backgroundPosition: "top center"
					}}
				>
					<div className={classes.container}>
						<GridContainer justify="center">
							<ItemGrid xs={12} sm={12} md={3}>
								<Card className={classes[this.state.cardAnimaton]}>
									<form className={classes.form}>
										<CardHeader color="primary" className={classes.cardHeader}>
											<h4>Senti.Cloud</h4>
										</CardHeader>
										<CardBody>
											<Collapse in={!error}>
												<Info>{t("confirmUser.welcomeMessage")}</Info>
												<Info>{t("confirmUser.lastStep")}</Info>
											</Collapse>
											<Collapse in={error}>
												<Danger>{errorMessage}</Danger>
											</Collapse>
											<TextF
												id={"password"}
												label={t('confirmUser.password')}
												value={password}
												className={classes.textField}
												// disabled={true}
												handleChange={this.handleChange("password")}
												margin="normal"
												noFullWidth
												error={error}
												type={'password'}
											/>
											<TextF
												id={"confirmpassword"}
												label={t("confirmUser.passwordConfirm")}
												value={confirmPassword}
												className={classes.textField}
												// disabled={true}
												handleChange={this.handleChange("confirmPassword")}
												margin="normal"
												noFullWidth
												error={error}
												type={'password'}
											/>
										</CardBody>
										<CardFooter className={classes.cardFooter}>
											<Button variant={'contained'} color={'primary'} size="large" className={classes.loginButton} onClick={this.confirmUser}>
												{t("confirmUser.button")}
											</Button>
										</CardFooter>
									</form>
									<Collapse in={this.state.loggingIn} timeout="auto" unmountOnExit>
										<CardContent>
											<CircularLoader notCentered />
										</CardContent>
									</Collapse>
								</Card>
							</ItemGrid>
						</GridContainer>
					</div>
				</div>

			</div>
		);
	}
}
const mapStateToProps = (state) => ({

})

const mapDispatchToProps = dispatch => ({
	getSettings: async () => dispatch(await getSettings()),
	changeLanguage: l => dispatch(changeLanguage(l, true))
})

export default connect(mapStateToProps, mapDispatchToProps)(withLocalization()(withStyles(loginPageStyle)(ConfirmUser)));

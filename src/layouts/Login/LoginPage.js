import React from "react";
// material-ui components
import { InputAdornment, withStyles, CardContent, Collapse, Button } from "@material-ui/core";
// @material-ui/icons
import { LockOutlined, Person } from "@material-ui/icons";
// core components
import { GridContainer, ItemGrid } from "components";
// import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";
import CustomInput from "components/CustomInput/CustomInput.js";

import loginPageStyle from "assets/jss/material-dashboard-react/loginPageStyle.js";
import { loginUser } from "variables/dataLogin";
import { setToken } from 'variables/data'
import cookie from "react-cookies";
import classNames from 'classnames';
import CircularLoader from "components/Loader/CircularLoader";
import withLocalization from "components/Localization/T";
import { connect } from 'react-redux';
import { getSettings } from 'redux/settings';

class LoginPage extends React.Component {
	constructor(props) {
		super(props);
		// we use this to make the card to appear after the page has been rendered
		this.state = {
			cardAnimaton: "cardHidden",
			user: '',
			pass: '',
			loggingIn: false,
			error: false
		};
		this.input = React.createRef()
	}
	handleKeyPress = (event) => {
		if (event.key === 'Enter') {
			this.loginUser()
		}
	}
	componentWillUnmount = () => {
		this._isMounted = 0
		window.removeEventListener('keypress', this.handleKeyPress, false)
	}

	componentDidMount() {
		this._isMounted = 1
		window.addEventListener('keypress', this.handleKeyPress, false)
		var loginData = cookie.load('SESSION')
		if (loginData) {
			if (setToken()) {
				this.props.history.push('/dashboard')
			}
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
	loginUser = async () => {
		this.setState({ loggingIn: true })
		setTimeout(
			async function () {
				await loginUser(this.state.user, this.state.pass).then(async rs => {
					if (rs) {						
						cookie.save('SESSION', rs, { path: '/' })
						if (rs.isLoggedIn) {
							if (setToken())								
							{
								await this.props.getSettings()
								var prevURL = this.props.location.state ? this.props.location.state.prevUrl : null
								this.props.history.push(prevURL ? prevURL : "/dashboard")
							}
						}
					}
					else {
						this.setState({ error: true, loggingIn: false })
					}
				})
			}.bind(this),
			1000
		);


	}
	inputRef = (ref) => {
		this.input = ref
	}
	render() {
		const { classes, t } = this.props;
		const label = classNames({ [classes.label]: !this.state.error,
			[classes.errorLabel]: this.state.error
		});
		const underline = classNames({
			[classes.underline]: !this.state.error,
			[classes.errorUnderline]: this.state.error
		});
		const focused = classNames({
			[classes.focused]: !this.state.error,
			[classes.errorFocused]: this.state.error
		
		});
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
											<CustomInput
												inputRef={this.createRef}
												autoFocus={true}
												labelText={t("login.username")}
												id="user"
												error={this.state.error}
												formControlProps={{
													fullWidth: true
												}}
												labelProps={{ FormLabelClasses: {
													root: label,
													focused: focused } }}
												inputProps={{
													type: "email",
													onChange: this.handleInput,
													classes: { underline: underline },
													endAdornment: (
														<InputAdornment position="end">
															<Person className={classes.inputIconsColor} />
														</InputAdornment>
													)
												}}
											/>
											<CustomInput
												labelText={t("login.pass")}
												id="pass"
												error={this.state.error}
												formControlProps={{
													fullWidth: true
												}}
												labelProps={{
													FormLabelClasses: {
														root: classes.label,
														focused: classes.focused
													}
												}}
												inputProps={{
													type: "password",
													onChange: this.handleInput,
													classes: { underline: classes.underline },
													endAdornment: (
														<InputAdornment position="end">
															<LockOutlined className={classes.inputIconsColor} />
														</InputAdornment>
													)
												}}
											/>
										</CardBody>
										<CardFooter className={classes.cardFooter}>
											<Button variant={'contained'} color={'primary'} size="large" className={classes.loginButton} onClick={this.loginUser}>
												{t("login.button")}
                     						 </Button>
										</CardFooter>
									</form>
									<Collapse in={this.state.loggingIn} timeout="auto" unmountOnExit>
										<CardContent>
											{/* <Grid container><CircularProgress className={classes.loader} /></Grid> */}
											<CircularLoader notCentered/>
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
	getSettings: async () => dispatch(await getSettings())
})

export default connect(mapStateToProps, mapDispatchToProps)(withLocalization()(withStyles(loginPageStyle)(LoginPage)));

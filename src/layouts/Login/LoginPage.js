import React from "react";
// material-ui components
import { InputAdornment, withStyles, CardContent, Collapse, CircularProgress, Grid } from "@material-ui/core";
// @material-ui/icons
import Person from "@material-ui/icons/Person";
import LockOutline from "@material-ui/icons/LockOutline";
// core components
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/ItemGrid";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";
import CustomInput from "components/CustomInput/CustomInput.js";

import loginPageStyle from "assets/jss/material-dashboard-react/loginPageStyle.js";
import { loginUser, setToken } from "variables/data";
import cookie from "react-cookies";
import classNames from 'classnames';

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
	}
	handleKeyPress = (event) => {
		if (event.key === 'Enter') {
			this.loginUser()
		}
	}
	componentWillUnmount = () => {
		window.removeEventListener('keypress', this.handleKeyPress, false)
	}

	componentDidMount() {
		window.addEventListener('keypress', this.handleKeyPress, false)
		var loginData = cookie.load('SESSION')
		// console.log(this.props.history)
		// console.log(this)
		if (loginData) { //check if loginData is still valid
			if (setToken()) {
				//User redirect instead of push as push will "nullify" the back history item
				this.props.history.push('/dashboard')
			}
		}

		// we add a hidden class to the card and after 700 ms we delete it and the transition appears
		setTimeout(
			function () {
				this.setState({ cardAnimaton: "" });
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
	loginUser = async () => {
		this.setState({ loggingIn: true })
		setTimeout(
			async function () {
				await loginUser(this.state.user, this.state.pass).then(rs => {
					if (rs) {
						cookie.save('SESSION', rs)
						if (rs.isLoggedIn) {
							if (setToken())
								this.props.history.push(this.props.location.state.prevUrl)
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
	render() {
		const { classes } = this.props;
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
							<GridItem xs={12} sm={12} md={3}>
								<Card className={classes[this.state.cardAnimaton]}>
									<form className={classes.form}>
										<CardHeader color="primary" className={classes.cardHeader}>
											<h4>Senti Cloud Console</h4>
										</CardHeader>
										<CardBody>
											<CustomInput
												labelText="Username..."
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
												labelText="Password"
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
															<LockOutline className={classes.inputIconsColor} />
														</InputAdornment>
													)
												}}
											/>
										</CardBody>
										<CardFooter className={classes.cardFooter}>
											<Button color="primary" size="large" onClick={this.loginUser}>
												Login
                     						 </Button>
										</CardFooter>
									</form>
									<Collapse in={this.state.loggingIn} timeout="auto" unmountOnExit>
										<CardContent>
											<Grid container><CircularProgress className={classes.loader} /></Grid>
										</CardContent>
									</Collapse>
								</Card>
							</GridItem>
						</GridContainer>
					</div>
				</div>

			</div>
		);
	}
}

export default withStyles(loginPageStyle)(LoginPage);

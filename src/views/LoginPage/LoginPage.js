import React from "react";
// material-ui components
import withStyles from "material-ui/styles/withStyles";
import InputAdornment from "material-ui/Input/InputAdornment";
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
import { Redirect } from "react-router-dom";

import loginPageStyle from "assets/jss/material-dashboard-react/loginPageStyle.js";
import { loginUser, setToken } from "variables/data";
import cookie from "react-cookies";

// import image from "assets/img/bg7.jpg";

class LoginPage extends React.Component {
	constructor(props) {
		super(props);
		// we use this to make the card to appear after the page has been rendered
		this.state = {
			cardAnimaton: "cardHidden",
			user: '',
			pass: '',
			isLoggedIn: false
		};
	}
	componentDidMount() {
		// we add a hidden class to the card and after 700 ms we delete it and the transition appears
		var loginData = cookie.load('SESSION')
		if (loginData) {
			this.setState({ isLoggedIn: true })
			setToken()
		}


		setTimeout(
			function () {
				this.setState({ cardAnimaton: "" });
			}.bind(this),
			700
		);
	}
	handleInput = (e) => {
		this.setState({ [e.target.id]: e.target.value })
	}
	loginUser = async () => {
		var data = await loginUser(this.state.user, this.state.pass)
		cookie.save('SESSION', data)
		setToken()
		if (data.isLoggedIn) { this.setState({ isLoggedIn: true }) }
	}
	render() {
		const { classes } = this.props;
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
											<h4>Senti Cloud</h4>
										</CardHeader>
										{/* <p className={classes.divider}>Login</p> */}
										<CardBody>
											<CustomInput
												labelText="Username..."
												id="user"
												formControlProps={{
													fullWidth: true
												}}
												inputProps={{
													type: "email",
													onChange: this.handleInput,
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
												formControlProps={{
													fullWidth: true
												}}
												inputProps={{
													type: "password",
													onChange: this.handleInput,
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
								</Card>
							</GridItem>
						</GridContainer>
					</div>
				</div>
				{this.state.isLoggedIn ? <Redirect from={window.location.pathname} to={'/'} /> : null}
			</div>
		);
	}
}

export default withStyles(loginPageStyle)(LoginPage);

import React from "react";
// material-ui components
import withStyles from "material-ui/styles/withStyles";
import InputAdornment from "material-ui/Input/InputAdornment";
// @material-ui/icons
import Email from "@material-ui/icons/Email";
import LockOutline from "@material-ui/icons/LockOutline";
import People from "@material-ui/icons/People";
// core components
import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import Footer from "components/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import IconButton from "components/CustomButtons/IconButton.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";
import CustomInput from "components/CustomInput/CustomInput.js";

import loginPageStyle from "assets/jss/material-dashboard-react/loginPageStyle.js";

// import image from "assets/img/bg7.jpg";

class LoginPage extends React.Component {
	constructor(props) {
		super(props);
		// we use this to make the card to appear after the page has been rendered
		this.state = {
			cardAnimaton: "cardHidden"
		};
	}
	componentDidMount() {
		// we add a hidden class to the card and after 700 ms we delete it and the transition appears
		setTimeout(
			function () {
				this.setState({ cardAnimaton: "" });
			}.bind(this),
			700
		);
	}
	render() {
		const { classes, ...rest } = this.props;
		return (
			<div>
				<Header
					absolute
					color="transparent"
					brand="Material Kit React"
					rightLinks={<HeaderLinks />}
					{...rest}
				/>
				<div
					className={classes.pageHeader}
					style={{
						backgroundImage: "url()",
						backgroundSize: "cover",
						backgroundPosition: "top center"
					}}
				>
					<div className={classes.container}>
						<GridContainer justify="center">
							<GridItem xs={12} sm={12} md={4}>
								<Card className={classes[this.state.cardAnimaton]}>
									<form className={classes.form}>
										<CardHeader color="primary" className={classes.cardHeader}>
											<h4>Login</h4>
											<div className={classes.socialLine}>
												<IconButton
													href="#pablo"
													target="_blank"
													color="transparent"
													onClick={e => e.preventDefault()}
												>
													<i
														className={classes.socialIcons + " fab fa-twitter"}
													/>
												</IconButton>
												<IconButton
													href="#pablo"
													target="_blank"
													color="transparent"
													onClick={e => e.preventDefault()}
												>
													<i
														className={classes.socialIcons + " fab fa-facebook"}
													/>
												</IconButton>
												<IconButton
													href="#pablo"
													target="_blank"
													color="transparent"
													onClick={e => e.preventDefault()}
												>
													<i
														className={
															classes.socialIcons + " fab fa-google-plus-g"
														}
													/>
												</IconButton>
											</div>
										</CardHeader>
										<p className={classes.divider}>Or Be Classical</p>
										<CardBody>
											<CustomInput
												labelText="First Name..."
												id="first"
												formControlProps={{
													fullWidth: true
												}}
												inputProps={{
													type: "text",
													endAdornment: (
														<InputAdornment position="end">
															<People className={classes.inputIconsColor} />
														</InputAdornment>
													)
												}}
											/>
											<CustomInput
												labelText="Email..."
												id="email"
												formControlProps={{
													fullWidth: true
												}}
												inputProps={{
													type: "email",
													endAdornment: (
														<InputAdornment position="end">
															<Email className={classes.inputIconsColor} />
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
													endAdornment: (
														<InputAdornment position="end">
															<LockOutline className={classes.inputIconsColor} />
														</InputAdornment>
													)
												}}
											/>
										</CardBody>
										<CardFooter className={classes.cardFooter}>
											<Button simple color="primary" size="lg">
												Get started
                     						 </Button>
										</CardFooter>
									</form>
								</Card>
							</GridItem>
						</GridContainer>
					</div>
					<Footer whiteFont />
				</div>
			</div>
		);
	}
}

export default withStyles(loginPageStyle)(LoginPage);

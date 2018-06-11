import React from "react";
// material-ui components
import withStyles from "material-ui/styles/withStyles";
import InputAdornment from "material-ui/Input/InputAdornment";
// @material-ui/icons
import Email from "@material-ui/icons/Email";
import LockOutline from "@material-ui/icons/LockOutline";
import People from "@material-ui/icons/People";
// core components
import Footer from "components/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/ItemGrid";
import Button from "components/CustomButtons/Button.js";
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
		const { classes } = this.props;
		return (
			<div>
				<div
					className={classes.pageHeader}
					style={{
						backgroundColor: ,
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
										</CardHeader>
										<p className={classes.divider}>Senti Cloud</p>
										<CardBody>
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
				</div>
			</div>
		);
	}
}

export default withStyles(loginPageStyle)(LoginPage);

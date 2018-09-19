import React, { Component, Fragment } from 'react'
import { Paper, withStyles, Grid, FormControl, InputLabel, Select, Input, /* Chip, */ MenuItem, Collapse, Button, Snackbar } from '@material-ui/core';
import { MuiPickersUtilsProvider, /* DatePicker */ } from 'material-ui-pickers';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';
import { /*  KeyboardArrowRight as KeyArrRight, KeyboardArrowLeft as KeyArrLeft,  */Save, Check } from '@material-ui/icons';
import classNames from 'classnames';
import { updateOrg } from 'variables/dataUsers'
import { TextF, ItemGrid, CircularLoader, GridContainer, Danger, Warning } from '..'
import { connect } from 'react-redux'
import createprojectStyles from '../../assets/jss/components/projects/createprojectStyles'

var moment = require("moment")
var countries = require("i18n-iso-countries")
countries.registerLocale(require("i18n-iso-countries/langs/en.json"));
countries.registerLocale(require("i18n-iso-countries/langs/da.json"));

// const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: 300,
			width: 250,
		},
	},
};

class CreateOrg extends Component {
	constructor(props) {
		super(props)

		this.state = {
			org: {},
			creating: false,
			created: false,
			loading: true,
			openSnackBar: false,
		}
	}
	handleValidation = () => {
		let errorCode = [];
		const { title, startDate, endDate } = this.state.org
		if (title === "") {
			errorCode.push(1)
		}
		if (!moment(startDate).isValid()) {
			errorCode.push(2)
		}
		if (!moment(endDate).isValid()) {
			errorCode.push(3)
		}
		if (moment(startDate).isAfter(endDate)) {
			errorCode.push(4)
		}
		this.setState({
			errorMessage: errorCode.map(c => <Danger key={c}>{this.errorMessages(c)}</Danger>)
		})
		if (errorCode.length === 0)
			return true
		else
			return false
	}
	errorMessages = code => {
		const { t } = this.props
		switch (code) {
			case 1:
				return t("orgs.validation.noTitle")
			case 2:
				return t("orgs.validation.noStartDate")
			case 3:
				return t("orgs.validation.noEndDate")
			case 4:
				return t("orgs.validation.startDateBiggerThanEndDate")
			default:
				return ""
		}
	}
	componentDidMount = async () => {
		this._isMounted = 1
		// let id = this.props.match.params.id
		// await getOrg(id).then(rs => {
		// 	if (rs && this._isMounted) {
		// 		this.setState({
		// 			org: rs,
		// 		})
		// 	}
		// })
		this.setState({
			loading: false
		})
		this.props.setHeader(this.props.t("orgs.createOrg"), true, `/users/orgs`)
	}

	componentWillUnmount = () => {
		this._isMounted = 0
		clearTimeout(this.timer)
	}

	handleDateChange = id => value => {
		this.setState({
			error: false,
			org: {
				...this.state.org,
				[id]: moment(value).format("YYYY-MM-DD HH:mm")
			}
		})
	}
	handleChange = (id) => e => {
		e.preventDefault()
		this.setState({
			error: false,
			org: {
				...this.state.org,
				[id]: e.target.value
			}
		})
	}
	handleUpdateProject = () => {
		clearTimeout(this.timer)
		this.timer = setTimeout(async () => {
			// if (this.handleValidation())
			return updateOrg(this.state.org).then(rs => rs ?
				this.setState({ created: true, creating: false, openSnackBar: true }) :
				this.setState({ created: false, creating: false, error: true, errorMessage: this.props.t("orgs.validation.networkError") })
				, 2e3)
		})

	}

	

	goToOrg = () => {
		this.props.history.push('/org/' + this.props.match.params.id)//REFACTOR
	}

	render() {
		const { classes, t } = this.props
		const { created, error, loading, org } = this.state
		const buttonClassname = classNames({
			[classes.buttonSuccess]: created,
		})

		return (
			!loading ?
				<GridContainer justify={'center'}>
					<Paper className={classes.paper}>
						<MuiPickersUtilsProvider utils={MomentUtils}>
							<form className={classes.form}>
								<ItemGrid xs={12}>
									<Collapse in={this.state.error}>
										<Warning>
											<Danger>
												{this.state.errorMessage}
											</Danger>
										</Warning>
									</Collapse>
								</ItemGrid>
								<ItemGrid container xs={12} md={6}>
									<TextF
										autoFocus
										id={"title"}
										label={t("orgs.fields.name")}
										value={org.name}
										className={classes.textField}
										handleChange={this.handleChange("name")}
										margin="normal"
										noFullWidth
										error={error}
									/>
								</ItemGrid>
								<ItemGrid container xs={12} md={6}>
									<TextF
										autoFocus
										id={"address"}
										label={t("orgs.fields.address")}
										value={org.address}
										className={classes.textField}
										handleChange={this.handleChange("address")}
										margin="normal"
										noFullWidth
										error={error}
									/>
								</ItemGrid>
								<ItemGrid container xs={12} md={6}>
									<TextF
										autoFocus
										id={"city"}
										label={t("orgs.fields.city")}
										value={org.city}
										className={classes.textField}
										handleChange={this.handleChange("city")}
										margin="normal"
										noFullWidth
										error={error}
									/>
								</ItemGrid>
								<ItemGrid container xs={12} md={6}>
									<TextF
										autoFocus
										id={"postcode"}
										label={t("orgs.fields.zip")}
										value={org.zip}
										className={classes.textField}
										handleChange={this.handleChange("zip")}
										margin="normal"
										noFullWidth
										error={error}
									/>
								</ItemGrid>
								<ItemGrid container xs={12} md={6}>
									<TextF
										autoFocus
										id={"region"}
										label={t("orgs.fields.region")}
										value={org.region}
										className={classes.textField}
										handleChange={this.handleChange("region")}
										margin="normal"
										noFullWidth
										error={error}
									/>
								</ItemGrid>
								<ItemGrid container xs={12} md={6}>
									<TextF
										autoFocus
										id={"website"}
										label={t("orgs.fields.url")}
										value={org.url}
										className={classes.textField}
										handleChange={this.handleChange("website")}
										margin="normal"
										noFullWidth
										error={error}
									/>
								</ItemGrid>
								<ItemGrid xs={12}>
									<FormControl className={classes.formControl}>
										<Fragment>
											<InputLabel FormLabelClasses={{ root: classes.label }} color={"primary"} htmlFor="select-multiple-chip">
												{t("orgs.fields.country")}
											</InputLabel>
											<Select
												color={"primary"}
												value={org.country}
												onChange={this.handleChange("country")}
												input={<Input id="select-multiple-chip" classes={{ underline: classes.underline }} />}
												MenuProps={MenuProps}
											>
												{Object.keys(countries.getNames(this.props.language)).map(country => {
													return <MenuItem key={country} value={country}>
														{countries.getName(country, this.props.language)}
													</MenuItem>
												}
												)}
											</Select>
										</Fragment>
									</FormControl>
								</ItemGrid>
							</form>
							<ItemGrid xs={12} container justify={'center'}>
								<Collapse in={this.state.creating} timeout="auto" unmountOnExit>
									<CircularLoader notCentered />
								</Collapse>
							</ItemGrid>
							<Grid container justify={"center"}>
								<div className={classes.wrapper}>
									<Button
										variant="contained"
										color="primary"
										className={buttonClassname}
										disabled={this.state.creating}
										onClick={this.state.created ? this.goToOrg : this.handleUpdateProject}>
										{this.state.created ?
											<Fragment><Check className={classes.leftIcon} />{t("orgs.viewProject")}</Fragment>
											: <Fragment><Save className={classes.leftIcon} />{t("orgs.updateProject")}</Fragment>}
									</Button>
								</div>
							</Grid>

						</MuiPickersUtilsProvider>
					</Paper>
					<Snackbar
						anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
						open={this.state.openSnackBar}
						onClose={() => { this.setState({ openSnackBar: false }) }}
						ContentProps={{
							'aria-describedby': 'message-id',
						}}
						autoHideDuration={5000}
						message={
							<ItemGrid zeroMargin noPadding justify={'center'} alignItems={'center'} container id="message-id">
								<Check className={classes.leftIcon} color={'primary'} />
								{/* Project {this.state.title} has been successfully updated! */}
								{t("snackbars.orgUpdated", { org: org.title })}
							</ItemGrid>
						}
					/>
				</GridContainer>
				: <CircularLoader />
		)
	}
}
const mapStateToProps = (state) => ({
	language: state.localization.language

})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(createprojectStyles, { withTheme: true })(CreateOrg))

import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { Grid, IconButton, Menu, MenuItem, withStyles, Button, Typography } from '@material-ui/core';
import { AssignmentTurnedIn, MoreVert, /* Edit */ } from "@material-ui/icons"
// import { dateFormatter } from 'variables/functions';
import { ItemGrid, /* , Caption, Info */  } from 'components';
import InfoCard from 'components/Cards/InfoCard';
import deviceStyles from 'assets/jss/views/deviceStyles';
import { Doughnut, Polar, Bar } from 'react-chartjs-2';
import { getWifiSummary } from 'variables/dataDevices';
// import { primaryColor } from 'assets/jss/material-dashboard-react';
import { getRandomColor } from 'variables/colors';
var moment = require('moment');


const legendOpts = {
	display: true,
	position: 'bottom',
	fullWidth: true,
	reverse: false,
};

class ProjectData extends Component {
	constructor(props) {
		super(props)

		this.state = {
			barDataSets: null,
			roundDataSets: null,
			actionAnchor: null
		}
	}
	componentDidMount = async () => {
		this._isMounted = 1
		const { project } = this.props
		// console.log(this.props.theme.breakpoints.width("md") < window.innerWidth ? 400 : 1000)
		if (this._isMounted) {
			// console.log(moment().startOf('day').format("YYYY-MM-DD+HH:mm"), moment().endOf('day').format("YYYY-MM-DD+HH:mm"))
			let todayStart = moment().startOf('day').format("YYYY-MM-DD+HH:mm")
			let todayEnd = moment().endOf('day').format("YYYY-MM-DD+HH:mm")
			let dataArr = []
			await Promise.all(project.devices.map(async d => {
				let dataSet = null
				await getWifiSummary(d.device_id, todayStart, todayEnd).then(rs => dataSet = { id: d.device_name + "(" + d.device_id + ")", data: rs })
				return dataArr.push(dataSet)
			}))
			this.setState({
				...this.state,
				roundDataSets: {
					labels: dataArr.map(da => da.id),
					datasets: [{
						label: "",
						borderColor: "#FFF",
						borderWidth: 1,
						data: dataArr.map(d => parseInt(d.data, 10)),
						backgroundColor: dataArr.map(() => getRandomColor())
					}]
				},
				barDataSets: {
					datasets: dataArr.map(d => ({
						label: [d.id],
						borderColor: "#FFF",
						borderWidth: 1,
						data: [parseInt(d.data, 10)],
						backgroundColor: getRandomColor()
					})
					)
				}
			})
		}
	}
	componentWillUnmount = () => {
	  this._isMounted = 0
	}
	
	handleOpenActionsDetails = event => {
		this.setState({ actionAnchor: event.currentTarget });
	};
	handleCloseActionsDetails = () => {
		this.setState({ actionAnchor: null });
	};

	render() {
		const { actionAnchor } = this.state
		// const { classes } = this.props
		return (
			<InfoCard
				title={"Data"} avatar={<AssignmentTurnedIn />}
				noExpand
				topAction={<ItemGrid noMargin noPadding>
					<IconButton
						aria-label="More"
						aria-owns={actionAnchor ? 'long-menu' : null}
						aria-haspopup="true"
						onClick={this.handleOpenActionsDetails}>
						<MoreVert />
					</IconButton>
					<Menu
						id="long-menu"
						anchorEl={actionAnchor}
						open={Boolean(actionAnchor)}
						onClose={this.handleCloseActionsDetails}
						PaperProps={{
							style: {
								maxHeight: 200,
								minWidth: 200
							}
						}}>
						<MenuItem>
							{/* <Edit className={classes.leftIcon} />Edit project */}
						</MenuItem>
						))}
					</Menu>
				</ItemGrid>}
				content={<Grid container>
					<ItemGrid xs={12} container justify={'center'}>
						<Typography variant="display1">Daily Summary</Typography>
					</ItemGrid>
					<ItemGrid xs={12} container noPadding>
						{this.state.roundDataSets ? <Doughnut
							height={this.props.theme.breakpoints.width("md") < window.innerWidth ? 400 : 1000}
							width={this.props.theme.breakpoints.width("md") < window.innerWidth ? 400 : window.innerWidth - 40}
							options={{
								maintainAspectRatio: false
							}}
							data={this.state.roundDataSets} legend={legendOpts} responsive /> : null}
					</ItemGrid>
					 <ItemGrid xs={12} container noPadding>
						{this.state.roundDataSets ? <Polar
							height={this.props.theme.breakpoints.width("md") < window.innerWidth ? 400 : 1000}
							width={this.props.theme.breakpoints.width("md") < window.innerWidth ? 400 : window.innerWidth - 40}
							options={{
								maintainAspectRatio: false,
							}}
							data={this.state.roundDataSets} legend={legendOpts} responsive /> : null}
					</ItemGrid> 
					<ItemGrid xs={12} container noPadding>
						{this.state.barDataSets ? <Bar
							// responsive
							data={this.state.barDataSets}
							legend={legendOpts}
							height={this.props.theme.breakpoints.width("md") < window.innerWidth ? 700 : 1000}
							width={this.props.theme.breakpoints.width("md") < window.innerWidth ? 700 : window.innerWidth - 40}
							options={{
								maintainAspectRatio: false
							}}
						/> : null}
					</ItemGrid>
					<ItemGrid xs={12}>
						<Button onClick={() => console.log(this.state)}> State </Button>
					</ItemGrid> 
				</Grid>}
			/>

		);
	}
}
ProjectData.propTypes = {
	// history: PropTypes.any.isRequired,
	// match: PropTypes.any.isRequired,
	project: PropTypes.object.isRequired,
}
export default withStyles(deviceStyles, { withTheme: true })(ProjectData);
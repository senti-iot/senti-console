import React, { Component } from 'react'
import { ItemG, InfoCard, CircularLoader } from '../../../components/index';
import { PieChartRounded, DonutLargeRounded, BarChart } from '../../../variables/icons';
import { getDataDaily } from 'variables/dataCollections'
import moment from 'moment';
import { shortDateFormat } from '../../../variables/functions';
import { Line } from 'react-chartjs-2';
import { withTheme } from '@material-ui/core';
import { colors } from '../../../variables/colors';

class CollectionData extends Component {
	constructor(props) {
		super(props)

		this.state = {
			loading: true,
			from: moment().startOf('year'),
			to: moment().endOf('day'),
			raw: {
				barDataSets: null,
				roundDataSets: null,
				lineDataSets: null
			},
			calibrated: {
				barDataSets: null,
				roundDataSets: null,
				lineDataSets: null,
			},
			dateFilterInputID: 0,
			timeType: 0,
			openCustomDate: false,
			display: 0,
			visibility: false,
		}
	}
	format = "YYYY-MM-DD+HH:mm"
	barOpts = {
		display: false,
		position: 'bottom',
		fullWidth: true,
		reverse: false,

		labels: {
			padding: 10
		}
	}
	options = [
		{ id: 0, label: this.props.t("filters.dateOptions.today") },
		{ id: 5, label: this.props.t("filters.dateOptions.yesterday") },
		{ id: 6, label: this.props.t("filters.dateOptions.thisWeek") },
		{ id: 1, label: this.props.t("filters.dateOptions.7days") },
		{ id: 2, label: this.props.t("filters.dateOptions.30days") },
		{ id: 3, label: this.props.t("filters.dateOptions.90days") },
		{ id: 4, label: this.props.t("filters.dateOptions.custom") },
	]
	visibilityOptions = [
		{ id: 0, icon: <PieChartRounded />, label: this.props.t("charts.type.pie") },
		{ id: 1, icon: <DonutLargeRounded />, label: this.props.t("charts.type.donut") },
		{ id: 2, icon: <BarChart />, label: this.props.t("charts.type.bar") },
	]
	componentDidMount = () => {
		this.handleWifiDaily()
	}

	handleWifiDaily = async () => {
		const { collection } = this.props
		const { from, to } = this.state
		let data = await getDataDaily(collection.id, moment(from).format(this.format), moment(to).format(this.format), false)
		if (data) {
			let dataArr = Object.keys(data).map(r => ({ id: shortDateFormat(r), value: data[r] }))
			this.setState({
				data: data,
				calibrated: {
					lineDataSets: {
						labels: dataArr.map(rd => rd.id),
						datasets: [{
							borderColor: colors[18],
							// borderWidth: 1,
							data: dataArr.map(d => d.value),
							backgroundColor: colors[18],
							fill: false,
							lineTension: 0.1,
							borderCapStyle: 'butt',
							borderJoinStyle: 'miter',
							pointBorderColor: colors[18]
						}]
						
					},
					barDataSets: {

					},
					roundDataSets: {

					}
				},
				loading: false
			})
		}
	}
	renderLoader = () => <CircularLoader notCentered />
	render() {
		const { t } = this.props
		const { loading } = this.state
		return (
			<InfoCard
				noExpand
				title={t("collection.cards.data")}
				content={
					<ItemG container>
						{loading ? this.renderLoader() : <ItemG xs={12}>
							<Line
								height={window.innerHeight / 4}
								legend={this.barOpts}
								data={this.state.calibrated.lineDataSets} />
						</ItemG>}
					</ItemG>
				}
			/>
		)
	}
}

export default withTheme()(CollectionData)

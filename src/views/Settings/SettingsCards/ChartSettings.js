import React, { Component } from 'react'
import { BarChart, PieChartRounded, ShowChart, DonutLargeRounded } from 'variables/icons'
import { InfoCard, DSelect, ItemGrid } from 'components';
import { ListItemText, ListItem, List, Grid, withStyles } from '@material-ui/core';
import { settingsStyles } from 'assets/jss/components/settings/settingsStyles';

class ChartSettings extends Component {
	chartTypes = () => {
		const { t } = this.props
		return [
			{ value: 0, icon: <PieChartRounded />, label: t('charts.type.pie') },
			{ value: 1, icon: <DonutLargeRounded />, label: t('charts.type.donut') },
			{ value: 2, icon: <BarChart />, label: t('charts.type.bar') },
			{ value: 3, icon: <ShowChart />, label: t('charts.type.line') }
		]

	}
	changeChartType = e => this.props.changeChartType(e.target.value)
	render() {
		const { t, classes, chartType } = this.props
		return (
			<InfoCard
				noExpand
				avatar={<BarChart />}
				title={t('settings.headers.charts')}
				content={
					<Grid container>
						<List className={classes.list}>
							<ListItem>
								<ItemGrid container zeroMargin noPadding alignItems={'center'}>
									<ListItemText>{t('settings.chart.defaultChart')}</ListItemText>
									<DSelect menuItems={this.chartTypes()} value={chartType} onChange={this.changeChartType} />
								</ItemGrid>
							</ListItem>
						</List>
					</Grid>
				
				}
			/>
		)
	}
}

export default withStyles(settingsStyles)(ChartSettings)
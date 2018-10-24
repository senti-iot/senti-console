import React, { Component } from 'react'
import { BarChart, PieChartRounded, ShowChart, DonutLargeRounded } from 'variables/icons'
import { InfoCard, DSelect, ItemGrid } from 'components';
import { ListItemText, ListItem, List, Grid } from '@material-ui/core';

export default class ChartSettings extends Component {
	constructor(props) {
	  super(props)
	
	  this.state = {
		 chartType: 0
	  }
	}
	chartTypes = () => {
		const { t } = this.props
		return [
			{ id: 0, icon: <PieChartRounded />, label: t("charts.type.pie") },
			{ id: 1, icon: <DonutLargeRounded />, label: t("charts.type.donut") },
			{ id: 2, icon: <BarChart />, label: t("charts.type.bar") },
			{ id: 3, icon: <ShowChart />, label: t("charts.type.line") }
		]

	}
	render() {
		const { t, classes } = this.props
		return (
			<InfoCard
				noExpand
				avatar={<BarChart />}
				title={t("settings.headers.charts")}
				content={
					<Grid container>
						<List className={classes.list}>
							<ListItem divider>
								<ItemGrid container zeroMargin noPadding alignItems={"center"}>
									<ListItemText>{t("settings.discoverSenti")}</ListItemText>
									<DSelect menuItems={discSenti} value={discSentiVal} onChange={this.changeDiscoverSenti} />
								</ItemGrid>
							</ListItem>
						</List>
					</Grid>
				
				}
			/>
		)
	}
}

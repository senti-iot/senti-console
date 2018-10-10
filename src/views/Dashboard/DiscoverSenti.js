import React, { Component } from 'react'
import { GridContainer, ItemGrid } from 'components';
import { Typography, Hidden, withStyles } from '@material-ui/core';
import DiscoverSentiCards from 'components/Cards/DiscoverSentiCards';
import AnalyticsImg from 'assets/img/Rounded/analytics.png'
import StorageImg from 'assets/img/Rounded/storage.png'
import HostingImg from 'assets/img/Rounded/hosting.png'
import discoverSentiStyle from 'assets/jss/material-dashboard-react/discoverSentiStyles';

class DiscoverSenti extends Component {
	goTo = (where) => e => {
		e.preventDefault()
		this.props.history.push(where)
	 }
	render() {
		const { classes, t } = this.props
		return (
			<Hidden mdDown>
				<div className={classes.root}>
					<div className={classes.texturePicture}>
						<div className={classes.devicesPicture}>
							<GridContainer>
								<ItemGrid xs={12}>
									<Typography variant={'h6'} style={{ color: "white" }}>{t("discoverSenti.welcome")}</Typography>
								</ItemGrid>
								<ItemGrid xs={12} sm={4} noMargin>
									<DiscoverSentiCards img={StorageImg}
										onClick={this.goTo("/projects/new")}
										content={
											<Typography variant={'h6'} style={{ color: "white", fontWeight: 400 }}>{t("discoverSenti.addProject")}</Typography>
										}/>
								</ItemGrid>
								<ItemGrid xs={12} sm={4} noMargin>
									<DiscoverSentiCards img={HostingImg}
										onClick={this.goTo("/devices/list")}
										content={
											<Typography variant={'h6'} style={{ color: "white", fontWeight: 400 }}>{t("discoverSenti.onSiteSetup")}</Typography>

										}/>
								</ItemGrid>
								<ItemGrid xs={12} sm={4} noMargin>
									<DiscoverSentiCards img={AnalyticsImg}
										onClick={this.goTo("/devices/list")}
										content={
											<Typography variant={'h6'} style={{ color: "white", fontWeight: 400 }}>{t("discoverSenti.startAnalyzeData")}</Typography>
										}
									/>
								</ItemGrid>
							</GridContainer>
						</div>
					</div>
				</div>
			</Hidden>
		)
	}
}

export default withStyles(discoverSentiStyle)(DiscoverSenti)

import { Hidden, Typography, withStyles } from '@material-ui/core';
import AnalyticsImg from 'assets/img/Rounded/analytics.png';
import HostingImg from 'assets/img/Rounded/hosting.png';
import StorageImg from 'assets/img/Rounded/storage.png';
import discoverSentiStyle from 'assets/jss/material-dashboard-react/discoverSentiStyles';
import { GridContainer, ItemGrid } from 'components';
import DiscoverSentiCards from 'components/Cards/DiscoverSentiCards';
import React, { Component } from 'react';

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
									<Typography variant={'h6'} style={{ color: 'white' }}>{t('discoverSenti.welcome')}</Typography>
								</ItemGrid>
								<ItemGrid xs={12} sm={4} noMargin>
									<DiscoverSentiCards img={StorageImg}
										onClick={this.goTo('/projects/list')}
										content={
											<Typography variant={'h6'} style={{ color: 'white', fontWeight: 400, textTransform: 'none' }}>{t('discoverSenti.addProject')}</Typography>
										}/>
								</ItemGrid>
								<ItemGrid xs={12} sm={4} noMargin>
									<DiscoverSentiCards img={HostingImg}
										onClick={this.goTo('/devices/list')}
										content={
											<Typography variant={'h6'} style={{ color: 'white', fontWeight: 400, textTransform: 'none' }}>{t('discoverSenti.onSiteSetup')}</Typography>

										}/>
								</ItemGrid>
								<ItemGrid xs={12} sm={4} noMargin>
									<DiscoverSentiCards img={AnalyticsImg}
										onClick={this.goTo('/collections/list')}
										content={
											<Typography variant={'h6'} style={{ color: 'white', fontWeight: 400, textTransform: 'none' }}>{t('discoverSenti.startAnalyzeData')}</Typography>
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

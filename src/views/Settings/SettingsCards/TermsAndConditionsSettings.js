import React, { Component } from 'react'
import { InfoCard, ItemGrid } from 'components';
import { Assignment } from 'variables/icons';
import { Grid, List, ListItem, ListItemText, withStyles, Button } from '@material-ui/core';
import { settingsStyles } from 'assets/jss/components/settings/settingsStyles';
import CookiesDialog from 'components/Cookies/CookiesDialog';

class TermsAndConditions extends Component {
	constructor(props) {
	  super(props)
	
	  this.state = {
		 openCP: false
	  }
	}
	handleOpenCP = () => { 
		this.setState({ openCP: true })
	}
	handleCloseCP = () => { 
		this.setState({ openCP: false })
	}
	render() {
		const { classes, t } = this.props
		const { openCP } = this.state
		return (
			<InfoCard
				noExpand
				avatar={<Assignment />}
				title={t('settings.t&c.title')}
				content={
					<Grid container>
						<CookiesDialog open={openCP} handleClose={this.handleCloseCP} t={t} classes={classes} readOnly/>
						<List className={classes.list}>
							<ListItem>
								<ItemGrid container zeroMargin noPadding alignItems={'center'}>
									<ListItemText>{t('settings.t&c.cookiesPolicy')}</ListItemText>
									<Button onClick={this.handleOpenCP}>{t('actions.readMore')}</Button>
								</ItemGrid>
							</ListItem>
						</List>
					</Grid>
				}
			/>
		)
	}
}

export default withStyles(settingsStyles)(TermsAndConditions)
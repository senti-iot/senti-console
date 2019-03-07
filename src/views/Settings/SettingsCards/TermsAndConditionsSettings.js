import React, { Component } from 'react'
import { InfoCard, ItemGrid } from 'components';
import { Assignment } from 'variables/icons';
import { Grid, List, ListItem, ListItemText, withStyles, Button } from '@material-ui/core';
import { settingsStyles } from 'assets/jss/components/settings/settingsStyles';
import CookiesDialog from 'components/Cookies/CookiesDialog';
import PrivacyDialog from 'components/Cookies/PrivacyDialog';
import ResetSettingsModal from '../SettingsModal/ResetSettingsModal';

class TermsAndConditions extends Component {
	constructor(props) {
	  super(props)
	
	  this.state = {
		 openCP: false,
		 openRS: false,
		 openPP: false
	  }
	}
	handleOpenCP = () => { 
		this.setState({ openCP: true })
	}
	handleCloseCP = () => { 
		this.setState({ openCP: false })
	}
	handleOpenPP = () => { 
		this.setState({ openPP: true })
	}
	handleClosePP = () => { 
		this.setState({ openPP: false })
	}
	handleOpenRS = () => {
		this.setState({ openRS: true })
	}
	handleCloseRS = (redirect) => {
		this.setState({ openRS: false })
		if (redirect) {
			this.props.history.push('/')
		}
	}
	render() {
		const { classes, t } = this.props
		const { openCP, openPP, openRS } = this.state
		return (
			<InfoCard
				noExpand
				avatar={<Assignment />}
				title={t('settings.t&c.title')}
				content={
					<Grid container>
						<CookiesDialog open={openCP} handleClose={this.handleCloseCP} t={t} classes={classes} readOnly/>
						<PrivacyDialog open={openPP} handleClose={this.handleClosePP} t={t} classes={classes} readOnly/>
						<ResetSettingsModal open={openRS} handleClose={this.handleCloseRS} t={t} classes={classes} />
						<List className={classes.list}>
							<ListItem divider>
								<ItemGrid container zeroMargin noPadding alignItems={'center'}>
									<ListItemText>{t('settings.t&c.cookiesPolicy')}</ListItemText>
									<Button color={'primary'} onClick={this.handleOpenCP}>{t('actions.read')}</Button>
								</ItemGrid>
							</ListItem>
							<ListItem divider>
								<ItemGrid container zeroMargin noPadding alignItems={'center'}>
									<ListItemText>{t('settings.t&c.privacyPolicy')}</ListItemText>
									<Button color={'primary'} onClick={this.handleOpenPP}>{t('actions.read')}</Button>
								</ItemGrid>
							</ListItem>
							<ListItem>
								<ItemGrid container zeroMargin noPadding alignItems={'center'}>
									<ListItemText>{t('settings.reset.resetSettings')}</ListItemText>
									<Button className={classes.red} onClick={this.handleOpenRS}>{t('settings.reset.restore')}</Button>
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
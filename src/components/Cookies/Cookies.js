import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Snackbar, Button, withStyles } from '@material-ui/core';
import ItemG from 'components/Grid/ItemG';
import withLocalization from 'components/Localization/T';
import { acceptCookiesFunc } from 'redux/settings';
import CookiesDialog from './CookiesDialog';
import withSnackbar from 'components/Localization/S';
import { finishedSaving } from 'redux/settings';

const styles = theme => ({
	p: {
		marginBottom: theme.spacing.unit
	},
	title: {
		fontWeight: 500
	}
})
class Cookies extends Component {
	constructor(props) {
	  super(props)
	
	  this.state = {
		 open: false,
		 showSnackBar: true,
	  }
	}
	componentDidUpdate = (prevProps, prevState) => {
		if (this.props.saved === true) {
			this.props.s('snackbars.settingsSaved')
			this.props.finishedSaving()
		}
	}
	handleAcceptCookies = () => { 
		this.handleClose()
		this.props.acceptCookies(true)
	}
	handleOpen = () => {
		this.setState({ open: true, showSnackBar: false });
	};
	handleClose = () => {
		this.setState({ open: false, showSnackBar: true });
	};
	renderCookiesPrivacy = () => {
		const { t, classes } = this.props
		return <CookiesDialog 
			open={this.state.open}
			handleClose={this.handleClose}
			t={t}
			classes={classes}
			handleAcceptCookies={this.handleAcceptCookies} />
	}
	render() {
		const { t } = this.props
		const { showSnackBar } = this.state
		return (
			<Fragment>
				<Snackbar
					open={!this.props.cookies && showSnackBar}
					ContentProps={{
						style: { width: '100%' },
						'aria-describedby': 'message-id',
					}}
					message={<span id="message-id">{t('dialogs.cookies.message.snackbar')}</span>}
					action={
						<ItemG container justify={'space-between'}>
							<Button color={'primary'} size={'small'} onClick={this.handleAcceptCookies}>
								{t('actions.accept')}
							</Button>
							<Button color={'primary'} size={'small'} onClick={this.handleOpen}>
								{t('actions.readMore')}
							</Button>
						</ItemG>
					}
				/>
				{this.renderCookiesPrivacy()}
			</Fragment>
	
		)
	}
}
const mapStateToProps = (state) => ({
	cookies: state.settings.cookies,
	saved: state.settings.saved
})

const mapDispatchToProps = dispatch => ({
	acceptCookies: async (val) => dispatch(await acceptCookiesFunc(val)),
	finishedSaving: () => dispatch(finishedSaving())

})

export default connect(mapStateToProps, mapDispatchToProps)(withLocalization()(withStyles(styles)(withSnackbar()(Cookies))))

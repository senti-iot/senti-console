import { withStyles, Fade } from '@material-ui/core';
import cloudfunctionStyles from 'assets/jss/views/deviceStyles';
import { CircularLoader, GridContainer, ItemGrid } from 'components';
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { DataUsage, Code } from 'variables/icons';
// import Toolbar from 'components/Toolbar/Toolbar';
import { isFav, addToFav, removeFromFav, finishedSaving } from 'redux/favorites';
import { scrollToAnchor } from 'variables/functions';
import { getFunctionLS } from 'redux/data';
import FunctionCode from './CloudCards/FunctionCode';
import FunctionDetails from './CloudCards/FunctionDetails';
// import FunctionDetails from './FunctionCards/FunctionDetails';
// import FunctionDevices from './FunctionCards/FunctionDevices';

class Function extends Component {
	constructor(props) {
		super(props)

		this.state = {
			//Date Filter
			//End Date Filter Tools
			cloudfunction: null,
			activeDevice: null,
			loading: true,
			anchorElHardware: null,
			openAssign: false,
			openUnassignDevice: false,
			openAssignOrg: false,
			openAssignDevice: false,
			openDelete: false,
			//Map
			loadingMap: true,
			heatData: null,
			//End Map
		}
		let prevURL = props.location.prevURL ? props.location.prevURL : '/functions/list'
		props.setHeader('sidebar.cloudfunction', true, prevURL, 'functions')
	}

	format = 'YYYY-MM-DD+HH:mm'
	tabs = () => {
		const { t } = this.props
		return [
			{ id: 0, title: t('tabs.details'), label: <DataUsage />, url: `#details` },
			{ id: 1, title: t('tabs.code'), label: <Code />, url: `#code` }
		]
	}

	reload = (msgId) => {
		this.snackBarMessages(msgId)
		this.getFunction(this.props.match.params.id)
	}

	getFunction = async (id) => {
		const { getFunction } = this.props
		await getFunction(id)
	}
	componentDidUpdate = async (prevProps) => {
		if (prevProps.match.params.id !== this.props.match.params.id)
			await this.componentDidMount()
		if (this.props.saved === true) {
			const { cloudfunction } = this.props
			if (this.props.isFav({ id: cloudfunction.id, type: 'cloudfunction' })) {
				this.props.s('snackbars.favorite.saved', { name: cloudfunction.name, type: this.props.t('favorites.types.cloudfunction') })
				this.props.finishedSaving()
			}
			if (!this.props.isFav({ id: cloudfunction.id, type: 'cloudfunction' })) {
				this.props.s('snackbars.favorite.removed', { name: cloudfunction.name, type: this.props.t('favorites.types.cloudfunction') })
				this.props.finishedSaving()
			}
		}
		// if (!this.props.cloudfunction) {
		// 	this.props.history.push('/404')
		// }
	}
	componentDidMount = async () => {
		if (this.props.match) {
			let id = this.props.match.params.id
			if (id) {
				await this.getFunction(id).then(() => this.props.cloudfunction ? this.props.setBC('cloudfunction',  this.props.cloudfunction.name) : null
				)
				this.props.setTabs({
					route: 0,
					id: 'cloudfunction',
					tabs: this.tabs(),
					hashLinks: true
				})
				if (this.props.location.hash !== '') {
					scrollToAnchor(this.props.location.hash)
				}
			}
		}
		else {
			this.props.history.push({
				pathname: '/404',
				prevURL: window.location.pathname
			})
		}
	}
	addToFav = () => {
		const { cloudfunction } = this.props
		let favObj = {
			id: cloudfunction.id,
			name: cloudfunction.name,
			type: 'cloudfunction',
			path: this.props.match.url
		}
		this.props.addToFav(favObj)
	}
	removeFromFav = () => {
		const { cloudfunction } = this.props
		let favObj = {
			id: cloudfunction.id,
			name: cloudfunction.name,
			type: 'cloudfunction',
			path: this.props.match.url
		}
		this.props.removeFromFav(favObj)
	}

	snackBarMessages = (msg) => {
		// const { s, t, cloudfunction } = this.props

		switch (msg) {
			default:
				break
		}
	}



	renderLoader = () => {
		return <CircularLoader />
	}


	render() {
		const { history, match, t, accessLevel, cloudfunction, loading } = this.props
		return (
			<Fragment>
				{!loading ? <Fade in={true}>
					<GridContainer justify={'center'} alignContent={'space-between'}>
						<ItemGrid xs={12} noMargin id="details">
							<FunctionDetails
								cloudfunction={cloudfunction}
								isFav={this.props.isFav({ id: cloudfunction.id, type: 'cloudfunction' })}
								addToFav={this.addToFav}
								removeFromFav={this.removeFromFav}
								history={history}
								t={t}
								accessLevel={accessLevel}
								match={match}
							/>
						</ItemGrid>
						<ItemGrid xs={12} noMargin id='code'>
							<FunctionCode
								theme={this.props.theme}
								cloudfunction={cloudfunction}
								t={t}
							/>
						</ItemGrid>
					</GridContainer></Fade>
					: this.renderLoader()}
			</Fragment>
		)
	}
}
const mapStateToProps = (state) => ({
	accessLevel: state.settings.user.privileges,
	language: state.settings.language,
	saved: state.favorites.saved,
	mapTheme: state.settings.mapTheme,
	periods: state.dateTime.periods,
	cloudfunction: state.data.cloudfunction,
	loading: !state.data.gotFunction,

})

const mapDispatchToProps = (dispatch) => ({
	isFav: (favObj) => dispatch(isFav(favObj)),
	addToFav: (favObj) => dispatch(addToFav(favObj)),
	removeFromFav: (favObj) => dispatch(removeFromFav(favObj)),
	finishedSaving: () => dispatch(finishedSaving()),
	getFunction: async (id, customerID, ua) => dispatch(await getFunctionLS(id, customerID, ua))
})


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(cloudfunctionStyles, { withTheme: true })(Function))

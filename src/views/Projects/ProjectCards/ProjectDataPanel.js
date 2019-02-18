import React, { Component, Fragment } from 'react'
import { InfoCard, DateFilterMenu, Dropdown } from 'components';
import { withStyles, Button, IconButton } from '@material-ui/core';
import { Add, Visibility, VisibilityOff, Clear, Timeline } from 'variables/icons';
import { connect } from 'react-redux'
import { hideShowPeriod, resetToDefault } from 'redux/dateTime';
import { dateTimeFormatter } from 'variables/functions';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import withLocalization from 'components/Localization/T';

const styles = theme => ({
	icon: {
		color: 'rgba(0, 0, 0, 0.54)',
		marginRight: 4
	}
})
class ProjectDataPanel extends Component {
	render() {
		const { t, periods, classes, width } = this.props
		let mobile = isWidthUp('md', width)
		return (
			<InfoCard
				title={t('collections.cards.data') + ' Control Panel'}
				avatar={<Timeline />}
				noExpand
				noMargin
				noPadding
				content={null}
				topAction={
					<Fragment>
						{periods.length < 5 &&
							<DateFilterMenu
								button={mobile}
								icon={<Fragment><Add className={classes.icon} />{!mobile ? null : t('menus.charts.addAPeriod')}</Fragment>}
								t={t}
							/>
						}

						<Dropdown
							icon={<Fragment><Visibility className={classes.icon} />{!mobile ? null : t('menus.charts.showHidePeriods')}</Fragment>}
							button={mobile}
							divider
							menuItems={
								periods.map(p => ({
									label: `${dateTimeFormatter(p.from)} - ${dateTimeFormatter(p.to)}`,
									icon: p.hide ? <VisibilityOff className={classes.icon} /> : <Visibility className={classes.icon} />,
									func: () => this.props.hideShowPeriod(p.id)
								}))}
						/>

						{mobile ?
							<Button onClick={this.props.resetToDefault} style={{ color: 'rgba(0, 0, 0, 0.54)' }}>
								<Clear className={classes.icon} />
								{t('menus.charts.resetToDefault')}
							</Button>
							: <IconButton onClick={this.props.resetToDefault}>
								<Clear className={classes.icon} />
							</IconButton>}

					</Fragment>
				}
			/>
		)
	}
}
const mapStateToProps = (state) => ({
	periods: state.dateTime.periods
})

const mapDispatchToProps = dispatch => ({
	hideShowPeriod: pId => dispatch(hideShowPeriod(pId)),
	resetToDefault: () => dispatch(resetToDefault())
})


export default withLocalization()(
	withWidth()(
		withStyles(styles, { withTheme: true })(
			connect(mapStateToProps, mapDispatchToProps)(ProjectDataPanel))))

import React, { Component, Fragment } from 'react'
import { InfoCard, DateFilterMenu, Dropdown, T } from 'components';
import { withStyles, Button, IconButton, Typography } from '@material-ui/core';
import { Add, Visibility, VisibilityOff, Clear, Timeline } from 'variables/icons';
import { connect } from 'react-redux'
import { hideShowPeriod, resetToDefault } from 'redux/dateTime';
import { dateTimeFormatter } from 'variables/functions';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import withLocalization from 'components/Localization/T';

const styles = theme => ({
	icon: {
		
		color: theme.palette.type === 'light' ? 'rgba(0, 0, 0, 0.54)' : '#fff',
		marginRight: 4
	}
})
class ChartDataPanel extends Component {
	render() {
		const { t, periods, classes, width } = this.props
		let mobile = isWidthUp('md', width)
		return (
			<InfoCard
				title={t('charts.controlPanel')}
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
								icon={<Fragment><Add className={classes.icon} />{!mobile ? null : <Typography>{t('menus.charts.addAPeriod')}</Typography>}</Fragment>}
								t={t}
							/>
						}

						<Dropdown
							icon={<Fragment><Visibility className={classes.icon} />{!mobile ? null : <Typography>{t('menus.charts.showHidePeriods')}</Typography>}</Fragment>}
							button={mobile}
							divider
							menuItems={
								periods.map(p => ({
									label: <T style={{ whiteSpace: 'normal' }}>{`${dateTimeFormatter(p.from)} - ${dateTimeFormatter(p.to)}`}</T>,
									icon: p.hide ? <VisibilityOff className={classes.icon} /> : <Visibility className={classes.icon} />,
									func: () => this.props.hideShowPeriod(p.id)
								}))}
						/>
						{mobile ?
							<Button onClick={this.props.resetToDefault}>
								<Clear className={classes.icon} />
								<Typography>{t('menus.charts.resetToDefault')}</Typography>
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
			connect(mapStateToProps, mapDispatchToProps)(ChartDataPanel))))

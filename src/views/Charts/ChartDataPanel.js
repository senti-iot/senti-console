import React, { Fragment } from 'react'
import { InfoCard, DateFilterMenu, Dropdown, T, ItemG } from 'components';
import { makeStyles, Button, IconButton, Typography } from '@material-ui/core';
import { Add, Visibility, VisibilityOff, Clear, Timeline } from 'variables/icons';
import { useSelector, useDispatch } from 'react-redux'
import { hideShowPeriod, resetToDefault } from 'redux/dateTime';
import { dateTimeFormatter } from 'variables/functions';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
// import withLocalization from 'components/Localization/T';
import { useLocalization } from 'hooks'

const styles = makeStyles(theme => ({
	icon: {
		color: theme.palette.type === 'light' ? 'rgba(0, 0, 0, 0.54)' : '#fff',
		marginRight: 4
	}
}))

// const mapStateToProps = (state) => ({
// 	periods: state.dateTime.periods
// })

// const mapDispatchToProps = dispatch => ({
// 	hideShowPeriod: pId => dispatch(hideShowPeriod(pId)),
// 	resetToDefault: () => dispatch(resetToDefault())
// })

// @Andrei
const ChartDataPanel = props => {
	const classes = styles()
	const t = useLocalization()
	const dispatch = useDispatch()
	const periods = useSelector(state => state.dateTime.periods)

	const { width } = props
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
							icon={<ItemG container alignItems={'center'}><Add className={classes.icon} />{!mobile ? null : <T className={classes.icon}>{t('menus.charts.addAPeriod')}</T>}</ItemG>}
							t={t}
						/>
					}

					<Dropdown
						icon={<Fragment><Visibility className={classes.icon} />{!mobile ? null : <T className={classes.icon}>{t('menus.charts.showHidePeriods')}</T>}</Fragment>}
						button={mobile}
						divider
						menuItems={
							periods.map(p => ({
								label: <T style={{ whiteSpace: 'normal' }}>{`${dateTimeFormatter(p.from)} - ${dateTimeFormatter(p.to)}`}</T>,
								icon: p.hide ? VisibilityOff : Visibility,
								func: () => dispatch(hideShowPeriod(p.id))
							}))}
					/>
					{mobile ?
						<Button onClick={() => dispatch(resetToDefault())}>
							<Clear className={classes.icon} />
							<Typography>{t('menus.charts.resetToDefault')}</Typography>
						</Button>
						: <IconButton onClick={() => dispatch(resetToDefault())}>
							<Clear className={classes.icon} />
						</IconButton>}
				</Fragment>
			}
		/>
	)
}

export default withWidth()(ChartDataPanel)

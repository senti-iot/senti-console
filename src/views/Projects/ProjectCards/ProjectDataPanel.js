import React, { Component } from 'react'
import { InfoCard, ItemG, DateFilterMenu, Dropdown } from 'components';
import { IconButton, Checkbox } from '@material-ui/core';
import { Add, Visibility, Clear, Timeline } from 'variables/icons';
import { connect } from 'react-redux'
import { hideShowPeriod } from 'redux/dateTime';
import { dateTimeFormatter } from 'variables/functions';

class ProjectDataPanel extends Component {
	render() {
		const { t, periods } = this.props
		return (
			<InfoCard
				title={t('collections.cards.data') + ' Control Panel'}
				avatar={<Timeline />}
				noExpand
				noMargin
				noPadding
				content={null}
				topAction={
					<ItemG container>
						{periods.length < 5 && <ItemG>
							<DateFilterMenu
								icon={<Add />}
								t={t}
							/>
						</ItemG>}
						<ItemG>
							<Dropdown icon={<Visibility />} menuItems={
								periods.map(p => ({ 
									label: `${dateTimeFormatter(p.from)} - ${dateTimeFormatter(p.to)}`,
									icon: <Checkbox checked={p.hide} />,
									func: () => this.props.hideShowPeriod(p.id)
								}))
							
							} />
						</ItemG>
						<ItemG>
							<IconButton>
								<Clear />
							</IconButton>
						</ItemG>
					</ItemG>
				}
			/>
		)
	}
}
const mapStateToProps = (state) => ({
	periods: state.dateTime.periods
})

const mapDispatchToProps = dispatch => ({ 
	hideShowPeriod: pId => dispatch(hideShowPeriod(pId))
})


export default connect(mapStateToProps, mapDispatchToProps)(ProjectDataPanel)

import React from 'react'
import { MuiPickersUtilsProvider, DateTimePicker } from 'material-ui-pickers';
import { Dialog, DialogTitle, DialogContent, FormControlLabel, Checkbox, DialogActions, Button } from '@material-ui/core';
import { ItemGrid, Caption } from 'components';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';
import { DateRange, AccessTime, KeyboardArrowRight, KeyboardArrowLeft } from 'variables/icons';

const CustomDateTime = (props) => {
	const { classes, t, openCustomDate, handleCloseDialog, handleCustomDate, to, from,
		timeType, handleCustomCheckBox, handleCancelCustomDate
	} = props
	return <MuiPickersUtilsProvider utils={MomentUtils}>
		<Dialog
			open={openCustomDate}
			onClose={handleCancelCustomDate}
			aria-labelledby='alert-dialog-title'
			aria-describedby='alert-dialog-description'>
			<DialogTitle id='alert-dialog-title'>{t('filters.dateOptions.custom')}</DialogTitle>
			<DialogContent>
				<ItemGrid>
					<DateTimePicker
						autoOk
						ampm={false}
						label={t('filters.startDate')}
						clearable
						format='LLL'
						value={from}
						onChange={handleCustomDate('from')}
						animateYearScrolling={false}
						color='primary'
						disableFuture
						dateRangeIcon={<DateRange />}
						timeIcon={<AccessTime />}
						rightArrowIcon={<KeyboardArrowRight />}
						leftArrowIcon={<KeyboardArrowLeft />}
						InputLabelProps={{ FormLabelClasses: { root: classes.label, focused: classes.focused } }}
						InputProps={{ classes: { underline: classes.underline } }}
					/>
				</ItemGrid>
				<ItemGrid>
					<DateTimePicker
						autoOk
						disableFuture
						ampm={false}
						label={t('filters.endDate')}
						clearable
						format='LLL'
						value={to}
						onChange={handleCustomDate('to')}
						animateYearScrolling={false}
						dateRangeIcon={<DateRange />}
						timeIcon={<AccessTime />}
						color='primary'
						rightArrowIcon={<KeyboardArrowRight />}
						leftArrowIcon={<KeyboardArrowLeft />}
						InputLabelProps={{ FormLabelClasses: { root: classes.label, focused: classes.focused } }}
						InputProps={{ classes: { underline: classes.underline } }}
					/>
				</ItemGrid>
				<ItemGrid container>
					<ItemGrid xs={12} noPadding zeroMargin>
						<Caption>{t('filters.display')}</Caption>
					</ItemGrid>
					<ItemGrid xs={12} zeroMargin>
						<FormControlLabel
							control={
								<Checkbox
									checked={timeType === 0 ? true : false}
									onChange={handleCustomCheckBox}
									value={'0'}
									className={classes.checkbox}
								/>
							}
							label={t('filters.dateOptions.minutely')}
						/>
					</ItemGrid>
					<ItemGrid xs={12} zeroMargin>
						<FormControlLabel
							control={
								<Checkbox
									checked={timeType === 1 ? true : false}
									onChange={handleCustomCheckBox}
									value={'1'}
									className={classes.checkbox}
								/>
							}
							label={t('filters.dateOptions.hourly')}
						/>
					</ItemGrid>
					<ItemGrid xs={12} zeroMargin>
						<FormControlLabel
							control={
								<Checkbox
									checked={timeType === 2 ? true : false}
									onChange={handleCustomCheckBox}
									value={'2'}
									className={classes.checkbox}
								/>
							}
							label={t('filters.dateOptions.daily')}
						/>
					</ItemGrid>
					<ItemGrid xs={12} zeroMargin>
						<FormControlLabel
							control={
								<Checkbox
									checked={timeType === 3 ? true : false}
									onChange={handleCustomCheckBox}
									value={'3'}
									className={classes.checkbox}
								/>
							}
							label={t('filters.dateOptions.summary')}
						/>
					</ItemGrid>
				</ItemGrid>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleCancelCustomDate} color='primary'>
					{t('actions.decline')}
				</Button>
				<Button onClick={handleCloseDialog} color='primary' autoFocus>
					{t('actions.apply')}
				</Button>
			</DialogActions>
		</Dialog>
	</MuiPickersUtilsProvider>
}
export default CustomDateTime
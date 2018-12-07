import React from 'react'
import { MuiPickersUtilsProvider, DateTimePicker } from 'material-ui-pickers';
import { Dialog, DialogTitle, DialogContent, FormControlLabel, /* Checkbox, */ DialogActions, Button, RadioGroup, Radio, FormControl, withStyles } from '@material-ui/core';
import { ItemG, Caption } from 'components';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';
import { DateRange, AccessTime, KeyboardArrowRight, KeyboardArrowLeft } from 'variables/icons';
const styles = theme => ({
	dialogWidth: {
		maxWidth: 240,
	},
	checkbox: {
		padding: 8
	}
})
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
			<DialogContent className={classes.dialogWidth}>
				<ItemG container spacing={8}>
					<ItemG xs={12}>
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
					
						/>
					</ItemG>
					<ItemG xs={12}>
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
					
						/>
					</ItemG>
				
					<ItemG style={{ marginTop: 20 }} xs={12}>
						<Caption>{t('filters.display')}</Caption>
					</ItemG>
					<ItemG xs={12}>
						<FormControl component="fieldset" /* className={classes.formControl} */>
							<RadioGroup
								aria-label={t('filters.display')}
								name={t('filters.display')}
								onChange={handleCustomCheckBox}
								value={timeType.toString()}
							>
								<FormControlLabel
									value={'0'}
									control={<Radio className={classes.checkbox} />}
									label={t('filters.dateOptions.minutely')}
								/>

								<FormControlLabel
									value={'1'}
									control={<Radio className={classes.checkbox} />}
									label={t('filters.dateOptions.hourly')}
								/>

								<FormControlLabel
									value={'2'}
									control={<Radio className={classes.checkbox} />}
									label={t('filters.dateOptions.daily')}
								/>

								<FormControlLabel
									value={'3'}
									control={<Radio className={classes.checkbox} />}
									label={t('filters.dateOptions.summary')}
								/>
							</RadioGroup>
						</FormControl>
					</ItemG>
				</ItemG>
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
export default withStyles(styles)(CustomDateTime)
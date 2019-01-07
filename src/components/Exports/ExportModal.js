import React, { Component, Fragment } from 'react'
import { Dialog, Button } from '@material-ui/core';
import { GridContainer, ItemG, Info } from 'components';
import { CSVLink } from 'react-csv'
import moment from 'moment'
// import DevicePDF from './DevicePDF';

class ExportModal extends Component {
	CSVHeaders = [
		{ label: 'Device ID', key: 'id' },
		{ label: 'Start Date', key: 'startDate' },
		{ label: 'End Date', key: 'endDate' },
		{ label: 'Count', key: 'count' }
	]
	render() {
		const { open, handleClose, t, data } = this.props

		return (
			<Dialog
				open={open}
				onClose={handleClose}
			>

				<GridContainer>
					{data &&
						<Fragment>
							<ItemG xs={12}>
								<Info>{t('dialogs.exportMessage')}</Info>
							</ItemG>
							<ItemG container spacing={8} >
								<ItemG xs={3}>
									<CSVLink filename={`senti.cloud-data-${moment().format('DD-MM-YYYY')}.csv`} style={{ color: "#fff" }} data={data} headers={this.CSVHeaders}>
										<Button color={'primary'} variant={'contained'}>
										CSV
										</Button>
									</CSVLink>
								</ItemG>
								<ItemG xs={3}><Button color={'primary'} variant={'contained'}>JSON</Button></ItemG>
								<ItemG xs={3}><Button color={'primary'} variant={'contained'}>XLSX</Button></ItemG>
							</ItemG>
						</Fragment>
					}
				</GridContainer>
			</Dialog>
		)
	}
}

export default ExportModal

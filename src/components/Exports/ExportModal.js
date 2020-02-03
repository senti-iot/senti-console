/* eslint-disable indent */
import React, { Fragment } from 'react'
import { Dialog, Button } from '@material-ui/core'
import { GridContainer, ItemG, Info } from 'components'
import { CSVLink } from 'react-csv'
import moment from 'moment'
import zipcelx from 'zipcelx'
import { useLocalization } from 'hooks'

// import DevicePDF from './DevicePDF';

const ExportModal = props => {
	const t = useLocalization()
	// let newHeaders = [
	// 	{ label: 'Data Collection ID', key: 'id' },
	// 	{ label: 'Data Collection Name', key: 'dcName' },
	// 	{ label: 'Lat', key: 'lat' },
	// 	{ label: 'Long', key: 'long' },
	// 	{ label: 'Time granulation', key: 'unit' },
	// 	{ label: 'Start Date', key: 'startDate' },
	// 	{ label: 'End Date', key: 'endDate' },
	// 	{ label: 'Count', key: 'count' },
	// 	{ label: 'Project Name', key: 'projectName' },
	// 	{ label: 'Organization', key: 'org' }
	// ]
	let CSVHeaders = [
		{ label: 'Device ID', key: 'id' },
		{ label: 'Start Date', key: 'startDate' },
		{ label: 'End Date', key: 'endDate' },
		{ label: 'Count', key: 'count' }
	]
	const exportToJson = () => {
		var data = props.data
		var json = JSON.stringify(data);
		var blob = new Blob([json], { type: "application/json" });
		var url = URL.createObjectURL(blob);
		return url
	}
	const exportToXLSX = () => {
		var data = props.data
		let config = {
			filename: `senti.cloud-data-${moment().format('DD-MM-YYYY')}`,
			sheet: {
				data: [
					[
						{ type: 'string', value: 'Device ID' },
						{ type: 'string', value: 'Start Date' },
						{ type: 'string', value: 'End Date' },
						{ type: 'string', value: 'Count' },
					], ...data.map(d => [
						{ type: 'string', value: d.id },
						{ type: 'date', value: d.startDate },
						{ type: 'date', value: d.endDate },
						{ type: 'number', value: d.count },
					])]
			}
		}
		zipcelx(config)
	}
	const { open, handleClose, data, to, from, raw } = props
	return (
		<Dialog
			open={open}
			onClose={handleClose}
		>
			<GridContainer>
				{data &&
					<Fragment>

						<ItemG xs={12}>
							<Info>{t('dialogs.export.message')}</Info>
						</ItemG>
						<ItemG xs={12}>
							<Info paragraph={false}>
								{raw ? t('collections.rawData') : t('collections.calibratedData')}
							</Info>
							<Info>
								{`${from} - ${to}`}
							</Info>
						</ItemG>
						<ItemG container spacing={2} justify={'center'} >
							<ItemG>
								<Button filename={`senti.cloud-data-${moment().format('DD-MM-YYYY')}.csv`} data={data} headers={CSVHeaders} component={CSVLink} color={'primary'} variant={'outlined'}>
									CSV
									</Button>
							</ItemG>
							<ItemG>
								<Button component={'a'} download={`senti.cloud-data-${moment().format('DD-MM-YYYY')}.json`} href={exportToJson()} target={'_blank'} color={'primary'} variant={'outlined'}>
									JSON
									</Button>
							</ItemG>
							<ItemG>
								<Button color={'primary'} variant={'outlined'} onClick={exportToXLSX}>
									XLSX
									</Button>
							</ItemG>
						</ItemG>
					</Fragment>
				}
			</GridContainer>
		</Dialog>
	)
}

export default ExportModal
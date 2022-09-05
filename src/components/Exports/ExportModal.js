/* eslint-disable indent */
import React, { Fragment, useEffect, useState } from 'react'
import { Dialog, Button, DialogTitle, DialogContent, DialogActions, IconButton } from '@material-ui/core'
import { ItemG, T } from 'components'
import { CSVLink } from 'react-csv'
import moment from 'moment'
// import zipcelx from 'zipcelx'
import { useLocalization } from 'hooks'
import { Close } from 'variables/icons'

// import DevicePDF from './DevicePDF';

const ExportModal = props => {
	const t = useLocalization()
	const [dataConverted, setDataConverted] = useState(null);

	useEffect(() => {
		let newData = [];
		props.data.datasets[0].data.forEach(d => {
			newData.push({ x: moment(d.x).local().format('YYYY-MM-DD HH:mm:ss'), y: d.y })
		})
		setDataConverted(newData)
	}, [props.data]);


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
		{ label: props.dataField, key: 'x' },
		{ label: 'Date', key: 'y' },
	]
	const exportToJson = () => {
		var data = dataConverted.map(o => ({
			[props.dataField]: o.y, date: o.x
		}))

		var json = JSON.stringify(data)
		var blob = new Blob([json], { type: "application/json" })
		var url = URL.createObjectURL(blob)
		return url
	}
	// const exportToXLSX = () => {
	// 	let config = {
	// 		filename: `senti.cloud-data-${moment().format('DD-MM-YYYY')}`,
	// 		sheet: {
	// 			data: props.data.datasets[0].data
	// 		}
	// 	}
	// 	zipcelx(config)
	// }
	const { open, handleClose, dataField } = props
	return (
		<Dialog
			open={open}
			onClose={handleClose}
			maxWidth={'sm'}
			fullWidth
		>
			<DialogTitle disableTypography>
				<ItemG container justify="center" alignItems="center">
					<ItemG xs>
						{t('menus.export')} - {dataField}
					</ItemG>
					<ItemG>
						<IconButton style={{ color: '#fff' }} aria-label="close" onClick={handleClose}>
							<Close />
						</IconButton>
					</ItemG>
				</ItemG>
			</DialogTitle>
			<DialogContent>

				<T style={{ padding: 8 }}>{t('dialogs.export.message')}</T>

				{dataConverted ?
					<Fragment>
						<ItemG container spacing={2} justify={'center'} >
							<ItemG>
								<Button filename={`senti.cloud-data-${props.dataField}-${moment().format('DD-MM-YYYY')}.csv`}
									data={dataConverted}
									headers={CSVHeaders}
									component={CSVLink}
									color={'primary'}
									variant={'contained'}
								>
									CSV
				</Button>

							</ItemG>
							<ItemG>
								<Button component={'a'} download={`senti.cloud-data-${props.dataField}-${moment().format('DD-MM-YYYY')}.json`} href={exportToJson()} target={'_blank'} color={'primary'} variant={'contained'}
								>
									JSON
				</Button>
							</ItemG>
						</ItemG>
					</Fragment> : null
				}
			</DialogContent>
			<DialogActions>

				<Button icon={<Close />} color={'primary'} variant={'outlined'} onClick={handleClose}> {t('actions.close')}</Button>
			</DialogActions>
		</Dialog>
	)
}

export default ExportModal
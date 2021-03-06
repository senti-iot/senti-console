/* eslint-disable indent */
/* eslint-disable no-undef */
import React, { useState } from 'react'
import { Dialog, Collapse, Radio, Button, DialogTitle, DialogActions, Typography, DialogContent } from '@material-ui/core'
import { ItemG, Info, Caption } from 'components'
import moment from 'moment'
import zipcelx from 'zipcelx'
import _ from 'lodash'
import DMultiSelect from 'components/CustomInput/DMultiSelect';
import { CSVLink } from 'react-csv'
import { useLocalization } from 'hooks'

// CSVHeaders is not defined (throws error)
const ExportUsers = props => {
	const t = useLocalization()
	const [custom, setCustom] = useState(false)
	const [customHeaders, setCustomHeaders] = useState([])
	// constructor(props) {
	// 	super(props)

	// 	this.state = {
	// 		custom: false,
	// 		customHeaders: [],
	// 	}
	// }
	const defaultUserHeaders = () => {
		return [
			// { id: 0, label: t('users.fields.id'), key: 'id' },
			{ id: 0, label: t('users.fields.name'), keys: ['firstName', 'lastName'] },
			{ id: 1, label: t('users.fields.position'), key: 'aux.senti.extendedProfile.position' },
			{ id: 2, label: t('users.fields.organisation'), key: 'org.name' },
			{ id: 3, label: t('users.fields.phone'), key: 'phone' },
			{ id: 4, label: t('users.fields.email'), key: 'email' },
			{ id: 5, label: t('users.fields.firstName'), key: 'firstName' },
			{ id: 6, label: t('users.fields.lastName'), key: 'lastName' },
		]
	}
	const exportToJson = () => {
		var data = props.data
		var json = JSON.stringify(data);
		var blob = new Blob([json], { type: "application/json" });
		var url = URL.createObjectURL(blob);
		return url
	}
	const exportToCSV = () => {
		const { data } = props
		let result = []
		if (!custom) {
			data.forEach(u => {
				let obj = {}
				defaultUserHeaders().forEach(h => {
					obj[h.label] = h.keys ? h.keys.map(k => _.get(u, k)).join(' ') : _.get(u, h.key)
				})
				result.push(obj)
			})
			return result
		}
		else {
			data.forEach(u => {
				let obj = {}
				customHeaders.forEach(ch => {
					let h = defaultUserHeaders()[defaultUserHeaders().findIndex(h => h.id === ch)]
					obj[h.label] = h.keys ? h.keys.map(k => _.get(u, k)).join(' ') : _.get(u, h.key)
				})
				result.push(obj)
			})
			return result
		}
	}
	const exportToXLSX = () => {
		// var data = this.props.data
		const { data } = props
		if (!custom) {
			let config = {
				filename: `senti.cloud-users-${moment().format('DD-MM-YYYY')}`,
				sheet: {
					data: [
						defaultUserHeaders().map(d => ({
							type: 'string', value: d.label
						}))
						, ...data.map(d => defaultUserHeaders().map(h => {

							if (h.keys) {
								let array = []
								h.keys.forEach(f =>
									array.push(_.get(d, f)))
								let obj = array.join(' ')
								return { type: 'string', value: obj }
							}
							return { type: 'string', value: _.get(d, h.key) }
						})
						)]
				}
			}
			zipcelx(config)
		}
		else {
			let config = {
				filename: `senti.cloud-users-${moment().format('DD-MM-YYYY')}`,
				sheet: {
					data: [
						customHeaders.map(d => {
							let header = defaultUserHeaders()[defaultUserHeaders().findIndex(f => f.id === d)]
							return ({
								type: 'string', value: header.label
							})
						})
						, ...data.map(d => customHeaders.map(h => {
							let header = defaultUserHeaders()[defaultUserHeaders().findIndex(f => f.id === h)]

							if (header.keys) {
								let array = []
								header.keys.forEach(f =>
									array.push(_.get(d, f)))
								let obj = array.join(' ')
								return { type: 'string', value: obj }
							}
							return { type: 'string', value: _.get(d, header.key) }
						})
						)]
				}
			}
			zipcelx(config)
		}
	}
	const changeHeader = e => {
		setCustom(parseInt(e.target.value, 10))
		// this.setState({ custom: parseInt(e.target.value, 10) })
	}
	const handleChangeMultiple = event => {
		const options = event.target.value;
		setCustomHeaders(options)
		// this.setState({
		// 	customHeaders: options,
		// });
	};
	const { open, handleClose, CSVHeaders } = props
	return (
		<Dialog
			open={open}
			onClose={handleClose}
		>
			<DialogTitle disableTypography>
				<Typography variant={'h6'} style={{ color: 'inherit' }}>
					{t('menus.exportUsers')}
				</Typography>

			</DialogTitle>

			<DialogContent>
				<ItemG container>
					<ItemG xs={12} container justify={'center'}>
						<ItemG>
							<Radio
								checked={Boolean(!custom)}
								value={0}
								onChange={changeHeader}
							/>
						</ItemG>
						<ItemG xs container alignItems={'center'}>
							<Info paragraph={false}>
								{t('exports.standardColumns')}
							</Info>
						</ItemG>
						<ItemG xs={12}>
							<Collapse in={Boolean(!custom)}>
								<div style={{ marginLeft: 48 }}>
									<Caption>
										{defaultUserHeaders().map((d, i) => i === defaultUserHeaders().length - 1 ? d.label : `${d.label}, `)}
									</Caption>
								</div>
							</Collapse>
						</ItemG>
					</ItemG>
					<ItemG xs={12} container justify={'center'}>
						<ItemG>
							<Radio
								checked={Boolean(custom)}
								value={1}
								onChange={changeHeader}
							/>
						</ItemG>
						<ItemG xs container alignItems={'center'}>
							<Info paragraph={false}>
								{t('exports.customColumns')}
							</Info>
						</ItemG>
						<ItemG xs={12}>
							<Collapse in={Boolean(custom)}>
								<div style={{ marginLeft: 48 }}>
									<ItemG>
										<DMultiSelect
											label={t('exports.columns')}
											checkbox
											value={customHeaders}
											onChange={handleChangeMultiple}
											menuItems={defaultUserHeaders().map(d => ({
												value: d.id, label: d.label
											}))}
										/>

									</ItemG>
								</div>
							</Collapse>
						</ItemG>
					</ItemG>
				</ItemG>
			</DialogContent>
			<DialogActions>
				<ItemG container justify={'flex-end'}>
					<Button style={{ margin: 8 }} filename={`senti.cloud-data-${moment().format('DD-MM-YYYY')}.csv`} data={exportToCSV()} headers={CSVHeaders} component={CSVLink} color={'primary'} variant={'outlined'}>
						CSV
						</Button>
					<Button style={{ margin: 8 }} component={'a'} download={`senti.cloud-data-${moment().format('DD-MM-YYYY')}.json`} href={exportToJson()} target={'_blank'} color={'primary'} variant={'outlined'}>
						JSON
						</Button>
					<Button style={{ margin: 8 }} color={'primary'} variant={'outlined'} onClick={exportToXLSX}>
						XLSX
						</Button>
				</ItemG>
			</DialogActions>

		</Dialog>
	)
}

export default ExportUsers
import React, { Component, Fragment } from 'react'
import { Dialog, Collapse, Radio, Button } from '@material-ui/core'
import { GridContainer, ItemG, Info, Caption } from 'components'
import moment from 'moment'
import zipcelx from 'zipcelx'
import _ from 'lodash'
import DMultiSelect from 'components/CustomInput/DMultiSelect';
import { CSVLink } from 'react-csv'

class ExportUsers extends Component {
	constructor(props) {
		super(props)

		this.state = {
			custom: false,
			customHeaders: [],
		}
	}
	defaultUserHeaders = () => {
		const { t } = this.props
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
	exportToJson = () => {
		var data = this.props.data
		var json = JSON.stringify(data);
		var blob = new Blob([json], { type: "application/json" });
		var url = URL.createObjectURL(blob);
		return url
	}
	exportToCSV = () => {
		const { data } = this.props
		const { custom, customHeaders } = this.state
		let result = []
		if (!custom) {
			data.forEach(u => {
				let obj = {}
				this.defaultUserHeaders().forEach(h => {
					obj[h.label] = h.keys ? h.keys.map(k => _.get(u, k)).join(' ') : _.get(u, h.key)
				})
				result.push(obj)
			})
			console.log(result)
			return result
		}
		else {
			data.forEach(u => {
				let obj = {}
				customHeaders.forEach(ch => {
					let h = this.defaultUserHeaders()[this.defaultUserHeaders().findIndex(h => h.id === ch)]
					obj[h.label] = h.keys ? h.keys.map(k => _.get(u, k)).join(' ') : _.get(u, h.key)
				})
				result.push(obj)
			})
			return result
		}
	}
	exportToXLSX = () => {
		// var data = this.props.data
		const { data } = this.props
		const { custom, customHeaders } = this.state
		if (!custom) {
			let config = {
				filename: `senti.cloud-users-${moment().format('DD-MM-YYYY')}`,
				sheet: {
					data: [
						this.defaultUserHeaders().map(d => ({
							type: 'string', value: d.label
						}))
						, ...data.map(d => this.defaultUserHeaders().map(h => {

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
							let header = this.defaultUserHeaders()[this.defaultUserHeaders().findIndex(f => f.id === d)]
							return ({
								type: 'string', value: header.label
							})
						})
						, ...data.map(d => customHeaders.map(h => {
							let header = this.defaultUserHeaders()[this.defaultUserHeaders().findIndex(f => f.id === h)]

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
	changeHeader = e => {
		this.setState({ custom: parseInt(e.target.value, 10) })
	}
	handleChangeMultiple = event => {
		const options = event.target.value;

		this.setState({
			customHeaders: options,
		});
	};
	render() {
		const { open, handleClose, data } = this.props
		const { custom, customHeaders } = this.state
		return (
			<Dialog
				open={open}
				onClose={handleClose}
			>
				<GridContainer>
					{data &&
						<Fragment>
							<ItemG container>
								<ItemG xs={12} container justify={'center'}>
									<ItemG>
										<Radio
											checked={Boolean(!custom)}
											value={0}
											onChange={this.changeHeader}
										/>
									</ItemG>
									<ItemG xs container alignItems={'center'}>
										<Info noParagraph>
											Normal Headers
										</Info>
									</ItemG>
									<ItemG xs={12}>
										<Collapse in={Boolean(!custom)}>
											<div style={{ marginLeft: 48 }}>
												<Caption>
													{this.defaultUserHeaders().map((d, i) => i === this.defaultUserHeaders().length - 1 ? d.label : `${d.label}, `)}
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
											onChange={this.changeHeader}
										/>
									</ItemG>
									<ItemG xs container alignItems={'center'}>
										<Info noParagraph>
											Custom Headers
										</Info>
									</ItemG>
									<ItemG xs={12}>
										<Collapse in={Boolean(custom)}>
											<div style={{ marginLeft: 48 }}>
												<ItemG>
													<DMultiSelect
														label={'Headers'}
														checkbox
														value={customHeaders}
														onChange={this.handleChangeMultiple}
														menuItems={this.defaultUserHeaders().map(d => ({
															value: d.id, label: d.label
														}))}
													/>

												</ItemG>
											</div>
										</Collapse>
									</ItemG>
								</ItemG>
								<ItemG container justify={'center'}>
									{/* <ItemG xs={4}> */}
									<Button style={{ margin: 16, marginTop: 24 }} filename={`senti.cloud-data-${moment().format('DD-MM-YYYY')}.csv`} data={this.exportToCSV()} headers={this.CSVHeaders} component={CSVLink} color={'primary'} variant={'contained'}>
										CSV
									</Button>
									{/* </ItemG> */}
									{/* <ItemG xs={4}> */}
									<Button style={{ margin: 16, marginTop: 24 }} component={'a'} download={`senti.cloud-data-${moment().format('DD-MM-YYYY')}.json`} href={this.exportToJson()} target={'_blank'} color={'primary'} variant={'contained'}>
										JSON
									</Button>
									{/* </ItemG> */}
									{/* <ItemG xs={4}> */}
									<Button style={{ margin: 16, marginTop: 24 }} color={'primary'} variant={'contained'} onClick={this.exportToXLSX}>
										XLSX
									</Button>
									{/* </ItemG> */}
								</ItemG>
							</ItemG>
						</Fragment>
					}
				</GridContainer>
			</Dialog>
		)
	}
}

export default ExportUsers
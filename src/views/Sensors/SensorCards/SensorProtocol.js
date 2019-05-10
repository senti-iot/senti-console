import { withStyles, IconButton } from '@material-ui/core';
import registryStyles from 'assets/jss/views/deviceStyles';
import { Caption, ItemG, TextF } from 'components';
import InfoCard from 'components/Cards/InfoCard';
import Dropdown from 'components/Dropdown/Dropdown';
import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import { DataUsage, Edit, /* DeviceHub, LibraryBooks, LayersClear, */ Star, StarBorder, Block, CheckCircle, ContentCopy, /* Delete */ } from 'variables/icons';
import { connect } from 'react-redux'
import { copyToClipboard } from 'variables/functions';
import withSnackbar from 'components/Localization/S';

class SensorDetails extends Component {

	registryState = () => {
		const { registry, t } = this.props
		switch (registry.state) {
			case 1:
				return t('registries.fields.state.active')
			case 2:
				return t('registries.fields.state.inactive')
			default:
				break;
		}
	}
	renderProtocol = (id) => {
		const { t } = this.props
		switch (id) {
			case 0:
				return t('registries.fields.protocols.none')
			case 1: 
				return t('registries.fields.protocols.mqtt')
			case 2: 
				return t('registries.fields.protocols.http')
			case 3: 
				return `${t('registries.fields.protocols.mqtt')} & ${t('registries.fields.protocols.http')}`
			default:
				break;
		}
	}
	renderCommunication = (val) => {
		const { t, classes } = this.props
		switch (val) {
			case 0:
				return <ItemG container><Block className={classes.blocked} /> {t('sensors.fields.communications.blocked')}</ItemG>
			case 1:
				return <ItemG container><CheckCircle className={classes.allowed} /> {t('sensors.fields.communications.allowed')}</ItemG>
			default:
				break;
		}
	}
	render() {
		const { classes, sensor, t, isFav, addToFav, removeFromFav, /* accessLevel ,*/ history } = this.props
		return (
			<InfoCard
				title={t('registries.fields.protocol')}
				avatar={<DataUsage />}
				// noPadding
				// noRightExpand
				// menuExpand
				noExpand
				// expanded={Boolean(detailsPanel)}
				topAction={<Dropdown menuItems={
					[
						{ label: t('menus.edit'), icon: <Edit className={classes.leftIcon} />, func: () => history.push({ pathname: `/sensor/${sensor.id}/edit`, prevURL: `/sensor/${sensor.id}` }) },
						// { label: t('menus.delete'), icon: <Delete className={classes.leftIcon} />, func: handleOpenDeleteDialog },
						{ label: isFav ? t('menus.favorites.remove') : t('menus.favorites.add'), icon: isFav ? <Star className={classes.leftIcon} /> : <StarBorder className={classes.leftIcon} />, func: isFav ? removeFromFav : addToFav }

					]
				} />

				}
				subheader={<ItemG container alignItems={'center'}>
					<Caption>{this.renderProtocol(sensor.protocol)}</Caption>
				</ItemG>}
				content={
					<ItemG container spacing={16}>
						<ItemG xs={12}>
							<Caption>{t('sensors.fields.protocols.publishData')}</Caption>
							{sensor.protocol === 1 || sensor.protocol === 3 ? <ItemG xs={12}>
								<Caption>{t('registries.fields.protocols.mqtt')}</Caption>
								<TextF
									id={'mqtt-publish'}
									fullWidth
									readOnly
									label={''}
									value={`v1/webhouse/location/europe/registries/${sensor.regUUID}/devices/${sensor.uuid}/publish`}
									InputProps={{
										endAdornment:
											<ItemG>
												<IconButton onClick={() => {
													this.props.s('snackbars.urlCopied')
													copyToClipboard(`v1/webhouse/location/europe/registries/${sensor.regUUID}/devices/${sensor.uuid}/publish`)
												}
												}>
													<ContentCopy />
												</IconButton>
											</ItemG>
									}}
								/>
							</ItemG> : null}
							{sensor.protocol === 2 || sensor.protocol === 3 ? <ItemG xs={12}>
								<Caption>{t('registries.fields.protocols.http')} POST</Caption>
								<TextF 
									id={'htpp-publish'}
									fullWidth
									label={''}
									readOnly
									value={`https://iotdevice.senti.cloud/v1/webhouse/location/europe/registries/${sensor.regUUID}/devices/${sensor.uuid}/publish`}
									InputProps = {{ endAdornment:
										<ItemG>
											<IconButton onClick={() => { 
												this.props.s('snackbars.urlCopied')
												copyToClipboard(`https://iotdevice.senti.cloud/v1/webhouse/location/europe/registries/${sensor.regUUID}/devices/${sensor.uuid}/publish`)}
											}>
												<ContentCopy/>
											</IconButton>
										</ItemG> }
									}
								/>
							</ItemG> : null}
						</ItemG>
						<ItemG xs={12}>
							<Caption>{t('sensors.fields.protocols.state')}</Caption>
							{sensor.protocol === 1 || sensor.protocol === 3 ? <ItemG xs={12}>
								<Caption>{t('registries.fields.protocols.mqtt')}</Caption>
								<TextF
									id={'mqtt-state'}
									fullWidth
									label={''}
									readOnly
									value={`v1/webhouse/location/europe/registries/${sensor.regUUID}/devices/${sensor.uuid}/state/*event*`}
									InputProps = {{ endAdornment:
										<ItemG>
											<IconButton onClick={() => { 
												this.props.s('snackbars.urlCopied')
												copyToClipboard(`v1/webhouse/location/europe/registries/${sensor.regUUID}/devices/${sensor.uuid}/state/*event*`)}
											}>
												<ContentCopy/>
											</IconButton>
										</ItemG> }
									}
								/>
							</ItemG> : null}
							{sensor.protocol === 2 || sensor.protocol === 3 ? <ItemG xs={12}>
								<Caption>{t('registries.fields.protocols.http')}</Caption>
								<TextF 
									id={'http-state'}
									fullWidth
									readOnly
									value={`https://iotdevice.senti.cloud/v1/webhouse/location/europe/registries/${sensor.regUUID}/devices/${sensor.uuid}/state/*event*`}
									InputProps = {{ endAdornment:
										<ItemG>
											<IconButton onClick={() => { 
												this.props.s('snackbars.urlCopied')
												copyToClipboard(`https://iotdevice.senti.cloud/v1/webhouse/location/europe/registries/${sensor.regUUID}/devices/${sensor.uuid}/state/*event*`)}
											}>
												<ContentCopy/>
											</IconButton>
										</ItemG> }
									}
								/>
							</ItemG> : null}
						</ItemG>
					</ItemG>
				}
			/>
		)
	}
}

const mapStateToProps = (state) => ({
	detailsPanel: state.settings.detailsPanel
})

export default withSnackbar()(connect(mapStateToProps)(withStyles(registryStyles)(SensorDetails)))
import React, { Component, Fragment } from 'react'
import { withStyles, Button } from '@material-ui/core';
import { CloudUpload, Restore, Check } from 'variables/icons'
import { ItemGrid, Success, Warning } from 'components';
// import ImageCarousel from 'components/Devices/ImageCarousel';
import { uploadPictures } from 'variables/dataDevices';
import GridContainer from 'components/Grid/GridContainer';
import DeviceImage from 'components/Devices/DeviceImage';
import imageuploadStyles from 'assets/jss/components/image/imageuploadStyles';

class ImageUpload extends Component {
	constructor(props) {
		super(props)

		this.state = {
			images: [],
			success: null
		}
	}
	tempUpload = e => {
		if (e.target.files[0]) {
			var imgs = [...e.target.files]
			this.setState({ images: imgs })
		}
	}
	upload = async () => {
		await uploadPictures({
			id: this.props.dId,
			files: this.state.images,
		}).then(rs => { this.setState({ success: rs }); return rs })
	}
	finish = () => {
		this.setState({ images: [] })
		if (this.props.callBack)
			this.props.callBack()
		// return this.props.callBack ? this.props.callBack() : ''
	}
	handleReset = () => { this.setState({ images: [] }) }
	render() {
		const { classes, t } = this.props
		const { images, success } = this.state
		return (
			<GridContainer className={classes.grid}>
				<ItemGrid xs={12} noPadding container zeroMargin extraClass={classes.grid}>
					{images.length > 0 ? <DeviceImage t={t} label={'Preview selected images'} images={[...images]} /> : null}
				</ItemGrid>
				<ItemGrid xs={12} container zeroMargin justify={'center'}>
					{images.length > 0 ?
						<Fragment>
							{success ?
								<ItemGrid xs={12} zeroMargin container justify={'center'}>
									{success === true ? <Success>{t('images.uploadSuccess')}</Success> :
										success === false ?
											<Warning>{t('images.uploadFailed')}</Warning>
											: null}
								</ItemGrid> : null}
							<ItemGrid xs={6} noMargin container justify={'center'}>
								<Button variant='contained' color={success ? 'primary' : 'default'} component='span' className={classes.button} onClick={success ? this.finish : this.upload}>
									{!success ? <Fragment>
										<CloudUpload className={classes.iconButton} />{t('images.upload')}
									</Fragment>
										: <Fragment>
											<Check className={classes.iconButton} />{t('images.finish')}
										</Fragment>}
								</Button>
							</ItemGrid>
							<ItemGrid xs={6} noMargin container justify={'center'}>
								<Button variant={'contained'} component='span' className={classes.button} onClick={this.handleReset}>
									<Restore className={classes.iconButton} />{t('images.reset')}
								</Button>
							</ItemGrid>
						</Fragment>
						 :
						<Fragment>
							<input
								accept='image/*'
								className={classes.input}
								id='contained-button-file'
								multiple
								type='file'
								name='sentiFile'
								encType='multipart/form-data'
								onChange={this.tempUpload}
							/>
							<label htmlFor='contained-button-file'>
								<Button variant='contained' component='span' className={classes.button}>
									<CloudUpload className={classes.iconButton} />{t('images.add')}
								</Button>
							</label>
						</Fragment>
					}
				</ItemGrid>
			</GridContainer>
		)
	}
}

export default withStyles(imageuploadStyles)(ImageUpload)
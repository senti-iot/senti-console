import React, { useState, Fragment } from 'react'
import { withStyles, Button } from '@material-ui/core';
import { CloudUpload, Restore, Check } from 'variables/icons'
import { ItemGrid, Success, Warning } from 'components';
import { uploadPictures } from 'variables/dataDevices';
import GridContainer from 'components/Grid/GridContainer';
import DeviceImage from 'components/Devices/DeviceImage';
import imageuploadStyles from 'assets/jss/components/image/imageuploadStyles';
import { useLocalization } from 'hooks'

const ImageUpload = props => {
	const t = useLocalization()
	const [images, setImages] = useState([])
	const [success, setSuccess] = useState(null)
	// constructor(props) {
	// 	super(props)

	// 	this.state = {
	// 		images: [],
	// 		success: null
	// 	}
	// }
	const tempUpload = e => {
		if (e.target.files[0]) {
			var imgs = [...e.target.files]
			setImages(imgs)
			// this.setState({ images: imgs })
		}
	}
	const upload = async () => {
		await uploadPictures({
			id: props.dId,
			files: images,
		}).then(rs => { setSuccess(rs); return rs })
	}
	const finish = () => {
		setImages([])
		// this.setState({ images: [] })
		if (props.callBack)
			props.callBack()
	}
	const handleReset = () => { this.setState({ images: [] }) }

	const { classes } = props
	// const { images, success } = this.state
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
							<Button variant={'outlined'} color={"primary"} component='span' className={classes.button} onClick={success ? finish : upload}>
								{!success ? <Fragment>
									<CloudUpload className={classes.iconButton} />{t('images.upload')}
								</Fragment>
									: <Fragment>
										<Check className={classes.iconButton} />{t('images.finish')}
									</Fragment>}
							</Button>
						</ItemGrid>
						<ItemGrid xs={6} noMargin container justify={'center'}>
							<Button variant={'outlined'} component='span' className={classes.button} onClick={handleReset}>
								<Restore className={classes.iconButton} />{t('images.reset')}
							</Button>
						</ItemGrid>
					</Fragment>
					:
					<Fragment>
						<input
							accept='image/*'
							className={classes.input}
							id='outlined-button-file'
							multiple
							type='file'
							name='sentiFile'
							encType='multipart/form-data'
							onChange={tempUpload}
						/>
						<label htmlFor='outlined-button-file'>
							<Button variant='outlined' color={'primary'} component='span' className={classes.button}>
								<CloudUpload className={classes.iconButton} />{t('images.add')}
							</Button>
						</label>
					</Fragment>
				}
			</ItemGrid>
		</GridContainer>
	)
}

export default withStyles(imageuploadStyles)(ImageUpload)
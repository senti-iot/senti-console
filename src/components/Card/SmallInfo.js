import React, { Fragment } from 'react'
import { Info } from '..';
import Caption from '../Typography/Caption';

const SmallInfo = (props) => {
	return (
		<Fragment>
			<Caption classes={props.captionClasses}>
				{props.caption}
			</Caption>
			<Info classes={props.infoClasses}>
				{props.info}
			</Info>
		</Fragment>
	)
}

export default SmallInfo

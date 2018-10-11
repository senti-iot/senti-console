import React, { Fragment } from 'react'
import { Info, Caption } from 'components';

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

import React from 'react'
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';


const T = styled(({ b, ...rest }) => <Typography {...rest} />)`
	font-weight: ${props => props.b ? 600 : undefined};
`
export default T
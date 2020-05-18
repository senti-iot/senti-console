import { makeStyles } from '@material-ui/styles'

const usersStyles = makeStyles(theme => ({

	root: {
		width: '100%',
		margin: theme.spacing(1),
		borderRadius: "3px"
	},
	img: {
		borderRadius: "50px",
		height: "30px",
		width: "30px",
		display: 'flex'
	},
}))

export default usersStyles

import { colors } from '@material-ui/core';

export const bgColorsLight = theme => ({
	'': {
		background: theme.palette.type === 'light' ? '#fff' : 'rgba(0,0,0,0.7)'
	},
	lightBlue: {
		background: `linear-gradient(to right bottom, ${colors.lightBlue[200]}, ${colors.lightBlue[200]})`
	},
	cyan: {
		background: `linear-gradient(to right bottom, ${colors.cyan[100]}, ${colors.cyan[200]})`
	},
	teal: {
		background: `linear-gradient(to right bottom, ${colors.teal[100]}, ${colors.teal[200]})`
	},
	green: {
		background: `linear-gradient(to right bottom, ${colors.green[100]}, ${colors.green[200]})`
	},

	lightGreen: {
		background: `linear-gradient(to right bottom, ${colors.lightGreen[100]}, ${colors.lightGreen[200]})`
	},

	lime: {
		background: `linear-gradient(to right bottom, ${colors.lime[100]}, ${colors.lime[200]})`
	},

	yellow: {
		background: `linear-gradient(to right bottom, ${colors.yellow[100]}, ${colors.yellow[200]})`
	},

	amber: {
		background: `linear-gradient(to right bottom, ${colors.amber[100]}, ${colors.amber[200]})`
	},

	orange: {
		background: `linear-gradient(to right bottom, ${colors.orange[100]}, ${colors.orange[200]})`
	},

	deepOrange: {
		background: `linear-gradient(to right bottom, ${colors.deepOrange[100]}, ${colors.deepOrange[200]})`
	},

	red: {
		background: `linear-gradient(to right bottom, ${colors.red[200]}, ${colors.red[200]})`
	},

	pink: {
		background: `linear-gradient(to right bottom, ${colors.pink[100]}, ${colors.pink[200]})`
	},

	purple: {
		background: `linear-gradient(to right bottom, ${colors.purple[100]}, ${colors.purple[200]})`
	},

	deepPurple: {
		background: `linear-gradient(to right bottom, ${colors.deepPurple[200]}, ${colors.deepPurple[200]})`,
	},

	indigo: {
		background: `linear-gradient(to right bottom, ${colors.indigo[100]}, ${colors.indigo[200]})`
	},

	blue: {
		background: `linear-gradient(to right bottom, ${colors.blue[100]}, ${colors.blue[200]})`
	}
})
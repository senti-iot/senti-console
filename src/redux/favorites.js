import { saveSettings } from 'variables/dataLogin';

const SETFAV = 'setFavorites'
const GETFAVS = 'getFavorites'
const SAVEFAVORITES = 'saveFavorites'

export const updateFav = (obj) => {
	return (dispatch, getState) => {
		let uFav = getState().favorites.favorites.findIndex(f => f.id === obj.id)
		let array = getState().favorites.favorites
		array[uFav] = obj
		dispatch({
			type: SETFAV,
			favorites: array
		})
		dispatch(saveFavorites(true))
	}
}
export const isFav = (obj) => {
	return (dispatch, getState) => {
		let favs = getState().favorites.favorites
		if (favs.findIndex(f => f.id === obj.id && f.type === obj.type) > -1)
			return true
		else
			return false
	}
}
export const finishedSaving = () => {
	return {
		type: SAVEFAVORITES,
		saved: false
	}
}
export const removeFromFav = (obj) => {
	return async (dispatch, getState) => {
		// let arr = []
		let favs = getState().favorites.favorites
		favs = favs.filter(f => f.id !== obj.id)
		dispatch({
			type: SETFAV,
			favorites: favs
		})
		dispatch(saveFavorites())
	}
}
export const addToFav = (obj) => {
	return async (dispatch, getState) => {
		let favs = getState().favorites.favorites
		favs.push(obj)
		dispatch({
			type: SETFAV,
			favorites: favs
		})
		dispatch(saveFavorites())
	}
}

const saveFavorites = (noConfirm) => {
	return async (dispatch, getState) => {
		let user = getState().settings.user
		let f = getState().favorites.favorites
		user.aux = user.aux ? user.aux : {}
		user.aux.senti = user.aux.senti ? user.aux.senti : {}
		user.aux.senti.favorites = f
		var saved = await saveSettings(user)
		dispatch({
			type: SAVEFAVORITES,
			saved: noConfirm ? false : saved ? true : false 
		})
	}
}
const initialState = {
	favorites: [],
	saved: false
}

export const favorites = (state = initialState, action) => {
	switch (action.type) {
		case SETFAV: {
			return Object.assign({}, state, { favorites: action.favorites })
		}
		case GETFAVS: {
			return Object.assign({}, state, { ...action.favorites })
		}
		case SAVEFAVORITES:
		{ 
			return Object.assign({}, state, { saved: action.saved })
		}
		default:
			return state
	}

}
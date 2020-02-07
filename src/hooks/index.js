import useEventListener from './useEventListener/useEventListener'
import useLocalization from './useLocalization/useLocalization'
import usePrevious from './usePrevious/usePrevious'
import useSnackbar from './useSnackbar/useSnackbar'

import { useState, useContext, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation, useRouteMatch as useMatch } from 'react-router'
import { useTheme } from '@material-ui/styles'


/**
 * DEV
 */
import useWhyDidYouUpdate from './useWhyDidYouUpdate/useWhyDidYouUpdate'

export {
	useMatch,
	useWhyDidYouUpdate,
	useRef,
	//Dev
	useState,
	useEffect,
	useContext,
	useTheme,
	usePrevious,
	useLocalization,
	useHistory,
	useLocation,
	useSelector,
	useDispatch,
	useEventListener,
	useSnackbar
}
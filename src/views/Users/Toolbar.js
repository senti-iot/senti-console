

import React from 'react'
import { People, Business } from '@material-ui/icons';
import { AppBar, Tabs, Tab } from '@material-ui/core';
import Search from '../../components/Search/Search';
import { suggestionGen } from 'variables/functions'
const Toolbar = (props) => {
	return (
		<AppBar position={'sticky'} classes={{ root: props.classes.appBar }}>
			<Tabs value={props.route} onChange={props.handleTabsChange} classes={{ fixed: props.classes.noOverflow, root: props.classes.noOverflow }}>
				<Tab title={props.t("users.tabs.users")} id={0} label={<People />} onClick={() => { props.history.push(`/users`) }} />
				<Tab title={props.t("users.tabs.orgs")} id={1} label={<Business />} onClick={() => { props.history.push(`/orgs`) }} />
				<Search
					right
					suggestions={props.users ? suggestionGen(props.users) : []}
					handleFilterKeyword={props.handleFilterKeyword}
					searchValue={props.filters.keyword} />
			</Tabs>
		</AppBar>
	)
}

export default Toolbar

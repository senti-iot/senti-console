const breadcrumbs = (t, name) => {
	return {
		'settings': [
			{
				label: t('sidebar.settings'),
				path: '/settings'
			}
		],
		'user': [
			{
				label: t('sidebar.users'),
				path: '/users'
			},
			{
				label: name,
				path: '/user/%id'
			}
		],
		'users': [
			{
				label: t('sidebar.users'),
				path: '/users'
			}
		],
		'orgs': [
			{
				label: t('sidebar.orgs'),
				path: '/users'
			}
		],
		'org': [
			{
				label: t('sidebar.orgs'),
				path: '/orgs'
			},
			{
				label: name,
				path: '/org/%id'
			}
		],
		'favorites': [{
			label: t('sidebar.favorites'),
			path: '/favorites'
		}],
		'collection': [
			{
				label: t('sidebar.collections'),
				path: '/collections'
			},
			{
				label: name,
				path: '/collection/%id'
			}
		],
		'collections': [{
			label: t('sidebar.collections'),
			path: '/collections'
		}],
		'projects': [{
			label: t('sidebar.projects'),
			path: '/projects'
		}],
		'project': [
			{
				label: t('sidebar.projects'),
				path: '/projects'
			},
			{
				label: name,
				path: '/project/%id'
			}
		],
		'devices': [{
			label: t('sidebar.devices'),
			path: '/devices'
		}],
		'device': [
			{
				label: t('sidebar.devices'),
				path: '/devices'
			},
			{
				label: name,
				path: '/device/%id'
			}
		]

	}
}
export default breadcrumbs
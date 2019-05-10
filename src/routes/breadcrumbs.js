const breadcrumbs = (t, name, id) => {
	return {
		'registries': [
			{ label: t('sidebar.registries'), path: '/registries' }
		],
		'registry': [
			{ label: t('sidebar.registries'), path: '/registries' },
			{ label: name, path: '/registry/%id' }
		],
		'createregistry': [
			{ label: t('sidebar.registries'), path: '/registries' },
			{ label: t('menus.create.registry'), path: '/registries/new' }
		],
		'editregistry': [
			{ label: t('sidebar.registries'), path: `/registries` },
			{ label: name, path: `/registry/${id}` },
			{ label: t('menus.edits.registry'), path: `/registry/${id}/edit` }	
		],
		'sensors': [
			{ label: t('sidebar.devices'), path: '/sensors' }
		],
		'sensor': [
			{ label: t('sidebar.devices'), path: '/sensors' },
			{ label: name, path: '/sensor/%id' }
		],
		'createsensor': [
			{ label: t('sidebar.devices'), path: '/sensors' },
			{ label: t('menus.create.device'), path: '/sensors/new' }
		],
		'editsensor': [
			{ label: t('sidebar.devices'), path: `/sensors` },
			{ label: name, path: `/sensor/${id}` },
			{ label: t('menus.edits.device'), path: `/sensor/${id}/edit` }	
		],
		'devicetype': [
			{ label: t('sidebar.devicetypes'), path: '/devicetypes' },
			{ label: name, path: '/devicetype/%id' }
		],
		'devicetypes': [
			{ label: t('sidebar.devicetypes'), path: '/devicetypes' }
		],
		'createdevicetypes': [
			{ label: t('sidebar.devicetypes'), path: '/devicetypes' },
			{ label: t('menus.create.devicetype'), path: '/devicetypes/new' }
		],
		'createproject': [
			{ label: t('sidebar.projects'), path: '/projects' },
			{ label: t('menus.create.project'), path: '/projects/new' }
		],
		'editproject': [
			{ label: t('sidebar.projects'), path: `/projects` },
			{ label: name, path: `/project/${id}` },
			{ label: t('menus.edits.project'), path: `/project/${id}/edit` }	
		],
		'createcollection': [
			{ label: t('sidebar.collections'), path: '/collections' },
			{ label: t('menus.create.collection'), path: '/collections/new' }
		],
		'editcollection': [
			{ label: t('sidebar.collections'), path: `/collections` },
			{ label: name, path: `/collection/${id}` },
			{ label: t('collections.editCollection'), path: `/collection/${id}/edit` }	
		],
		'editdevicedetails': [
			{ label: t('sidebar.devices'), path: `/devices` },
			{ label: name, path: `/device/${id}` },
			{ label: t('devices.editDetailsTitle', { deviceId: `${name}(${id})` }), path: `/device/${id}/edit` }	
		],
		'editdevicehardware': [
			{ label: t('sidebar.devices'), path: `/devices` },
			{ label: name, path: `/device/${id}` },
			{ label: t('devices.editHardwareTitle', { deviceId: `${name}(${id})` }), path: `/device/${id}/edit` }
		],
		'createorg': [
			{ label: t('sidebar.orgs'), path: '/management/orgs' },
			{ label: t('menus.create.org'), path: '/management/orgs/new' }
		],
		'editorg': [
			{ label: t('sidebar.orgs'), path: '/management/orgs' },
			{ label: name, path: `/management/org/${id}` },
			{ label: t('menus.edits.org'), path: `/management/org/${id}/edit` }
		],
		'createuser': [
			{ label: t('sidebar.users'), path: '/management/users' },
			{ label: t('menus.create.user'), path: '/management/users/new' }
		],
		'edituser': [
			{ label: t('sidebar.users'), path: '/management/users' },
			{ label: name, path: `/management/user/${id}` },
			{ label: t('menus.edits.user'), path: `/management/user/${id}/edit` }
		],
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
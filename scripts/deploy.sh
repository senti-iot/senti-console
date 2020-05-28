#!/bin/bash

if [[ "$1" == "master" ]]; then
	echo
	echo Deploying Senti App $1 ...
	rsync -r --quiet $2/build/ deploy@rey.webhouse.net:/srv/www/odeumcode/dashboard.senti.cloud
	echo
	# Senti Workspace
	curl -X POST -H 'Content-type: application/json' --data '{"text":"Senti App MASTER updated!"}' $3
	echo Deployment to production done!
	exit 0
fi

if [[ "$1" == "beta" ]]; then
	echo
	echo Deploying Senti App $1 ...
	rsync -r --quiet $2/build/ deploy@rey.webhouse.net:/srv/www/odeumcode/beta.senti.cloud
	echo
	# Senti Workspace
	curl -X POST -H 'Content-type: application/json' --data '{"text":"Senti App BETA updated!"}' $3
	echo Deployment to beta done!
	exit 0
fi

if [[ "$1" == "alpha" ]]; then
	echo
	echo Deploying Senti App $1 ...
	rsync -r --quiet $2/build/ deploy@rey.webhouse.net:/srv/www/odeumcode/alpha.senti.cloud/
	echo
	# Senti Workspace
	curl -X POST -H 'Content-type: application/json' --data '{"text":"Senti App ALPHA updated!"}' $3
	echo Deployment to alpha-dev done!
	exit 0
fi

if [[ "$1" == "merge" ]]; then
	echo
	echo Deploying Senti App $1 ...
	rsync -r --quiet $2/build/ deploy@rey.webhouse.net:/srv/www/odeumcode/beta2.senti.cloud
	echo
	# Senti Workspace
	curl -X POST -H 'Content-type: application/json' --data '{"text":"Senti App ALPHA updated!"}' $3
	echo Deployment to alpha-dev done!
	exit 0
fi

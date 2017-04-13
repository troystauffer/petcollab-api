#!/bin/sh -e

if [ $# -ne 2 ]; then
  echo 1>&2 "Usage: $0 <application name> <sequelize env>"
  exit 1
fi

APP_NAME=$1
SQ_ENV=$2
PREV_WORKERS=$(heroku ps --app $APP_NAME | grep "^worker." | wc -l | xargs)

heroku maintenance:on --app $APP_NAME
heroku run `./node_modules/.bin/sequelize db:migrate --env $SQ_ENV` -a $APP_NAME
heroku maintenance:off --app $APP_NAME
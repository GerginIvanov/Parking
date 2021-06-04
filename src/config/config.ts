let config = {};

if(process.env.NODE_ENV === 'prod'){
    config = require('../environments/prod'); //no settings for prod currently
}else{
    config = require('../environments/dev');
}

module.exports = config;
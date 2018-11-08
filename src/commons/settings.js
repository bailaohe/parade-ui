let settings = {
    'development': {
        'server': 'http://116.62.201.139:5000'
    },
    'production': {
        'server': ''
    }
}

env = process.env['NODE_ENV']

module.exports = settings[env]

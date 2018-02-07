let settings = {
    'development': {
        'server': 'http://localhost:9999'
    },
    'production': {
        'server': ''
    }
}

env = process.env['NODE_ENV']

module.exports = settings[env]

const { alias } = require('react-app-rewire-alias');
// const path = require('path');

module.exports = function override(config) {
    alias({
        '@views': 'src/views',
        '@services': 'src/services',
        '@components': 'src/components',
        '@utilities': 'src/utilities',
        '@helpers': 'src/helpers',
        '@store': 'src/store'
    })(config);

    return config;
};
const { v4: uuidv4 } = require('uuid');

const generateAccessToken = () => {
    return uuidv4().replace(/-/g, '');
};

module.exports = {
    generateAccessToken
};

const fetch = require('node-fetch');

const fetchJSON = url => fetch(url).then(response => response.json());

export default fetchJSON;
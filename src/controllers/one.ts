const axios = require('axios');


const add = async (req: any, res: any) => {
    let response = await axios.get('https://api.chucknorris.io/jokes/random');
    const { value } = response.data;
    res.status(201).send(value);
};

module.exports = { add }
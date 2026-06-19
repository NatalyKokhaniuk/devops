const axios = require("axios");
const NodeCache = require("node-cache");

const cache = new NodeCache({
    stdTTL: 1800
});

async function getCurrency() {

    if (cache.has("currency")) {
        return cache.get("currency");
    }

    const response = await axios.get(process.env.EXCHANGE_API);

    const data = {
        USD: 1,
        EUR: response.data.rates.EUR,
        UAH: response.data.rates.UAH,
        GBP: response.data.rates.GBP
    };

    cache.set("currency", data);

    return data;
}

module.exports = { getCurrency };

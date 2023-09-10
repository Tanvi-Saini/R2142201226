const express = require('express');
const axios = require('axios');
const app = express();
const port = 8008;

app.use(express.json());

app.get('/numbers', async (req, res) => {
    const urls = req.query.url || [];

    if (urls.length === 0) {
        return res.status(400).json({ numbers: [] });
    }

    const result = [];

    try {
        const promises = urls.map(async (url) => {
            try {
                const response = await axios.get(url, { timeout: 500 });
                if (response.status === 200) {
                    const data = response.data;
                    if (Array.isArray(data.numbers)) {
                        result.push(...data.numbers);
                    }
                }
            } catch (error) {
                console.log("Error Occured!");
            }
        });

        await Promise.all(promises);
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }

    const uniqueNumbers = [...new Set(result)].sort((a, b) => a - b);

    return res.json({ numbers: uniqueNumbers });
});

app.listen(port, () => {
    console.log(`Number Management Service is running on port ${port}`);
});
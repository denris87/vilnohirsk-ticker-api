const express = require('express');
const cors = require('cors');
const yaml = require('js-yaml');

const app = express();
app.use(cors());

// Пряме посилання на сирий файл
const GITHUB_RAW_URL = 'https://raw.githubusercontent.com/denris87/vilnohirsk-ticker-api/main/ticker.yaml';

app.get('/api/ticker', async (req, res) => {
    try {
        const response = await fetch(`${GITHUB_RAW_URL}?t=${Date.now()}`);
        if (!response.ok) {
            return res.status(response.status).json({ error: "GitHub Error" });
        }
        
        const yamlText = await response.text();
        const data = yaml.load(yamlText);
        
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        
        res.json(data || { messages: [] });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

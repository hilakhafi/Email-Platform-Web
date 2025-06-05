const BlacklistService = require('../services/BlacklistServer');
// Add a URL to the blacklist
exports.addToBlackList = async (req, res) => {
    let { url } = req.body;
    // Check if URL is provided
    if (!url) {
        return res.status(400).json({ error: 'Url is required' });
    }

    try {
        url = decodeURIComponent(url).trim();
        const response = await BlacklistService.add(url);
        // Check if the addition was successful
        if (response === '201 Created') {
            res.status(201).json();
        } else {
            res.status(400).json({ error: `Bad Request` });
        }
    } catch (error) {
        // Handle unexpected errors
        res.status(500).json({ error: 'Failed to add to blacklist', details: error.message || error });
    }
    
};
// Remove a URL from the blacklist
exports.removeFromBlackList = async (req, res) => {
    let { id } = req.params;
    // Check if ID is provided
    if (!id) {
        return res.status(400).json({ error: 'ID is required' });
    }

    try {
        id = decodeURIComponent(id).trim();

        const response = await BlacklistService.sendToServer('DELETE', id);
        // Check if the deletion was successful
        if (response === '204 No Content') {
            res.status(204).json();
        } else {
            res.status(404).json({ error: 'URL not found in blacklist' });
        }
    } catch (error) {
        // Handle unexpected errors
        res.status(500).json({ error: 'Failed to remove from blacklist' });
    }
};

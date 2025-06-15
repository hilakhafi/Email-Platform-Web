const BlacklistService = require('../services/BlacklistServer');
// Add a URL to the blacklist
// exports.addToBlackList = async (req, res) => {
//     let { url } = req.body;
//     // Check if URL is provided
//     if (!url) {
//         return res.status(400).json({ error: 'Url is required' });
//     }

//     try {
//         url = decodeURIComponent(url).trim();
//         const response = await BlacklistService.add(url);
//         // Check if the addition was successful
//         if (response === '201 Created') {
//             res.status(201).json();
//         } else {
//             res.status(400).json({ error: `Bad Request` });
//         }
//     } catch (error) {
//         // Handle unexpected errors
//         res.status(500).json({ error: 'Failed to add to blacklist', details: error.message || error });
//     }
    
// };
exports.addToBlackList = async (req, res) => {
    const { subject = '', body = '' } = req.body;

    // שליפת כל הקישורים מתוך subject ו־body
    const urls = [...BlacklistService.extractUrls(subject), ...BlacklistService.extractUrls(body)];

    if (urls.length === 0) {
        return res.status(400).json({ error: 'No URLs found in subject or body' });
    }

    try {
        let successCount = 0;
        for (let url of urls) {
            url = decodeURIComponent(url).trim();
            const response = await BlacklistService.add(url);

            if (response === '201 Created') {
                successCount++;
            }
        }

        if (successCount > 0) {
            res.status(201).json({ message: `${successCount} URLs added to blacklist` });
        } else {
            res.status(400).json({ error: 'No URLs were added to blacklist' });
        }

    } catch (error) {
        res.status(500).json({ error: 'Failed to add URLs to blacklist', details: error.message || error });
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

// exports.checkEmailForSpam = async (req, res) => {
//     const { subject, body } = req.body;

//     if (!subject || !body) {
//         return res.status(400).json({ error: 'subject and body are required' });
//     }

//     try {
//         const isSpam = await BlacklistService.check(subject, body);
//         res.status(200).json({ spam: isSpam });
//     } catch (err) {
//         res.status(500).json({ error: 'Error checking spam', details: err.message });
//     }
// };

// exports.markMailAsSpam = async (req, res) => {
//   const { mailId, subject, body } = req.body;

//   if (!mailId || !subject || !body) {
//     return res.status(400).json({ error: 'mailId, subject and body are required' });
//   }

//   try {
//     await BlacklistService.add(subject, body);

//     return res.status(201).json({ message: 'Mail marked as spam and URLs blacklisted' });
//   } catch (error) {
//     return res.status(500).json({ error: 'Failed to mark mail as spam', details: error.message });
//   }
// };

exports.checkEmailForSpam = async (req, res) => {
    const { subject, body } = req.body;

    if (!subject || !body) {
        return res.status(400).json({ error: 'subject and body are required' });
    }

    try {
        const isSpam = await BlacklistService.check(subject, body);
        res.status(200).json({ spam: isSpam });
    } catch (err) {
        res.status(500).json({ error: 'Error checking spam', details: err.message });
    }
};

const net = require('net');
const PORT = 8080;
const HOST = 'blacklist';

let client = null;
let queue = [];
let buffer = '';
let ready = false;

// Initialize TCP connection to the blacklist server
const initConnection = () => {
  return new Promise((resolve, reject) => {
    client = new net.Socket();
    client.connect(PORT, HOST, () => {
    });

    client.on('data', (data) => {
      buffer += data.toString();

      // cehck if we have a complete response
      if (buffer.includes('\n\n')) {
        const response = buffer.trim();
        buffer = '';

        const resolveFunc = queue.shift(); // will get the first function in the queue
        if (resolveFunc) resolveFunc(response);
      }
    });

    client.on('error', (err) => {
      console.error('[ERROR] Socket error:', err.message);
      reject(err);
    });

    client.on('close', () => {
      console.log('[INFO] Socket closed');
      client = null;
    });

// Wait for the initial configuration response
    // once we get the first response, we can consider the connection ready
    // and we can start processing commands
    client.once('data', (firstResponse) => {
      const res = firstResponse.toString();
      if (res.includes('Configuration accepted') || res.includes('Ready for commands.')) {
        ready = true;
        buffer = ''; // reset buffer after initial configuration
        resolve();
      } else {
        reject(new Error('Unexpected configuration response: ' + res));
      }
    });
  });
};

const sendToServer = async (command, url) => {

  if (!client || !ready) {
    await initConnection();
  }

  return new Promise((resolve, reject) => {
    queue.push(resolve);  // add the resolve function to the queue to call it later

    const commandLine = `${command} ${url}\n`;
    client.write(commandLine);
  });
};

const extractUrls = (text) => {
    const urlRegex = /\b(?:https?:\/\/|www\.)[^\s]+/g;
    return text.match(urlRegex) || [];
};

// checls if the mail includes blocked links
const check = async (subject, body) => {

    const urls = [...extractUrls(subject), ...extractUrls(body)];

    if (urls.length === 0) return false;

    for (const url of urls) {

      const response = await sendToServer('GET', url);

      const parts = response.split('\n\n');
        if (parts.length === 2) {
            const [bloom, exact] = parts[1].split(' ');
            if (bloom === 'true' && (exact === 'true' || exact === undefined)) {
                return true;
            }
        } else {
            throw new Error(`Unexpected response from blacklist server: ${response}`);
        }
    }
    return false;  
    // all links are valid, not blocked
};

// Add a URL to the blacklist
const add = async (url) => {
  const result = await sendToServer('POST', url);
  return result;
};

// Remove a URL from the blacklist
const remove = async (url) => {
  const result = await sendToServer('DELETE', url);
  return result;
};


module.exports = {
    sendToServer,
    check,
    add,
    remove
};
















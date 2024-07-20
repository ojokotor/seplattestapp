const express = require('express');
const bodyParser = require('body-parser');
const basicAuth = require('basic-auth');
const axios = require('axios');

const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(bodyParser.json());

// Middleware for basic authentication
const auth = (req, res, next) => {
    const user = basicAuth(req);
  
    // Replace with your own logic for verifying username and password
    const validUser = 'admin';
    const validPassword = 'password123X';
  
    if (!user || user.name !== validUser || user.pass !== validPassword) {
      res.set('WWW-Authenticate', 'Basic realm="example"');
      return res.status(401).send('Unauthorized. Get a username and password');
    }
    next();
  };

// Endpoint to handle POST requests
app.post('/items', auth, async (req, res) => {
  const item = req.body;
  console.log('Received item:', item);

  // Forward the received data to another application
  try {
    const response = await axios.post('https://xceed365serviceapi-staging.azurewebsites.net/api/', item, {
      'Authorization': 'Bearer your-token',
      'Content-Type': 'application/json',
      'xceed-service-key':"+N240ZKB9faINL0xNs4Bzbx+fTcgQdFtoY3NB2b2gok="
    });
    
    console.log('Data forwarded successfully:', response.data);
    res.status(200).send('Item received and forwarded');
  } catch (error) {
    console.error('Error forwarding data:', error);
    res.status(500).send('Failed to forward item');
  }
  // res.status(200).send('Item received');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
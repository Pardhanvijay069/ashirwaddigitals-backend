const express = require('express');
const app = require('./src/app');
require('dotenv').config({ path: 'd:/Frame/SourceAnywhere/ashirwad/backend/.env' });
const http = require('http');

const server = http.createServer(app);
server.listen(0, async () => {
  const port = server.address().port;
  console.log(`Server running on port ${port}`);
  
  try {
    const fetch = require('node-fetch'); // wait node 18+ has native fetch
  } catch(e) {}
  
  const FormData = globalThis.FormData;
  const formData = new FormData();
  formData.append('images', new Blob([Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64')], { type: 'image/gif' }), 'test.gif');
  
  const res = await fetch(`http://localhost:${port}/api/admin/products/1/images`, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzgzODg2NDYxLCJleHAiOjE3ODM4OTAwNjF9.wqP7JEudYT3HQACs3JYn2aG_iVC6PUkL0eIIa63x_Mk'
    },
    body: formData
  });
  
  const json = await res.json();
  console.log('Response:', json);
  
  server.close();
});

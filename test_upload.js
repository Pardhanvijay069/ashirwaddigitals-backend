const fs = require('fs');

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzgzODg2NDYxLCJleHAiOjE3ODM4OTAwNjF9.wqP7JEudYT3HQACs3JYn2aG_iVC6PUkL0eIIa63x_Mk';

async function upload() {
  const gifBuffer = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
  const formData = new FormData();
  const blob = new Blob([gifBuffer], { type: 'image/gif' });
  formData.append('images', blob, 'test.gif');

  try {
    const res = await fetch('http://localhost:5000/api/admin/products/1/images', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    const data = await res.json();
    console.log('Response:', data);
  } catch (err) {
    console.error('Error:', err);
  }
}

upload();

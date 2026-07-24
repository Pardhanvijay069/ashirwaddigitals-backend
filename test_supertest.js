const express = require('express');
const app = require('./src/app'); // assuming app.js exports the express app

const request = require('supertest');

async function test() {
  const res = await request(app)
    .post('/api/admin/products/1/images')
    .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzgzODg2NDYxLCJleHAiOjE3ODM4OTAwNjF9.wqP7JEudYT3HQACs3JYn2aG_iVC6PUkL0eIIa63x_Mk')
    .attach('images', Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64'), 'test.gif');
  
  console.log(res.body);
}

test();

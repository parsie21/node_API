const express = require('express')
const axios = require('axios')

// Define the API endpoint and request details
const url = 'http://localhost:11434/api/generate';
const headers = {
    'Content-Type': 'application/json',
};

const data = {
    model: 'mistral',
    prompt: 'What is the capital of Italy?',
    stream: false, // Set to true if you want streaming responses
};

// Make the POST request

axios
  .post(url, data, { headers })
  .then((response) => {
    console.log('Response:', response.data.response);
  })
  .catch((error) => {
    console.error('Error:', error.message);
  });


// Make the POST request with streaming
/*
axios
  .post(url, data, { headers, responseType: 'stream' })
  .then((response) => {
    response.data.on('data', (chunk) => {
      const text = chunk.toString('utf-8');
      console.log('Chunk:', text);
    });
  })
  .catch((error) => {
    console.error('Error:', error.message);
  });
  */
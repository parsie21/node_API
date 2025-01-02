const express = require('express');

// express app
const app = express(); 

//register view engine 
app.set('view engine', 'ejs');

//Da fare
// path a cui chiamare la generazione di un prompt

// listen for request 
app.listen(3000);
app.get('/index', (req,res) => {
    //Invia a Ollama
    sendPromptToOllama();
    //res.send('<p> Home page</p>');
    res.sendFile('./views/index.html', {root:__dirname})
});

app.get('/about', (req,res) => {
    //res.send('<p> About page</p>');
    res.sendFile('./views/about.html', {root:__dirname})
}); 

// redirects 
app.get('/about-us',(req,res) => {
    res.redirect('./about')
})

// 404 page
app.use((req,res)=> {
    res.status(404);
    res.sendFile('./views/404.html', {root:__dirname})
})


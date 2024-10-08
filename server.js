const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const properties = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'properties.json')));


app.get('/api/properties', (req, res) => {
    const query = req.query.q ? req.query.q.toLowerCase() : '';
    const filteredProperties = properties.filter(property =>
        property.name.toLowerCase().includes(query) ||
        property.type.toLowerCase().includes(query) ||
        property.location.toLowerCase().includes(query)
    );
    res.json(filteredProperties);
});

app.get('/api/property/:id', (req, res) => {
    const propertyId = parseInt(req.params.id, 10);
    const property = properties.find(p => p.id === propertyId);
    if (property) {
        res.json(property);
    } else {
        res.status(404).json({ error: 'Property not found' });
    }
});


app.get('/search', (req, res) => {
    const query = req.query.query;
    res.render('index', { query});
});


app.get('/', (req, res) => {
    // res.render('index',{searchQuery:null});

    res.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/guest', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'guest.html'));
});

app.get('/hostel', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'hostel.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'login.html'));
});

app.get('/rental', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'rental.html'));
});

app.get('/property/:id', (req, res) => {
    const propertyId = parseInt(req.params.id, 10);
    const property = properties.find(p => p.id === propertyId);
    if (property) {
        res.render('property-details', { property });
    } else {
        res.status(404).send('Property not found');
    }
});

app.get('/search-page', (req, res) => {
    const query = req.query.query || ''; 
    res.render('index', { query });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

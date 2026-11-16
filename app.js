
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Display the home page
app.get('/', (req, res) => {
  res.render('index', {
    search: '',
    drinks: [],
    error: null
  });
});

// Search for a cocktail using the API
app.post('/search', async (req, res) => {
  const search = (req.body.search || '').trim();

  if (!search) {
    return res.render('index', {
      search,
      drinks: [],
      error: 'Please enter a cocktail name.'
    });
  }

  try {
    const response = await axios.get(
      'https://www.thecocktaildb.com/api/json/v1/1/search.php',
      {
        params: { s: search },
        timeout: 10000
      }
    );

    const drinks = response.data.drinks || [];

    res.render('index', {
      search,
      drinks,
      error: drinks.length === 0
        ? 'No cocktails found. Try another name.'
        : null
    });
  } catch (error) {
    res.render('index', {
      search,
      drinks: [],
      error: 'Could not load cocktail recipes. Please try again.'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

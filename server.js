const PORT = process.env.PORT || 3000;
const express = require('express');
const mongoose = require('mongoose');
const ShortUrl = require('./models/shortUrl');
const app = express();


const mongoURI = 'mongodb+srv://lallimoyilla:WoisV4CSjhrElyIi@cluster0.ndvgdmx.mongodb.net/urlShortner?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoURI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

app.get('/', async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render('index', { shortUrls: shortUrls });
});

app.post('/shortUrls', async (req, res) => {
  await ShortUrl.create({ full: req.body.fullUrl });
  res.redirect('/');
});

app.get('/:shortUrl', async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
  if (shortUrl == null) return res.sendStatus(404);

  shortUrl.clicks++;
  await shortUrl.save(); 

  res.redirect(shortUrl.full);
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

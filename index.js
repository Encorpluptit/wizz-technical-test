const express = require('express');
const bodyParser = require('body-parser');
const db = require('./models');
const axios = require('axios');

const app = express();
const iosTopUrl = process.env.IOS_TOP_URL || 'https://interview-marketing-eng-dev.s3.eu-west-1.amazonaws.com/ios.top100.json';
const androidTopUrl = process.env.ANDROID_TOP_URL || 'https://interview-marketing-eng-dev.s3.eu-west-1.amazonaws.com/android.top100.json';

app.use(bodyParser.json());
app.use(express.static(`${__dirname}/static`));

app.get('/api/games', (req, res) => db.Game.findAll()
  .then(games => res.send(games))
  .catch((err) => {
    console.log('There was an error querying games', JSON.stringify(err));
    return res.send(err);
  }));

app.post('/api/games', (req, res) => {
  const { publisherId, name, platform, storeId, bundleId, appVersion, isPublished } = req.body;
  return db.Game.create({ publisherId, name, platform, storeId, bundleId, appVersion, isPublished })
    .then(game => res.send(game))
    .catch((err) => {
      console.log('***There was an error creating a game', JSON.stringify(err));
      return res.status(400).send(err);
    });
});

app.delete('/api/games/:id', (req, res) => {
  // eslint-disable-next-line radix
  const id = parseInt(req.params.id);
  return db.Game.findByPk(id)
    .then(game => game.destroy({ force: true }))
    .then(() => res.send({ id }))
    .catch((err) => {
      console.log('***Error deleting game', JSON.stringify(err));
      res.status(400).send(err);
    });
});

app.put('/api/games/:id', (req, res) => {
  // eslint-disable-next-line radix
  const id = parseInt(req.params.id);
  return db.Game.findByPk(id)
    .then((game) => {
      const { publisherId, name, platform, storeId, bundleId, appVersion, isPublished } = req.body;
      return game.update({ publisherId, name, platform, storeId, bundleId, appVersion, isPublished })
        .then(() => res.send(game))
        .catch((err) => {
          console.log('***Error updating game', JSON.stringify(err));
          res.status(400).send(err);
        });
    });
});

/**
 * Search for games by name and platform
 * @param {string} name - (in body) The name of the game to search for
 * @param {string} platform - (in body) The platform to search for
 * @returns {Promise} - A promise that resolves with the games that match the search criteria or rejects with an error
 */
app.post('/api/games/search', (req, res) => {
    const {name, platform} = req.body;
    const whereClause = {};

    // if name is not provided, we want to return all games
    if (name) {
        // Use the Sequelize.Op.like operator to search for partial matches
        whereClause.name = {[db.Sequelize.Op.like]: `%${name}%`};
    }

    // if platform is provided, add it to the whereClause object to filter the query in lowercase
    // for more flexibility in the search, we could use whereClause.platform = {[db.Sequelize.Op.like]: `${platform}`};
    if (platform) {
        whereClause.platform = platform.toLowerCase();
        platform.toLowerCase();
    }

    // Run the query and return the results. If there is an error, log it and return the error
    return db.Game.findAll({where: whereClause})
        .then(games => res.send(games))
        .catch((err) => {
            console.log('***There was an error querying games', JSON.stringify(err));
            return res.status(500).send(err);
        });
});

/**
 * Populate the database with the top 100 games from the App Store and Google Play Store
 * @returns {Promise} - A promise that resolves when the database is populated or rejects with an error
 */
app.post('/api/games/populate', async (req, res) => {
    const iosTopGames = await axios.get(iosTopUrl).then(response => response.data).catch(
        err => {
            console.error('***There was an error populating the database with ios games', JSON.stringify(err));
            return res.status(500).send(err);
        }
    )
    const androidTopGames = await axios.get(androidTopUrl).then(response => response.data).catch(
        err => {
            console.error('***There was an error populating the database with android games', JSON.stringify(err));
            return res.status(500).send(err);
        }
    )

    // flatten the array of arrays of games
    const flattenedGames = [...iosTopGames, ...androidTopGames].reduce((acc, val) => acc.concat(val), []);

    // bulk create the games in the database and return a success message or an error
    return await db.Game.bulkCreate(flattenedGames.map(game => ({
        publisherId: game.publisher_id,
        // some names contain special characters, we could sanitize them before saving to the database
        name: game.name,
        platform: game.os,
        storeId: game.bundle_id, // defaulting to bundle_id as store_id is not provided in either dataset
        bundleId: game.bundle_id,
        appVersion: game.version,
        isPublished: true
    }))).then(
        () => res.status(200).send({message: 'Database populated with top 100 games from App Store and Google Play Store'})
    ).catch(err => {
        console.log('***There was an error populating the database', JSON.stringify(err));
        res.status(500).send(err);
    });
});


app.listen(3000, () => {
  console.log('Server is up on port 3000');
});

module.exports = app;

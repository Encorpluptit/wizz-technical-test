const express = require('express');
const bodyParser = require('body-parser');
const db = require('./models');

const app = express();

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


app.listen(3000, () => {
  console.log('Server is up on port 3000');
});

module.exports = app;

const request = require('supertest');
var assert = require('assert');
const app = require('../index');
const MockAdapter = require('axios-mock-adapter');

/**
 * Testing create game endpoint
 */
describe('POST /api/games', function () {
    let data = {
        publisherId: "1234567890",
        name: "Test App",
        platform: "ios",
        storeId: "1234",
        bundleId: "test.bundle.id",
        appVersion: "1.0.0",
        isPublished: true
    }
    it('respond with 200 and an object that matches what we created', function (done) {
        request(app)
            .post('/api/games')
            .send(data)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, result) => {
                if (err) return done(err);
                assert.strictEqual(result.body.publisherId, '1234567890');
                assert.strictEqual(result.body.name, 'Test App');
                assert.strictEqual(result.body.platform, 'ios');
                assert.strictEqual(result.body.storeId, '1234');
                assert.strictEqual(result.body.bundleId, 'test.bundle.id');
                assert.strictEqual(result.body.appVersion, '1.0.0');
                assert.strictEqual(result.body.isPublished, true);
                done();
            });
    });
});

/**
 * Testing get all games endpoint
 */
describe('GET /api/games', function () {
    it('respond with json containing a list that includes the game we just created', function (done) {
        request(app)
            .get('/api/games')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, result) => {
                if (err) return done(err);
                assert.strictEqual(result.body[0].publisherId, '1234567890');
                assert.strictEqual(result.body[0].name, 'Test App');
                assert.strictEqual(result.body[0].platform, 'ios');
                assert.strictEqual(result.body[0].storeId, '1234');
                assert.strictEqual(result.body[0].bundleId, 'test.bundle.id');
                assert.strictEqual(result.body[0].appVersion, '1.0.0');
                assert.strictEqual(result.body[0].isPublished, true);
                done();
            });
    });
});


/**
 * Testing update game endpoint
 */
describe('PUT /api/games/1', function () {
    let data = {
        id : 1,
        publisherId: "999000999",
        name: "Test App Updated",
        platform: "android",
        storeId: "5678",
        bundleId: "test.newBundle.id",
        appVersion: "1.0.1",
        isPublished: false
    }
    it('respond with 200 and an updated object', function (done) {
        request(app)
            .put('/api/games/1')
            .send(data)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, result) => {
                if (err) return done(err);
                assert.strictEqual(result.body.publisherId, '999000999');
                assert.strictEqual(result.body.name, 'Test App Updated');
                assert.strictEqual(result.body.platform, 'android');
                assert.strictEqual(result.body.storeId, '5678');
                assert.strictEqual(result.body.bundleId, 'test.newBundle.id');
                assert.strictEqual(result.body.appVersion, '1.0.1');
                assert.strictEqual(result.body.isPublished, false);
                done();
            });
    });
});

/**
 * Testing update game endpoint
 */
describe('DELETE /api/games/1', function () {
    it('respond with 200', function (done) {
        request(app)
            .delete('/api/games/1')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });
});

/**
 * Testing get all games endpoint
 */
describe('GET /api/games', function () {
    it('respond with json containing no games', function (done) {
        request(app)
            .get('/api/games')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, result) => {
                if (err) return done(err);
                assert.strictEqual(result.body.length, 0);
                done();
            });
    });
});

/**
 * Testing search games endpoint
 */
describe('POST /api/games/search', () => {
    it('Create ios game', (done) => {
        request(app)
            .post('/api/games')
            .send({
                publisherId: '1234567890',
                name: 'Test App 2',
                platform: 'ios',
                storeId: '1234',
                bundleId: 'test.bundle.id',
                appVersion: '1.0.0',
                isPublished: true,
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(done);
    });
    it('Create android game', (done) => {
        request(app)
            .post('/api/games')
            .send({
                publisherId: '1234567890',
                name: 'Test App 2',
                platform: 'android',
                storeId: '1234',
                bundleId: 'test.bundle.id',
                appVersion: '1.0.0',
                isPublished: true,
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(done);
    });
    it('should return games matching the name', (done) => {
        request(app)
            .post('/api/games/search')
            .send({name: 'Test App'})
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, result) => {
                if (err) return done(err);
                assert(result.body.length > 0);
                result.body.forEach((game) => {
                    assert.strictEqual(game.name, 'Test App 2');
                });
                done();
            });
    });
    it('should return games matching the name in lowercase', (done) => {
        request(app)
            .post('/api/games/search')
            .send({name: 'test app'})
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, result) => {
                if (err) return done(err);
                assert(result.body.length > 0);
                result.body.forEach((game) => {
                    assert.strictEqual(game.name, 'Test App 2');
                });
                done();
            });
    });
    it('should return games matching the platform', (done) => {
        request(app)
            .post('/api/games/search')
            .send({platform: 'ios'})
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, result) => {
                if (err) return done(err);
                assert(result.body.length > 0);
                result.body.forEach((game) => {
                    assert.strictEqual(game.platform, 'ios');
                });
                done();
            });
    });
    it('should return games matching the platform in uppercase', (done) => {
        request(app)
            .post('/api/games/search')
            .send({platform: 'IOS'})
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, result) => {
                if (err) return done(err);
                assert(result.body.length > 0);
                result.body.forEach((game) => {
                    assert.strictEqual(game.platform, 'ios');
                });
                done();
            });
    });
    it('should return games matching both name and platform', (done) => {
        request(app)
            .post('/api/games/search')
            .send({name: 'Test App', platform: 'ios'})
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, result) => {
                if (err) return done(err);
                assert(result.body.length > 0);
                result.body.forEach((game) => {
                    assert.strictEqual(game.name, 'Test App 2');
                    assert.strictEqual(game.platform, 'ios');
                });
                done();
            });
    });
    it('should return all games if no name is provided', (done) => {
        request(app)
            .post('/api/games/search')
            .send({name: '', platform: ''})
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, result) => {
                if (err) return done(err);
                assert(result.body.length > 0);
                done();
            });
    });
    it('should return all games if no search criteria is provided', (done) => {
        request(app)
            .post('/api/games/search')
            .send({name: ''})
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, result) => {
                if (err) return done(err);
                assert(result.body.length === 2);
                done();
            });
    });
});


// Could not setup jest globals for beforeAll, afterAll, afterEach
// Therefore, commenting out the test cases for now
// describe('POST /api/games/populate', () => {
//     let mock;
//
//     beforeAll(() => {
//         mock = new MockAdapter(axios);
//     });
//
//     afterEach(() => {
//         mock.reset();
//     });
//
//     afterAll(() => {
//         mock.restore();
//     });
//
//     it('should populate the database with top 100 games from App Store and Google Play Store', async (done) => {
//         const iosTopGames = [
//             { publisher_id: '1', name: 'Game 1', os: 'ios', bundle_id: 'com.example.game1', version: '1.0' },
//             { publisher_id: '2', name: 'Game 2', os: 'ios', bundle_id: 'com.example.game2', version: '1.0' }
//         ];
//         const androidTopGames = [
//             { publisher_id: '3', name: 'Game 3', os: 'android', bundle_id: 'com.example.game3', version: '1.0' },
//             { publisher_id: '4', name: 'Game 4', os: 'android', bundle_id: 'com.example.game4', version: '1.0' }
//         ];
//
//         mock.onGet('https://interview-marketing-eng-dev.s3.eu-west-1.amazonaws.com/ios.top100.json').reply(200, iosTopGames);
//         mock.onGet('https://interview-marketing-eng-dev.s3.eu-west-1.amazonaws.com/android.top100.json').reply(200, androidTopGames);
//
//         request(app)
//             .post('/api/games/search')
//             .send({name: ''})
//             .set('Accept', 'application/json')
//             .expect('Content-Type', /json/)
//             .expect(200)
//             .end((err, result) => {
//                 done();
//             });
//     });
// });
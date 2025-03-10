# Technical test for Voodoo

## Introduction

This is a simple file that I write for any technical test that I do.
It contains:
- reflections that comes to me when reading the technical test description. It helps me to understand the requirements and to explain my logic
- Timings for each part of the test
- the answers to the questions in the README.md file.

## Timings
- 19:45 - 19:59: Read the README.md file
- 20:00 - 20:02: Install the project and run it
- 20:03 - 20:08: Read the code in the front-end and the back-end
- 20:09 - 20:22: Implement the search feature in the back-end and test it
- 20:23 - 21:10: Implement the populate feature in the back-end. The test with mocked axios calls is not working yet.
- 20:11 - 21:29: Start to answer the questions and fixing the populate test feature.
- 21:30 - 21:40: Small pause.
- 21:41 - 21:49: Finishing answering the questions.

## Reflections

### Feature 1

#### Should we validate arguments (type and validity) ?
I don't think so as the environment is controlled. The front-end team has already created the UI and the API is already in place. The only thing to do is to implement the expected interface.

```
It seems that no validation is performed in other routes, so we'll keep it simple.
We could have used a library like `express-validator` to validate the input.
```

#### How is the search supposed to work when no platform is specified ?
If no search has been specified, then the results should include everything (just like it does now).
But is the argument supposed to be an undefined, an empty string or a list of all the platforms ?

```
After reading the code in the front-end, I see that the platform is a string and that it could be empty when 'All' option is selected. So, if the platform is an empty string, we should return all the games.
```

### Feature 2
#### The S3 URL point to the s3 path. Should we use AWS SDK to download the files ?
I don't think so. The subject is clear, we may want to keep it simple. We can use the URL directly.
Furthermore, the files could be taken from elsewhere in the future, and we don't want to be dependent on AWS Storage for this.
Nonetheless, we should use a defaulted env variable to store the URL.

#### Should we bulk insert the data or insert one by one ?
I think we should bulk insert the data. It will be faster, and we don't need to worry about the order of the data.
We will assume that the data is not present in the database and that we can insert it without any problem.


## Answers
### Question 1:
To make this project production-ready, the following pieces are missing:

- Remove model logic from the routes and create a service layer to handle business logic and database calls.
- Implement comprehensive error handling to catch and log all possible errors, using a logging library like `winston` to log errors and important events.
- Implement input validation and sanitization to prevent SQL injection and other attacks.
- Use HTTPS to encrypt data in transit (if not already implemented by load balancer or reverse proxy).
- Implement authentication and authorization to secure the API endpoints.
- Obviously, use a real database like PostgreSQL or MySQL instead of SQLite for production.
- Analyze sequelize queries and add necessary indexes to improve performance.
- Implement database migrations using a tool like `sequelize-cli`.
- Write comprehensive integration tests using a testing framework like `mocha` and `chai`.
- Set up continuous integration (CI) to run tests automatically on each commit.
- Set up monitoring for the application and database using tools like `Prometheus` and `Grafana`.
- Implement alerting to notify the team of any issues.
- Use deployment tools like Docker & Docker Compose to containerize the application.
- Set up a CI/CD pipeline to automate the deployment process.
- Write comprehensive documentation for the API endpoints and the overall architecture.
- Include setup and deployment instructions.

### Action Plan:
1. Error Handling and Logging:
   - Use `express-validator` for input validation.
   - Add error handling middleware in Express.
   - Integrate tools like `winston` for logging.
2. Testing:
   - Write unit tests for all functions and routes that cover edge cases.
   - Write integration tests for the API endpoints using `mocha` and `chai`.
   - Set up a CI pipeline using GitHub Actions, `Dagger` or another CI tool.
3. Containerization and CI/CD:
   - Create Dockerfile & docker-compose.yml for containerization.
   - Set up a CI/CD pipeline for automated deployments.
4. Security:
   - Implement JWT-based authentication and role-based authorization.
   - Bonus: Implement OAuth2.0 for easier third-party authentication.
5. Database Enhancement & Optimization:
   - Modify the database layer to use a real database like PostgreSQL or MySQL.
   - Remove fixtures ingestion.
   - Use `sequelize-cli` for database migrations.
   - Add necessary indexes to the database to improve `Search Game` query performance.
6. Monitoring and Alerting:
   - Configure alerting using tools like `Sentry`, `DataDog` or `PagerDuty`.
   - Bonus: Integrate `Prometheus` for monitoring and use `Grafana` for visualization.
7. Documentation:
   - Write API documentation using tools like `Swagger`, allowing for easy API exploration and automated testing with tools like `Postman`.
   - Document the setup, deployment, and architecture for new developers.

### Question 2:
To automate the ingestion of new files from the S3 bucket every day, the following solution can be implemented:

1. Scheduled Job:
   - Use a task scheduler like `cron` or `node-cron` to run a job every day.
   - The job will call the `/api/games/populate` endpoint or internal function call to ingest the new files.
2. AWS Lambda Function:
   - Use AWS Lambda to create a serverless function. It could be triggered by:
      * A CloudWatch Events rule to trigger the function daily.
      * S3 Event Notifications to trigger the function when a new file is uploaded.
   - The Lambda function will call the `/api/games/populate` endpoint.


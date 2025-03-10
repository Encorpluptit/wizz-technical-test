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
- 20:23 - 21:10: Implement the populate feature in the back-end. The test with mocked axios calls is not working because of jest setup.

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


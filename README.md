# pym 2 
([pym improved](https://github.com/alexneamtu/pym))

A microservice that serves images and resizes them according to the request. The name is from the movie Ant-Man. Pym (Dr. Hank Pym) is the name of the doctor that shrunk Scott Lang.

## Running the code
Run `npm i` to install the node dependencies.

To start the project use `npm start`

To stop the project use `npm stop`

To run the tests use `npm test`

To run the linter use `npm run lint`

## Docker
In order to run the service inside a container run the following commands:

`docker build -t pym2 .`

`docker run -p 7000:7000 -p 8000:8000 pym2`

# codetyper
This is a project by members of the KalleTech discord server. We are making a website where you can practice your programming speed.

## Links
Website: https://christofferholmesland.github.io/codetyper/

Code: https://github.com/ChristofferHolmesland/codetyper

Discord: https://discord.gg/S6VfJ8jzey

Code documentation can be found in the [docs](./docs) folder after running `npm run generate-docs`.

## Setup

Read the contribution [guide](./CONTRIBUTING.md).

Requirements: Node.js and npm

#### Download and install
```bash
# Download the code
$ git clone git@github.com:ChristofferHolmesland/codetyper.git
$ cd codetyper
# Install dependencies
$ npm install
```

Note: Because we are using javascript modules you need a web server set up to serve the files. A simple server you can use is the one included in the [server](./server) folder. Example:
```bash
# Navigate to the project folder
$ cd codetyper
# Start http server
$ npm run dev
# You can access the app from a browser at http://localhost:8000
```

#### Before creating a pull request
```bash
# Format the code
$ npm run prettier
# Generate documentation
$ npm run generate-docs
# Run tests
$ npm run tests
```

Pull requests are only accepted if they pass every test, the code formatting is consistent, and the documentation has been updated.

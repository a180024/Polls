# Blockchain Assignment

Requirements:
- [x] Allow anyone to propose single-choice polls, each poll with an expiry time.
- [x] Allow anyone to vote on any active polls.
- [x] Allow anyone to query results on any polls.

## Description of contract
I created a struct each for the Poll and Poll Options. And also a mapping with pollId as key and an array of Option struct as value. Each timean poll is created, we save the area of options into the mapping and also create a Poll struct which is stored in an array.

I assumed that each poll will last from 1 hour to 1 week and a voter will not be able to vote on the same poll twice. 

## Demo
I deployed a basic frontend [here](https://gallant-montalcini-c2a5d9.netlify.app/) to access the contract deployed on Rinkeby network.

## Deployment
`$ npx hardhat deploy-contract`

## Test
`$ npx hardhat test`

## Start app
`$ npm run start`

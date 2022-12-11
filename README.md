## Currency Converter
Currency conversion service that includes FIAT and cryptocurrencies.
This service connects to the Coinbase API for exchange rates: https://developers.coinbase.com/api/v2#get-exchange-rates to request currency data. Some features of this API include converting from BTC to USD as well as applies some rate limiting


## Intall dependencies
- install redis
- `npm install` # install app dependencies
- `npm start` # app starts in localhost:5000
- `npm run test`  # run test, make sure app is not running otherwise you'll see `Uncaught Error: listen EADDRINUSE: address already in use :::5000` error
- `npm run lint` # catch lint errors
- `npm run lintfix` # fix lint errors

## TODO
- log or store request/response data and metadata to something like logzio or mongodb
- initialize app in an init async fashion
- add unit tests for standalone services and middleware
- add more tests tests tests and more tests
- add redis cache expiration policy
- remove hardcoded user and api id/key attributes currently defined as constants

## How to test this app
- run the app locally
- use the following curl command. It will only work with the given basic auth credentials as those are harcoded on the backend at the moment
```
curl --location --request POST 'localhost:5000/api/v1/conversions' \
--header 'Content-Type: application/json' \
--header 'Authorization: Basic MDE0ODE5Y2YtM2QyOC00NjQwLWEyYzMtOTU0YWUxYjQxM2ViOjRlZTk0ODA3LTBkNTgtNGNkMi04MjFjLTI5OWExZTkzOTA0NQ==' \
--data-raw '{
    "from": "BTC",
    "to": "USD",
    "amount": "999.20"
}'
```

Happy coding!

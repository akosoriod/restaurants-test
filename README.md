# Welcome to tyba app - API

## Cognito links
* https://tyba-v1-user-pool-development.auth.us-east-1.amazoncognito.com/login?response_type=token&client_id=6cp9lf58jm6b81oa8vp3g1i2m2&redirect_uri=https://github.com/akosoriod/restaurants-test
* https://tyba-v1-user-pool-development.auth.us-east-1.amazoncognito.com/logout?response_type=token&client_id=6cp9lf58jm6b81oa8vp3g1i2m2&redirect_uri=https://github.com/akosoriod/restaurants-test

## Run Local

* `cdk synth Infrastructure-omni-V1-Stack-development > template.yaml`  build proyect and generate yaml architecture file
* `sam local start-api`   run proyect in local

## Run test
* `npm run test`    perform the jest unit tests

## Deploy in AWS
* `cdk deploy Infrastructure-omni-V1-Stack-development` deploy infrastructure stack to your default AWS account/region
* `cdk deploy Pipeline-omni-V1-Stack-development`       deploy pipeline stack to your default AWS account/region


## Diagram cloud serverless architecture
<p align="center"><img src="<p align="center"><img src="https://raw.githubusercontent.com/akosoriod/restaurants-test/main/docs/AWS_diagram.png"></p>


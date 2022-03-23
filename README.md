# Welcome to tyba app - API


* endpoint_example: [API](https://fvs1m6rc69.execute-api.us-east-1.amazonaws.com/prod/v1/searches)
  
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


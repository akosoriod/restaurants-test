# Welcome to tyba app - backend

### AWS 

* `cdk synth tyba-V1-InfrastructureStack-development  > template.yaml` Emit the synthesized CloudFormation template
* `cdk deploy  tyba-V1-InfrastructureStack-development` Create Api in AWS
* `cdk deploy  tyba-V1-DatabaseStack-development` Create dynamoDB 
* `cdk deploy  tyba-V1-PipelineStack-development` Create pipeline 


 ### Start the Api locally 
- `cdk synth TPChain-V1-InfrastructureStack-development --no-staging > template.yaml` Emit the synthesized CloudFormation template
- `sam local start-api -l logs.log --docker-network dynamo_local_tpchainNetwork` Start Api with logs file and docker network

cdk deploy --require-approval never -f tyba-V1-InfrastructureStack-development
cdk synth tyba-V1-InfrastructureStack-development > template2.yaml
type template2.yaml >> template.yaml
sam local start-api -l logs.log 

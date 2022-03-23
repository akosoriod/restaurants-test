import {CodePipeline, CodePipelineSource, ShellStep} from "@aws-cdk/pipelines";
import * as codeCommit from "@aws-cdk/aws-codecommit";
import {Construct, Stack, StackProps, Stage, StageProps} from '@aws-cdk/core';
import {TybaInfrastructureStack} from "./tyba-infrastructure-stack";
import {TybaDatabaseStack} from "./tyba-database-stack";


class TybaInfrastructureStage extends Stage {

    constructor(scope: Construct, id: string, env: any, props?: StageProps) {
        super(scope, id, props);

        const Stack = new TybaInfrastructureStack(this, env.STACK_NAME, env);

    }
}

class tybaDatabaseStage extends Stage {

    constructor(scope: Construct, id: string, env: any, props?: StageProps) {
        super(scope, id, props);

        const Stack = new TybaDatabaseStack(this, env.STACK_NAME, env);

    }
}



export class TybaPipelineStack extends Stack {
    constructor(scope: Construct, id: string, env: any, props?: StackProps) {
        super(scope, id, props);

        const repository = codeCommit.Repository.fromRepositoryArn(this, 'Repository', env.REPOSITORY_ARN)

        const tybaPipeline = new CodePipeline(this, env.PIPELINE_NAME, {
            pipelineName: env.PIPELINE_NAME,
            dockerEnabledForSynth: true,
            dockerEnabledForSelfMutation: true,
            synth: new ShellStep('Synth', {
                input: CodePipelineSource.codeCommit(repository, env.PROJECT_ENVIRONMENT),
                commands: [
                    'npm ci',
                    'npm run build',
                    'npx cdk synth'
                ],
            }),
        });

       /* const DatabaseStage = new tybaDatabaseStage(this, `Database`, env, {
            env: env.AWS_ENVIRONMENT
        })

        tybaPipeline.addStage(DatabaseStage);*/

        const InfrastructureStage = new TybaInfrastructureStage(this, `Infrastructure`, env, {
            env: env.AWS_ENVIRONMENT
        })

        tybaPipeline.addStage(InfrastructureStage);

    }
    
}
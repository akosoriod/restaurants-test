#!/usr/bin/env node
import {App} from '@aws-cdk/core';
import {TybaPipelineStack} from "../lib/tyba-pipeline-stack";
import {TybaInfrastructureStack} from "../lib/tyba-infrastructure-stack";
import {TybaDatabaseStack} from "../lib/tyba-database-stack";
import {envDevelopment} from "./env";


const app = new App();


// DEVELOPMENT

new TybaDatabaseStack(app, `${envDevelopment.PROJECT_NAME}-V${envDevelopment.PROJECT_VERSION}-DatabaseStack-development`, envDevelopment, {
     env: envDevelopment.AWS_ENVIRONMENT
});

new TybaInfrastructureStack(app, `${envDevelopment.PROJECT_NAME}-V${envDevelopment.PROJECT_VERSION}-InfrastructureStack-development`, envDevelopment, {
    env: envDevelopment.AWS_ENVIRONMENT
});

new TybaPipelineStack(app, `${envDevelopment.PROJECT_NAME}-V${envDevelopment.PROJECT_VERSION}-PipelineStack-development`, envDevelopment, {
    env: envDevelopment.AWS_ENVIRONMENT
});


app.synth();
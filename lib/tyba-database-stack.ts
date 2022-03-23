import * as dynamoDb from '@aws-cdk/aws-dynamodb';
import * as cdk from '@aws-cdk/core';

export class TybaDatabaseStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, env:any, props?: cdk.StackProps) {
        super(scope, id, props);

        const table = new dynamoDb.Table(this, env.MAIN_TABLE_NAME, {
            tableName: env.MAIN_TABLE_NAME,
            billingMode: dynamoDb.BillingMode.PAY_PER_REQUEST,
            removalPolicy:cdk.RemovalPolicy.RETAIN,
            partitionKey: {name: 'PK', type: dynamoDb.AttributeType.STRING},
            sortKey: {name: 'SK', type: dynamoDb.AttributeType.STRING}
        });
        table.addLocalSecondaryIndex({
            indexName: "LSI1",
            sortKey: {name: 'LSI1', type: dynamoDb.AttributeType.STRING},
            projectionType: dynamoDb.ProjectionType.ALL,
        });
        table.addLocalSecondaryIndex({
            indexName: "LSI2",
            sortKey: {name: 'LSI2', type: dynamoDb.AttributeType.STRING},
            projectionType: dynamoDb.ProjectionType.ALL,
        });
        table.addLocalSecondaryIndex({
            indexName: "LSI3",
            sortKey: {name: 'LSI3', type: dynamoDb.AttributeType.STRING},
            projectionType: dynamoDb.ProjectionType.ALL,
        });
        table.addLocalSecondaryIndex({
            indexName: "LSI4",
            sortKey: {name: 'LSI4', type: dynamoDb.AttributeType.STRING},
            projectionType: dynamoDb.ProjectionType.ALL,
        });
        table.addLocalSecondaryIndex({
            indexName: "LSI5",
            sortKey: {name: 'LSI5', type: dynamoDb.AttributeType.STRING},
            projectionType: dynamoDb.ProjectionType.ALL,
        });
        table.addGlobalSecondaryIndex({
            indexName: "Inverted",
            partitionKey: {name: 'SK', type: dynamoDb.AttributeType.STRING},
            sortKey: {name: 'PK', type: dynamoDb.AttributeType.STRING},
            projectionType: dynamoDb.ProjectionType.ALL,
        });


    }
}

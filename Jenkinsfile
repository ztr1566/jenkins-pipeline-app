// Import the shared library we configured in Jenkins
@Library('devops-project-lib') _

pipeline {
    // Run on our agent with the label 'ubuntu'
    agent { label 'ubuntu' }

    // Environment variables for our pipeline
    environment {
        AWS_ACCOUNT_ID = '826568078815' // <-- غيّر دي
        AWS_REGION = 'us-east-1' // <-- غيّر دي لو منطقتك مختلفة
        ECR_REPO_NAME = 'my-ubuntu-app' // <-- اسم الـ ECR repo
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo 'Checking out the source code...'
            }
        }

        stage('Build and Push Docker Image') {
            steps {
                script {
                    // Call the function from our shared library
                    buildPipeline.buildAndPushDockerImage(
                        awsAccountId: env.AWS_ACCOUNT_ID,
                        awsRegion: env.AWS_REGION,
                        ecrRepoName: env.ECR_REPO_NAME
                    )
                }
            }
        }
    }
}
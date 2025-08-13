@Library('devops-project-lib') _

pipeline {
    agent { label 'ubuntu' }

    environment {
        AWS_ACCOUNT_ID      = '826568078815'
        AWS_REGION          = 'us-east-1'
        ECR_REPO_NAME       = 'my-ubuntu-app'
        MANIFEST_REPO_URL   = 'https://github.com/ztr1566/jenkins-app-manifests.git'
        GITHUB_CREDENTIALS  = 'github-credentials'
        // Define the imageTag once using the build number
        IMAGE_TAG           = "${env.BUILD_NUMBER}"
    }

    stages {
        stage('Build and Push Docker Image') {
            steps {
                script {
                    buildPipeline(
                        awsAccountId: env.AWS_ACCOUNT_ID,
                        awsRegion: env.AWS_REGION,
                        ecrRepoName: env.ECR_REPO_NAME,
                        imageTag: env.IMAGE_TAG // Use the environment variable
                    )
                }
            }
        }

        stage('Update Manifests') {
            steps {
                script {
                    def fullImageUrl = "${env.AWS_ACCOUNT_ID}.dkr.ecr.${env.AWS_REGION}.amazonaws.com/${env.ECR_REPO_NAME}:${env.IMAGE_TAG}"

                    withCredentials([usernamePassword(credentialsId: env.GITHUB_CREDENTIALS, usernameVariable: 'GIT_USERNAME', passwordVariable: 'GIT_PASSWORD')]) {
                        
                        sh 'git config --global user.email "ztr1566@gmail.com"'
                        sh 'git config --global user.name "Ziad Rashid"'
                        sh 'rm -rf jenkins-app-manifests' 
                        sh "git clone https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/ztr1566/jenkins-app-manifests.git"
                        
                        dir('jenkins-app-manifests') {
                            sh "sed -i 's|image: .*|image: ${fullImageUrl}|g' deployment.yml"
                            sh 'git add deployment.yml'
                            // Use double quotes here for the variable to work
                            sh "git commit -m 'Update image to version ${env.IMAGE_TAG}'"
                            sh 'git push'
                        }
                    }
                }
            }
        }
    }
}
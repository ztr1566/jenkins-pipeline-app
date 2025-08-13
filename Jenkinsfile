@Library('devops-project-lib') _

pipeline {
    agent { label 'ubuntu' }

    environment {
        AWS_ACCOUNT_ID      = '826568078815'
        AWS_REGION          = 'us-east-1'
        ECR_REPO_NAME       = 'my-ubuntu-app'
        MANIFEST_REPO_URL   = 'https://github.com/ztr1566/jenkins-app-manifests.git' // <-- تأكد من أن هذا هو الرابط الصحيح
        GITHUB_CREDENTIALS  = 'github-credentials' // <-- الـ ID الذي أنشأته في الخطوة 2
    }

    stages {
        stage('Build and Push Docker Image') {
            steps {
                script {
                    // سنستخدم رقم البناء كـ tag فريد
                    def imageTag = env.BUILD_NUMBER

                    buildPipeline(
                        awsAccountId: env.AWS_ACCOUNT_ID,
                        awsRegion: env.AWS_REGION,
                        ecrRepoName: env.ECR_REPO_NAME,
                        imageTag: imageTag
                    )
                }
            }
        }

        stage('Update Manifests') {
            steps {
                script {
                    def imageTag = env.BUILD_NUMBER
                    def fullImageUrl = "${env.AWS_ACCOUNT_ID}.dkr.ecr.${env.AWS_REGION}.amazonaws.com/${env.ECR_REPO_NAME}:${imageTag}"

                    // استخدم الـ credentials للوصول إلى المستودع
                    withCredentials([usernamePassword(credentialsId: env.GITHUB_CREDENTIALS, usernameVariable: 'GIT_USERNAME', passwordVariable: 'GIT_PASSWORD')]) {

                        // إعداد Git
                        sh 'git config --global user.email "ztr1566@gmail.com"'
                        sh 'git config --global user.name "Ziad Rashid"'

                        // استنساخ مستودع الـ manifests
                        sh "git clone https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/ztr1566/jenkins-app-manifests.git"

                        dir('jenkins-app-manifests') {
                            // تحديث ملف الـ deployment باستخدام sed
                            sh "sed -i 's|image: .*|image: ${fullImageUrl}|g' deployment.yaml"

                            // عمل commit و push للتغيير
                            sh 'git add deployment.yaml'
                            sh 'git commit -m "Update image to version ${imageTag}"'
                            sh 'git push'
                        }
                    }
                }
            }
        }
    }
}
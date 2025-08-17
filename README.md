# DevOps CI/CD Pipeline on AWS EKS

A comprehensive, fully automated CI/CD pipeline implementation using Jenkins, ArgoCD, and monitoring with Prometheus & Grafana on AWS EKS.

## 🏗️ Architecture Overview

This project implements a complete DevOps pipeline that automates the journey from code commit to production deployment:

- **AWS EKS**: Managed Kubernetes service hosting our applications
- **Jenkins**: CI/CD automation server with master-agent architecture
- **ArgoCD**: GitOps-based continuous deployment
- **Prometheus & Grafana**: Comprehensive monitoring and visualization
- **Amazon ECR**: Container registry for Docker images

## 🎯 Project Goals

- **Zero-Touch Deployment**: Push code and watch it automatically deploy to production
- **GitOps Workflow**: Infrastructure and application state managed through Git
- **Real-Time Monitoring**: Complete observability of applications and infrastructure
- **Scalable Architecture**: Production-ready setup that can handle growth

## 🚀 Quick Start

### Prerequisites

Ensure you have the following tools installed on your local machine:

```bash
# AWS CLI
aws --version

# kubectl
kubectl version --client

# eksctl
eksctl version

# Helm
helm version
```

### Repository Structure

This project requires three separate Git repositories:

1. **`jenkins-pipeline-app`** - Your application source code
2. **`jenkins-shared-lib`** - Reusable Jenkins pipeline functions
3. **`my-app-manifests`** - Kubernetes deployment manifests for ArgoCD

## 📋 Implementation Guide

### Phase 1: AWS Infrastructure Setup

#### 1.1 Create IAM User

1. Navigate to AWS IAM Console
2. Create user: `devops-project-admin`
3. Attach policy: `AdministratorAccess`
4. Generate and save Access Keys
5. Configure AWS CLI: `aws configure`

#### 1.2 Launch EC2 Instances

Create two `t3.medium` Ubuntu instances:
- `jenkins-master` - Jenkins controller
- `jenkins-agent` - Jenkins build agent

**Security Group Configuration:**
- Port 22 (SSH)
- Port 80 (HTTP)
- Port 8080 (Custom TCP) - Source: 0.0.0.0/0

#### 1.3 Create EKS Cluster

```bash
eksctl create cluster \
--name my-devops-cluster \
--version 1.28 \
--region us-east-1 \
--nodegroup-name standard-workers \
--node-type t3.medium \
--nodes 2 \
--nodes-min 2 \
--nodes-max 3 \
--managed
```

Verify cluster access:
```bash
kubectl get nodes
```

### Phase 2: Jenkins Configuration

#### 2.1 Install Jenkins Master

SSH into `jenkins-master` and run:

```bash
# Install Java
sudo apt update
sudo apt install openjdk-17-jre -y

# Install Jenkins
curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key | sudo tee \
/usr/share/keyrings/jenkins-keyring.asc > /dev/null

echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \
https://pkg.jenkins.io/debian-stable binary/ | sudo tee \
/etc/apt/sources.list.d/jenkins.list > /dev/null

sudo apt-get update
sudo apt-get install jenkins -y

# Start Jenkins
sudo systemctl enable jenkins
sudo systemctl start jenkins
```

#### 2.2 Jenkins Initial Setup

1. Access Jenkins at `http://<jenkins-master-ip>:8080`
2. Get initial password: `sudo cat /var/lib/jenkins/secrets/initialAdminPassword`
3. Install suggested plugins
4. Create admin user

#### 2.3 Configure Jenkins Agent

SSH into `jenkins-agent` and install dependencies:

```bash
# Java
sudo apt update && sudo apt install openjdk-17-jre -y

# Docker
sudo apt install docker.io -y
sudo usermod -aG docker jenkins
sudo usermod -aG docker ubuntu
sudo systemctl restart docker

# kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# AWS CLI
sudo apt install awscli -y
```

#### 2.4 Connect Agent to Master

1. In Jenkins: **Manage Jenkins** → **Nodes** → **New Node**
2. Name: `ubuntu-agent`, Type: **Permanent Agent**
3. Configure:
   - Remote root directory: `/home/ubuntu/jenkins-agent`
   - Labels: `ubuntu`
   - Launch method: **Launch agents via SSH**
   - Host: Jenkins agent private IP
   - Credentials: SSH Username with private key (username: `ubuntu`)

#### 2.5 Install Required Plugin

Install **Pipeline: AWS Steps** plugin via **Manage Jenkins** → **Plugins**.

### Phase 3: CI Pipeline Implementation

#### 3.1 Create ECR Repository

```bash
# Create ECR repository
aws ecr create-repository --repository-name my-ubuntu-app --region us-east-1
```

#### 3.2 Setup Shared Library

In your `jenkins-shared-lib` repository, create `vars/buildPipeline.groovy`:

```groovy
def call(Map config) {
    script {
        if (!config.awsAccountId || !config.awsRegion || !config.ecrRepoName || !config.imageTag) {
            error "Missing required configuration: awsAccountId, awsRegion, ecrRepoName, imageTag"
        }
        
        def imageName = "${config.awsAccountId}.dkr.ecr.${config.awsRegion}.amazonaws.com/${config.ecrRepoName}"
        
        withAWS(credentials: 'aws-credentials', region: config.awsRegion) {
            def ecrLoginCommand = "aws ecr get-login-password --region ${config.awsRegion} | docker login --username AWS --password-stdin ${config.awsAccountId}.dkr.ecr.${config.awsRegion}.amazonaws.com"
            sh(ecrLoginCommand)
            sh "docker build -t ${imageName}:${config.imageTag} ."
            sh "docker push ${imageName}:${config.imageTag}"
        }
    }
}
return this
```

#### 3.3 Configure Jenkins Credentials

1. **AWS Credentials**: **Manage Jenkins** → **Credentials** → **Add Credentials**
   - Kind: **AWS Credentials**
   - ID: `aws-credentials`
   - Add your IAM user's Access Key and Secret Key

2. **GitHub Credentials**: Add GitHub username/password or token
   - ID: `github-credentials`

#### 3.4 Create Jenkinsfile

In your `jenkins-pipeline-app` repository:

```groovy
@Library('devops-project-lib') _

pipeline {
    agent { label 'ubuntu' }
    
    environment {
        AWS_ACCOUNT_ID = 'YOUR_AWS_ACCOUNT_ID'
        AWS_REGION = 'us-east-1'
        ECR_REPO_NAME = 'my-ubuntu-app'
        MANIFEST_REPO_URL = 'https://github.com/<YOUR_USERNAME>/my-app-manifests.git'
        GITHUB_CREDENTIALS = 'github-credentials'
        IMAGE_TAG = "${env.BUILD_NUMBER}"
    }
    
    stages {
        stage('Build and Push Docker Image') {
            steps {
                script {
                    buildPipeline(
                        awsAccountId: env.AWS_ACCOUNT_ID,
                        awsRegion: env.AWS_REGION,
                        ecrRepoName: env.ECR_REPO_NAME,
                        imageTag: env.IMAGE_TAG
                    )
                }
            }
        }
        
        stage('Update Manifests') {
            steps {
                script {
                    def fullImageUrl = "${env.AWS_ACCOUNT_ID}.dkr.ecr.${env.AWS_REGION}.amazonaws.com/${env.ECR_REPO_NAME}:${env.IMAGE_TAG}"
                    
                    withCredentials([usernamePassword(credentialsId: env.GITHUB_CREDENTIALS, usernameVariable: 'GIT_USERNAME', passwordVariable: 'GIT_PASSWORD')]) {
                        sh 'git config --global user.email "jenkins@example.com"'
                        sh 'git config --global user.name "Jenkins CI"'
                        sh 'rm -rf my-app-manifests'
                        sh "git clone https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/<YOUR_USERNAME>/my-app-manifests.git"
                        
                        dir('my-app-manifests') {
                            sh "sed -i 's|image: .*|image: ${fullImageUrl}|g' deployment.yaml"
                            sh 'git add deployment.yaml'
                            sh "git commit -m 'Update image to version ${env.IMAGE_TAG}'"
                            sh 'git push'
                        }
                    }
                }
            }
        }
    }
}
```

#### 3.5 Setup GitHub Webhook

1. In your `jenkins-pipeline-app` GitHub repository: **Settings** → **Webhooks**
2. Add webhook:
   - URL: `http://<jenkins-master-ip>:8080/github-webhook/`
   - Content type: `application/json`
3. In Jenkins pipeline configuration: Enable **GitHub hook trigger for GITScm polling**

### Phase 4: ArgoCD GitOps Setup

#### 4.1 Install ArgoCD

```bash
# Create namespace
kubectl create namespace argocd

# Install ArgoCD
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Expose ArgoCD server
kubectl patch svc argocd-server -n argocd -p '{"spec": {"type": "LoadBalancer"}}'
```

#### 4.2 Access ArgoCD

```bash
# Get external IP
kubectl get svc -n argocd

# Get initial admin password
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
```

#### 4.3 Create Kubernetes Manifests

In your `my-app-manifests` repository, create:

**deployment.yaml:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ubuntu-app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: ubuntu-app
  template:
    metadata:
      labels:
        app: ubuntu-app
    spec:
      containers:
      - name: ubuntu-app
        image: YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/my-ubuntu-app:latest
        ports:
        - containerPort: 80
```

**service.yaml:**
```yaml
apiVersion: v1
kind: Service
metadata:
  name: ubuntu-app-service
spec:
  selector:
    app: ubuntu-app
  ports:
  - port: 80
    targetPort: 80
  type: LoadBalancer
```

#### 4.4 Create ArgoCD Application

1. Login to ArgoCD UI
2. Click **NEW APP**
3. Configure:
   - Application Name: `ubuntu-app`
   - Sync Policy: **Automatic** (enable Prune and Self Heal)
   - Repository URL: Your `my-app-manifests` repository
   - Destination: `https://kubernetes.default.svc`
   - Namespace: `default`

### Phase 5: Monitoring Setup

#### 5.1 Configure EBS CSI Driver

```bash
# Associate OIDC provider
eksctl utils associate-iam-oidc-provider --region=us-east-1 --cluster=my-devops-cluster --approve

# Create IAM service account
eksctl create iamserviceaccount \
--name ebs-csi-controller-sa \
--namespace kube-system \
--cluster my-devops-cluster \
--attach-policy-arn arn:aws:iam::aws:policy/service-role/AmazonEBSCSIDriverPolicy \
--approve --role-only --role-name AmazonEKS_EBS_CSI_DriverRole

# Install EBS CSI driver
eksctl create addon \
--name aws-ebs-csi-driver \
--cluster my-devops-cluster \
--service-account-role-arn arn:aws:iam::$(aws sts get-caller-identity --query Account --output text):role/AmazonEKS_EBS_CSI_DriverRole \
--force
```

#### 5.2 Install Prometheus

```bash
# Add Helm repository
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

# Create monitoring namespace and install Prometheus
kubectl create namespace monitoring
helm install prometheus prometheus-community/prometheus --namespace monitoring
```

#### 5.3 Install Grafana

```bash
# Add Grafana Helm repository
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update

# Install Grafana
helm install grafana grafana/grafana --namespace monitoring

# Expose Grafana
kubectl patch svc grafana -n monitoring -p '{"spec": {"type": "LoadBalancer"}}'
```

#### 5.4 Access Grafana

```bash
# Get external IP
kubectl get svc -n monitoring

# Get admin password
kubectl get secret --namespace monitoring grafana -o jsonpath="{.data.admin-password}" | base64 --decode
```

#### 5.5 Configure Grafana Dashboard

1. Login to Grafana (username: `admin`)
2. **Connections** → **Data sources** → **Add Prometheus**
3. URL: `http://prometheus-server.monitoring.svc.cluster.local`
4. **Dashboards** → **Import** → Use ID: `15757`
5. Select Prometheus data source and import

## 🔧 Troubleshooting

### Common Issues

**Issue: Jenkins build fails with "withAWS not found"**
- **Solution**: Install the "Pipeline: AWS Steps" plugin

**Issue: Jenkins build fails with "aws: not found"**
- **Solution**: Install AWS CLI on Jenkins agent: `sudo apt install awscli -y`

**Issue: ArgoCD can't access private repositories**
- **Solution**: Configure repository credentials in ArgoCD settings

**Issue: Prometheus pods stuck in Pending state**
- **Solution**: Ensure EBS CSI driver is properly installed and IAM roles are configured

## 📊 Monitoring and Alerts

The implemented monitoring stack provides:

- **Cluster Metrics**: Node utilization, pod status, resource consumption
- **Application Metrics**: Request rates, response times, error rates
- **Infrastructure Metrics**: Storage, network, compute resources
- **Custom Dashboards**: Tailored views for different stakeholders

## 🔒 Security Considerations

- Use least-privilege IAM roles in production
- Enable AWS GuardDuty for threat detection
- Implement Pod Security Standards
- Use AWS Secrets Manager for sensitive data
- Enable audit logging on EKS cluster

## 📈 Scaling and Optimization

- Configure Horizontal Pod Autoscaling (HPA)
- Implement Cluster Autoscaling
- Use spot instances for cost optimization
- Implement resource quotas and limits
- Monitor costs with AWS Cost Explorer

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request


## 🆘 Support

For issues and questions:
- Create an issue in the repository
- Check the troubleshooting section above
- Review AWS EKS documentation

---

**Built with ❤️ for the DevOps community**

pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing npm dependencies...'
                sh '''export PATH=/var/jenkins_home/node/bin:$PATH
                npm ci'''
            }
        }

        stage('Build') {
            steps {
                echo 'Building TypeScript...'
                sh '''export PATH=/var/jenkins_home/node/bin:$PATH
                npm run build'''
            }
        }

        stage('Prisma Generate') {
            steps {
                echo 'Generating Prisma Client...'
                sh '''export PATH=/var/jenkins_home/node/bin:$PATH
                npx prisma generate'''
            }
        }

        stage('Security Scan') {
            steps {
                echo 'Running npm audit...'
                sh '''export PATH=/var/jenkins_home/node/bin:$PATH
                npm audit --audit-level=moderate || true'''
            }
        }
    }

    post {
        always {
            echo 'Cleaning workspace...'
            cleanWs()
        }
        success {
            echo 'Build completed successfully!'
        }
        failure {
            echo 'Build failed!'
        }
    }
}
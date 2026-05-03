pipeline {
    agent any

    environment {
        NODE_VERSION = '20'
        DATABASE_URL = 'mysql://root:root@localhost:3306/belajar_typescript_restful_api'
    }

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
                sh 'npm ci'
            }
        }

        stage('Run Tests') {
            steps {
                echo 'Running unit tests...'
                sh 'npm test'
            }
        }

        stage('Build') {
            steps {
                echo 'Building TypeScript...'
                sh 'npm run build'
            }
        }

        stage('Prisma Generate') {
            steps {
                echo 'Generating Prisma Client...'
                sh 'npx prisma generate'
            }
        }

        stage('Security Scan') {
            steps {
                echo 'Running npm audit...'
                sh 'npm audit --audit-level=moderate || true'
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
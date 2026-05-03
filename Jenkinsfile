pipeline {
    agent { label 'server-dev' }

    environment {
        APP_DIR = '/home/ec2-user/app'
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

        stage('Test') {
            steps {
                echo 'Running tests...'
                sh '''
                    cd ${APP_DIR}
                    docker compose up -d mysql || true
                    sleep 5
                '''
                sh 'npx prisma migrate reset --force'
                sh 'npm test'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying application...'
                sh '''
                    cp -r dist/ ${APP_DIR}/dist/
                    cp package.json package-lock.json ${APP_DIR}/
                    cp -r prisma/ ${APP_DIR}/prisma/
                    cp ecosystem.config.js ${APP_DIR}/
                    cp .env ${APP_DIR}/.env

                    cd ${APP_DIR}
                    npm ci --omit=dev
                    npx prisma generate
                    npx prisma migrate deploy

                    pm2 delete belajar-api || true
                    pm2 start ecosystem.config.js --env production
                    pm2 save
                '''
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
            echo 'Build and deploy completed successfully!'
        }
        failure {
            echo 'Build or deploy failed!'
        }
    }
}

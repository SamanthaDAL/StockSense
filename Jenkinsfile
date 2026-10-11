pipeline {
    agent any

    tools {
        jdk 'JDK 17'
        maven 'Maven 3.9.16'
    }

    environment {
        SPRING_DATASOURCE_PASSWORD = credentials('stocksense-db-password')
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/SamanthaDAL/StockSense.git'
            }
        }

        stage('Verify Tools') {
            steps {
                bat 'java -version'
                bat 'mvn -version'
                bat '"D:\\nvm4w\\nodejs\\node.exe" --version'
                bat '"D:\\nvm4w\\nodejs\\npm.cmd" --version'
                bat '"D:\\Programs\\Git\\cmd\\git.exe" --version'
            }
        }

        stage('Backend Tests') {
            steps {
                dir('server') {
                    bat 'mvn test'
                }
            }
        }

        stage('Frontend Build') {
            steps {
                dir('client') {
                    bat '''
                        set "PATH=D:\\nvm4w\\nodejs;%PATH%"
                        call npm.cmd ci
                        call npm.cmd run build
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'StockSense CI pipeline passed.'
        }

        failure {
            echo 'StockSense CI pipeline failed. Check the failed stage above.'
        }
    }
}
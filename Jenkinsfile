pipeline {
    agent any

    options {
        skipDefaultCheckout(true)
    }

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

        stage('Package Backend') {
            steps {
                dir('server') {
                    bat 'mvn -DskipTests package'
                }
            }
        }

        stage('Assemble Release Artifacts') {
            steps {
                bat '''
                    if exist release rmdir /s /q release
                    mkdir release

                    for /f %%i in ('"D:\\Programs\\Git\\cmd\\git.exe" rev-parse --short HEAD') do set "SHORT_COMMIT=%%i"
                    set "RELEASE_VERSION=build-%BUILD_NUMBER%-%SHORT_COMMIT%"

                    copy /Y "server\\target\\stocksense-server-1.0-SNAPSHOT.jar" "release\\stocksense-server-%RELEASE_VERSION%.jar"

                    "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -NoProfile -Command "Compress-Archive -Path 'client\\dist\\*' -DestinationPath 'release\\stocksense-client-%RELEASE_VERSION%.zip' -Force"

                    if errorlevel 1 exit /b %errorlevel%

                    dir release
                '''
            }
        }

        stage('Archive Release Artifacts') {
            steps {
                archiveArtifacts artifacts: 'release/*',
                    fingerprint: true,
                    onlyIfSuccessful: true
            }
        }
    }

    post {
        success {
            echo 'StockSense CI pipeline passed and release artifacts were created.'
        }

        failure {
            echo 'StockSense CI pipeline failed. Check the failed stage above.'
        }
    }
}
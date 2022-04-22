pipeline {
  environment {
    NPM_PUBLIC_REGISTRY_URL = "https://nexus.ugpa.ru/repository/npm/"
    NPM_REGISTRY_URL = "https://nexus.ugpa.ru/repository/npm-private/"
    NPM_REGISTRY_URL_FOR_CLI_LOGIN = "https://nexus.ugpa.ru/repository/npm-private"
    USER_EMAIL = "svnuser@ugpa.ru"
    NPM_REGISTRY_CREDENTIALS_ID = 'd7e20d0f-a745-45cc-a581-f724ad016a39'
  }
  agent { label 'nodejs12' }
  stages {
    stage ("Install") {
      steps {
        sh "npm set registry ${NPM_PUBLIC_REGISTRY_URL}"
        sh 'npm install'
        sh 'npm install --save-dev npm-cli-login'
      }
    }
    stage ("Build") {
      steps {
        sh 'npm run build'
      }
    }
    stage ("Test") {
      steps {
        sh 'npm run unit-test'
      }
    }
    stage ("Publish") {
      steps {
        withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: "${NPM_REGISTRY_CREDENTIALS_ID}", usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD']]) {
          sh "npx npm-cli-login -u \$USERNAME -p \$PASSWORD -e ${USER_EMAIL} -r ${NPM_REGISTRY_URL_FOR_CLI_LOGIN}"
        }
        sh "npm set registry ${NPM_REGISTRY_URL}"
        sh "npm publish --registry=${NPM_REGISTRY_URL}"
      }
    }
  }
}
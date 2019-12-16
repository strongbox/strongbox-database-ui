@Library('jenkins-shared-libraries') _

def ARTIFACT_ID = 'strongbox-database-ui'
def SERVER_ID = 'carlspring-oss-snapshots'
def DEPLOY_SERVER_URL = 'https://repo.carlspring.org/content/repositories/carlspring-oss-snapshots/'
def PR_SERVER_URL = 'https://repo.carlspring.org/content/repositories/carlspring-oss-pull-requests/'

// Notification settings for "master" and "branch/pr"
def notifyMaster = [notifyAdmins: true, recipients: [culprits(), requestor()]]
def notifyBranch = [recipients: [brokenTestsSuspects(), requestor()], notifyByChat: false]

pipeline {
    agent {
        label 'ubuntu-jdk8-mvn3.6-node12-browsers'
    }
    parameters {
        booleanParam(defaultValue: false, description: 'Force deploy?', name: 'FORCE_DEPLOY')
        booleanParam(defaultValue: false, description: 'Clear .npm cache on node?', name: 'CLEAR_CACHE')
        booleanParam(defaultValue: true, description: 'Send email notification?', name: 'NOTIFY_EMAIL')
    }
    options {
        timeout(time: 2, unit: 'HOURS')
        disableConcurrentBuilds()
    }
    environment {
        // Necessary for NPM to avoid being asked questions.
        CI="true"
    }
    stages {
        stage('Node') {
            steps {
                container("node") {
                    nodeInfo("npm yarn node mvn")
                }
            }
        }
        stage('Install dependencies') {
            steps {
                script {
                    container("node") {
                        def npmCachePath = workspace().getNPMCachePath()

                        if(params.CLEAR_CACHE) {
                            sh label: "Clearing ${npmCachePath}", script: "rm -rf ${npmCachePath}/*"
                        }

                        sh label: "Set NPM cache directory", script: "npm config set cache ${npmCachePath}"
                        sh label: "Install dependencies", script: "npm install"
                        sh label: "List installed packages", script: "npm ls --depth=0 || echo ''"
                    }
                }
            }
        }
        stage('Build') {
            steps {
                container("node") {
                    sh "npm run ci-build"
                }
            }
        }
        stage('Tests') {
            parallel {
                stage('ci-test') {
                    steps {
                        script {
                            container("node") {
                                try {
                                    sh "npm run ci-test"
                                } catch (e) {
                                    if(!params.FORCE_DEPLOY) {
                                        currentBuild.result = 'FAILURE'
                                        throw e
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        stage('Deploy') {
            when {
                expression { (params.FORCE_DEPLOY || currentBuild.result == null || currentBuild.result == 'SUCCESS') }
            }
            steps {
                script {
                    container("node") {
                        withMavenPlus(mavenLocalRepo: workspace().getM2LocalRepoPath(), mavenSettingsConfig: 'a5452263-40e5-4d71-a5aa-4fc94a0e6833', publisherStrategy: 'EXPLICIT', options: [artifactsPublisher(), mavenLinkerPublisher()])
                        {
                            def SERVER_URL;
                            def VERSION_ID;

                            if (BRANCH_NAME == 'master') {
                                echo "Deploying master..."
                                SERVER_URL = DEPLOY_SERVER_URL;
                                VERSION_ID = "1.0-SNAPSHOT"
                            } else {
                                echo "Deploying branch/PR"
                                SERVER_URL = PR_SERVER_URL;
                                if(env.CHANGE_ID) {
                                    VERSION_ID = "1.0-PR-${env.CHANGE_ID}-SNAPSHOT"
                                } else {
                                    VERSION_ID = "1.0-${BRANCH_NAME}-SNAPSHOT"
                                }
                            }

                            sh "mvn deploy:deploy-file " +
                               " -Dfile=./dist/packaging/"+ ARTIFACT_ID +".zip " +
                               " -DrepositoryId=" + SERVER_ID +
                               " -Durl=" + SERVER_URL +
                               " -DartifactId=" + ARTIFACT_ID +
                               " -DgroupId=org.carlspring.strongbox" +
                               " -Dpackaging=zip" +
                               " -Dversion=" + VERSION_ID
                        }
                    }
                }
            }
        }
    }
    post {
        failure {
            script {
                if(params.NOTIFY_EMAIL) {
                    notifyFailed((BRANCH_NAME == "master") ? notifyMaster : notifyBranch)
                }
            }
        }
        unstable {
            script {
                if(params.NOTIFY_EMAIL) {
                    notifyUnstable((BRANCH_NAME == "master") ? notifyMaster : notifyBranch)
                }
            }
        }
        fixed {
            script {
                if(params.NOTIFY_EMAIL) {
                    notifyFixed((BRANCH_NAME == "master") ? notifyMaster : notifyBranch)
                }
            }
        }
        always {
            container("node") {
                junit 'dist/TESTS-*.xml'
            }

            script {

                def isSuccessful = currentBuild.result == 'SUCCESS';

                if((params.TRIGGER_STRONGBOX && isSuccessful) || params.FORCE_DEPLOY) {
                    if(BRANCH_NAME == "master") {
                        build job: '/strongbox/builds/strongbox/master',
                              wait: false,
                              parameters: [
                                  string(name: 'INTEGRATION_TESTS_BRANCH', value: 'master'),
                                  booleanParam(name: 'RUN_ONLY_SMOKE', value: false),
                                  booleanParam(name: 'SKIP_TESTS', value: false),
                                  booleanParam(name: 'DEPLOY', value: true),
                                  booleanParam(name: 'NOTIFY_EMAIL', value: true)
                              ]
                    }
                }
            }
        }
    }
}

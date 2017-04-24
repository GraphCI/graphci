# GraphCI

Reinventing CI using docker.

Take a look at the yaml file below. Define each of your stages, **GraphCI** will build a DAG of each of your stages and run them in order. In the example the `assume-role` stage runs and collects one-time AWS credentials. The next three stages are dependent on `assume-role` and cat the output, plucking out particular values. Later the `create-stack` value will take the outputs of the `aws_access_key_id`, `aws_secret_access_key` and `aws_session_token` stages, put them into environment variables passed into the docker stage. The `create-stack` stage also relies on the `get-code` output as a volume.

# Usage
`AWS_PROFILE=has-permissions-to-s3 npm start`

# CI Definition

```yaml
assume-role:
  img: pebbletech/docker-aws-cli
  run: aws sts assume-role --role-arn arn:aws:iam::327070154264:role/AssumeThis --role-session-name deploy
aws_access_key_id:
  after: assume-role
  img: pebbletech/docker-aws-cli
  run: cat out/assume-role | jq -r .Credentials.AccessKeyId
aws_secret_access_key:
  after: assume-role
  img: pebbletech/docker-aws-cli
  run: cat out/assume-role | jq -r .Credentials.SecretAccessKey
aws_session_token:
  after: assume-role
  img: pebbletech/docker-aws-cli
  run: cat out/assume-role | jq -r .Credentials.SessionToken
get-code:
  img: bravissimolabs/alpine-git
  run: git clone -b master --single-branch https://github.com/distributedlife/graphci.git get-code
create-stack:
  img: pebbletech/docker-aws-cli
  env:
    - aws_access_key_id
    - aws_secret_access_key
    - aws_session_token
    - AWS_DEFAULT_REGION
  vol: get-code
  run: aws cloudformation create-stack --stack-name infra --template-body file://get-code/example.yaml
wait-for-success:
  after: create-stack
  img: pebbletech/docker-aws-cli
  env:
    - aws_access_key_id
    - aws_secret_access_key
    - aws_session_token
    - AWS_DEFAULT_REGION
  run: aws cloudformation wait stack-create-complete --stack-name infra
```

# How do I...?
## Publish a package to npm and then end of a

# To do
- [ ] Fail the build when environment variables are missing
- [ ] Make sure that envvars with spaces work
- [ ] Bug: GraphCI should be able to pull images the host does not already have
- [ ] Implicit dag creation (run)
- [ ] Implicit dag creation (img)
- [ ] Zip up out and move to s3 bucket for run
- [ ] Handle errors from docker containers as promise rejections
- [ ] Handle nothing to do when there is no config
- [ ] Support for encrypted environment variables
- [ ] Support packages using Dockerfiles
- [ ] Add support for clean up stages. If other stage finishes (not just passes) then run my stage
- [ ] Conditional Logic. If stage is true run update, if stage is false, run create.
- [ ] Dependencies on remote pipelines. When this build goes green _after_ my build has started, then this dependency is fulfulled.
- [ ] Make a docker container that comes with GraphCI installed already
- [ ] Command completion


# Triggers
- [ ] Remote build completes (we need some way of tracking whether or not we have build of this before
- [ ] Timer. When we do a get on a package and it's version number has changed, then we run a stage that updates that dependency and runs the build.

# Results

graphci/run/:runId/:stage.json ()
graphci/run/:runId/:stage.log (for console out)
graphci/run/:runId/:stage.zip (for volumes)

```javascript
POST graphci/run/:runId/:stage.json
{
  name: prior.name,
  started: prior.started,
  finished: moment().utc(),
  status: 'winning|like-a-chump',
  logs: graphci/run/:runId/:stage.log,
  artefact: graphci/run/:runId/:stage.zip,
}
```


How it could work:

# Self-Hosted as a Service
1. Set up assume role that graphci can assume
2. Trigger deployment on graphci.com. It sets up GraphCI in your account.
3. Start pushing commits


# Results
https://graphci.com/results/aws-account-id/name-of-pipeline/# -> redirects to:
https://graphci-AWS-Account-Id.s3-website-ap-southeast-2.amazonaws.com/results/aws-account-id/name-of-pipeline/#

This 404's and redirects to our S3 bucket where we return an index.html that is our react app. We then use the route to make a request to our backend server that goes and gets the results file from your AWS account (we have permission to read).

We update the store with the json we receive and render the results.


# Deployment
## UI
```bash
DEPLOY_STAGING_BUCKET=graphci-lambdas-deploy \
AWS_DEFAULT_REGION=ap-southeast-2 \
ROLE_TO_ASSUME=arn:aws:iam::*:role/AssumeThis \
npm run deploy
```

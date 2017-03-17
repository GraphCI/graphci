# dockercise

Reinventing CI using docker.

Take a look at the yaml file below. Define each of your stages, **dockercise** will build a DAG of each of your stages and run them in order. In the example the `assume-role` stage runs and collects one-time AWS credentials. The next three stages are dependent on `assume-role` and cat the output, plucking out particular values. Later the `create-stack` value will take the outputs of the `aws_access_key_id`, `aws_secret_access_key` and `aws_session_token` stages, put them into environment variables passed into the docker stage. The `create-stack` stage also relies on the `get-code` output as a volume.

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
  run: git clone -b master --single-branch https://github.com/distributedlife/dockercise.git get-code
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

# To do
- [ ] Implicit dag creation (run)
- [ ] Implicit dag creation (img)
- [ ] Zip up out and move to s3 bucket for run
- [ ] Handle errors from docker containers as promise rejections
- [ ] Handle nothing to do when there is no config
- [ ] Make sure that envvars with spaces work
- [ ] Support for encrypted environment variables
- [ ] Support packages using Dockerfiles
- [ ] Add support for clean up stages. If other stage finishes (not just passes) then run my stage
- [ ] Make stages immutable. They operate in a one-time-path, the results are uploaded to s3. The path is deleted. Next!
- [ ] Conditional Logic. If stage is true run update, if stage is false, run create.
- [ ] Dependencies on remote pipelines. When this build goes green _after_ my build has started, then this dependency is fulfulled.
- [ ] No log out for sensitive output from jobs.

# Done
- [x] Implicit dag creation (env)
- [x] Implicit dag creation (vol)
- [x] Env var output of stage
- [x] File output of stage
- [x] Volume output of stage
- [x] Externals vols
- [x] Passing in external env-vars
- [x] Prepopulate stages with all keys to simplify logic
- [x] Collect all files before making DAG

# Triggers
- [ ] Manual
- [ ] Git commit
- [ ] Remote build completes (we need some way of tracking whether or not we have build of this before
- [ ] Timer. When we do a get on a package and it's version number has changed, then we run a stage that updates that dependency and runs the build.

# Results

dockercise/run/:runId/:stage.json ()
dockercise/run/:runId/:stage.log (for console out)
dockercise/run/:runId/:stage.zip (for volumes)

```javascript
POST dockercise/run/:runId/:stage.json
{
  name: prior.name,
  started: prior.started,
  finished: moment().utc(),
  status: 'winning|like-a-chump',
  logs: dockercise/run/:runId/:stage.log,
  artefact: dockercise/run/:runId/:stage.zip,
}
```


How it could work:

# Self-Hosted as a Service
1. Set up assume role that dockercise can assume
2. Trigger deployment on dockercise.com. It sets up dockercise in your account.
3. Start pushing commits


# Results
https://dockercise.com/results/aws-account-id/name-of-pipeline/# -> redirects to:
https://dockercise-AWS-Account-Id.s3-website-ap-southeast-2.amazonaws.com/results/aws-account-id/name-of-pipeline/#

This 404's and redirects to our S3 bucket where we return an index.html that is our react app. We then use the route to make a request to our backend server that goes and gets the results file from your AWS account (we have permission to read).

We update the store with the json we receive and render the results.

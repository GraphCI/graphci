# dockercise

Reinventing CI using docker.

# To do
[ ] Automap ~/ to process.env.HOME
[x] Implicit dag creation (env)
[x] Implicit dag creation (vol)
[ ] Implicit dag creation (run)
[ ] Implicit dag creation (img)
[x] Env var output of stage
[x] File output of stage
[ ] Volume output of stage
[ ] Passing in external env-vars
[ ] Zip up out and move to s3 bucket for run
[x] Prepopulate stages with all keys to simplify logic

How it could work:

# Self-Serverless
1. Set your AWS Credentials
2. Run script that will create a stack that runs dockercise and links your config repo
3. Start pushing commits

Or,

# Public Repos
- Log in with you github account
- Select your repo
- We add webhook for change notification
- We add a deployment key (for ssh read)
- We parse the repo looking for *.dockercise.yaml
- We merge those files and build a DAG.
- We wait for notifications to buildDag

- You create an role in your AWS account with a specific name. You allow our AWS Account to use that role
- We assume that role and create an S3 bucket, and an EC2 instance. We setup that instance with a docker host and then suspend it.

- When a job comes in we jump across to your ec2 instance and run the command, pipe the logs to your cloudwatch and results to your s3 bucket.
-> Notification -> Lambda -> ecs:run-task -> assume-role -> do build on your infra

# Results
https://dockercise.com/results/aws-account-id/name-of-pipeline/#

This 404's and redirects to our S3 bucket where we return an index.html that is our react app. We then use the route to make a request to our backend server that goes and gets the results file from your AWS account (we have permission to read).

We update the store with the json we receive and render the results.


# CI Definition

```yaml
after: human-click
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
  run: git clone -b master --single-branch https://github.com/distributedlife/dockercise.git
create-stack:
  img: pebbletech/docker-aws-cli
  env:
    - aws_access_key_id
    - aws_secret_access_key
    - aws_session_token
  vol: get-code
  run: aws cloudformation create-stack --stack-name infra --template-body file://infrastructure.yaml
wait-for-success:
  after: create-stack
  img: pebbletech/docker-aws-cli
  env:
    - aws_access_key_id
    - aws_secret_access_key
    - aws_session_token
  run: aws cloudformation wait stack-create-complete --stack-name infra
```

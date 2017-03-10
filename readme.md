# dockercise

Reinventing CI using docker.

How it works:

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
  run: aws sts assume-role --role-arn arn:aws:etc:etc --role-session-name deploy
access-key-id:
  img: pebbletech/docker-aws-cli
  run: cat {assume-role} | jq -r .Credentials.AccessKeyId
secret-access-key:
  img: pebbletech/docker-aws-cli
  run: cat {assume-role} | jq -r .Credentials.SecretAccessKey
session-token:
  img: pebbletech/docker-aws-cli
  run: cat {assume-role} | jq -r .Credentials.SessionToken
get-code:
  img: bravissimolabs/alpine-git
  run: git clone -b master --single-branch git@github.com:ensemblejs/ensemblejs.git
create-stack:
  img: pebbletech/docker-aws-cli
  vol: get-code
  env:
    - access-key-id
    - secret-access-key
    - session-token
  run: aws cloudformation create-stack --stack-name infra --template-body file://infrastructure.yaml
  done: aws cloudformation wait stack-create-complete --stack-name infra
```

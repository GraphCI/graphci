# GraphCI

The docker-first and docker-last graph based CI system with package support.

Given a graph definition **GraphCI** will find the path to your desired nodes and then run each of the required stages, in parallel when possible and in sequence when required.


# Installation
`npm i graphci -g`


# Usage
`graphci node_you_want_built`

GraphCI will look in all subfolders (except node_modules) looking for `*.graphci.yaml` files. It then loads the files into a giant graph. The graph expands through subgraphs.

An `example.graphci.yaml` is:

```yaml
meta:
  subgraphs:
    - graphci/aws-assume-role:latest
node1:
  img: alpine
  run: ls -la
node2:
  after: node1
  img: alpine
  run: echo "GraphCI"
```

The meta node lets you define extra subgraphs. GraphCI fetches these before any part of the graph runs. Subgraphs may contain further subgraphs. All are loaded before the graph is fun.


# Node Definition
A GraphCI node requires only three things, a name, a docker image and a command to run.

```yaml
node_name:
  img: alpine
  run: echo "Hello"
```

## Environment Variables
A node can use the console output of a previous node as an environment variable:

```yaml
relies_on_node_name:
  env: node_name
  img: alpine
  run: cat $NODE_NAME | grep "Hello"
```

The `relies_on_node_name` node will run after `node_name` has completed. By making a relationship we've created an execution order. GraphCI handles this for you.

And the run will pass or fail depending on whether $NODE_NAME contains hello because grep returns a non-zero return code when no matches are found.

You can also include multiple environment variables and those that are defined outside the process.

```yaml
relies_on_node_name:
  env:
    - node_name
    - home
  img: alpine
  run: echo $HOME
```

## Volumes
Each node gets it's own volume mounted for storing output that isn't console output. You can use the `$OUT` environment variables. Other nodes can mount that volume and use it. These volumes mount as read-only.

```yaml
has_a_volume:
  img: alpine
  run: echo "Content" > $OUT/a_file
needs_a_volume:
  img: alpine
  vol: has_a_volume
  run: echo has_a_volume/a_file | grep "Content"
```

You can set a working directory if required. So to rewrite the subgraph above.

```yaml
has_a_volume:
  img: alpine
  run: echo "Content" > $OUT/a_file
needs_a_volume:
  img: alpine
  vol: has_a_volume
  dir: /has_a_volume
  run: echo a_file | grep "Content"
```

Or, if you want write access, you can operate `on` a volume. Node outputs are immutable so you will get a copy of the output the working volume of the current node. Using the `on` attribute will also set the working dir to the working volume.

```yaml
has_a_volume:
  img: alpine
  run: echo "Content" > $OUT/a_file
needs_a_volume:
  img: alpine
  on: has_a_volume
  run: echo a_file | grep "Content"
```

You can mount mulitple volumes. The `on` and `dir` attributes do not support more than one entry.

```yaml
has_multiple_volumes:
  vol:
    - node1
    - node2
  img: alpine
  run: ls -la /node1 && ls -la node2
```

## Explicit dependencies
If you require a node to run after another run is complete, but they share no information. Then you can use the `after` tag.

```yaml
node_name:
  after:
    - other_node
    - prior_node
  img: alpine
  run: echo "Waiting..."
```

## Sensitive logs
You can hide logs for a stage by setting the `noLog` attribute to true. No logs will be printed to the console or will be uploaded to S3. The output of that stage will be made available for the duration of the run.

```yaml
has_sensitive_logs:
  img: alpine
  run: echo "Will not be seen"
  noLog: true
```

## Forcing Success
Some stages, like creating an S3 bucket will fail if you already own the bucket. Which is technically correct, but no useful because the intent that you have a bucket has been achieved. You can force build stages to pass by using the `neverFail` tag.

```yaml
create_deploy_bucket:
  img: elimydlarz/docker-aws-cli:1.11.56
  env:
    - aws_access_key_id
    - aws_secret_access_key
    - aws_session_token
    - aws_default_region
    - deploy_staging_bucket
  run: aws s3 mb s3://$DEPLOY_STAGING_BUCKET
  neverFail: true
```

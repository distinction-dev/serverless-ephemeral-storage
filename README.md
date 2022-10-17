## Getting started

### Installation

`npm install --save-dev serverless-ephemeral-storage`

add Plugin to your `serverless.yml` in the plugins section.

### Usage

Example `serverless.yml`:

```yaml
provider:
  name: aws

plugins:
  - serverless-ephemeral-storage

functions:
  hello:
    handler: handler.hello
    ephemeralStorageSize: 1024
```

### Functionality

Before March 24, 2022, AWS Lambda was providing only an additional 512MB of ephemeral storage.
Following the most recent upgrade, the user can choose this storage capacity between 512 MB and 10240 MB.
This plugin is designed to work with an older version of the serverless package that does not support the ephemeralStorageSize property in lambda functions.  
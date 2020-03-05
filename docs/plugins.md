# Plugins

There are three types of plugins: processors, drivers, and trackers. Processors
are used when loading the configuration file to get values from outside sources,
like CloudFormation outputs. Drivers are used within the scripts to make the desired
changes. Finally, trackers keep track of which migration scripts have been executed.

- Processors
  - [Cloud Formation](/plugins/processors/dm-processor-cf/README.md)

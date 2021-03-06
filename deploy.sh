#!/bin/bash -x

script_dir=$(cd $(dirname $BASH_SOURCE); pwd)
dist="$script_dir/dist/"
bucket="graphviz-drive"

aws s3 sync --delete "$dist" "s3://$bucket"

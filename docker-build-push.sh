#/bin/bash

docker login
docker build -t philipf/gencal .
docker push philipf/gencal
# This script will install the Python Flask app to an Azure App Service <name>.azurewebsites.net
# It uses a Free App Service plan, which only useful or Dev/Test

# Important appname must be unique globally in *.azurewebsites.net namespace
appname="gencal"

az login

# Update with deployment specific settings
az webapp up \
     --runtime PYTHON:3.9 \
     --sku F1 \
     --location australiaeast \
     --resource-group rg-gencal \
     -n $appname
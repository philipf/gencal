az login

# Update with deployment specific settings
# Important -n (app name) must be unique globally
az webapp up --runtime PYTHON:3.9 --sku F1  --location australiaeast --resource-group rg-gencal -n gencal 
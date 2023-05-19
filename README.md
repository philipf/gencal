# gencal
[![Open in Dev Containers](https://img.shields.io/static/v1?label=Dev%20Containers&message=Open&color=blue&logo=visualstudiocode)](https://vscode.dev/redirect?url=vscode://ms-vscode-remote.remote-containers/cloneInVolume?url=https://github.com/philipf/gencal)

Generates a simple month calendar in SVG format.
I use this tool to generate calendars to pull into draw.io to plan out upcoming deployments.

Disclaimer: To expedite the process, most of the code was generated using ChatGPT and Github Copilot.

## Usage:

### Online

Retrieve calendar for the current month:

https://gencal.azurewebsites.net/

Retrieve a calendar for a specific month:

https://gencal.azurewebsites.net/2023/5

### Command line
1. The easiest is to open the repository in Github's codespaces or open using DevContainers
2. Usage:

```bash
python gencal.py 2023 5
```

3. Download or save the generated file `cal-\<year\>-\<month\>`.svg for example `cal-2023-05.svg`

## Example SVG:

<img src="calendar.svg"/>


## Deploy to Azure as an Python App Service
- See Azure [documention](https://learn.microsoft.com/en-us/azure/app-service/quickstart-python) to deploy a Python web app)
- Review the included `install-az.sh` script

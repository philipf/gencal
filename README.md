# gencal
[![Open in Dev Containers](https://img.shields.io/static/v1?label=Dev%20Containers&message=Open&color=blue&logo=visualstudiocode)](https://vscode.dev/redirect?url=vscode://ms-vscode-remote.remote-containers/cloneInVolume?url=https://github.com/philipf/gencal)

Generates a simple month calendar in SVG format.
I use this tool to generate calendars to pull into draw.io to plan out upcoming deployments.

Disclaimer:To get this done as quickly as possible most of the code was generated using ChatGPT and Github Copilot.

## Usage:
1. The easiest it to open the repository in Github's codespaces or open using DevContainers
2. Update the last line in `gencal.py` to the required calendar value, for example

```python
generate_svg_calendar(2023, 2)
```

3. Download/save the calendar.svg file


## Example SVG:

<img src="calendar.svg"/>


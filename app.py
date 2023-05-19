# Flask app that serves a calendar as an SVG image
# Important that is named app.py so the Azure App Service automatically runs it.
# Otherwise you need to configure the startup file in the Azure App Service configuration.
# az webapp config set --resource-group <resource-group-name> --name <app-name> --startup-file "<custom-command>"
from flask import Flask, Response, abort
from datetime import datetime
import gencal

app = Flask(__name__)

@app.route('/<year>/<month>', methods=['GET'])
def get_calendar(year, month):
    # Validate year and month
    try:
        datetime(int(year), int(month), 1)
    except ValueError:
        abort(400, description="Invalid year or month")
        return

    # Create calendar for the specified year and month using the gencal module
    svg_drawing = gencal.generate_svg_calendar(year, month)
    svg_data = svg_drawing.tostring()

    return Response(svg_data, mimetype='image/svg+xml')

@app.route('/', methods=['GET'])
def default_route():
    # generate a calendar for the current month
    now = datetime.now()
    svg_drawing = gencal.generate_svg_calendar(now.year, now.month)
    svg_data = svg_drawing.tostring()

    return Response(svg_data, mimetype='image/svg+xml')

@app.errorhandler(404)
def page_not_found(e):
    # Handle 404 errors (Page not found)
    return "Sorry, this page doesn't exist.", 404

if __name__ == '__main__':
    app.run(port=5000)

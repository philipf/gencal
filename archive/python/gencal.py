import calendar
import svgwrite
from datetime import datetime

def generate_svg_calendar(year, month):
    """
    Function to generate a SVG calendar for a specified year and month.

    Parameters:
    year (int): The year for the calendar.
    month (int): The month for the calendar.
    """

    # Validate year and month
    try:
        datetime(int(year), int(month), 1)
    except ValueError:
        print("Invalid year or month")
        return

    # Create calendar for the specified year and month
    calendar_month = calendar.monthcalendar(int(year), int(month))
    
    # Define cell size and header height
    cell_size = 90
    header_height = 20

    # Constants for SVG drawing
    svg_size = (f"{cell_size * 7 + 20}px", f"{header_height + cell_size * (len(calendar_month) + 1)}px")
    font_family = "Arial"
    font_fill = "black"
    
    # Create SVG drawing
    svg_drawing = svgwrite.Drawing(size=svg_size)

    # Add the month and year as a centred title
    title_text = f"{calendar.month_name[int(month)]} {year}"
    title_location = (cell_size * 7 / 2 + 10, header_height / 2 + 10)    
    svg_drawing.add(svg_drawing.text(title_text, insert=title_location, 
                                     font_size="20px", fill=font_fill, 
                                     text_anchor="middle", font_weight="bold", 
                                     font_family=font_family))

    # Generate calendar grid
    for column in range(7):  # Loop over the week days
        for row in range(len(calendar_month) + 1):  # Loop over the weeks in the month
            
            # Define common values for rectangle and text
            cell_location = (10 + column * cell_size, header_height + 40 + (row - 1) * cell_size if row != 0 else 40)
            cell_dimensions = (f"{cell_size}px", f"{header_height}px" if row == 0 else f"{cell_size}px")
            
            # Create a rectangle for the cell
            svg_drawing.add(svg_drawing.rect(insert=cell_location, 
                                             size=cell_dimensions, 
                                             stroke_width="0.5", 
                                             stroke="grey", 
                                             fill="none"))

            # Text parameters for day name and day number
            text_font_size = "12px" if row == 0 else "10px"
            text_font_weight = "bold" if row == 0 else "normal"
            text_insert = (15 + column * cell_size, header_height + 35) if row == 0 else (13 + column * cell_size, header_height + 40 + (row - 1) * cell_size + 13)
            
            # First row for day names or Remaining cells for day numbers
            if row == 0 or calendar_month[row-1][column] != 0:
                text_content = calendar.day_name[column] if row == 0 else str(calendar_month[row-1][column])
                svg_drawing.add(svg_drawing.text(text_content, insert=text_insert, 
                                                 font_size=text_font_size, fill=font_fill, 
                                                 font_weight=text_font_weight, font_family=font_family))
                
            # If it is a weekend, shade the cell in light grey
            if row != 0 and column in [5, 6]:
                svg_drawing.add(svg_drawing.rect(insert=cell_location, 
                                                 size=cell_dimensions, 
                                                 stroke_width="0.5", 
                                                 stroke="grey", 
                                                 fill="lightgrey", 
                                                 opacity="0.3"))
                
                
    return svg_drawing

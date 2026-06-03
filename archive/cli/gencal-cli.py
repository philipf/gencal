import sys
import gencal

# main function
# take year and month arguments from command line 
# if year and month arguments are not pass warn user, and show usage and exit

# if year and month arguments are passed, call generate_svg_calendar function
# and save the returned svg_drawing object to a file
# if the file is saved successfully, print a message to the user
# if the file is not saved successfully, print an error message to the user
def main():
    """
    Main function for the gencal-cli.py script.
    """
    # Check if the year and month arguments are passed
    if len(sys.argv) != 3:
        print("Usage: python gencal-cli.py year month")
        return
    
    # Get the year and month from the command line arguments
    year = sys.argv[1]
    month = sys.argv[2]
    
    # Generate the calendar
    svg_drawing = gencal.generate_svg_calendar(year, month)
    
    # Save the calendar to a file
    filename = f"cal-{year}-{str(month).zfill(2)}.svg"
    try:
        svg_drawing.saveas(filename)
        print(f"Calendar saved to {filename}")
    except:
        print(f"Error saving calendar to {filename}")
        
# Call the main function
if __name__ == "__main__":
    main()
    



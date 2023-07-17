# Zendesk Date Time Tool

Date Time Tool inserts a date time string into the textarea of a Zendesk ticket on a given keypress.  The extension also generates a timeline from the date time tags.

## How to install the Date Time Tool Chrome Extension for ZenDesk

Have IT deploy to chrome browser

## Instructions for use

**To insert a date time string into the text area in the following format: 'MM/DD/YY hh:mm: '**

1. For any Zendesk ticket, **left-click into the textarea** (internal/external comment area)

2. Hold the control key and press the enter key   

**To Generate a Timeline based on the inserted date time strings**

1. Right click in the Zendesk editing area

2. From the context menu, select "Generate Timeline"
    - The feature will timeout 5 seconds after right clicking if the context menu option is not selected

## Uninstall Zendesk DateTimerTagger

1. In Chrome's URL field, go to chrome://extensions/.  
	a. This will open the "Extensions" menu in Chrome.

2. Find the Zendesk DateTimeTagger Extension

3. Select "Remove"

4. Confirm the removal when prompted by Chrome

## Known Issues

1. ~~When a ticket is first loaded the caret (cursor) will not move to the end of the date time string.  Once a string or character is input into the textarea this issue goes away.~~
   - Fixed by Jacob West 

2. ~~The 'Generate Timeline' feature executes as many times as the user right clicks before selecting "Generate Timeline"~~
   - Fixed

3. ~~The 'Generate Timeline' Feature executes in tickets when the user generates a timeline in another ticket~~
	- Fixed

4. ~~Date Time Tags entered by the user will follow system time instead of EST~~
   - Fixed by Jacob West 

5. ~A generated timeline contains duplicate comments when a comment appears more than twice~
   - Fixed


## Errors

This extension comes with no support.

## To-Dos

- [] Make the string hotkey user defineable through the extension menu
- [] Improve performace
- [] Refactor to improve readability
- [] Have timeline generator execute once and only once without the timer to cancel an unfired message 
- [] Add ability to select timezone for datetime formatting
- [x] Implement a "timeline" or "Export" feature that collects all of the date time strings and their data
- [x] Implement an "exclusion" feature that excludes certain date time strings from the timeline report
- [x] Fix issue where caret does not move to the end of the string when the textarea first loads
- [x] Fix record duplication when creating timeline

## Versions
- 1.0.0 -  Implemented basic functionality
- 1.0.1 -  Generated extension ID and added to script.js/generateTimeline()
- 1.1.2 -  Added ability to omit records from timeline.  Fixed duplicate comments in timeline
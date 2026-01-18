Real-time Flight Tracker

<u>Problem Statement</u> 
    This project tracks all commercial flights to and from most major cities in India and a few destinations abroad in real-time using Aviationstack API.

<u>Features Implemented</u>
    - Separate handling of International and Domestic Flights and relevant error messages are shown if invalid start or destination is entered, depending on the locations entered.
    - All available flights fetched for every pair of start location and destination that are present.
    - Real data fetched from Aviationstack API.
    - Flights are shown in the form of a table containing the records. 

<u>DOM Concepts Used</u>
    - Event handling
    - Event propagation
    - Event delegation
    - Asynchronous programming
        - Async function.

<u>Steps to Run the Project</u>
    - 1. Select the type of flight (International or Domestic).
    - 2. Enter the start and destination locations.
    - 3. Click "Track flights".
    - 4. All the relevant flights should have been displayed, if not, heed the error messages and try again accordingly.

<u>Known limitations</u>
    - Not all cities are included in this project, as mostly Indian cities are present with only a few destinations abroad.
    - Cannot retrieve flights in the future as it comes under paid plan of Aviationstack API.

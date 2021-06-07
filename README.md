# Parking

The app was developed using a local MySQL server through Xampp. The app's setting for connetion to a DB can be reconfigured from 'src/environment/dev.ts' amd a mew file 'prod.ts' can be added there to connect to a different DB in a production environment.

To start the app use the 'npm run dev' command.

There are four routes in the app:

1. Calculate the current number of free spots in the parking (out of 200 total): GET - /api/parking/vehicles/freeSpots

2. Register a new vehicle into the parking if there is enough free space: POST - /api/parking/vehicles/   
   The body params needed are:
  - 'licensePlate: string'
  - 'vehicleType: string' : values 'A', 'B' or 'C'  // each of these params alter the space needed and fee per hour
  - 'discount: string' : values 'silver', 'gold', 'platinum' //the discounts' respective percentages are 10%, 15%, 20%

3. Check the current fee which a vehicle has accumulated. Day and night fees are automatically calculated based on the time of day.
   Discounts are also applied to the returned number: GET - /api/parking/vehicles/:licensePlate

4. Deregister a vehicle from the parking lot. The final fee is also displayed to the user: DELETE - /api/parking/vehicles/:licensePlate

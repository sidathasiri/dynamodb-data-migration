## Currency Data Migration Script for PaymantPlan DynamoDB Table

### Setup Locally
- Run `npm install` to install the dependencies
- Setup the AWS credentials for the required AWS account

### Steps
1. Create a on-demand backup of the current data in the `PaymentPlanOrders` DynamoDB table from the AWS console and confirm the backup is successfully created
2. Export the data as CSV and download to your local machine
3. Update the `inputCsvPath` in the `index.js` pointing to the downloaded CSV file
4. Run the `appendColumnToCsv` function to create a new CSV file including the currency column
5. Once the execution is complete review the newly created `updated-dynamodb-data.csv` file to verify if the data change is correct before pushing to the DynamoDB table
6. Once the verification is complete, run the `uploadDataToDynamoDB` function in the `index.js` to push the updated data back to the DynamoDB table
7. Once all data is pushed, confirm the updated data from the DynamoDB console

### Rollback Plan
1. Delete the `PaymentPlanOrders` table from the DynamoDB table
2. Restore the backup with the same table name. Enable the option to recreate all the indexes as well.



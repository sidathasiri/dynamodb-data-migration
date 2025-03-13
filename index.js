const AWS = require('aws-sdk');
const fs = require('fs');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// Initialize the DynamoDB client
const dynamodb = new AWS.DynamoDB.DocumentClient({ region: 'ap-southeast-2' });

const tableName = 'PaymentPlanOrders';

// File paths
const inputCsvPath = 'results.csv';  // Update this based on your downloaded file path
const outputCsvPath = 'updated-dynamodb-data.csv';

// Step 1: Append a new column to the CSV
async function appendColumnToCsv() {
    try {
        const rows = [];

        // Read the CSV file
        fs.createReadStream(inputCsvPath)
            .pipe(csv())
            .on('data', (row) => {
                row.currency = 'aud'; // Add the new column
                rows.push(row);
            })
            .on('end', () => {
                // Write the updated data to a new CSV file
                const csvWriter = createCsvWriter({
                    path: outputCsvPath,
                    header: [
                        ...Object.keys(rows[0]).map((key) => ({ id: key, title: key })),
                    ],
                });

                csvWriter.writeRecords(rows).then(() => {
                    console.log(`New column added and saved to ${outputCsvPath}`);
                });
            });
    } catch (error) {
        console.error('Error appending column:', error);
    }
}

// Step 2: Upload updated data back to DynamoDB
async function uploadDataToDynamoDB() {
    try {
        const rows = [];

        // Read the updated CSV file
        fs.createReadStream(outputCsvPath)
            .pipe(csv())
            .on('data', (row) => {
                rows.push(row);
            })
            .on('end', async () => {
                // Upload each row to DynamoDB
                for (const row of rows) {
                    const params = {
                        TableName: tableName,
                        Item: row,
                    };

                    await dynamodb.put(params).promise();
                    console.log(`Uploaded item...`);
                }

                console.log('All items uploaded successfully!');
            });
    } catch (error) {
        console.error('Error uploading data:', error);
    }
}

// Run the script
(async () => {
    await appendColumnToCsv();
    // await uploadDataToDynamoDB();
})();
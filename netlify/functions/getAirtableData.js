// C:\Users\Administrator\Desktop\pizzeria-ambrosia\netlify\functions\getAirtableData.js

const Airtable = require('airtable');

// Your base ID
const BASE_ID = 'appI9gKsHB7gF86G7';
const TABLE_NAME = 'Imported table'; // Update this if your table name is different

exports.handler = async function(event, context) {
  console.log('Function `getAirtableData` invoked');
  
  if (!process.env.AIRTABLE_API_KEY) {
    console.error('AIRTABLE_API_KEY is missing');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server configuration error' })
    };
  }

  try {
    Airtable.configure({
      endpointUrl: 'https://api.airtable.com',
      apiKey: process.env.AIRTABLE_API_KEY
    });
    
    const base = Airtable.base(BASE_ID);

    console.log('Fetching records from Airtable');
    const records = await base(TABLE_NAME).select().all();
    console.log(`Fetched ${records.length} records`);

    let categories = {};

    records.forEach(record => {
      let category = record.get('Category');
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push({
        id: record.id,
        fields: record.fields
      });
    });

    console.log('Successfully processed records');
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, POST, OPTION",
      },
      body: JSON.stringify(categories)
    };
  } catch (err) {
    console.error('Error in getAirtableData:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch data', details: err.message })
    };
  }
}
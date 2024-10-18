const Airtable = require('airtable');

const BASE_ID = 'appI9gKsHB7gF86G7';
const TABLE_NAME = 'Imported table';

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
    let categoryOrder = {};

    records.forEach(record => {
      let category = record.get('Category');
      let order = record.get('Order'); // Assuming you have an 'Order' column in your table
      if (!categories[category]) {
        categories[category] = [];
        categoryOrder[category] = order || Infinity; // Use Infinity if no order is specified
      }
      categories[category].push({
        id: record.id,
        fields: record.fields
      });
      console.log('%c record =', 'color: white; font-size: 15px; font-weight: bold;', record);
      console.log('%c order =', 'color: white; font-size: 15px; font-weight: bold;', order);
    });

    console.log('Successfully processed records');
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, POST, OPTION",
      },
      body: JSON.stringify({ categories, categoryOrder })
    };
  } catch (err) {
    console.error('Error in getAirtableData:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch data', details: err.message })
    };
  }
}
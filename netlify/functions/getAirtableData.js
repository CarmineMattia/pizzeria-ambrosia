// netlify/functions/getAirtableData.js
const Airtable = require('airtable');

exports.handler = async function(event, context) {
  try {
    const base = new Airtable({apiKey: process.env.AIRTABLE_TOKEN}).base(process.env.AIRTABLE_BASE_ID);
    
    let records = await base('Menu').select().all();
    let categories = {};

    records.forEach(record => {
      let category = record.get('Category');
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(record);
    });

    return {
      statusCode: 200,
      body: JSON.stringify(categories)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch data' })
    };
  }
}
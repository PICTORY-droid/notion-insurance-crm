const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const PAGE_ID = process.env.NOTION_PAGE_ID;

const DB_IDS = {
  pipeline: '635ab8f7-9f1d-4255-8f04-2af8ae011c7b',
  consult: 'b7a1ddce-cc3b-4cde-8773-414c3d6a1b6d',
  contract: 'ab5a2245-dc6f-472d-bb55-e509138c9478',
  activity: '997bbd31-7281-4e5c-9d70-1d4f9273b47a',
  remind: '8ca6432a-ae9d-4b6f-b239-5a295426d26e',
  client: '22cec55f-85b8-43ae-a35e-c41e353faec8'
};

console.log('✅ DB ID 목록:');
console.log('  고객 DB:', DB_IDS.client);
console.log('  영업 파이프라인:', DB_IDS.pipeline);
console.log('  상담 DB:', DB_IDS.consult);
console.log('  계약 DB:', DB_IDS.contract);
console.log('  활동 DB:', DB_IDS.activity);
console.log('  리마인드 DB:', DB_IDS.remind);

module.exports = DB_IDS;

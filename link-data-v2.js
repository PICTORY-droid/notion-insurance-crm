const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });

const DB = {
  client: '22cec55f-85b8-43ae-a35e-c41e353faec8',
  consult: 'b7a1ddce-cc3b-4cde-8773-414c3d6a1b6d',
  contract: 'ab5a2245-dc6f-472d-bb55-e509138c9478',
  activity: '997bbd31-7281-4e5c-9d70-1d4f9273b47a',
  remind: '8ca6432a-ae9d-4b6f-b239-5a295426d26e',
  pipeline: '635ab8f7-9f1d-4255-8f04-2af8ae011c7b'
};

async function linkData() {
  console.log('데이터 연결 시작...');

  const clientDS = await notion.databases.retrieve({ database_id: DB.client });
  const clients = await notion.dataSources.query({ data_source_id: clientDS.data_sources[0].id });
  const clientMap = {};
  for (const c of clients.results) {
    clientMap[c.properties['고객명'].title[0].plain_text] = c.id;
  }
  console.log('고객 목록:', Object.keys(clientMap));

  console.log('상담 연결 중...');
  const consultDS = await notion.databases.retrieve({ database_id: DB.consult });
  const consults = await notion.dataSources.query({ data_source_id: consultDS.data_sources[0].id });
  for (const c of consults.results) {
    const title = c.properties['상담제목']?.title?.[0]?.plain_text;
    const clientName = title?.split(' ')[0];
    if (clientMap[clientName]) {
      await notion.pages.update({
        page_id: c.id,
        properties: { '고객': { relation: [{ id: clientMap[clientName] }] } }
      });
      console.log('  ✅ 상담 연결:', title, '→', clientName);
    }
  }

  console.log('활동 연결 중...');
  const activityDS = await notion.databases.retrieve({ database_id: DB.activity });
  const activities = await notion.dataSources.query({ data_source_id: activityDS.data_sources[0].id });
  for (const a of activities.results) {
    const title = a.properties['활동제목']?.title?.[0]?.plain_text;
    const clientName = title?.split(' ')[0];
    if (clientMap[clientName]) {
      await notion.pages.update({
        page_id: a.id,
        properties: { '고객': { relation: [{ id: clientMap[clientName] }] } }
      });
      console.log('  ✅ 활동 연결:', title, '→', clientName);
    }
  }

  console.log('계약 연결 중...');
  const contractDS = await notion.databases.retrieve({ database_id: DB.contract });
  const contracts = await notion.dataSources.query({ data_source_id: contractDS.data_sources[0].id });
  const clientNames = Object.keys(clientMap);
  for (let i = 0; i < contracts.results.length; i++) {
    const clientName = clientNames[i % clientNames.length];
    const title = contracts.results[i].properties['상품명']?.title?.[0]?.plain_text;
    await notion.pages.update({
      page_id: contracts.results[i].id,
      properties: { '고객': { relation: [{ id: clientMap[clientName] }] } }
    });
    console.log('  ✅ 계약 연결:', title, '→', clientName);
  }

  console.log('🎉 모든 데이터 연결 완료!');
}

linkData().catch(err => console.error('❌ 오류:', err.message));
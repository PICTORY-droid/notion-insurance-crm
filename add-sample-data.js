const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });

const DB = {
  client: '22cec55f-85b8-43ae-a35e-c41e353faec8',
  pipeline: '635ab8f7-9f1d-4255-8f04-2af8ae011c7b',
  consult: 'b7a1ddce-cc3b-4cde-8773-414c3d6a1b6d',
  contract: 'ab5a2245-dc6f-472d-bb55-e509138c9478',
  activity: '997bbd31-7281-4e5c-9d70-1d4f9273b47a',
  remind: '8ca6432a-ae9d-4b6f-b239-5a295426d26e'
};

const clients = [
  { name: '김철수', phone: '010-1234-5678', birth: '1980-03-15', job: '회사원', source: '소개' },
  { name: '이영희', phone: '010-2345-6789', birth: '1975-07-22', job: '자영업', source: '광고' },
  { name: '박민준', phone: '010-3456-7890', birth: '1990-11-05', job: '공무원', source: 'SNS' },
  { name: '최지은', phone: '010-4567-8901', birth: '1985-02-28', job: '교사', source: '소개' },
  { name: '정수현', phone: '010-5678-9012', birth: '1992-09-14', job: '간호사', source: '기존고객' },
  { name: '강동원', phone: '010-6789-0123', birth: '1978-12-01', job: '사업가', source: '소개' },
  { name: '윤서연', phone: '010-7890-1234', birth: '1988-04-17', job: '디자이너', source: 'SNS' },
  { name: '임태양', phone: '010-8901-2345', birth: '1983-06-30', job: '의사', source: '소개' },
  { name: '한소희', phone: '010-9012-3456', birth: '1995-08-12', job: '프리랜서', source: '광고' },
  { name: '오준혁', phone: '010-0123-4567', birth: '1970-01-25', job: '은행원', source: '기존고객' }
];

async function addSampleData() {
  console.log('샘플 데이터 추가 시작...');
  console.log('이미 데이터가 있으면 중복될 수 있어요!');

  for (const c of clients) {
    await notion.pages.create({
      parent: { database_id: DB.client },
      properties: {
        '고객명': { title: [{ text: { content: c.name } }] },
        '연락처': { rich_text: [{ text: { content: c.phone } }] },
        '생년월일': { date: { start: c.birth } },
        '직업': { rich_text: [{ text: { content: c.job } }] },
        '유입경로': { select: { name: c.source } }
      }
    });
    console.log('  ✅ 고객 추가:', c.name);
  }
  console.log('🎉 완료!');
}

addSampleData().catch(err => console.error('❌ 오류:', err.message));
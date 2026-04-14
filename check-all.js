const { Client } = require('@notionhq/client');
require('dotenv').config();
const notion = new Client({ auth: process.env.NOTION_TOKEN });
const DBS = {
  '고객 DB': '22cec55f-85b8-43ae-a35e-c41e353faec8',
  '영업 파이프라인': '635ab8f7-9f1d-4255-8f04-2af8ae011c7b',
  '상담 DB': 'b7a1ddce-cc3b-4cde-8773-414c3d6a1b6d',
  '계약 DB': 'ab5a2245-dc6f-472d-bb55-e509138c9478',
  '활동 DB': '997bbd31-7281-4e5c-9d70-1d4f9273b47a',
  '리마인드 DB': '8ca6432a-ae9d-4b6f-b239-5a295426d26e'
};
const EXPECTED = {
  '고객 DB': ['고객명','연락처','생년월일','직업','유입경로','파이프라인','상담기록','계약','활동','리마인드','총 상담 수','총 계약 수','최근 활동일','고객 등급','휴면 여부'],
  '영업 파이프라인': ['고객명','단계','다음 연락일','메모','고객'],
  '상담 DB': ['상담제목','상담일','상담 유형','상담 내용','다음 액션','다음 상담일','고객'],
  '계약 DB': ['상품명','계약일','보험사','월 보험료','납입기간','계약 상태','만기일','고객'],
  '활동 DB': ['활동제목','날짜','활동 유형','메모','고객'],
  '리마인드 DB': ['리마인드 제목','유형','예정일','완료 여부','고객']
};
async function checkAll() {
  console.log('전체 DB 속성 점검 시작...');
  for (const [name, dbId] of Object.entries(DBS)) {
    const db = await notion.databases.retrieve({ database_id: dbId });
    const ds = await notion.dataSources.retrieve({ data_source_id: db.data_sources[0].id });
    const actual = Object.keys(ds.properties);
    const missing = EXPECTED[name].filter(p => !actual.includes(p));
    console.log('📋 ' + name + ': ' + (missing.length > 0 ? '❌ 누락: ' + missing.join(', ') : '✅ 정상'));
  }
  console.log('완료!');
}
checkAll().catch(e => console.error('오류:', e.message));
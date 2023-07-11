export enum JobSite {
  LEVER = 'lever.co',
  GREENHOUSE = 'greenhouse.io',
  TEAMTAILOR = 'teamtailor.com',
  WORKABLE = 'workable.com',
  JOBVITE = 'jobvite.com',
  WORKDAY = 'myworkdayjobs.com',
  BAMBOOHR = 'bamboohr.com',
}

const WORKABLE_PROP_MAP = {
  IDS: [
    'firstname',
    'lastname',
    'email',
    'cover_letter',
    'address',
    'CA_6551',
    'school',
    'CA_6551',
    'field_of_study',
    'degree',
  ],
  NAMES: [
    'phone',
    'start_date',
    'end_date',
    'title',
    'company',
    'industry',
    'summary',
    'QA_6542214',
  ],
  AUTO_COMPLETES: [],
}

const LEVER_PROP_MAP = {
  IDS: [],
  NAMES: [
    'resume',
    'name',
    'email',
    'phone',
    'org',
    'urls[LinkedIn]',
    'urls[Twitter]',
    'urls[GitHub]',
    'urls[Portfolio]',
    'urls[Other]',
    'comments',
    'cards[f123cab7-b366-4897-98ef-ac2d88f5089c][field1]',
    'cards[f123cab7-b366-4897-98ef-ac2d88f5089c][field2]',
    'cards[f123cab7-b366-4897-98ef-ac2d88f5089c][field3]',
    'cards[f123cab7-b366-4897-98ef-ac2d88f5089c][field4]',
    'cards[f123cab7-b366-4897-98ef-ac2d88f5089c][field6]',
    'cards[62e3c836-a509-40e6-9895-ae79407cdcae][field1]',
    'cards[62e3c836-a509-40e6-9895-ae79407cdcae][field2]',
    'cards[62e3c836-a509-40e6-9895-ae79407cdcae][field0]',
    'cards[a496c793-bdcd-4703-9bff-2f23c7a8dc5c][field0]',
    'cards[522c5a72-a91c-4b9f-a8cf-eb5f0cb25ab7][field0]',
    'cards[88ca6817-b704-45cc-aef3-59a24df2f405][field0]',
    'cards[7123737d-00b8-4900-a9bf-0059cbbbb3ff][field0]',
    'cards[205cbc38-3a25-46fa-b3a7-ede8966e314f][field0]',
    'cards[1e303a9c-924a-40dd-ab18-b3cbe5672441][field0]',
    'cards[06fd7b42-4805-4b54-a182-a3fa44266a4f][field0]',
    'cards[06fd7b42-4805-4b54-a182-a3fa44266a4f][field3]',
    'cards[1511a958-cba8-4266-8468-abdd3e0d8d9b][field3]',
  ],
  AUTO_COMPLETES: [],
}

const GREENHOUSE_PROP_MAP = {
  IDS: [
    'first_name',
    'last_name',
    'email',
    'phone',
    // 'job_application_answers_attributes_1_text_value',
    // 'job_application_answers_attributes_0_text_value',
    // 'job_application_answers_attributes_6_text_value',
    // 'job_application_answers_attributes_4_text_value',
    // 'job_application_answers_attributes_5_text_value',
    // 'job_application_answers_attributes_2_text_value',
  ],
  NAMES: [],
  AUTO_COMPLETES: [],
}
for (let i = 1; i <= 100; i++) {
  if (!GREENHOUSE_PROP_MAP.IDS.includes(`job_application_answers_attributes_${i}_text_value`)) {
    GREENHOUSE_PROP_MAP.IDS.push(`job_application_answers_attributes_${i}_text_value`)
  }
}

const TEAMTAILOR_PROP_MAP = {
  IDS: ['candidate_first_name', 'candidate_last_name', 'candidate_email', 'candidate_phone'],
  NAMES: [],
  AUTO_COMPLETES: [],
}

const JOBVITE_PROP_MAP = {
  IDS: [],
  NAMES: [],
  AUTO_COMPLETES: ['given-name', 'family-name', 'email', 'tel'],
}
const WORKDAY_PROP_MAP = {
  IDS: [
    // 'input-4',
    // 'input-5',
    // 'input-7',
    // 'input-8',
    // ' input-9',
    // 'input-10',
    // 'input-13',
    // 'input-14',
    // 'input-17',
    // 'input-18',
    // 'input-19',
    // 'input-27',
    // 'input-63',
    // 'input-66',
    // 'input-108',
  ],
  NAMES: [],
  AUTO_COMPLETES: [],
}
for (let i = 1; i <= 150; i++) {
  if (!WORKDAY_PROP_MAP.IDS.includes(`input-${i}`)) {
    WORKDAY_PROP_MAP.IDS.push(`input-${i}`)
  }
}

const BAMBOOHR_PROP_MAP = {
  IDS: [
    'firstName',
    'lastName',
    'email',
    'phone',
    'streetAddress',
    'city',
    'zip',
    'desiredPay',
    'websiteUrl',
    'linkedinUrl',
    'references',
    'educationInstitutionName',
    'referredBy',
    // 'customQuestions[632]',
    // 'customQuestions[633]',
    // 'customQuestions[634]',
    // 'customQuestions[635]',
  ],
  NAMES: [],
  AUTO_COMPLETES: [],
}
for (let i = 600; i <= 1000; i++) {
  if (!BAMBOOHR_PROP_MAP.IDS.includes(`customQuestions[${i}]`)) {
    BAMBOOHR_PROP_MAP.IDS.push(`customQuestions[${i}]`)
  }
}

export const JobSiteMap = {
  [JobSite.LEVER]: LEVER_PROP_MAP,
  [JobSite.WORKABLE]: WORKABLE_PROP_MAP,
  [JobSite.GREENHOUSE]: GREENHOUSE_PROP_MAP,
  [JobSite.TEAMTAILOR]: TEAMTAILOR_PROP_MAP,
  [JobSite.JOBVITE]: JOBVITE_PROP_MAP,
  [JobSite.WORKDAY]: WORKDAY_PROP_MAP,
  [JobSite.BAMBOOHR]: BAMBOOHR_PROP_MAP,
}

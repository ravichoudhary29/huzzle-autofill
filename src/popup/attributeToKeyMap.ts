export const attributeToKeyMap: { [key: string]: string[] } = {
  first_name: ['first_name', 'candidate_first_name', 'firstname', 'given-name'],
  last_name: ['lastname', 'family-name'],
  name: ['name'],
  email: ['email', 'candidate_email'],
  phone: ['phone'],
  linkedin_url: ['urls[LinkedIn]', 'job_application[answers_attributes][0][text_value]'],
  // add other mappings as needed
}

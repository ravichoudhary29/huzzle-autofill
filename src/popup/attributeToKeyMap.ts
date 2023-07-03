export const attributeToKeyMap: { [key: string]: string } = {
  first_name: 'first_name',
  candidate_first_name: 'first_name',
  firstname: 'first_name',
  'given-name': 'first_name',

  lastname: 'last_name',

  'family-name': 'last_name',

  name: 'name',

  email: 'email',
  candidate_email: 'email',
  // add other mappings as needed

  phone: 'phone',
  'urls[LinkedIn]': 'linkedin_url',
}

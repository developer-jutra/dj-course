import { ContractorSummary as Contractor, ContractorDetails } from '../contract/contract';

export const MOCK_CONTRACTOR_DETAILS_LIST: ContractorDetails[] = [
  {
    addresses: [
      {
        address_id: 'b63511b6-526e-47d2-aca1-569643c63e45',
        address_type: 'CORPORATE',
        city: 'East Kristyshire',
        country: 'Dominican Republic',
        postal_code: '50469',
        street_address: '92686 Davis Garden',
      },
    ],
    contacts: [
      {
        details: 'info@daugherty-ochoa.com',
        type: 'EMAIL',
      },
      {
        details: '(429)908-1827',
        type: 'PHONE',
      },
    ],
    created_at: 'Mon, 11 Sep 2023 15:21:49 GMT',
    employees: [
  {
    contacts: [
      {
            details: 'jennifer.walker@daugherty-ochoa.com',
        type: 'EMAIL',
      },
      {
            details: '3306640735',
        type: 'PHONE',
      },
        ],
        employee_data: {
          job_title: 'Training and development officer',
          type: 'contractor_employee',
        },
        employee_name: 'Jennifer Walker',
        employee_id: '71',
      },
    ],
    id: '1',
    name: 'Daugherty-Ochoa',
    status: 'INACTIVE',
    tax_id_number: '0480611432',
    updated_at: 'Thu, 16 Jan 2025 00:03:53 GMT',
  },
  {
  addresses: [
    {
      address_id: '3aeda1c7-8a40-41a4-bf94-feda05aeb7be',
      address_type: 'BILLING',
      city: 'North Travisville',
      country: 'Cameroon',
      postal_code: '31521',
      street_address: '16560 Melissa Place',
    },
    {
      address_id: '79d640d0-ceef-4882-80b2-ee309dfbae2f',
      address_type: 'CORPORATE',
      city: 'New Mary',
      country: 'Greece',
      postal_code: '08136',
      street_address: '5588 Jose Curve',
    },
  ],
  contacts: [
    {
      details: 'info@cummingswoodandtaylor.com',
      type: 'EMAIL',
    },
    {
      details: '2963032883',
      type: 'PHONE',
    },
  ],
  created_at: 'Sun, 21 Jan 2024 16:39:45 GMT',
  employees: [
    {
      contacts: [
        {
          details: 'chelsea.phillips@cummingswoodandtaylor.com',
          type: 'EMAIL',
        },
      ],
      employee_data: {
        job_title: 'Maintenance engineer',
        type: 'contractor_employee',
      },
      employee_name: 'Chelsea Phillips',
      employee_id: '72',
    },
  ],
  id: '2',
  name: 'Cummings, Wood and Taylor',
  status: 'ACTIVE',
  tax_id_number: '0083113364',
  updated_at: 'Sun, 27 Apr 2025 04:34:07 GMT',
  },
  {
    addresses: [
      {
        address_id: '46b33659-4fdb-48c2-91ff-0d44d74fd7d0',
        address_type: 'BILLING',
        city: 'West Jeffrey',
        country: 'Hong Kong',
        postal_code: '98011',
        street_address: '22502 Thompson Knoll',
      },
    ],
    contacts: [
      {
        details: 'info@hill-campbell.com',
        type: 'EMAIL',
      },
      {
        details: '001-359-688-2176',
        type: 'PHONE',
      },
    ],
    created_at: 'Sat, 07 Oct 2023 11:31:00 GMT',
    employees: [
      {
        contacts: [
          {
            details: 'andrew.vaughan@hill-campbell.com',
            type: 'EMAIL',
          },
          {
            details: '3349696709',
            type: 'PHONE',
          },
        ],
        employee_data: {
          job_title: 'Engineer, manufacturing systems',
          type: 'contractor_employee',
        },
        employee_name: 'Andrew Vaughan',
        employee_id: '73',
      },
      {
        contacts: [
          {
            details: 'christopher.torres@hill-campbell.com',
            type: 'EMAIL',
          },
          {
            details: '+1-904-760-5372x47312',
            type: 'PHONE',
          },
        ],
        employee_data: {
          job_title: 'Facilities manager',
          type: 'contractor_employee',
        },
        employee_name: 'Christopher Torres',
        employee_id: '74',
      },
    ],
    id: '3',
    name: 'Hill-Campbell',
    status: 'ACTIVE',
    tax_id_number: '9140670785',
    updated_at: 'Mon, 25 Nov 2024 15:40:03 GMT',
  },
  {
    addresses: [
      {
        address_id: '6d1ec45f-c867-43d6-8ea1-9436df5d8ea1',
        address_type: 'OTHER',
        city: 'Port Christopher',
        country: 'Slovenia',
        postal_code: '41611',
        street_address: '3004 Kimberly Shoals',
      },
      {
        address_id: '92af7ff3-3c8e-4a51-913c-d426ed3ea2f2',
        address_type: 'BILLING',
        city: 'Brownstad',
        country: 'Congo',
        postal_code: '45678',
        street_address: '60429 Cooper Throughway Suite 223',
      },
    ],
    contacts: [
      {
        details: 'info@brown-whitehead.com',
        type: 'EMAIL',
      },
      {
        details: '(679)513-6472x576',
        type: 'PHONE',
      },
    ],
    created_at: 'Wed, 03 Jan 2024 22:24:09 GMT',
    employees: [
      {
        contacts: [
          {
            details: 'barry.rogers@brown-whitehead.com',
            type: 'EMAIL',
          },
          {
            details: '4949974424',
            type: 'PHONE',
          },
        ],
        employee_data: {
          job_title: 'Clinical embryologist',
          type: 'contractor_employee',
        },
        employee_name: 'Barry Rogers',
        employee_id: '75',
      },
      {
        contacts: [
          {
            details: 'steven.spears@brown-whitehead.com',
            type: 'EMAIL',
          },
          {
            details: '(865)297-7224x67746',
            type: 'PHONE',
          },
        ],
        employee_data: {
          job_title: 'Seismic interpreter',
          type: 'contractor_employee',
        },
        employee_name: 'Steven Spears',
        employee_id: '76',
      },
    ],
    id: '4',
    name: 'Brown-Whitehead',
    status: 'INACTIVE',
    tax_id_number: undefined,
    updated_at: 'Fri, 27 Dec 2024 11:19:52 GMT',
  },
  {
    addresses: [
      {
        address_id: '3d4df4fb-81fc-4fc6-ae52-4072213a4bbf',
        address_type: 'CORPORATE',
        city: 'Sheilahaven',
        country: 'Spain',
        postal_code: '64003',
        street_address: '1040 Smith Lodge',
      },
    ],
    contacts: [
      {
        details: 'info@ramseyhendersonandparker.com',
        type: 'EMAIL',
      },
      {
        details: '+1-349-720-7694x00557',
        type: 'PHONE',
      },
    ],
    created_at: 'Mon, 19 Feb 2024 08:22:36 GMT',
    employees: [],
    id: '5',
    name: 'Ramsey, Henderson and Parker',
    status: 'ACTIVE',
    tax_id_number: '3166249549',
    updated_at: 'Sun, 20 Apr 2025 14:02:38 GMT',
  },
];

export const MOCK_CONTRACTORS: Contractor[] = [
  ...MOCK_CONTRACTOR_DETAILS_LIST.map(
    ({ id, name, status, tax_id_number, contacts }) => ({
      id: id.toString(),
      name,
      status,
      tax_id_number,
      contacts,
    })
  ),
  {
    contacts: [
      {
        details: 'info@wardhallandfarley.com',
        type: 'EMAIL',
      },
      {
        details: '878.765.0037x34752',
        type: 'PHONE',
      },
    ],
    id: '6',
    name: 'Ward, Hall and Farley',
    status: 'ACTIVE',
    tax_id_number: '8786007963',
  },
  {
    contacts: [
      {
        details: 'info@hartandsons.com',
        type: 'EMAIL',
      },
      {
        details: '001-865-228-4874x4785',
        type: 'PHONE',
      },
    ],
    id: '7',
    name: 'Hart and Sons',
    status: 'ACTIVE',
    tax_id_number: undefined,
  },
];
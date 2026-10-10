export const business = {
  name: '[COMPANY NAME]',
  city: '',
  areas: [] as string[],
  phone: '',
  whatsapp: '',
  email: '',
  address: '',
  hours: '',
  preview: true,
  siteVisit: 'Confirmed on enquiry',
  warranty: '',
  languages: ['en'],
};
export const photo = (id: string, width = 1400) =>
  'https://images.unsplash.com/' +
  id +
  '?auto=format&fit=crop&w=' +
  width +
  '&q=85';
export const images = [
  'photo-1600210492486-724fe5c67fb0',
  'photo-1600607687920-4e2a09cf159d',
  'photo-1600566753086-00f18fb6b3ea',
  'photo-1497366754035-f200968a6e72',
  'photo-1497366811353-6870744d04b2',
  'photo-1600210491892-03d54c0aaf87',
];
export const services = [
  {
    slug: 'gypsum-false-ceilings',
    name: 'Gypsum False Ceilings',
    short: 'A clean canvas, beautifully overhead.',
    intro:
      'Create a more considered interior with a ceiling designed around your room, lighting, and services.',
    body: 'A well-planned false ceiling brings proportion to a room while keeping wiring, ductwork and access requirements in mind. Start with the way you use the space, then choose the level, edge detail and finish that belong there.',
    applications: [
      'Living rooms and bedrooms',
      'Villa renovations and apartment interiors',
      'Hallways with coordinated lighting',
    ],
    options: [
      'Minimal flat ceilings',
      'Suspended gypsum systems',
      'Bulkheads and changes in ceiling level',
      'Discreet maintenance access panels',
    ],
    scope:
      'A quotation can cover setting out, framing, boarding, joint treatment and the agreed surface finish. Demolition, painting, insulation and electrical works must be identified separately in the scope.',
    considerations:
      'Check finished ceiling height, fixing conditions and access to equipment before closing the ceiling. Board type and framing should suit the environment and the specified system.',
    cost: 'Area, suspension depth, the number of levels, access panels and finishing requirements affect both cost and programme.',
    faqs: [
      [
        'How much ceiling height will I lose?',
        'The required depth depends on framing, lighting and the services above. Confirm the finished level after a site review.',
      ],
      [
        'Can recessed lights be included?',
        'Openings and details can be coordinated with the lighting design. Electrical supply, fittings and installation must be expressly included or assigned to an electrician.',
      ],
      [
        'Will I still be able to access equipment?',
        'Access panels should be located and sized before installation, with the maintenance requirements of each service in mind.',
      ],
      [
        'Is painting part of the work?',
        'Only when it is included in your written quotation. Joint preparation and final decoration should be specified separately.',
      ],
    ],
  },
  {
    slug: 'gypsum-partitions-drywall',
    name: 'Gypsum Partitions & Drywall',
    short: 'Thoughtful divisions. Better use of space.',
    intro:
      'Make better use of your space with gypsum partitions planned around privacy, circulation, and everyday use.',
    body: 'A partition changes more than a floor plan. Door positions, daylight, sockets, wall-mounted loads and the movement of people all influence the right layout and construction.',
    applications: [
      'Office rooms and meeting spaces',
      'Room division within existing interiors',
      'Retail back-of-house areas',
    ],
    options: [
      'Full-height partitions',
      'Door openings and reinforced fixing points',
      'Insulation within the wall cavity',
      'Jointed and decorated wall finishes',
    ],
    scope:
      'Define setting out, framing, board layers, insulation and surface preparation. Doors, glazing, power, data and painting should be itemised so responsibilities are clear.',
    considerations:
      'Plan support for cupboards, screens and other loads. Acoustic expectations depend on the complete assembly, including doors, perimeter seals and penetrations.',
    cost: 'Partition height, total length, board layers, door openings, reinforcement and access restrictions influence the quotation.',
    faqs: [
      [
        'Can a partition support a wall-mounted screen?',
        'Suitable reinforcement needs to be designed into the wall around the expected load and fixing position.',
      ],
      [
        'Can cables run inside the partition?',
        'Yes, where properly coordinated. Electrical and data work must be planned before the partition is closed.',
      ],
      [
        'Will the partition block all sound?',
        'No absolute soundproofing claim is appropriate. Performance depends on the complete system and adjoining construction.',
      ],
      [
        'Are doors supplied with the partition?',
        'Door frames, leaves and hardware are only included when clearly listed in the quotation.',
      ],
    ],
  },
  {
    slug: 'decorative-ceilings-cove-details',
    name: 'Decorative Ceilings & Cove Details',
    short: 'Light, depth and a little distinction.',
    intro:
      'Give your interior definition with tailored ceiling shapes, recessed details, and lighting features.',
    body: 'Subtle changes in depth can transform the feel of a room. A cove can soften the edge of a ceiling; a tray can frame a gathering space. The strongest details follow the architecture rather than overwhelm it.',
    applications: [
      'Living and dining spaces',
      'Entrance halls and feature zones',
      'Bedrooms with indirect lighting',
    ],
    options: [
      'Tray ceilings',
      'Stepped profiles',
      'Recessed lighting coves',
      'Shadow-gap perimeter details',
    ],
    scope:
      'Agree profiles, dimensions, sample details and the finish before work begins. Electrical installation, LED products and drivers are separately coordinated unless expressly included.',
    considerations:
      'Allow enough space for lighting maintenance and ventilation. Test the intended light source against the profile to avoid unwanted shadows and visible bright spots.',
    cost: 'Linear detail length, corners, curved work, lighting access and the level of surface finish influence labour and scheduling.',
    faqs: [
      [
        'Can I share a reference photograph?',
        'Yes. A reference helps communicate your preferred style; the detail still needs to be adapted to your room and ceiling height.',
      ],
      [
        'Are LED strips included?',
        'Only if specified. The quotation should distinguish the gypsum detail from electrical wiring, drivers, fittings and installation.',
      ],
      [
        'What is a shadow gap?',
        'It is a deliberate recessed edge that creates a fine line of shadow between surfaces. Its dimensions and finish need careful setting out.',
      ],
      [
        'Can decorative work suit a small room?',
        'A restrained profile can add definition without dominating the room. Ceiling height and the overall proportions guide the choice.',
      ],
    ],
  },
  {
    slug: 'office-commercial-gypsum-works',
    name: 'Office & Commercial Gypsum Works',
    short: 'Spaces that work as hard as you do.',
    intro:
      'Ceiling and partition packages planned around your layout, project schedule, and other trades.',
    body: 'Commercial interiors need clear coordination. Drawings, access requirements, service routes and the order of work should be reviewed together so ceiling and partition packages fit the wider programme.',
    applications: [
      'Office fit-outs and refurbishments',
      'Retail interiors',
      'Contractor-led interior packages',
    ],
    options: [
      'Drawing-based ceiling packages',
      'Office room divisions',
      'Service access coordination',
      'Phased installation, subject to agreement',
    ],
    scope:
      'Define drawing revisions, quantities, interfaces and working arrangements in the quotation. Approvals, MEP work, specialist doors and permits are excluded unless explicitly included.',
    considerations:
      'Confirm building management requirements and site access before scheduling. Coordinate fire detection, ventilation, lighting and maintenance access with the relevant trades.',
    cost: 'Working hours, phasing, logistics, access equipment, drawing changes and the sequence of other trades affect delivery.',
    faqs: [
      [
        'Can you price from drawings?',
        'Drawings can support an initial scope review. Dimensions, access and existing conditions may still need site verification.',
      ],
      [
        'Can work take place in phases?',
        'Phasing is subject to the project programme, access and contractor confirmation. It is not automatically included.',
      ],
      [
        'Who coordinates other trades?',
        'The quotation and project plan should identify a responsible contact for each interface.',
      ],
      [
        'Are building approvals included?',
        'Approvals and permits must be assigned in writing; do not assume they form part of a gypsum package.',
      ],
    ],
  },
  {
    slug: 'acoustic-fire-rated-systems',
    name: 'Acoustic & Fire-Rated Systems',
    short: 'Performance begins with specification.',
    intro:
      'Specify partitions and ceilings around the performance your project requires.',
    body: 'Performance-led construction starts with a documented assembly. Board selection matters, but framing, layers, insulation, joints, fixings and penetrations are all part of the system.',
    applications: [
      'Meeting rooms with defined acoustic targets',
      'Projects with consultant-specified assemblies',
      'Partitions requiring documented fire performance',
    ],
    options: [
      'Specified multilayer board assemblies',
      'Cavity insulation',
      'Perimeter and penetration detailing',
      'Documentation-led system selection',
    ],
    scope:
      'The selected tested assembly, supporting documentation and installation responsibilities must be agreed. Consultant design, independent testing and certification are not implied.',
    considerations:
      'A board alone does not guarantee the finished system rating. Any substitution or penetration must be checked against the relevant system documentation by the responsible specialist.',
    cost: 'Required performance, board layers, framing, insulation, sealing details and documentation affect the scope and programme.',
    faqs: [
      [
        'Is a fire-rated board enough?',
        'No. Performance relates to the tested assembly and its correctly executed details, not the board in isolation.',
      ],
      [
        'Can you guarantee soundproof rooms?',
        'No absolute soundproof claim is made. A defined acoustic target and the surrounding construction must be considered.',
      ],
      [
        'Will a rating be included in the quotation?',
        'Only where supported by the specified assembly, relevant documentation and confirmed scope.',
      ],
      [
        'Can the specified products be substituted?',
        'Substitutions require review against the design and system documentation before installation.',
      ],
    ],
  },
  {
    slug: 'gypsum-repairs-finishing',
    name: 'Gypsum Repairs & Finishing',
    short: 'Bring the finish back into focus.',
    intro:
      'Restore damaged ceilings and walls with repairs matched to the condition of the existing surface.',
    body: 'A lasting repair starts by understanding the cause. Cracks, staining and damaged boards need assessment before the surface is patched, jointed and prepared for decoration.',
    applications: [
      'Cracked joints and local damage',
      'Replacement of damaged board sections',
      'Finishing after service alterations',
    ],
    options: [
      'Local patch repairs',
      'Board section replacement',
      'Joint treatment',
      'Repainting where agreed',
    ],
    scope:
      'The agreed work may include removal of affected material, local support, replacement boards and finishing. Leak repairs, structural investigation and full-room repainting are separate unless included.',
    considerations:
      'Resolve leaks or movement before cosmetic repairs. Moisture-resistant board is not waterproof and is not automatically suitable for every wet area.',
    cost: 'Damage extent, access, the condition of framing and the area requiring redecoration determine the repair scope.',
    faqs: [
      [
        'Can a water stain simply be painted over?',
        'The source of moisture and the condition of the board need assessment first. Painting does not resolve an active leak.',
      ],
      [
        'Will the repaired area match exactly?',
        'Matching depends on the existing texture, paint and age of the surface. Wider decoration may be needed for a consistent finish.',
      ],
      [
        'Can small cracks return?',
        'They may recur if underlying movement or moisture is not resolved. The cause should guide the repair.',
      ],
      [
        'Can I send photos before a visit?',
        'Photos and approximate dimensions help with an initial review, but concealed conditions may require inspection.',
      ],
    ],
  },
].map((service, i) => ({ ...service, image: images[i], confirmed: false }));
export const styles = [
  'Minimal flat ceilings',
  'Recessed cove details',
  'Tray ceilings',
  'Shadow-gap details',
  'Decorative feature ceilings',
  'Office partitions',
];
export type Project = {
  slug: string;
  name: string;
  location: string;
  type: string;
  category: string;
  requirement: string;
  scope: string;
  considerations: string;
  materials?: string;
  duration?: string;
  images: string[];
  verified: boolean;
};
export const projects: Project[] = [];
export const commonFaqs = [
  [
    'What do you need for a quotation?',
    'Share the location, approximate dimensions, intended service and a brief description. Photographs or drawings can help establish the scope; a site review may be needed before a final quotation.',
  ],
  [
    'Can I choose a ceiling design from a photograph?',
    'A reference image is a useful starting point. The detail needs to be adapted to ceiling height, lighting, services and the room layout.',
  ],
  [
    'How is installation scheduled?',
    'Scheduling is agreed after the scope, access, materials and coordination requirements are understood. A preferred date is a request, not a confirmed booking.',
  ],
  [
    'Is painting included?',
    'Painting and the level of surface preparation must be listed in the quotation. They are not automatically included.',
  ],
  [
    'Who handles the lighting?',
    'Openings and ceiling details should be coordinated with the lighting plan. Electrical installation must be included expressly or arranged with the responsible electrician.',
  ],
  [
    'Can an existing gypsum ceiling be repaired?',
    'The condition and cause of damage determine the repair. Underlying leaks or movement may need resolution before cosmetic work.',
  ],
  [
    'Which locations do you serve?',
    'Confirmed service areas have not yet been supplied for this preview. Coverage must be checked before a quotation or visit is arranged.',
  ],
];


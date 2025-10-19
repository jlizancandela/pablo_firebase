import { PlaceHolderImages } from './placeholder-images';

export interface Task {
  id: string;
  description: string;
  assignee: { name: string; initials: string };
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
}

export interface Photo {
  id: string;
  url: string;
  hint: string;
  comment: string;
  capturedAt: Date;
}

export interface Visit {
  id: string;
  date: Date;
  phase: string;
  attendees: string[];
  observations: string;
}

export interface Project {
  id: string;
  name: string;
  address: string;
  client: string;
  startDate: Date;
  projectType: 'Commercial' | 'Residential' | 'Industrial';
  coverPhotoUrl: string;
  coverPhotoHint: string;
  tasks: Task[];
  photos: Photo[];
  visits: Visit[];
}

const findImage = (id: string) => PlaceHolderImages.find(img => img.id === id) || { imageUrl: '', imageHint: '' };

const projectsData: Project[] = [
  {
    id: 'proj-1',
    name: 'Downtown Tower Renovation',
    address: '123 Main St, Metropolis, USA',
    client: 'Global Corp',
    startDate: new Date('2023-01-15'),
    projectType: 'Commercial',
    coverPhotoUrl: findImage('project-cover-1').imageUrl,
    coverPhotoHint: findImage('project-cover-1').imageHint,
    tasks: [
      { id: 'task-1-1', description: 'Strip out old fixtures on floors 1-5', assignee: { name: 'Demolition Team', initials: 'DT' }, priority: 'High', completed: true },
      { id: 'task-1-2', description: 'Asbestos abatement inspection', assignee: { name: 'Jane Doe', initials: 'JD' }, priority: 'High', completed: true },
      { id: 'task-1-3', description: 'Install new HVAC system', assignee: { name: 'HVAC Inc.', initials: 'HI' }, priority: 'Medium', completed: false },
      { id: 'task-1-4', description: 'Update electrical wiring', assignee: { name: 'John Smith', initials: 'JS' }, priority: 'Medium', completed: false },
    ],
    photos: [
      { id: 'photo-1-1', url: findImage('project-gallery-1').imageUrl, hint: findImage('project-gallery-1').imageHint, comment: 'Exposed wiring on floor 3. Needs review.', capturedAt: new Date('2023-03-20') },
      { id: 'photo-1-2', url: findImage('project-gallery-2').imageUrl, hint: findImage('project-gallery-2').imageHint, comment: 'New foundation poured for the extension.', capturedAt: new Date('2023-02-10') },
    ],
    visits: [
      { id: 'visit-1-1', date: new Date('2023-03-15'), phase: 'Electrical & Plumbing', attendees: ['Mike R.', 'Sarah K.'], observations: 'Progress is steady. Electrical rough-in is 50% complete. Some issues with plumbing layout identified, need to consult with architect.' },
    ],
  },
  {
    id: 'proj-2',
    name: 'Oak Valley Luxury Homes',
    address: '456 Oak Dr, Suburbia, USA',
    client: 'The Miller Family',
    startDate: new Date('2023-06-01'),
    projectType: 'Residential',
    coverPhotoUrl: findImage('project-cover-2').imageUrl,
    coverPhotoHint: findImage('project-cover-2').imageHint,
    tasks: [
      { id: 'task-2-1', description: 'Finalize architectural plans', assignee: { name: 'Architect Firm', initials: 'AF' }, priority: 'High', completed: true },
      { id: 'task-2-2', description: 'Pour foundation for Lot 2', assignee: { name: 'Concrete Crew', initials: 'CC' }, priority: 'Medium', completed: false },
    ],
    photos: [
      { id: 'photo-2-1', url: findImage('project-gallery-3').imageUrl, hint: findImage('project-gallery-3').imageHint, comment: 'Plumbing installed for master bathroom.', capturedAt: new Date('2023-08-01') },
    ],
    visits: [
        { id: 'visit-2-1', date: new Date('2023-07-20'), phase: 'Foundation', attendees: ['Tom B.'], observations: 'Site cleared and ready for foundation pour. Weather looks good for next week.' },
    ],
  },
  {
    id: 'proj-3',
    name: 'Skyline Business Park',
    address: '789 Industrial Way, Techtown, USA',
    client: 'Innovate Inc.',
    startDate: new Date('2022-11-10'),
    projectType: 'Industrial',
    coverPhotoUrl: findImage('project-cover-3').imageUrl,
    coverPhotoHint: findImage('project-cover-3').imageHint,
    tasks: [
      { id: 'task-3-1', description: 'Install steel frame for Warehouse A', assignee: { name: 'Steel Erectors', initials: 'SE' }, priority: 'High', completed: true },
      { id: 'task-3-2', description: 'Pave access roads', assignee: { name: 'Paving Co.', initials: 'PC' }, priority: 'Medium', completed: false },
    ],
    photos: [
        { id: 'photo-3-1', url: findImage('project-gallery-5').imageUrl, hint: findImage('project-gallery-5').imageHint, comment: 'Weekly progress meeting.', capturedAt: new Date('2023-01-10') },
        { id: 'photo-3-2', url: findImage('project-gallery-6').imageUrl, hint: findImage('project-gallery-6').imageHint, comment: 'Framing for office section underway.', capturedAt: new Date('2023-02-15') },
    ],
    visits: [],
  },
];

export const getProjects = (): Project[] => {
  return projectsData;
};

export const getProjectById = (id: string): Project | undefined => {
  return projectsData.find(p => p.id === id);
};

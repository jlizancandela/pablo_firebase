
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
        name: 'Maple Street Residence',
        address: '123 Maple St, Springfield',
        client: 'The Simpsons',
        startDate: new Date('2023-01-15'),
        projectType: 'Residential',
        coverPhotoUrl: findImage('project-cover-2').imageUrl,
        coverPhotoHint: findImage('project-cover-2').imageHint,
        tasks: [
            { id: 'task-1', description: 'Foundation work', assignee: { name: 'Bob Builder', initials: 'BB' }, priority: 'High', completed: true },
            { id: 'task-2', description: 'Framing', assignee: { name: 'Wendy', initials: 'W' }, priority: 'High', completed: true },
            { id: 'task-3', description: 'Electrical wiring', assignee: { name: 'Sparky', initials: 'S' }, priority: 'Medium', completed: false },
            { id: 'task-4', description: 'Plumbing installation', assignee: { name: 'Mario', initials: 'M' }, priority: 'Medium', completed: false },
        ],
        photos: [
            { id: 'photo-1', url: findImage('project-gallery-2').imageUrl, hint: findImage('project-gallery-2').imageHint, comment: 'Foundation poured and cured.', capturedAt: new Date('2023-01-20') },
            { id: 'photo-2', url: findImage('project-gallery-1').imageUrl, hint: findImage('project-gallery-1').imageHint, comment: 'Initial wiring for the main floor.', capturedAt: new Date('2023-02-10') },
        ],
        visits: [
            { id: 'visit-1', date: new Date('2023-01-18'), phase: 'Foundation', attendees: ['Tom, Jane, Mike'], observations: 'Foundation looks solid. No cracks observed. Ready for framing.' },
            { id: 'visit-2', date: new Date('2023-02-05'), phase: 'Framing', attendees: ['Tom, Sarah'], observations: 'Framing is complete and up to code. Some adjustments needed on the west wall.' },
        ],
    },
    {
        id: 'proj-2',
        name: 'Downtown Office Tower',
        address: '456 Financial Ave, Metropolis',
        client: 'LexCorp',
        startDate: new Date('2022-09-01'),
        projectType: 'Commercial',
        coverPhotoUrl: findImage('project-cover-1').imageUrl,
        coverPhotoHint: findImage('project-cover-1').imageHint,
        tasks: [
            { id: 'task-5', description: 'Site preparation', assignee: { name: 'Bob Builder', initials: 'BB' }, priority: 'High', completed: true },
            { id: 'task-6', description: 'Steel frame erection', assignee: { name: 'Wendy', initials: 'W' }, priority: 'High', completed: true },
        ],
        photos: [
            { id: 'photo-3', url: findImage('project-gallery-3').imageUrl, hint: findImage('project-gallery-3').imageHint, comment: 'Plumbing rough-in for the first 10 floors.', capturedAt: new Date('2023-03-15') },
        ],
        visits: [
            { id: 'visit-3', date: new Date('2022-09-10'), phase: 'Pre-construction', attendees: ['Lex, Tom'], observations: 'Final site survey completed. Ready to break ground.' },
        ],
    },
    {
        id: 'proj-3',
        name: 'Oak Valley Industrial Park',
        address: '789 Industrial Pkwy, Gotham',
        client: 'Wayne Enterprises',
        startDate: new Date('2023-03-20'),
        projectType: 'Industrial',
        coverPhotoUrl: findImage('project-cover-3').imageUrl,
        coverPhotoHint: findImage('project-cover-3').imageHint,
        tasks: [],
        photos: [],
        visits: [],
    }
];

export const getProjects = async (): Promise<Project[]> => {
  return Promise.resolve(projectsData);
};

export const getProjectById = async (id: string): Promise<Project | undefined> => {
  return Promise.resolve(projectsData.find(p => p.id === id));
};

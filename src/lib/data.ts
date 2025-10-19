
import { PlaceHolderImages } from './placeholder-images';

export interface Task {
  id: string;
  description: string;
  assignee: { name: string; initials: string };
  priority: 'Alta' | 'Media' | 'Baja';
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
  projectType: 'Comercial' | 'Residencial' | 'Industrial';
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
        name: 'Residencia en Calle Maple',
        address: '123 Calle Maple, Springfield',
        client: 'Los Simpsons',
        startDate: new Date('2023-01-15'),
        projectType: 'Residencial',
        coverPhotoUrl: findImage('project-cover-2').imageUrl,
        coverPhotoHint: findImage('project-cover-2').imageHint,
        tasks: [
            { id: 'task-1', description: 'Trabajos de cimentación', assignee: { name: 'Bob el Constructor', initials: 'BC' }, priority: 'Alta', completed: true },
            { id: 'task-2', description: 'Estructura de madera', assignee: { name: 'Wendy', initials: 'W' }, priority: 'Alta', completed: true },
            { id: 'task-3', description: 'Cableado eléctrico', assignee: { name: 'Chispitas', initials: 'C' }, priority: 'Media', completed: false },
            { id: 'task-4', description: 'Instalación de fontanería', assignee: { name: 'Mario', initials: 'M' }, priority: 'Media', completed: false },
        ],
        photos: [
            { id: 'photo-1', url: findImage('project-gallery-2').imageUrl, hint: findImage('project-gallery-2').imageHint, comment: 'Cimentación vertida y curada.', capturedAt: new Date('2023-01-20') },
            { id: 'photo-2', url: findImage('project-gallery-1').imageUrl, hint: findImage('project-gallery-1').imageHint, comment: 'Cableado inicial para la planta principal.', capturedAt: new Date('2023-02-10') },
        ],
        visits: [
            { id: 'visit-1', date: new Date('2023-01-18'), phase: 'Cimentación', attendees: ['Tom, Jane, Mike'], observations: 'La cimentación se ve sólida. No se observaron grietas. Lista para la estructura.' },
            { id: 'visit-2', date: new Date('2023-02-05'), phase: 'Estructura', attendees: ['Tom, Sarah'], observations: 'La estructura está completa y cumple con el código. Se necesitan algunos ajustes en la pared oeste.' },
        ],
    },
    {
        id: 'proj-2',
        name: 'Torre de Oficinas del Centro',
        address: '456 Av. Financiera, Metrópolis',
        client: 'LexCorp',
        startDate: new Date('2022-09-01'),
        projectType: 'Comercial',
        coverPhotoUrl: findImage('project-cover-1').imageUrl,
        coverPhotoHint: findImage('project-cover-1').imageHint,
        tasks: [
            { id: 'task-5', description: 'Preparación del sitio', assignee: { name: 'Bob el Constructor', initials: 'BC' }, priority: 'Alta', completed: true },
            { id: 'task-6', description: 'Montaje de la estructura de acero', assignee: { name: 'Wendy', initials: 'W' }, priority: 'Alta', completed: true },
        ],
        photos: [
            { id: 'photo-3', url: findImage('project-gallery-3').imageUrl, hint: findImage('project-gallery-3').imageHint, comment: 'Instalación inicial de fontanería para los primeros 10 pisos.', capturedAt: new Date('2023-03-15') },
        ],
        visits: [
            { id: 'visit-3', date: new Date('2022-09-10'), phase: 'Pre-construcción', attendees: ['Lex, Tom'], observations: 'Estudio final del sitio completado. Listo para empezar la excavación.' },
        ],
    },
    {
        id: 'proj-3',
        name: 'Parque Industrial Oak Valley',
        address: '789 Vía Industrial, Gotham',
        client: 'Empresas Wayne',
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

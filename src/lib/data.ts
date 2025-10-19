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

const projectsData: Project[] = [];

export const getProjects = (): Project[] => {
  return projectsData;
};

export const getProjectById = (id: string): Project | undefined => {
  return projectsData.find(p => p.id === id);
};

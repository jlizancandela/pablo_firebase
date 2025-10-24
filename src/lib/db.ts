
import Dexie, { Table } from 'dexie';
import type { Project, Task, Photo, Visit, WorkLog } from './data';
import { getInitialPhases } from './data';
import { v4 as uuidv4 } from 'uuid';
import { PlaceHolderImages } from './placeholder-images';

// Extend Project type for local DB (e.g., using string IDs)
export interface ProjectWithId extends Project {
    id: string;
}

export class ConstructPabloDexie extends Dexie {
    projects!: Table<ProjectWithId>;
    workLogs!: Table<WorkLog, string>;

    constructor() {
        super('ConstructPabloDB');
        this.version(2).stores({
            projects: '++id, name, client',
            workLogs: '++id, projectId, date',
        });
        // The upgrade function for version 1 is now implicitly handled by Dexie.
        // When a user opens the app with an older DB, Dexie sees version 2 and the new 'workLogs' store,
        // and it will automatically create it.
    }

    // Method to add a new project
    async addProject(projectData: Omit<Project, 'id' | 'startDate' | 'coverPhotoUrl' | 'coverPhotoHint' | 'tasks' | 'photos' | 'visits' | 'phases'>) {
        const randomImageIndex = Math.floor(Math.random() * PlaceHolderImages.length);
        const newProject: ProjectWithId = {
            ...projectData,
            id: uuidv4(),
            startDate: new Date(),
            coverPhotoUrl: PlaceHolderImages[randomImageIndex].imageUrl,
            coverPhotoHint: PlaceHolderImages[randomImageIndex].imageHint,
            tasks: [],
            photos: [],

            visits: [],
            phases: getInitialPhases(),
        };
        return await this.projects.add(newProject);
    }
    
    async addPhotoToProject(projectId: string, photo: Photo): Promise<void> {
        await this.projects.where('id').equals(projectId).modify(p => {
            p.photos.push(photo);
        });
    }
}

export const db = new ConstructPabloDexie();

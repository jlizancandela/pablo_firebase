
import Dexie, { Table } from 'dexie';
import type { Project, Task, Photo, Visit, FileAttachment } from './data';
import { getInitialPhases } from './data';
import { v4 as uuidv4 } from 'uuid';
import { PlaceHolderImages } from './placeholder-images';

// Extend Project type for local DB (e.g., using string IDs)
export interface ProjectWithId extends Project {
    id: string;
}

export class ConstructWiseDexie extends Dexie {
    projects!: Table<ProjectWithId>;

    constructor() {
        super('ConstructWiseDB');
        this.version(1).stores({
            projects: '++id, name, client', // Define an auto-incrementing primary key 'id' and index other fields
        });
    }

    // Method to add a new project
    async addProject(projectData: Omit<Project, 'id' | 'startDate' | 'coverPhotoUrl' | 'coverPhotoHint' | 'tasks' | 'photos' | 'visits' | 'files' | 'phases'>) {
        const randomImageIndex = Math.floor(Math.random() * 4);
        const newProject: ProjectWithId = {
            ...projectData,
            id: uuidv4(),
            startDate: new Date(),
            coverPhotoUrl: PlaceHolderImages[randomImageIndex].imageUrl,
            coverPhotoHint: PlaceHolderImages[randomImageIndex].imageHint,
            tasks: [],
            photos: [],
            visits: [],
            files: [],
            phases: getInitialPhases(),
        };
        return await this.projects.add(newProject);
    }
    
    async addPhotoToProject(projectId: string, photo: Photo): Promise<void> {
        await this.projects.update(projectId, {
            photos: Dexie.currentChallenge.value.photos.concat(photo)
        });
    }
}

export const db = new ConstructWiseDexie();

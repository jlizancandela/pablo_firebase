
export type FieldType = 'checkbox' | 'text' | 'number' | 'date' | 'file' | 'selector';
export type PhaseStatus = 'No iniciada' | 'En curso' | 'Completada';
export type CheckpointStatus = 'No iniciado' | 'En curso' | 'Completado';

export interface FileAttachment {
  id: string;
  name: string;
  url: string;
  fileType: 'pdf' | 'dwg' | 'doc' | 'xls';
  uploadedAt: any; // Date or Firestore Timestamp
  phase: string;
}

export interface Field {
  id: string;
  label: string;
  type: FieldType;
  value: string | number | boolean | any | null; // Date or Firestore Timestamp
  options?: string[]; // For 'selector' type
  required: boolean;
}

export interface Checkpoint {
  id: string;
  title: string;
  status: CheckpointStatus;
  fields: Field[];
}

export interface Phase {
  id: string;
  title: string;
  objective: string;
  status: PhaseStatus;
  checkpoints: Checkpoint[];
  closingCriteria: string;
}

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
  capturedAt: any; // Date or Firestore Timestamp
}

export interface Visit {
  id: string;
  date: any; // Date or Firestore Timestamp
  phase: string;
  attendees: string[];
  observations: string;
}

export interface Project {
  id: string;
  name: string;
  address: string;
  client: string;
  startDate: any; // Date or Firestore Timestamp
  projectType: 'Comercial' | 'Residencial' | 'Industrial';
  coverPhotoUrl: string;
  coverPhotoHint: string;
  tasks: Task[];
  photos: Photo[];
  visits: Visit[];
  phases: Phase[];
  files: FileAttachment[];
}

    
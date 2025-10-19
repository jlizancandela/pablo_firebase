
import { PlaceHolderImages } from './placeholder-images';

// --- NUEVAS INTERFACES PARA FASES DE OBRA ---
export type FieldType = 'checkbox' | 'text' | 'number' | 'date' | 'file' | 'selector';
export type PhaseStatus = 'No iniciada' | 'En curso' | 'Completada';
export type CheckpointStatus = 'No iniciado' | 'En curso' | 'Completado';

export interface FileAttachment {
  id: string;
  name: string;
  url: string;
  fileType: 'pdf' | 'dwg' | 'doc' | 'xls';
  uploadedAt: Date;
  phase: string;
}

export interface Field {
  id: string;
  label: string;
  type: FieldType;
  value: string | number | boolean | Date | null;
  options?: string[]; // Para el tipo 'selector'
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

// --- INTERFACES EXISTENTES (MODIFICADAS) ---
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
  phases: Phase[];
  files: FileAttachment[];
}

const findImage = (id: string) => PlaceHolderImages.find(img => img.id === id) || { imageUrl: '', imageHint: '' };

// --- DATOS DE EJEMPLO CON FASES ---
const projectPhases: Phase[] = [
    {
        id: "phase-1",
        title: "FASE 1: PREVIA / DEFINICIÓN",
        objective: "Validar la viabilidad técnica, económica y administrativa del proyecto antes de desarrollar el proyecto técnico.",
        status: "Completada",
        closingCriteria: "Todos los checkpoints marcados como completados",
        checkpoints: [
            { id: "cp-1.1", title: "Levantamiento del estado actual", status: "Completado", fields: [{ id: "f-1.1.1", label: "Planos actuales adjuntados", type: "checkbox", value: true, required: true }] },
            { id: "cp-1.2", title: "Análisis de patologías", status: "Completado", fields: [{ id: "f-1.2.1", label: "Patologías identificadas", type: "checkbox", value: true, required: true }] },
            { id: "cp-1.3", title: "Análisis normativo y urbanístico", status: "Completado", fields: [{ id: "f-1.3.1", label: "Normativa aplicable consultada", type: "checkbox", value: true, required: true }] },
            { id: "cp-1.4", title: "Servidumbres y comunidad", status: "Completado", fields: [{ id: "f-1.4.1", label: "Servidumbres verificadas", type: "checkbox", value: true, required: true }] },
            { id: "cp-1.5", title: "Estudio de viabilidad", status: "Completado", fields: [{ id: "f-1.5.1", label: "Viabilidad técnica confirmada", type: "checkbox", value: true, required: true }] },
            { id: "cp-1.6", title: "Programa de necesidades del cliente", status: "Completado", fields: [{ id: "f-1.6.1", label: "Programa completado", type: "checkbox", value: true, required: true }] },
            { id: "cp-1.7", title: "Anteproyecto validado", status: "Completado", fields: [{ id: "f-1.7.1", label: "Anteproyecto elaborado", type: "checkbox", value: true, required: true }] },
            { id: "cp-1.8", title: "Presupuesto objetivo aprobado", status: "Completado", fields: [{ id: "f-1.8.1", label: "Presupuesto objetivo definido", type: "checkbox", value: true, required: true }] },
        ]
    },
    {
        id: "phase-2",
        title: "FASE 2: PROYECTO TÉCNICO",
        objective: "Desarrollar la documentación técnica completa y detallada para la ejecución de la obra.",
        status: "En curso",
        closingCriteria: "Todos los checkpoints completados (visado solo si aplica)",
        checkpoints: [
            { id: "cp-2.1", title: "Proyecto básico redactado", status: "Completado", fields: [{ id: "f-2.1.1", label: "Proyecto básico completado", type: "checkbox", value: true, required: true }] },
            { id: "cp-2.2", title: "Proyecto de ejecución completo", status: "No iniciado", fields: [{ id: "f-2.2.1", label: "Proyecto de ejecución desarrollado", type: "file", value: false, required: true }] },
        ]
    },
    // Las demás fases se añadirían aquí...
    { id: "phase-3", title: "FASE 3: TRAMITACIONES Y LICENCIAS", objective: "Obtener los permisos administrativos necesarios para iniciar la obra.", status: "No iniciada", closingCriteria: "Licencia vigente + seguros + comunicaciones completadas", checkpoints: [] },
    { id: "phase-4", title: "FASE 4: CONTRATACIÓN", objective: "Seleccionar y formalizar los contratos con la empresa constructora.", status: "No iniciada", closingCriteria: "Contrato firmado + cronograma + documentación de empresas", checkpoints: [] },
    { id: "phase-5", title: "FASE 5: PREPARACIÓN DE OBRA", objective: "Preparar el terreno y organizar los recursos para iniciar la ejecución.", status: "No iniciada", closingCriteria: "Acta de comienzo + PSS aprobado + organización completada", checkpoints: [] },
    { id: "phase-6", title: "FASE 6: EJECUCIÓN - ESTRUCTURA", objective: "Completar la estructura del edificio con control de calidad y seguridad.", status: "No iniciada", closingCriteria: "Estructura completada al 100% y certificada", checkpoints: [] },
    { id: "phase-7", title: "FASE 7: EJECUCIÓN - CERRAMIENTOS Y CUBIERTAS", objective: "Cerrar el edificio para protegerlo de agentes atmosféricos.", status: "No iniciada", closingCriteria: "Edificio cerrado y protegido (todas tareas Sí)", checkpoints: [] },
    { id: "phase-8", title: "FASE 8: EJECUCIÓN - PARTICIONES INTERIORES", objective: "Definir los espacios interiores y preparar para instalaciones.", status: "No iniciada", closingCriteria: "Todos los campos al 100% en 'Sí'", checkpoints: [] },
    { id: "phase-9", title: "FASE 9: INSTALACIONES", objective: "Ejecutar y probar todas las instalaciones técnicas del edificio.", status: "No iniciada", closingCriteria: "Todas las instalaciones realizadas y aceptadas", checkpoints: [] },
    { id: "phase-10", title: "FASE 10: ACABADOS Y REMATES", objective: "Terminar la obra con todos los acabados finales.", status: "No iniciada", closingCriteria: "Obra completamente acabada (todos Sí)", checkpoints: [] },
    { id: "phase-11", title: "FASE 11: CIERRE DE OBRA", objective: "Finalizar administrativamente la obra y entregarla al cliente.", status: "No iniciada", closingCriteria: "Acta de recepción firmada + liquidación cerrada", checkpoints: [] },
    { id: "phase-12", title: "FASE 12: POST-OBRA (Seguimiento)", objective: "Realizar seguimiento y gestión de garantía durante 12 meses.", status: "No iniciada", closingCriteria: "Revisión a 12 meses completada + incidencias resueltas", checkpoints: [] },
];

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
        phases: projectPhases,
        files: [
            { id: 'file-1', name: 'Planos Estructurales.pdf', url: '#', fileType: 'pdf', uploadedAt: new Date('2023-01-10'), phase: 'FASE 2' },
            { id: 'file-2', name: 'Contrato de Obra.doc', url: '#', fileType: 'doc', uploadedAt: new Date('2023-01-12'), phase: 'FASE 4' },
            { id: 'file-3', name: 'Licencia Municipal.pdf', url: '#', fileType: 'pdf', uploadedAt: new Date('2023-02-20'), phase: 'FASE 3' },
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
        phases: projectPhases.map(p => ({...p, status: 'No iniciada', checkpoints: p.checkpoints.map(c => ({...c, status: 'No iniciado'})) })),
        files: [],
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
        files: [],
        phases: projectPhases.map(p => ({...p, status: 'No iniciada', checkpoints: p.checkpoints.map(c => ({...c, status: 'No iniciado'})) })),
    }
];

export const getProjects = async (): Promise<Project[]> => {
  return Promise.resolve(projectsData);
};

export const getProjectById = async (id: string): Promise<Project | undefined> => {
  return Promise.resolve(projectsData.find(p => p.id === id));
};

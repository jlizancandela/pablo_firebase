
import { v4 as uuidv4 } from 'uuid';

export type FieldType = 'checkbox' | 'text' | 'number' | 'date' | 'file' | 'selector';
export type PhaseStatus = 'No iniciada' | 'En curso' | 'Completada';
export type CheckpointStatus = 'No iniciado' | 'En curso' | 'Completado';

export interface FileAttachment {
  id: string;
  name: string;
  url: string; // Will store blob url
  fileType: 'pdf' | 'dwg' | 'doc' | 'xls';
  uploadedAt: Date;
  phase: string;
}

export interface Field {
  id: string;
  label: string;
  type: FieldType;
  value: string | number | boolean | Date | null;
  options?: string[]; // For 'selector' type
  required: boolean;
}

export interface Checkpoint {
  id: string;
  title: string;
  status: CheckpointStatus;
  fields: Field[];
  notes?: string;
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
  url: string; // Will store blob url
  hint: string;
  comment: string | null;
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
}

const createCheckpoint = (title: string): Checkpoint => ({
  id: uuidv4(),
  title,
  status: 'No iniciado',
  fields: [],
  notes: '',
});

export const getInitialPhases = (): Phase[] => [
    // 1. FASE PREVIA Y DOCUMENTAL
    {
      id: uuidv4(),
      title: "1. FASE PREVIA Y DOCUMENTAL",
      objective: "Definir y documentar el proyecto, y obtener las licencias necesarias.",
      status: "No iniciada",
      closingCriteria: "Todas las contrataciones y documentos preliminares completados y licencia obtenida.",
      checkpoints: [
        createCheckpoint("Contratación de Arquitecto"),
        createCheckpoint("Contratación de Arquitecto técnico"),
        createCheckpoint("Elaboración del proyecto básico"),
        createCheckpoint("Contratación de ingeniero"),
        createCheckpoint("Contratación de laboratorio para geotécnico"),
        createCheckpoint("Elaboración de estudio geotécnico"),
        createCheckpoint("Petición de licencia al ayuntamiento"),
        createCheckpoint("Concesión de licencia del ayuntamiento"),
        createCheckpoint("Elaboración del proyecto de ejecución"),
        createCheckpoint("Contratación de oficios, constructora"),
        createCheckpoint("Contratación de laboratorio de control"),
        createCheckpoint("Contratación de seguros"),
        createCheckpoint("Apertura de centro de trabajo"),
        createCheckpoint("Plan de Seguridad y Salud"),
        createCheckpoint("Coordinación de seguridad designada"),
        createCheckpoint("Gestión de corte de calle / ocupación de vía pública"),
        createCheckpoint("Contratación de suministro de agua de obra"),
        createCheckpoint("Contratación de suministro de luz de obra"),
      ],
    },
    // 2. IMPLANTACIÓN Y MOVIMIENTOS PREVIOS
    {
        id: uuidv4(),
        title: "2. IMPLANTACIÓN Y MOVIMIENTOS PREVIOS",
        objective: "Preparar el terreno para la construcción.",
        status: "No iniciada",
        closingCriteria: "Terreno listo y servicios básicos de obra operativos.",
        checkpoints: [
            createCheckpoint("Acta de replanteo"),
            createCheckpoint("Limpieza y desbroce"),
            createCheckpoint("Movimiento de tierras"),
            createCheckpoint("Saneamiento enterrado / drenajes"),
            createCheckpoint("Toma de tierra"),
            createCheckpoint("Pruebas de hormigón iniciales"),
        ],
    },
    // 3. CIMENTACIÓN
    {
        id: uuidv4(),
        title: "3. CIMENTACIÓN",
        objective: "Construir la base del edificio.",
        status: "No iniciada",
        closingCriteria: "Cimentación completada y validada por control de calidad.",
        checkpoints: [
            createCheckpoint("Excavación de zapatas / losas"),
            createCheckpoint("Encofrado y armaduras"),
            createCheckpoint("Vertido de hormigón"),
            createCheckpoint("Curado del hormigón"),
            createCheckpoint("Ensayos de probetas / control de resistencia"),
        ],
    },
    // 4. ESTRUCTURA
    {
        id: uuidv4(),
        title: "4. ESTRUCTURA",
        objective: "Levantar el esqueleto del edificio.",
        status: "No iniciada",
        closingCriteria: "Estructura principal finalizada y suministros definitivos gestionados.",
        checkpoints: [
            createCheckpoint("Pilares y vigas"),
            createCheckpoint("Forjados"),
            createCheckpoint("Escaleras / núcleos"),
            createCheckpoint("Apuntalamientos / desencofrado"),
            createCheckpoint("Curado y controles de Resistencia"),
            createCheckpoint("Solicitud de anexos de acometidas a compañías suministradoras (agua y luz)"),
            createCheckpoint("Solicitud de informes favorables al ayuntamiento"),
            createCheckpoint("Contratación de suministros definitivos (agua y luz)"),
        ],
    },
    // 5. CERRAMIENTOS Y PARTICIONES
    {
        id: uuidv4(),
        title: "5. CERRAMIENTOS Y PARTICIONES",
        objective: "Definir los espacios exteriores e interiores.",
        status: "No iniciada",
        closingCriteria: "Envolvente del edificio y divisiones internas completadas.",
        checkpoints: [
            createCheckpoint("Medianera: hoja exterior"),
            createCheckpoint("Fachada: hoja exterior"),
            createCheckpoint("Fachada: aislamiento y cámara"),
            createCheckpoint("Fachada: hoja interior"),
            createCheckpoint("Colocación de premarcos para carpinterías exteriores"),
            createCheckpoint("Tabiquerías y trasdosados, perfilería y en su caso una placa"),
            createCheckpoint("Colocación de premarcos para carpinterías"),
            createCheckpoint("Tabiquerías y trasdosados, cerramiento de placas y masillado"),
            createCheckpoint("Colocación de carpinterías exteriores"),
            createCheckpoint("Sellado"),
            createCheckpoint("Colocación de vierteaguas"),
            createCheckpoint("Colocación de remates laterales en ventanas"),
        ],
    },
    // 6. CUBIERTA
    {
        id: uuidv4(),
        title: "6. CUBIERTA",
        objective: "Finalizar el techo del edificio, asegurando su estanqueidad.",
        status: "No iniciada",
        closingCriteria: "Cubierta terminada y probada.",
        checkpoints: [
            createCheckpoint("Formación de pendientes"),
            createCheckpoint("Impermeabilización"),
            createCheckpoint("Aislamiento térmico"),
            createCheckpoint("Acabado y remates"),
            createCheckpoint("Pruebas de estanqueidad"),
        ],
    },
    // 7. INSTALACIONES
    {
        id: uuidv4(),
        title: "7. INSTALACIONES",
        objective: "Dotar al edificio de todos los servicios necesarios.",
        status: "No iniciada",
        closingCriteria: "Todas las instalaciones completadas y funcionales.",
        checkpoints: [
            createCheckpoint("Electricidad: preinstalación (rozas, canalizaciones)"),
            createCheckpoint("Telecomunicaciones / datos"),
            createCheckpoint("Fontanería: preinstalación"),
            createCheckpoint("Saneamiento: preinstalación"),
            createCheckpoint("Climatización: preinstalación"),
            createCheckpoint("Placas solares / ACS: preinstalación"),
            createCheckpoint("Gas / energías"),
            createCheckpoint("Electricidad: instalación (cableado, cuadros)"),
            createCheckpoint("Fontanería: instalación"),
            createCheckpoint("Saneamiento: instalación"),
            createCheckpoint("Climatización: colocación de maquinaria"),
            createCheckpoint("Placas solares / ACS: instalación final"),
        ],
    },
    // 8. REVESTIMIENTOS Y ACABADOS
    {
        id: uuidv4(),
        title: "8. REVESTIMIENTOS Y ACABADOS",
        objective: "Aplicar los acabados finales a suelos, paredes y techos.",
        status: "No iniciada",
        closingCriteria: "Todos los revestimientos y acabados completados.",
        checkpoints: [
            createCheckpoint("Enfoscados / yesos – zonas comunes"),
            createCheckpoint("Enfoscados / yesos – zonas privadas"),
            createCheckpoint("Pavimentos – zonas comunes"),
            createCheckpoint("Pavimentos – zonas privadas"),
            createCheckpoint("Alicatados / chapados – zonas comunes"),
            createCheckpoint("Alicatados / chapados – zonas privadas"),
            createCheckpoint("Acabado exterior mediante mortero monocapa"),
            createCheckpoint("Acabado exterior mediante pieza porcelánica"),
            createCheckpoint("Falsos techos – zonas comunes"),
            createCheckpoint("Falsos techos – zonas privadas"),
            createCheckpoint("Falsos techos - cortineros"),
            createCheckpoint("Carpintería interior"),
            createCheckpoint("Pintura – zonas comunes"),
            createCheckpoint("Pintura – zonas privadas"),
        ],
    },
    // 9. EQUIPAMIENTO Y URBANIZACIÓN
    {
        id: uuidv4(),
        title: "9. EQUIPAMIENTO Y URBANIZACIÓN",
        objective: "Instalar equipamiento final y finalizar áreas exteriores.",
        status: "No iniciada",
        closingCriteria: "Equipamiento interior y urbanización exterior finalizados.",
        checkpoints: [
            createCheckpoint("Aparatos sanitarios"),
            createCheckpoint("Mecanismos electricidad"),
            createCheckpoint("Rejillas climatización"),
            createCheckpoint("Mobiliario fijo / encimeras"),
            createCheckpoint("Barandillas / cerrajería"),
            createCheckpoint("Elementos exteriores / jardinería"),
        ],
    },
    // 10. PRUEBAS Y LEGALIZACIONES
    {
        id: uuidv4(),
        title: "10. PRUEBAS Y LEGALIZACIONES",
        objective: "Verificar el correcto funcionamiento y legalizar la construcción.",
        status: "No iniciada",
        closingCriteria: "Todas las pruebas superadas y legalizaciones obtenidas.",
        checkpoints: [
            createCheckpoint("Pruebas de instalaciones"),
            createCheckpoint("Boletines / legalizaciones / OCA"),
            createCheckpoint("Certificado energético"),
            createCheckpoint("Certificado final de obra"),
        ],
    },
    // 11. DOCUMENTACIÓN FINAL Y CIERRE
    {
        id: uuidv4(),
        title: "11. DOCUMENTACIÓN FINAL Y CIERRE",
        objective: "Entregar la obra y toda la documentación al cliente.",
        status: "No iniciada",
        closingCriteria: "Entrega de llaves y documentación finalizada.",
        checkpoints: [
            createCheckpoint('Planos "As Built"'),
            createCheckpoint("Manual de uso y mantenimiento"),
            createCheckpoint("Libro del edificio"),
            createCheckpoint("Certificados y garantías finales"),
            createCheckpoint("Limpieza final"),
            createCheckpoint("Lista de repasos"),
            createCheckpoint("Acta de recepción del edificio"),
            createCheckpoint("Entrega de llaves"),
        ],
    },
];

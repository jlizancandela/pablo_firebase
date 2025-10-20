
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

export const getInitialPhases = (): Phase[] => [
    // FASE 1: PREVIA / DEFINICIÓN
    {
      id: "phase_1",
      title: "FASE 1: PREVIA / DEFINICIÓN",
      objective: "Validar la viabilidad técnica, económica y administrativa del proyecto antes de desarrollar el proyecto técnico.",
      status: "No iniciada",
      closingCriteria: "Todos los checkpoints marcados como completados",
      checkpoints: [
        { id: "cp_1_1", title: "1.1 - Levantamiento del estado actual", status: "No iniciado", fields: [
          { id: "field_1_1_1", label: "Planos actuales adjuntados", type: "checkbox", value: false, required: true },
          { id: "field_1_1_2", label: "Fotos de estado actual adjuntadas", type: "checkbox", value: false, required: true },
          { id: "field_1_1_3", label: "Mediciones realizadas", type: "checkbox", value: false, required: true },
          { id: "field_1_1_4", label: "Notas de observaciones", type: "text", value: "", required: false },
        ]},
        { id: "cp_1_2", title: "1.2 - Análisis de patologías", status: "No iniciado", fields: [
          { id: "field_1_2_1", label: "Patologías identificadas", type: "checkbox", value: false, required: true },
          { id: "field_1_2_2", label: "Puntos críticos descritos", type: "text", value: "", required: false },
          { id: "field_1_2_3", label: "Foto de patologías adjuntada", type: "checkbox", value: false, required: false },
        ]},
        { id: "cp_1_3", title: "1.3 - Análisis normativo y urbanístico", status: "No iniciado", fields: [
            { id: "field_1_3_1", label: "Normativa aplicable consultada", type: "checkbox", value: false, required: true },
            { id: "field_1_3_2", label: "Restricciones urbanísticas", type: "checkbox", value: false, required: true },
            { id: "field_1_3_3", label: "Documentos consultados adjuntados", type: "checkbox", value: false, required: false },
        ]},
        { id: "cp_1_4", title: "1.4 - Servidumbres y comunidad", status: "No iniciado", fields: [
            { id: "field_1_4_1", label: "Servidumbres verificadas", type: "checkbox", value: false, required: true },
            { id: "field_1_4_2", label: "Comunidad de propietarios contactada", type: "checkbox", value: false, required: true },
            { id: "field_1_4_3", label: "Restricciones identificadas", type: "text", value: "", required: false },
        ]},
        { id: "cp_1_5", title: "1.5 - Estudio de viabilidad", status: "No iniciado", fields: [
            { id: "field_1_5_1", label: "Viabilidad técnica confirmada", type: "checkbox", value: false, required: true },
            { id: "field_1_5_2", label: "Viabilidad económica confirmada", type: "checkbox", value: false, required: true },
            { id: "field_1_5_3", label: "Observaciones", type: "text", value: "", required: false },
        ]},
        { id: "cp_1_6", title: "1.6 - Programa de necesidades del cliente", status: "No iniciado", fields: [
            { id: "field_1_6_1", label: "Programa completado", type: "checkbox", value: false, required: true },
            { id: "field_1_6_2", label: "Presupuesto estimado inicial (€)", type: "number", value: null, required: true },
            { id: "field_1_6_3", label: "Plazo estimado (días)", type: "number", value: null, required: true },
        ]},
        { id: "cp_1_7", title: "1.7 - Anteproyecto validado", status: "No iniciado", fields: [
            { id: "field_1_7_1", label: "Anteproyecto elaborado", type: "checkbox", value: false, required: true },
            { id: "field_1_7_2", label: "Anteproyecto adjuntado", type: "checkbox", value: false, required: true },
            { id: "field_1_7_3", label: "Cliente validó anteproyecto", type: "checkbox", value: false, required: true },
        ]},
        { id: "cp_1_8", title: "1.8 - Presupuesto objetivo aprobado", status: "No iniciado", fields: [
            { id: "field_1_8_1", label: "Presupuesto objetivo definido (€)", type: "number", value: null, required: true },
            { id: "field_1_8_2", label: "Presupuesto aprobado por cliente", type: "checkbox", value: false, required: true },
            { id: "field_1_8_3", label: "Acta de aprobación adjuntada", type: "checkbox", value: false, required: false },
        ]},
      ]
    },
    // FASE 2: PROYECTO TÉCNICO
    {
      id: "phase_2",
      title: "FASE 2: PROYECTO TÉCNICO",
      objective: "Desarrollar la documentación técnica completa y detallada para la ejecución de la obra.",
      status: "No iniciada",
      closingCriteria: "Todos los checkpoints completados (visado solo si aplica)",
      checkpoints: [
          { id: "cp_2_1", title: "2.1 - Proyecto básico redactado", status: "No iniciado", fields: [
              { id: "field_2_1_1", label: "Proyecto básico completado", type: "checkbox", value: false, required: true },
              { id: "field_2_1_2", label: "Proyecto básico adjuntado", type: "checkbox", value: false, required: true },
              { id: "field_2_1_3", label: "Soluciones propuestas descritas", type: "text", value: "", required: false },
          ]},
          { id: "cp_2_2", title: "2.2 - Proyecto de ejecución completo", status: "No iniciado", fields: [
              { id: "field_2_2_1", label: "Proyecto de ejecución desarrollado", type: "checkbox", value: false, required: true },
              { id: "field_2_2_2", label: "Proyecto de ejecución adjuntado", type: "checkbox", value: false, required: true },
              { id: "field_2_2_3", label: "Número de planos", type: "number", value: null, required: true },
              { id: "field_2_2_4", label: "Número de especificaciones técnicas", type: "number", value: null, required: true },
          ]},
          { id: "cp_2_3", title: "2.3 - Coordinación de sistemas", status: "No iniciado", fields: [
            { id: "field_2_3_1", label: "Coordinación estructura-instalaciones-acabados", type: "checkbox", value: false, required: true },
            { id: "field_2_3_2", label: "Documentos de coordinación adjuntados", type: "checkbox", value: false, required: true },
            { id: "field_2_3_3", label: "Interferencias detectadas y resueltas", type: "checkbox", value: false, required: true },
            { id: "field_2_3_4", label: "Detalles de resolución", type: "text", value: "", required: false },
          ]},
          { id: "cp_2_4", title: "2.4 - Mediciones y pliegos", status: "No iniciado", fields: [
              { id: "field_2_4_1", label: "Mediciones realizadas", type: "checkbox", value: false, required: true },
              { id: "field_2_4_2", label: "Pliego de condiciones técnicas", type: "checkbox", value: false, required: true },
              { id: "field_2_4_3", label: "Documentos adjuntados", type: "checkbox", value: false, required: true },
          ]},
          { id: "cp_2_5", title: "2.5 - Revisión de interferencias", status: "No iniciado", fields: [
              { id: "field_2_5_1", label: "Revisión cruzada completada", type: "checkbox", value: false, required: true },
              { id: "field_2_5_2", label: "Matriz de interferencias elaborada", type: "checkbox", value: false, required: true },
              { id: "field_2_5_3", label: "Matriz adjuntada", type: "checkbox", value: false, required: false },
              { id: "field_2_5_4", label: "Conflictos resueltos", type: "checkbox", value: false, required: true },
          ]},
          { id: "cp_2_6", title: "2.6 - Documentación lista para visado", status: "No iniciado", fields: [
              { id: "field_2_6_1", label: "Toda documentación recopilada", type: "checkbox", value: false, required: true },
              { id: "field_2_6_2", label: "Documentación revisada", type: "checkbox", value: false, required: true },
              { id: "field_2_6_3", label: "Carpeta completa adjuntada", type: "checkbox", value: false, required: true },
          ]},
          { id: "cp_2_7", title: "2.7 - Visado colegial (opcional)", status: "No iniciado", fields: [
              { id: "field_2_7_1", label: "Visado requerido", type: "checkbox", value: false, required: false },
              { id: "field_2_7_2", label: "Solicitud de visado presentada", type: "checkbox", value: false, required: false },
              { id: "field_2_7_3", label: "Certificado de visado adjuntado", type: "checkbox", value: false, required: false },
          ]},
      ]
    },
    // FASE 3: TRAMITACIONES Y LICENCIAS
    {
        id: "phase_3",
        title: "FASE 3: TRAMITACIONES Y LICENCIAS",
        objective: "Obtener los permisos administrativos necesarios para iniciar la obra.",
        status: "No iniciada",
        closingCriteria: "Licencia vigente + seguros + comunicaciones completadas",
        checkpoints: [
            { id: "cp_3_1", title: "3.1 - Licencia de obra", status: "No iniciado", fields: [
                { id: "field_3_1_1", label: "Tipo de obra", type: "selector", options: ["Licencia municipal", "Declaración responsable"], value: "Licencia municipal", required: true },
                { id: "field_3_1_2", label: "Solicitud presentada", type: "checkbox", value: false, required: true },
                { id: "field_3_1_3", label: "Fecha de presentación", type: "date", value: null, required: true },
                { id: "field_3_1_4", label: "Número de expediente", type: "text", value: "", required: false },
                { id: "field_3_1_5", label: "Licencia/declaración adjuntada", type: "checkbox", value: false, required: true },
                { id: "field_3_1_6", label: "Licencia vigente", type: "checkbox", value: false, required: true },
            ]},
            { id: "cp_3_2", title: "3.2 - Tasas e ICIO", status: "No iniciado", fields: [
                { id: "field_3_2_1", label: "Tasas municipales pagadas", type: "checkbox", value: false, required: true },
                { id: "field_3_2_2", label: "Importe ICIO (€)", type: "number", value: null, required: true },
                { id: "field_3_2_3", label: "ICIO pagado", type: "checkbox", value: false, required: true },
                { id: "field_3_2_4", label: "Justificantes adjuntados", type: "checkbox", value: false, required: true },
            ]},
            { id: "cp_3_3", title: "3.3 - Comunicaciones a terceros", status: "No iniciado", fields: [
                { id: "field_3_3_1", label: "Comunidad de propietarios comunicada", type: "checkbox", value: false, required: true },
                { id: "field_3_3_2", label: "Colindantes comunicados", type: "checkbox", value: false, required: true },
                { id: "field_3_3_3", label: "Fecha comunicación", type: "date", value: null, required: true },
                { id: "field_3_3_4", label: "Actas o correos adjuntados", type: "checkbox", value: false, required: false },
            ]},
            { id: "cp_3_4", title: "3.4 - Seguros y altas de suministros", status: "No iniciado", fields: [
                { id: "field_3_4_1", label: "Seguro RC de obra contratado", type: "checkbox", value: false, required: true },
                { id: "field_3_4_2", label: "Póliza de RC adjuntada", type: "checkbox", value: false, required: true },
                { id: "field_3_4_3", label: "Agua - alta/modificación solicitada", type: "checkbox", value: false, required: true },
                { id: "field_3_4_4", label: "Electricidad - alta/modificación solicitada", type: "checkbox", value: false, required: true },
                { id: "field_3_4_5", label: "Gas - alta/modificación solicitada", type: "checkbox", value: false, required: false },
                { id: "field_3_4_6", label: "Justificantes adjuntados", type: "checkbox", value: false, required: false },
            ]},
        ]
    },
    // FASE 4: CONTRATACIÓN
    {
        id: "phase_4",
        title: "FASE 4: CONTRATACIÓN",
        objective: "Seleccionar y formalizar los contratos con la empresa constructora.",
        status: "No iniciada",
        closingCriteria: "Contrato firmado + cronograma + documentación de empresas",
        checkpoints: [
            { id: "cp_4_1", title: "4.1 - Presupuesto detallado", status: "No iniciado", fields: [
                { id: "field_4_1_1", label: "Presupuesto desglosado por capítulos", type: "checkbox", value: false, required: true },
                { id: "field_4_1_2", label: "Presupuesto adjuntado", type: "checkbox", value: false, required: true },
                { id: "field_4_1_3", label: "Importe total (€)", type: "number", value: null, required: true },
            ]},
            { id: "cp_4_2", title: "4.2 - Solicitud y análisis de ofertas", status: "No iniciado", fields: [
                { id: "field_4_2_1", label: "Número de empresas consultadas", type: "number", value: null, required: true },
                { id: "field_4_2_2", label: "Ofertas recibidas", type: "number", value: null, required: true },
                { id: "field_4_2_3", label: "Ofertas adjuntadas", type: "checkbox", value: false, required: false },
            ]},
            { id: "cp_4_3", title: "4.3 - Análisis técnico-económico", status: "No iniciado", fields: [
                { id: "field_4_3_1", label: "Comparativa de ofertas realizada", type: "checkbox", value: false, required: true },
                { id: "field_4_3_2", label: "Tabla comparativa adjuntada", type: "checkbox", value: false, required: true },
                { id: "field_4_3_3", label: "Empresa seleccionada", type: "selector", options: [], value: "", required: true }, // Options added dynamically
                { id: "field_4_3_4", label: "Criterios de selección explicados", type: "text", value: "", required: false },
            ]},
            { id: "cp_4_4", title: "4.4 - Verificación documental de empresas", status: "No iniciado", fields: [
                { id: "field_4_4_1", label: "Seguridad Social verificada", type: "checkbox", value: false, required: true },
                { id: "field_4_4_2", label: "PRL verificado", type: "checkbox", value: false, required: true },
                { id: "field_4_4_3", label: "Solvencia económica verificada", type: "checkbox", value: false, required: true },
                { id: "field_4_4_4", label: "Seguros RC verificados", type: "checkbox", value: false, required: true },
                { id: "field_4_4_5", label: "Documentos adjuntados", type: "checkbox", value: false, required: false },
            ]},
            { id: "cp_4_5", title: "4.5 - Contrato de obra firmado", status: "No iniciado", fields: [
                { id: "field_4_5_1", label: "Contrato elaborado", type: "checkbox", value: false, required: true },
                { id: "field_4_5_2", label: "Contrato adjuntado", type: "checkbox", value: false, required: true },
                { id: "field_4_5_3", label: "Contrato firmado", type: "checkbox", value: false, required: true },
                { id: "field_4_5_4", label: "Fecha de firma", type: "date", value: null, required: true },
            ]},
            { id: "cp_4_6", title: "4.6 - Cronograma validado", status: "No iniciado", fields: [
                { id: "field_4_6_1", label: "Cronograma adjuntado", type: "checkbox", value: false, required: true },
                { id: "field_4_6_2", label: "Plazo de ejecución en días", type: "number", value: null, required: true },
                { id: "field_4_6_3", label: "Inicio previsto", type: "date", value: null, required: true },
                { id: "field_4_6_4", label: "Fin previsto", type: "date", value: null, required: true },
                { id: "field_4_6_5", label: "Cronograma aprobado", type: "checkbox", value: false, required: true },
            ]},
            { id: "cp_4_7", title: "4.7 - Plan de pagos y certificaciones", status: "No iniciado", fields: [
                { id: "field_4_7_1", label: "Plan de pagos definido", type: "checkbox", value: false, required: true },
                { id: "field_4_7_2", label: "Plan adjuntado", type: "checkbox", value: false, required: true },
                { id: "field_4_7_3", label: "Número de certificaciones previstas", type: "number", value: null, required: true },
                { id: "field_4_7_4", label: "Fecha de primer pago", type: "date", value: null, required: true },
            ]},
        ]
    },
    // FASE 5: PREPARACIÓN DE OBRA
    {
        id: "phase_5",
        title: "FASE 5: PREPARACIÓN DE OBRA",
        objective: "Preparar el terreno y organizar los recursos para iniciar la ejecución.",
        status: "No iniciada",
        closingCriteria: "Acta de comienzo + PSS aprobado + organización completada",
        checkpoints: [
            { id: "cp_5_1", title: "5.1 - Replanteo topográfico", status: "No iniciado", fields: [
                { id: "field_5_1_1", label: "Replanteo realizado", type: "checkbox", value: false, required: true },
                { id: "field_5_1_2", label: "Acta de replanteo adjuntada", type: "checkbox", value: false, required: true },
                { id: "field_5_1_3", label: "Cotas verificadas", type: "checkbox", value: false, required: true },
                { id: "field_5_1_4", label: "Referencias establecidas", type: "checkbox", value: false, required: true },
            ]},
            { id: "cp_5_2", title: "5.2 - Plan de Seguridad y Salud", status: "No iniciado", fields: [
                { id: "field_5_2_1", label: "PSS elaborado", type: "checkbox", value: false, required: true },
                { id: "field_5_2_2", label: "PSS adjuntado", type: "checkbox", value: false, required: true },
                { id: "field_5_2_3", label: "PSS aprobado por administración", type: "checkbox", value: false, required: true },
                { id: "field_5_2_4", label: "Coordinador de seguridad designado", type: "checkbox", value: false, required: true },
                { id: "field_5_2_5", label: "Nombre del coordinador", type: "text", value: "", required: true },
            ]},
            { id: "cp_5_3", title: "5.3 - Organización de obra", status: "No iniciado", fields: [
                { id: "field_5_3_1", label: "Vallado instalado", type: "checkbox", value: false, required: true },
                { id: "field_5_3_2", label: "Caseta de obra habilitada", type: "checkbox", value: false, required: true },
                { id: "field_5_3_3", label: "Plan de acopios elaborado", type: "checkbox", value: false, required: true },
                { id: "field_5_3_4", label: "Plan de acopios adjuntado", type: "checkbox", value: false, required: false },
                { id: "field_5_3_5", label: "Accesos establecidos", type: "checkbox", value: false, required: true },
                { id: "field_5_3_6", label: "Protecciones instaladas", type: "checkbox", value: false, required: true },
            ]},
            { id: "cp_5_4", title: "5.4 - Libros de registro habilitados", status: "No iniciado", fields: [
                { id: "field_5_4_1", label: "Libro de órdenes habilitado", type: "checkbox", value: false, required: true },
                { id: "field_5_4_2", label: "Libro de incidencias habilitado", type: "checkbox", value: false, required: true },
                { id: "field_5_4_3", label: "Libro de control de calidad habilitado", type: "checkbox", value: false, required: true },
                { id: "field_5_4_4", label: "Libro de seguridad habilitado", type: "checkbox", value: false, required: true },
            ]},
            { id: "cp_5_5", title: "5.5 - Acta de replanteo y comienzo", status: "No iniciado", fields: [
                { id: "field_5_5_1", label: "Acta de replanteo y comienzo firmada", type: "checkbox", value: false, required: true },
                { id: "field_5_5_2", label: "Fecha de comienzo", type: "date", value: null, required: true },
                { id: "field_5_5_3", label: "Acta adjuntada", type: "checkbox", value: false, required: true },
            ]},
            { id: "cp_5_6", title: "5.6 - Pedidos iniciales", status: "No iniciado", fields: [
                { id: "field_5_6_1", label: "Pedidos gestionados", type: "checkbox", value: false, required: true },
                { id: "field_5_6_2", label: "Número de pedidos", type: "number", value: null, required: false },
                { id: "field_5_6_3", label: "Lista de pedidos adjuntada", type: "checkbox", value: false, required: false },
            ]},
        ]
    },
    // FASE 6: EJECUCIÓN - ESTRUCTURA
    {
        id: "phase_6",
        title: "FASE 6: EJECUCIÓN - ESTRUCTURA",
        objective: "Completar la estructura del edificio con control de calidad y seguridad.",
        status: "No iniciada",
        closingCriteria: "Estructura completada al 100% y certificada",
        checkpoints: [
            { id: "cp_6_1", title: "6.1 - Demoliciones y desmontajes", status: "No iniciado", fields: [
                { id: "field_6_1_1", label: "Demoliciones completadas", type: "checkbox", value: false, required: true },
                { id: "field_6_1_2", label: "Gestión de residuos certificada", type: "checkbox", value: false, required: true },
                { id: "field_6_1_3", label: "Certificado de residuos adjuntado", type: "checkbox", value: false, required: true },
                { id: "field_6_1_4", label: "Acta de recepción adjuntada", type: "checkbox", value: false, required: false },
            ]},
            { id: "cp_6_2", title: "6.2 - Movimientos de tierra", status: "No iniciado", fields: [
                { id: "field_6_2_1", label: "Excavación completada", type: "checkbox", value: false, required: true },
                { id: "field_6_2_2", label: "Ensayos geotécnicos realizados", type: "checkbox", value: false, required: false },
                { id: "field_6_2_3", label: "Ensayos adjuntados", type: "checkbox", value: false, required: false },
                { id: "field_6_2_4", label: "Compactación verificada", type: "checkbox", value: false, required: true },
            ]},
            { id: "cp_6_3", title: "6.3 - Cimentación", status: "No iniciado", fields: [
                { id: "field_6_3_1", label: "Cimentación completada", type: "checkbox", value: false, required: true },
                { id: "field_6_3_2", label: "Ensayos de carga realizados", type: "checkbox", value: false, required: false },
                { id: "field_6_3_3", label: "Ensayos adjuntados", type: "checkbox", value: false, required: false },
                { id: "field_6_3_4", label: "Cimentación certificada", type: "checkbox", value: false, required: true },
            ]},
            { id: "cp_6_4", title: "6.4 - Estructura", status: "No iniciado", fields: [
                { id: "field_6_4_1", label: "Estructura completada", type: "checkbox", value: false, required: true },
                { id: "field_6_4_2", label: "Ensayos de resistencia realizados", type: "checkbox", value: false, required: false },
                { id: "field_6_4_3", label: "Ensayos adjuntados", type: "checkbox", value: false, required: false },
                { id: "field_6_4_4", label: "Certificados de hormigón", type: "checkbox", value: false, required: true },
                { id: "field_6_4_5", label: "Estructura aceptada", type: "checkbox", value: false, required: true },
                { id: "field_6_4_6", label: "% de avance", type: "number", value: 0, required: true },
            ]},
        ]
    },
    // FASE 7: EJECUCIÓN - CERRAMIENTOS Y CUBIERTAS
    {
        id: "phase_7",
        title: "FASE 7: EJECUCIÓN - CERRAMIENTOS Y CUBIERTAS",
        objective: "Cerrar el edificio para protegerlo de agentes atmosféricos.",
        status: "No iniciada",
        closingCriteria: "Edificio cerrado y protegido (todas tareas Sí)",
        checkpoints: [
            { id: "cp_7_1", title: "7.1 - Fábricas y cerramientos", status: "No iniciado", fields: [
                { id: "field_7_1_1", label: "Fábricas completadas", type: "checkbox", value: false, required: true },
                { id: "field_7_1_2", label: "Certificados de materiales adjuntados", type: "checkbox", value: false, required: true },
                { id: "field_7_1_3", label: "Cerramientos aceptados", type: "checkbox", value: false, required: true },
                { id: "field_7_1_4", label: "% de avance", type: "number", value: 0, required: true },
            ]},
            { id: "cp_7_2", title: "7.2 - Aislamientos", status: "No iniciado", fields: [
                { id: "field_7_2_1", label: "Aislamiento térmico colocado", type: "checkbox", value: false, required: true },
                { id: "field_7_2_2", label: "Continuidad verificada", type: "checkbox", value: false, required: true },
                { id: "field_7_2_3", label: "Certificados adjuntados", type: "checkbox", value: false, required: true },
            ]},
            { id: "cp_7_3", title: "7.3 - Carpinterías exteriores", status: "No iniciado", fields: [
                { id: "field_7_3_1", label: "Carpinterías colocadas", type: "checkbox", value: false, required: true },
                { id: "field_7_3_2", label: "Pruebas de estanqueidad realizadas", type: "checkbox", value: false, required: true },
                { id: "field_7_3_3", label: "Pruebas adjuntadas", type: "checkbox", value: false, required: true },
                { id: "field_7_3_4", label: "Carpinterías aceptadas", type: "checkbox", value: false, required: true },
            ]},
            { id: "cp_7_4", title: "7.4 - Cubiertas", status: "No iniciado", fields: [
                { id: "field_7_4_1", label: "Pendientes finalizadas", type: "checkbox", value: false, required: true },
                { id: "field_7_4_2", label: "Impermeabilización colocada", type: "checkbox", value: false, required: true },
                { id: "field_7_4_3", label: "Pruebas de infiltración realizadas", type: "checkbox", value: false, required: true },
                { id: "field_7_4_4", label: "Pruebas adjuntadas", type: "checkbox", value: false, required: true },
                { id: "field_7_4_5", label: "Aislamiento de cubierta colocado", type: "checkbox", value: false, required: true },
                { id: "field_7_4_6", label: "Cubiertas aceptadas", type: "checkbox", value: false, required: true },
            ]},
            { id: "cp_7_5", title: "7.5 - Recogidas de aguas", status: "No iniciado", fields: [
                { id: "field_7_5_1", label: "Canalones y bajantes instalados", type: "checkbox", value: false, required: true },
                { id: "field_7_5_2", label: "Sistema de drenaje funcional", type: "checkbox", value: false, required: true },
                { id: "field_7_5_3", label: "Prueba de funcionamiento", type: "checkbox", value: false, required: true },
            ]},
        ]
    },
    // FASE 8: EJECUCIÓN - PARTICIONES INTERIORES
    {
        id: "phase_8",
        title: "FASE 8: EJECUCIÓN - PARTICIONES INTERIORES",
        objective: "Definir los espacios interiores y preparar para instalaciones.",
        status: "No iniciada",
        closingCriteria: "Todos los campos al 100% en 'Sí'",
        checkpoints: [
            { id: "cp_8_1", title: "8.1 - Tabiquería", status: "No iniciado", fields: [
                { id: "field_8_1_1", label: "Tabiques colocados", type: "checkbox", value: false, required: true },
                { id: "field_8_1_2", label: "Puertas interiores colocadas", type: "checkbox", value: false, required: true },
                { id: "field_8_1_3", label: "% de avance", type: "number", value: 0, required: true },
            ]},
            { id: "cp_8_2", title: "8.2 - Trasdosados", status: "No iniciado", fields: [
                { id: "field_8_2_1", label: "Trasdosados colocados", type: "checkbox", value: false, required: true },
                { id: "field_8_2_2", label: "Aislamiento acústico colocado", type: "checkbox", value: false, required: true },
                { id: "field_8_2_3", label: "% de avance", type: "number", value: 0, required: true },
            ]},
            { id: "cp_8_3", title: "8.3 - Falsos techos", status: "No iniciado", fields: [
                { id: "field_8_3_1", label: "Perfilería instalada", type: "checkbox", value: false, required: true },
                { id: "field_8_3_2", label: "Placas colocadas", type: "checkbox", value: false, required: true },
                { id: "field_8_3_3", label: "% de avance", type: "number", value: 0, required: true },
            ]},
            { id: "cp_8_4", title: "8.4 - Revestimientos base", status: "No iniciado", fields: [
                { id: "field_8_4_1", label: "Alicatados base completados", type: "checkbox", value: false, required: true },
                { id: "field_8_4_2", label: "Enfoscados realizados", type: "checkbox", value: false, required: true },
                { id: "field_8_4_3", label: "Bases para pintura preparadas", type: "checkbox", value: false, required: true },
            ]},
        ]
    },
    // FASE 9: INSTALACIONES
    {
        id: "phase_9",
        title: "FASE 9: INSTALACIONES",
        objective: "Ejecutar y probar todas las instalaciones técnicas del edificio.",
        status: "No iniciada",
        closingCriteria: "Todas las instalaciones realizadas y aceptadas",
        checkpoints: [
            { id: "cp_9_1", title: "9.1 - Fontanería", status: "No iniciado", fields: [
                { id: "field_9_1_1", label: "Distribución completada", type: "checkbox", value: false, required: true },
                { id: "field_9_1_2", label: "Pruebas de presión realizadas", type: "checkbox", value: false, required: true },
                { id: "field_9_1_3", label: "Presión de prueba (bar)", type: "number", value: null, required: true },
                { id: "field_9_1_4", label: "Pruebas adjuntadas", type: "checkbox", value: false, required: true },
                { id: "field_9_1_5", label: "Aislamiento colocado", type: "checkbox", value: false, required: true },
                { id: "field_9_1_6", label: "Aparatos instalados", type: "checkbox", value: false, required: true },
                { id: "field_9_1_7", label: "Fontanería aceptada", type: "checkbox", value: false, required: true },
            ]},
            { id: "cp_9_2", title: "9.2 - Saneamiento", status: "No iniciado", fields: [
                { id: "field_9_2_1", label: "Colectores y arquetas colocados", type: "checkbox", value: false, required: true },
                { id: "field_9_2_2", label: "Pruebas de estanqueidad realizadas", type: "checkbox", value: false, required: true },
                { id: "field_9_2_3", label: "Pruebas adjuntadas", type: "checkbox", value: false, required: true },
                { id: "field_9_2_4", label: "Conexión a red pública", type: "checkbox", value: false, required: true },
                { id: "field_9_2_5", label: "Saneamiento aceptado", type: "checkbox", value: false, required: true },
            ]},
            { id: "cp_9_3", title: "9.3 - Electricidad", status: "No iniciado", fields: [
                { id: "field_9_3_1", label: "Canalizaciones completadas", type: "checkbox", value: false, required: true },
                { id: "field_9_3_2", label: "Cuadro eléctrico instalado", type: "checkbox", value: false, required: true },
                { id: "field_9_3_3", label: "Alumbrado colocado", type: "checkbox", value: false, required: true },
                { id: "field_9_3_4", label: "Bases de enchufes colocadas", type: "checkbox", value: false, required: true },
                { id: "field_9_3_5", label: "Pruebas eléctricas realizadas", type: "checkbox", value: false, required: true },
                { id: "field_9_3_6", label: "Pruebas adjuntadas", type: "checkbox", value: false, required: true },
                { id: "field_9_3_7", label: "PAT verificado", type: "checkbox", value: false, required: true },
                { id: "field_9_3_8", label: "Instalación eléctrica aceptada", type: "checkbox", value: false, required: true },
            ]},
            { id: "cp_9_4", title: "9.4 - Climatización y ventilación", status: "No iniciado", fields: [
                { id: "field_9_4_1", label: "Conductos instalados", type: "checkbox", value: false, required: true },
                { id: "field_9_4_2", label: "Equipos colocados", type: "checkbox", value: false, required: true },
                { id: "field_9_4_3", label: "Controles programados", type: "checkbox", value: false, required: true },
                { id: "field_9_4_4", label: "Pruebas de caudal realizadas", type: "checkbox", value: false, required: true },
                { id: "field_9_4_5", label: "Pruebas adjuntadas", type: "checkbox", value: false, required: true },
                { id: "field_9_4_6", label: "Sistema aceptado", type: "checkbox", value: false, required: true },
            ]},
            { id: "cp_9_5", title: "9.5 - Telecomunicaciones", status: "No iniciado", fields: [
                { id: "field_9_5_1", label: "Canalizaciones completadas", type: "checkbox", value: false, required: true },
                { id: "field_9_5_2", label: "Cableado instalado", type: "checkbox", value: false, required: true },
                { id: "field_9_5_3", label: "Configuración realizada", type: "checkbox", value: false, required: true },
                { id: "field_9_5_4", label: "Pruebas realizadas", type: "checkbox", value: false, required: true },
                { id: "field_9_5_5", label: "Sistema aceptado", type: "checkbox", value: false, required: true },
            ]},
        ]
    },
    // FASE 10: ACABADOS Y REMATES
    {
        id: "phase_10",
        title: "FASE 10: ACABADOS Y REMATES",
        objective: "Terminar la obra con todos los acabados finales.",
        status: "No iniciada",
        closingCriteria: "Obra completamente acabada (todos Sí)",
        checkpoints: [
            { id: "cp_10_1", title: "10.1 - Alicatados y solados", status: "No iniciado", fields: [
                { id: "field_10_1_1", label: "Alicatados completados", type: "checkbox", value: false, required: true },
                { id: "field_10_1_2", label: "Solados completados", type: "checkbox", value: false, required: true },
                { id: "field_10_1_3", label: "Inspección visual realizada", type: "checkbox", value: false, required: true },
                { id: "field_10_1_4", label: "Aceptados", type: "checkbox", value: false, required: true },
                { id: "field_10_1_5", label: "% de avance", type: "number", value: 0, required: true },
            ]},
            { id: "cp_10_2", title: "10.2 - Carpintería interior", status: "No iniciado", fields: [
                { id: "field_10_2_1", label: "Puertas colocadas", type: "checkbox", value: false, required: true },
                { id: "field_10_2_2", label: "Marcos instalados", type: "checkbox", value: false, required: true },
                { id: "field_10_2_3", label: "Cerraduras y herrajes", type: "checkbox", value: false, required: true },
                { id: "field_10_2_4", label: "Aceptados", type: "checkbox", value: false, required: true },
            ]},
            { id: "cp_10_3", title: "10.3 - Pintura final", status: "No iniciado", fields: [
                { id: "field_10_3_1", label: "Preparación de superficies", type: "checkbox", value: false, required: true },
                { id: "field_10_3_2", label: "Pintura aplicada", type: "checkbox", value: false, required: true },
                { id: "field_10_3_3", label: "Acabado aceptado", type: "checkbox", value: false, required: true },
            ]},
            { id: "cp_10_4", title: "10.4 - Montaje de aparatos", status: "No iniciado", fields: [
                { id: "field_10_4_1", label: "Aparatos sanitarios", type: "checkbox", value: false, required: true },
                { id: "field_10_4_2", label: "Grifería colocada", type: "checkbox", value: false, required: true },
                { id: "field_10_4_3", label: "Luminarias colocadas", type: "checkbox", value: false, required: true },
                { id: "field_10_4_4", label: "Tomas y accesorios", type: "checkbox", value: false, required: true },
            ]},
            { id: "cp_10_5", title: "10.5 - Limpieza final", status: "No iniciado", fields: [
                { id: "field_10_5_1", label: "Limpieza general realizada", type: "checkbox", value: false, required: true },
                { id: "field_10_5_2", label: "Inspección de limpieza", type: "checkbox", value: false, required: true },
                { id: "field_10_5_3", label: "Obra limpia y lista", type: "checkbox", value: false, required: true },
            ]},
        ]
    },
    // FASE 11: CIERRE DE OBRA
    {
        id: "phase_11",
        title: "FASE 11: CIERRE DE OBRA",
        objective: "Finalizar administrativamente la obra y entregarla al cliente.",
        status: "No iniciada",
        closingCriteria: "Acta de recepción firmada + liquidación cerrada",
        checkpoints: [
            { id: "cp_11_1", title: "11.1 - Pruebas finales de instalaciones", status: "No iniciado", fields: [
                { id: "field_11_1_1", label: "Pruebas finales completadas", type: "checkbox", value: false, required: true },
                { id: "field_11_1_2", label: "Puesta en marcha realizada", type: "checkbox", value: false, required: true },
                { id: "field_11_1_3", label: "Todas las instalaciones funcionales", type: "checkbox", value: false, required: true },
                { id: "field_11_1_4", label: "Informe adjuntado", type: "checkbox", value: false, required: true },
            ]},
            { id: "cp_11_2", title: "11.2 - Documentación técnica final", status: "No iniciado", fields: [
                { id: "field_11_2_1", label: "Planos as-built entregados", type: "checkbox", value: false, required: true },
                { id: "field_11_2_2", label: "Manuales de equipos entregados", type: "checkbox", value: false, required: true },
                { id: "field_11_2_3", label: "Certificados finales adjuntados", type: "checkbox", value: false, required: true },
                { id: "field_11_2_4", label: "Documentación completa", type: "checkbox", value: false, required: true },
            ]},
            { id: "cp_11_3", title: "11.3 - Trámites municipales de cierre", status: "No iniciado", fields: [
                { id: "field_11_3_1", label: "Fin de obra municipal presentado", type: "checkbox", value: false, required: true },
                { id: "field_11_3_2", label: "Fin de obra expedido", type: "checkbox", value: false, required: true },
                { id: "field_11_3_3", label: "Documentación adjuntada", type: "checkbox", value: false, required: true },
            ]},
            { id: "cp_11_4", title: "11.4 - Liquidación económica", status: "No iniciado", fields: [
                { id: "field_11_4_1", label: "Factura final elaborada", type: "checkbox", value: false, required: true },
                { id: "field_11_4_2", label: "Importe final (€)", type: "number", value: null, required: true },
                { id: "field_11_4_3", label: "Retenciones definidas", type: "checkbox", value: false, required: true },
                { id: "field_11_4_4", label: "Garantías documentadas", type: "checkbox", value: false, required: true },
                { id: "field_11_4_5", label: "Liquidación cerrada", type: "checkbox", value: false, required: true },
            ]},
            { id: "cp_11_5", title: "11.5 - Acta de recepción", status: "No iniciado", fields: [
                { id: "field_11_5_1", label: "Acta de recepción elaborada", type: "checkbox", value: false, required: true },
                { id: "field_11_5_2", label: "Acta firmada por todas las partes", type: "checkbox", value: false, required: true },
                { id: "field_11_5_3", label: "Fecha de firma", type: "date", value: null, required: true },
                { id: "field_11_5_4", label: "Acta adjuntada", type: "checkbox", value: false, required: true },
            ]},
        ]
    },
    // FASE 12: POST-OBRA (Seguimiento)
    {
        id: "phase_12",
        title: "FASE 12: POST-OBRA (Seguimiento)",
        objective: "Realizar seguimiento y gestión de garantía durante 12 meses.",
        status: "No iniciada",
        closingCriteria: "Revisión a 12 meses completada + incidencias resueltas",
        checkpoints: [
            { id: "cp_12_1", title: "12.1 - Vigilancia inicial (primeras semanas)", status: "No iniciado", fields: [
                { id: "field_12_1_1", label: "Vigilancia realizada", type: "checkbox", value: false, required: true },
                { id: "field_12_1_2", label: "Fisuras o infiltraciones detectadas", type: "checkbox", value: false, required: false },
                { id: "field_12_1_3", label: "Incidencias descritas", type: "text", value: "", required: false },
                { id: "field_12_1_4", label: "Foto de incidencias adjuntada", type: "checkbox", value: false, required: false },
            ]},
            { id: "cp_12_2", title: "12.2 - Revisión a 3 meses", status: "No iniciado", fields: [
                { id: "field_12_2_1", label: "Revisión completada", type: "checkbox", value: false, required: true },
                { id: "field_12_2_2", label: "Fecha de revisión", type: "date", value: null, required: true },
                { id: "field_12_2_3", label: "Incidencias encontradas", type: "checkbox", value: false, required: false },
                { id: "field_12_2_4", label: "Reparaciones solicitadas", type: "checkbox", value: false, required: false },
                { id: "field_12_2_5", label: "Acta de revisión adjuntada", type: "checkbox", value: false, required: false },
            ]},
            { id: "cp_12_3", title: "12.3 - Revisión a 12 meses", status: "No iniciado", fields: [
                { id: "field_12_3_1", label: "Revisión completada", type: "checkbox", value: false, required: true },
                { id: "field_12_3_2", label: "Fecha de revisión", type: "date", value: null, required: true },
                { id: "field_12_3_3", label: "Obra en garantía aceptada", type: "checkbox", value: false, required: true },
                { id: "field_12_3_4", label: "Acta de revisión adjuntada", type: "checkbox", value: false, required: false },
            ]},
            { id: "cp_12_4", title: "12.4 - Gestión de incidencias en garantía", status: "No iniciado", fields: [
                { id: "field_12_4_1", label: "Incidencias resueltas (número)", type: "number", value: 0, required: false },
                { id: "field_12_4_2", label: "Todas resueltas", type: "checkbox", value: false, required: false },
                { id: "field_12_4_3", label: "Documentación de reparaciones adjuntada", type: "checkbox", value: false, required: false },
            ]},
        ]
    }
];

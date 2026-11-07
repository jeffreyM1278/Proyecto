export const seed={
 equipments:[
 {id:'EQ-001',name:'Monitor multiparámetro',model:'BeneVision N12',serial:'MN-2026-1001',maker:'Mindray',site:'Hospital Central',status:'Operativo',next:'2026-11-04',category:'Monitoreo'},
 {id:'EQ-002',name:'Ventilador mecánico',model:'Servo-u',serial:'SV-2026-0220',maker:'Getinge',site:'Hospital Central',status:'En mantenimiento',next:'2026-11-02',category:'Soporte vital'},
 {id:'EQ-003',name:'Bomba de infusión',model:'Infusomat Space',serial:'BI-2026-0344',maker:'B. Braun',site:'Clínica Norte',status:'Operativo',next:'2026-11-12',category:'Infusión'},
 {id:'EQ-004',name:'Autoclave',model:'VS 2',serial:'AU-2026-0189',maker:'Tuttnauer',site:'Planta Industrial A',status:'Fuera de servicio',next:'2026-10-27',category:'Esterilización'}],
 orders:[{id:'OT-1001',equipment:'EQ-002',type:'Preventivo',technician:'Ana Martínez',priority:'Alta',date:'2026-11-02',status:'En proceso',diagnosis:'Revisión de sensores y calibración'}, {id:'OT-1002',equipment:'EQ-004',type:'Correctivo',technician:'Carlos López',priority:'Crítica',date:'2026-10-27',status:'Pendiente',diagnosis:'Falla de temperatura'}, {id:'OT-1003',equipment:'EQ-001',type:'Preventivo',technician:'Luis Pérez',priority:'Media',date:'2026-11-04',status:'Pendiente',diagnosis:''}],
 history:[{id:'H-01',date:'2026-10-18',equipment:'EQ-001',technician:'Ana Martínez',action:'Calibración de sensores',parts:'Ninguno'}, {id:'H-02',date:'2026-10-12',equipment:'EQ-003',technician:'Luis Pérez',action:'Sustitución de cable de alimentación',parts:'Cable AC'}],
 sites:[{id:'S-01',name:'Hospital Central',city:'San Salvador',type:'Hospital'},{id:'S-02',name:'Clínica Norte',city:'Santa Ana',type:'Clínica'},{id:'S-03',name:'Planta Industrial A',city:'La Libertad',type:'Planta industrial'}],
 users:[{id:'U-01',name:'María Hernández',email:'maria@ejemplo.com',role:'Administrador',status:'Activo'},{id:'U-02',name:'Ana Martínez',email:'ana@ejemplo.com',role:'Técnico',status:'Activo'},{id:'U-03',name:'Carlos López',email:'carlos@ejemplo.com',role:'Técnico',status:'Activo'}],
 documents:[{id:'D-01',name:'Manual BeneVision N12.pdf',equipment:'EQ-001',type:'Manual',url:''},{id:'D-02',name:'Ficha técnica Servo-u.pdf',equipment:'EQ-002',type:'Ficha técnica',url:''}]
};

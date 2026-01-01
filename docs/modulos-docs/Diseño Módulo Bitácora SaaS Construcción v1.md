# **Arquitectura de Sistemas de Registro de Incidencias en Construcción: Diseño Integral de un Módulo de Bitácora Digital de Alta Confiabilidad**

## **1\. Contexto Estratégico y Definición del Producto en el Ecosistema "Construction Tech"**

La industria de la construcción, históricamente rezagada en la adopción de tecnologías digitales, se encuentra en un punto de inflexión donde la gestión de la información ha dejado de ser una tarea administrativa para convertirse en el activo estratégico central para la defensa de márgenes de utilidad y la mitigación de riesgos legales. El planteamiento de desarrollar un módulo de bitácora para un Software as a Service (SaaS) enfocado en incidencias constructivas, sin pretender sustituir los instrumentos jurídicos oficiales, pero ofreciendo un "registro confiable", aborda una necesidad crítica no resuelta por la bitácora oficial: la agilidad operativa y la riqueza documental necesaria para la gestión interna de proyectos.

La dicotomía entre la "validez legal" y la "confiabilidad técnica" es el eje central sobre el cual debe girar el diseño de este producto. Mientras que la validez legal en México y otros países de Latinoamérica emana del cumplimiento estricto de normativas gubernamentales —como el Reglamento de la Ley de Obras Públicas y Servicios Relacionados con las Mismas (RLOPSRM) en el caso federal mexicano 1—, la confiabilidad técnica emana de la integridad de los datos, la inmutabilidad de los registros y la trazabilidad forense de las acciones de los usuarios. Un SaaS privado no puede, por decreto, otorgar la fe pública que otorga un notario o un sistema gubernamental como la Bitácora Electrónica de Obra Pública (BESOP/BEOP) 3, pero sí puede ofrecer un estándar de prueba técnica superior mediante el uso de criptografía, sellos de tiempo certificables y protocolos de auditoría robustos.

El enfoque estratégico, por tanto, no debe ser el de un sustituto, sino el de un **"Gemelo Digital de la Ejecución"**. La bitácora oficial es un resumen ejecutivo y jurídico de las modificaciones al contrato; el módulo SaaS propuesto debe ser la memoria granular, multimedia y analítica de la realidad física de la obra. En un entorno donde las disputas contractuales y los sobrecostos son la norma, la capacidad de un contratista para demostrar con precisión de segundos y coordenadas GPS cuándo, cómo y por qué ocurrió un evento, tiene un valor comercial incalculable, a menudo superior a la propia formalidad de la bitácora oficial, la cual suele llenarse con retraso y con una narrativa saneada para evitar conflictos inmediatos.

Al analizar el mercado y las necesidades de los usuarios, se identifica que el "Diario de Obra" 5 es el instrumento operativo real, mientras que la bitácora oficial es el instrumento contractual. El error de muchas plataformas actuales es intentar forzar la rigidez de la bitácora oficial en el día a día operativo, o bien, hacer el diario de obra tan informal (chats de mensajería instantánea) que la información se pierde. La propuesta de valor de este módulo reside en profesionalizar el Diario de Obra, dotándolo de la seriedad técnica de la bitácora oficial mediante reglas de negocio estrictas en el software (inmutabilidad, seriación), pero manteniendo la flexibilidad de captura necesaria en campo.

## **2\. Marco Normativo y Diferenciación: Bitácora Oficial vs. Herramienta SaaS**

Para diseñar correctamente las reglas de negocio del software, es imperativo realizar una disección profunda del marco legal existente. Entender qué hace a la bitácora oficial "legal" permite imitar sus mecanismos de seguridad para otorgar "confiabilidad" al módulo privado, sin cruzar la línea de la suplantación de funciones.

### **2.1. La Rigidez Normativa de la Bitácora de Obra Pública**

El Reglamento de la Ley de Obras Públicas y Servicios Relacionados con las Mismas (RLOPSRM) establece en su Artículo 122 la obligatoriedad del uso de la bitácora en cada contrato de obras y servicios, estipulando que su elaboración, control y seguimiento se realizará por medios remotos de comunicación electrónica.6 Este mandato crea un monopolio legal para los sistemas autorizados por la Secretaría de la Función Pública (SFP), como el BESOP.

El Artículo 123 del mismo reglamento define las reglas operativas que otorgan validez al instrumento, las cuales deben ser consideradas como los "requisitos no funcionales" de seguridad para nuestro módulo SaaS si aspiramos a un nivel de confiabilidad equiparable 7:

1. **Seriación Ininterrumpida:** Las notas deben numerarse en forma seriada y fecharse consecutivamente, respetando el orden establecido sin excepción.  
2. **Inmutabilidad Absoluta:** Se prohíbe la modificación de notas ya firmadas, inclusive para el autor original.  
3. **Corrección por Adición:** Los errores no se borran; se anulan mediante una nueva nota que referencia a la errónea.  
4. **Prohibición de Intercalaciones:** No se debe sobreponer ni añadir texto entre renglones o márgenes.

Estas características no son caprichos burocráticos; son mecanismos de seguridad de la información diseñados en una era analógica para garantizar la integridad del registro. Al trasladar esto al diseño del SaaS, no debemos permitir la edición de registros ("UPDATE" en base de datos) una vez finalizados. El sistema debe operar bajo un principio de "Append-Only" (Solo Agregar), donde la base de datos registra eventos secuenciales inmutables. Si un usuario desea "editar" una nota en el SaaS, el sistema debe técnicamente crear una nueva versión de la nota y marcar la anterior como obsoleta, manteniendo ambas accesibles en el historial de auditoría.6

### **2.2. El Nicho del "Diario de Obra" y la Validez Privada**

Frente a la bitácora oficial, la literatura técnica y jurídica reconoce la figura del "Diario de Obra". Según investigaciones académicas y prácticas de la industria, el diario es el instrumento de trabajo de la supervisión donde se concentra toda la información relevante referente al desarrollo del proceso constructivo.5 A diferencia de la bitácora, lo anotado en el diario carece de carácter oficial inmediato ante la SFP, pero constituye una "auténtica historia del frente de obra".

Aquí es donde el SaaS encuentra su mercado. La bitácora oficial se utiliza para "asuntos trascendentes" que modifican el contrato (costos, plazos, modificaciones al proyecto).1 Sin embargo, la obra se compone de miles de micro-eventos diarios (llegada de material, clima, instrucciones menores de calidad, rendimientos de mano de obra) que no ameritan una nota de bitácora oficial pero que, acumulados, explican el éxito o fracaso del proyecto.

El módulo debe plantearse como la herramienta para capturar esa "historia auténtica". Legalmente, en el ámbito privado (contratos entre particulares, subcontratistas, desarrolladores inmobiliarios), un registro electrónico confiable tiene plena validez probatoria bajo el Código de Comercio y el Código Federal de Procedimientos Civiles, siempre que se pueda demostrar la integridad del mensaje de datos y la atribución al autor. Por tanto, aunque el usuario "no pueda garantizar validez legal" en el sentido de sustituir un documento público, sí puede ofrecer una herramienta con **fuerza probatoria privada** muy superior a una hoja de cálculo o un cuaderno de papel.8

### **2.3. ¿Debería Reemplazar a la Bitácora Real?**

La respuesta categórica, basada en el análisis de riesgos y la normativa, es **NO**. El módulo no debe intentar reemplazar a la bitácora oficial en obras públicas o en proyectos privados donde el contrato estipule una bitácora notariada o específica. Intentar hacerlo expondría a los usuarios del SaaS a nulidad de sus registros en un litigio administrativo.

El enfoque correcto es el de **Complementariedad Vinculante**. El SaaS funciona como el repositorio de evidencia que *soporta* las notas de la bitácora oficial.

* *Escenario de Uso:* El residente detecta que el acero llegó con retraso (Día 1), llovió (Día 2\) y la grúa falló (Día 3). Todo esto se registra en el SaaS con fotos y GPS. El Día 4, el residente redacta *una sola nota* en la Bitácora Oficial solicitando una prórroga, y utiliza los reportes generados por el SaaS (con sus folios y evidencias) como anexo técnico.  
* *Ventaja:* La bitácora oficial se mantiene limpia y ejecutiva, mientras que el SaaS guarda la "caja negra" detallada de los hechos.

## **3\. Arquitectura de Información y Taxonomía de Datos**

Para que el registro sea confiable, no puede ser un campo de texto libre. La estructuración de datos es vital para la explotación posterior de la información (Business Intelligence) y para dar seriedad al registro. Basándonos en los estándares de reporte diario de construcción 10, se propone una taxonomía estricta.

### **3.1. Clasificación Tipológica de Notas**

El sistema debe obligar al usuario a categorizar cada incidencia. Esto no solo organiza la información, sino que guía al usuario sobre qué datos son obligatorios para cada tipo de evento.

| Categoría | Subtipos | Datos Obligatorios Específicos | Justificación |
| :---- | :---- | :---- | :---- |
| **Operativa** | Avance Físico, Suministros, Maquinaria, Personal | Volúmenes, Horas-Hombre, IDs de Equipo, Números de Remisión | Control de costos y estimaciones.2 |
| **Técnica** | Control de Calidad, Topografía, Mecánica de Suelos | Resultados de Laboratorio, Cadenamientos, Elevaciones | Trazabilidad de la calidad estructural.2 |
| **Administrativa** | Cambios de Proyecto, RFI (Solicitud de Información), Instrucciones | Referencia a Plano, ID de Solicitud, Plazo de Respuesta | Gestión del alcance y cambios.7 |
| **Incidencias** | Seguridad (HSE), Clima, Conflictos Sociales, Fuerza Mayor | Tipo de Lesión, Datos Climáticos (Temp/Lluvia), Evidencia Foto | Justificación de retrasos no imputables.10 |

### **3.2. Estructura de Datos (JSON Schema)**

Para garantizar la interoperabilidad y la estructura a largo plazo, el módulo debe basarse en un esquema de datos estándar, preferiblemente JSON, que es el estándar de facto para el intercambio de datos modernos y logs estructurados.13 A diferencia de los logs de texto plano (como los de servidores Apache), los logs de construcción requieren una estructura jerárquica rica.

Un esquema JSON robusto para una nota de bitácora en este SaaS debería incluir 15:

* **Encabezado Inmutable:** ID único (UUID), ID secuencial visible (Folio \#123), Timestamp de creación (servidor), Timestamp de ocurrencia (usuario), ID del Proyecto.  
* **Autoría y Atribución:** User ID, Rol en el momento de la creación (importante si el usuario cambia de rol después), Hash de la firma digital simple.  
* **Contexto Geo-Temporal:** Coordenadas (Lat/Long), Precisión del GPS, Datos climáticos automáticos (obtenidos vía API al momento de crear la nota).  
* **Payload (Contenido Variable):** Objeto flexible que cambia según el "Tipo de Nota". Si es "Maquinaria", exige campos de "Horometro Inicial/Final". Si es "Clima", exige "mm de precipitación".  
* **Evidencia:** Array de objetos multimedia con URLs a almacenamiento seguro y, crucialmente, la metadata EXIF original extraída antes de la compresión.  
* **Cadena de Bloques (Conceptual):** El campo previous\_note\_hash que contiene el hash de la nota anterior inmediata. Esto crea una cadena criptográfica simple que hace matemáticamente evidente si una nota intermedia fue eliminada o alterada, otorgando la "confiabilidad" técnica deseada sin necesidad de blockchain público costoso.

### **3.3. Metadatos de Auditoría (Audit Trails)**

El "registro confiable" implica saber no solo qué pasó en la obra, sino qué pasó con el dato. El sistema debe mantener un *Shadow Log* o registro de auditoría paralelo.16 Cada vez que alguien visualiza, exporta, intenta editar (y genera una nueva versión) o firma una nota, se guarda un evento.

* *Componente de UI:* Un panel lateral de "Historial del Registro" en cada nota, mostrando: "Creado por Juan (Residente) a las 10:00 AM", "Visto por Pedro (Supervisor) a las 11:30 AM", "Firmado por María (Directora) a las 05:00 PM". Esta transparencia inhibe la corrupción interna.

## **4\. Diseño Técnico y Stack Tecnológico**

La elección de la tecnología define la capacidad del sistema para operar en las condiciones hostiles de una obra (baja señal, dispositivos gama media) y la capacidad de escalabilidad del SaaS.

### **4.1. Arquitectura Frontend: Astro \+ React Islands**

Para un SaaS moderno que maneja gran cantidad de contenido (listados infinitos de notas, reportes, dashboards) pero requiere alta interactividad en puntos específicos (formularios de captura, mapas interactivos), la arquitectura de "Islas" es superior a las SPA (Single Page Applications) tradicionales.

Se recomienda utilizar **Astro** como el framework base.17

* *Justificación:* Astro renderiza HTML estático por defecto, lo que garantiza que la aplicación cargue casi instantáneamente incluso en redes 3G en sitios remotos. El "shell" de la aplicación (menús, encabezados, pies de página, listados de lectura) no envía JavaScript innecesario al cliente.  
* *Islas de Interactividad:* Dentro de Astro, se insertan "islas" de **React** para los componentes complejos: el editor de texto enriquecido de la nota, el componente de subida de fotos con previsualización y el mapa interactivo de geolocalización.19 Estas islas se hidratan (se vuelven interactivas) solo cuando son visibles o necesarias, ahorrando batería y datos al usuario en campo.

### **4.2. Gestión de Estado Global: Nano Stores**

La gestión del estado (state management) es crítica cuando se tiene una aplicación que debe funcionar offline y sincronizar datos cuando regresa la conexión. En lugar de usar React Context (que confina el estado al árbol de componentes de React y puede causar problemas de rendimiento con re-renderizados innecesarios), se recomienda **Nano Stores**.20

* *Ventaja Técnica:* Nano Stores es agnóstico del framework. Permite definir la lógica de negocio (ej. "Cola de notas por sincronizar", "Usuario autenticado", "Estado de la conexión") fuera de los componentes de UI. Esto significa que el estado puede compartirse fácilmente entre el shell estático de Astro y las islas interactivas de React.  
* *Persistencia:* Nano Stores tiene mecanismos sencillos para persistir datos en localStorage o IndexedDB, lo cual es el corazón de la funcionalidad "Offline-First". El usuario guarda la nota en el store local, y un "worker" en segundo plano escucha cambios en el store para intentar enviarlos al servidor cuando detecta conexión.

### **4.3. Componentes de UI: Shadcn UI y Diseño Atómico**

Para el desarrollo visual, no se debe reinventar la rueda. **Shadcn UI** ofrece una colección de componentes accesibles, bien diseñados y basados en Tailwind CSS que se integran perfectamente con React.22

* **Timeline Component:** Para el feed de la bitácora, el componente de línea de tiempo es esencial.24 Debe configurarse para mostrar la cronología vertical, con íconos que identifiquen visualmente el tipo de nota (un casco para seguridad, una nube para clima, un camión para materiales). Shadcn permite personalizar estos nodos para que sean informativos a simple vista.  
* **Audit Log Component:** Para la sección de seguridad, se pueden adaptar los bloques de "Activity Log" 16 para mostrar la trazabilidad de cada nota.  
* **Formularios:** Uso de react-hook-form integrado con los componentes de Input, Select y Textarea de Shadcn, validados con esquemas Zod que reflejen las reglas de negocio (ej. no permitir guardar si el campo "Ubicación" está vacío).26

## **5\. Experiencia de Usuario (UX) y Flujos de Trabajo en Campo**

La mejor arquitectura técnica fracasa si la experiencia de usuario ignora la realidad del campo. El usuario no está en un escritorio ergonómico; está en movimiento, con reflejos en la pantalla por el sol y suciedad en los dedos.

### **5.1. Filosofía "Field-First" (Primero el Campo)**

El diseño debe priorizar la captura móvil. La interfaz de escritorio es secundaria (para revisión y análisis).

* **Captura Multimedia Agresiva:** Escribir en un teclado virtual en obra es frustrante. El SaaS debe fomentar el uso de fotos, video y audio. Un botón central "+" debe ofrecer inmediatamente "Cámara" y "Micrófono".  
* **Dictado Inteligente:** Implementar APIs de transcripción (Speech-to-Text) optimizadas. El residente debe poder decir: "Nota de seguridad, personal sin arnés en andamio eje 4", y el sistema debe transcribirlo y pre-clasificarlo como "Seguridad".  
* **Geolocalización Pasiva:** No pedir al usuario que diga dónde está. El sistema obtiene la latitud/longitud y, mediante geocodificación inversa o capas GIS del proyecto, sugiere: "Estás en el Edificio B, Nivel 2".

### **5.2. El Flujo de la "Verdad Incomoda"**

A diferencia de la bitácora oficial donde se piensa mucho antes de escribir para no crear un problema legal, el Diario de Obra del SaaS debe capturar la realidad cruda.

* *Estado de Borrador Privado:* Permitir que el residente capture notas en modo "Borrador Privado". Estas notas se sincronizan a la nube pero solo son visibles para su equipo, no para el cliente/supervisión externa, hasta que se "Publican". Esto fomenta la captura honesta de errores para corrección interna antes de que se vuelvan oficiales.  
* *Publicación y Cierre:* Una vez que una nota se "Publica", se vuelve inmutable (regla de oro de la confiabilidad). El sistema debe advertir claramente: "¿Está seguro? Esta acción no se puede deshacer y quedará registrada permanentemente".

### **5.3. Visualización Cronológica (Timeline)**

La metáfora de interfaz más adecuada no es la tabla de Excel, sino el *Feed* de redes sociales.

* **Diseño Visual:** Una línea vertical continua conecta los eventos del día. Los días se agrupan claramente.  
* **Contexto Climático:** Al inicio de cada grupo de día en el timeline, se muestra un resumen automático del clima (obtenido de API histórica). Esto da contexto inmediato: "Ah, ese día llovió, por eso hay pocas notas de avance".  
* **Filtros Rápidos:** En la parte superior (sticky header), filtros tipo "chips" para ver solo "Seguridad", "Materiales" o "Notas de Juan".

## **6\. Seguridad, Inmutabilidad y Auditoría: El Núcleo de la Confianza**

Si el SaaS no puede ofrecer validez notarial, debe ofrecer una certeza técnica tan alta que un perito informático pueda validarla en un juicio.

### **6.1. Hashing y Encadenamiento**

Cada nota guardada debe generar un *hash* criptográfico (SHA-256) que incluya: el contenido de la nota, la fecha, el autor y, crucialmente, el hash de la nota anterior.7

* *Efecto:* Esto crea una cadena ininterrumpida. Si alguien con acceso a la base de datos altera una nota antigua (SQL Injection o acceso root), el hash de esa nota cambiará y no coincidirá con el "previous\_hash" de la nota siguiente, rompiendo la cadena y evidenciando la manipulación.  
* *Visualización:* El SaaS puede mostrar un pequeño ícono de "Cadena Verificada" en verde si la integridad matemática de la bitácora está intacta.

### **6.2. Sellado de Tiempo (Time Stamping)**

Uno de los mayores problemas en obra es el posfechado ("se me olvidó anotar esto ayer, lo pongo hoy con fecha de ayer").

* *Solución:* El sistema registra dos fechas: user\_date (la que el usuario dice que ocurrió el evento) y server\_date (cuando el servidor recibió los datos). Ambas son inmutables.  
* *Regla de Negocio:* Si la diferencia entre user\_date y server\_date excede un umbral (ej. 24 horas), la nota se marca visualmente con una etiqueta de "Registro Extemporáneo". Esto no invalida la nota, pero alerta al lector sobre la temporalidad, aumentando la transparencia.6

### **6.3. Firma Electrónica Simple**

Aunque no se use la FIEL del SAT (para evitar complejidad de implementación y custodia de certificados), se debe implementar un mecanismo de firma electrónica simple conforme al Código de Comercio.

* *Mecanismo:* Al dar clic en "Firmar/Cerrar Nota", el sistema solicita la contraseña del usuario nuevamente o un PIN de 4 dígitos (factor de conocimiento) y captura la IP y geolocalización (factor de posesión del dispositivo). Esto vincula lógicamente al autor con el registro de manera robusta.27

## **7\. Interoperabilidad y Estándares de Datos**

El SaaS no debe ser un silo de información. Para ser una herramienta "propia dentro de su SaaS" pero útil, debe hablar con el mundo exterior.

### **7.1. Exportación "Oficializable"**

El sistema debe ser capaz de generar un PDF con el formato visual estándar de la SCT/SFP.7

* *Diseño del PDF:* Encabezado con logos, número de contrato, folio consecutivo, cuerpo de la nota, y al pie, las firmas digitales visualizadas (con el hash y nombre del firmante).  
* *Uso:* Este PDF se imprime y se anexa a la bitácora oficial física, o se adjunta digitalmente en el BESOP si el sistema lo permite como anexo.

### **7.2. Integración con APIs de Terceros**

* **Clima:** Integración obligatoria con servicios como OpenWeatherMap o Visual Crossing para inyectar datos objetivos de condiciones ambientales en cada día de trabajo.10  
* **Sistemas Locales:** Analizar la integración o compatibilidad de exportación con sistemas municipales como la "Bitácora de Peritaje" de Mérida.29 Si el SaaS puede exportar un paquete de datos que el perito pueda cargar fácilmente en la app municipal, se reduce la duplicidad de trabajo.

## **8\. Estrategia de Implementación y Adopción**

### **8.1. Posicionamiento: "Defensa Privada"**

El planteamiento comercial y operativo no debe ser "cumple con la ley", sino "protege tu negocio".

* *Mensaje:* "La bitácora oficial protege al gobierno. Nuestra bitácora protege tu dinero".  
* Se debe enfocar en la resolución de disputas con subcontratistas, proveedores y en la justificación de reclamos (claims) por tiempos muertos.

### **8.2. Adopción Gradual**

Para vencer la resistencia al cambio en obra:

1. **Fase 1 (Sombra):** El residente usa la app solo para tomar fotos y notas de voz personales.  
2. **Fase 2 (Colaborativa):** Se invita al supervisor a "ver" las notas en modo lectura.  
3. **Fase 3 (Vinculante):** Se establece en los contratos privados con subcontratistas que las estimaciones se pagarán solo si los avances están registrados en la bitácora del SaaS. Esto fuerza la adopción por incentivo económico.

## **9\. Conclusiones y Hoja de Ruta**

El desarrollo de este módulo de bitácora representa una oportunidad significativa para elevar el estándar de gestión en la construcción privada. Al renunciar a la pretensión de ser una "Bitácora Oficial" gubernamental, el producto se libera de las cadenas burocráticas que hacen inusables a los sistemas oficiales, pero al adoptar voluntariamente los estándares técnicos de integridad y seguridad de dichos sistemas, adquiere una autoridad moral y técnica indispensable.

La hoja de ruta tecnológica es clara: construir sobre una arquitectura web moderna y rápida (**Astro/React**), priorizar la experiencia móvil offline (**Nano Stores**), y asegurar los datos con estándares criptográficos básicos (**Hashing/JSON Schema**). El resultado será una herramienta que, aunque no tenga el sello de un notario, tendrá la confianza matemática de la inmutabilidad, convirtiéndose en el árbitro de facto de la realidad de la obra.

### ---

**Tabla Comparativa: Bitácora Oficial vs. Módulo SaaS Propuesto**

| Característica | Bitácora Oficial (BESOP/SFP) | Módulo SaaS Propuesto (Diario de Obra Avanzado) |
| :---- | :---- | :---- |
| **Objetivo Principal** | Cumplimiento Normativo y Legal. | Control Operativo y Gestión de Evidencia. |
| **Flexibilidad** | Nula. Formatos rígidos y predefinidos. | Alta. Adaptable a tipos de obra y necesidades internas. |
| **Contenido** | "Asuntos Trascendentes" (Contrato, Costo, Plazo). | Detalle Granular (Micro-eventos, Clima, Fotos, Chat). |
| **Tecnología** | Web Legacy, firma con FIEL (compleja). | PWA Moderna (Astro/React), firma simple, Offline-First. |
| **Multimedia** | Limitada (Anexos pesados, sin visualización ágil). | Nativa (Fotos, Video, Voz, Geolocalización integrada). |
| **Validez** | Plena ante autoridades (SFP, OIC). | Probatoria Privada (Cód. Comercio) y Técnica (Auditoría). |
| **Usuario Principal** | Superintendente y Residente de Supervisión. | Todo el equipo de obra (Cabos, Almacén, Seguridad). |
| **Inmutabilidad** | Garantizada por Ley y Sistema Federal. | Garantizada por Arquitectura de Software (Hashing). |

### **Diagrama Conceptual de Flujo de Datos (Workflow)**

1. **Captura (Campo):** Usuario abre App (Offline) $\\rightarrow$ Toma Foto $\\rightarrow$ GPS y Fecha se bloquean $\\rightarrow$ Dicta nota $\\rightarrow$ Guarda en Nano Store.  
2. **Sincronización:** App detecta red $\\rightarrow$ Envía JSON al Servidor $\\rightarrow$ Servidor valida integridad y seriación.  
3. **Procesamiento:** Servidor obtiene Clima Histórico de API para esa hora/lugar $\\rightarrow$ Genera Hash de la nota \+ Hash anterior.  
4. **Almacenamiento:** Guarda JSON en DB NoSQL (Datos) \+ Fotos en Object Storage (WORM).  
5. **Visualización:** Timeline en Dashboard se actualiza $\\rightarrow$ Supervisor recibe notificación.  
6. **Cierre:** Supervisor revisa $\\rightarrow$ Firma (Pin \+ IP) $\\rightarrow$ Nota pasa a estado "Read-Only".

Este diseño asegura que el sistema cumpla con la promesa de "registro confiable de los hechos", ofreciendo una herramienta indispensable para la gestión moderna de la construcción.

#### **Obras citadas**

1. Reglamento de la Ley de Obras Públicas y Servicios Relacionados con las Mismas \- Cámara de Diputados, fecha de acceso: diciembre 31, 2025, [https://www.diputados.gob.mx/LeyesBiblio/regley/Reg\_LOPSRM.pdf](https://www.diputados.gob.mx/LeyesBiblio/regley/Reg_LOPSRM.pdf)  
2. Bitácora de obra \- Abogados especializados en obra pública y privada., fecha de acceso: diciembre 31, 2025, [https://www.despachomata.com/cbj/publicaciones/obra-publica/bitacora](https://www.despachomata.com/cbj/publicaciones/obra-publica/bitacora)  
3. Bitácora de obra pública por medios remotos de comunicación electrónica (Sistema de Bitácora Electrónica de Obra Pública BEOP \- Gob MX, fecha de acceso: diciembre 31, 2025, [https://www.gob.mx/cms/uploads/attachment/file/10181/preguntas-frecuentes-ago-2015.pdf](https://www.gob.mx/cms/uploads/attachment/file/10181/preguntas-frecuentes-ago-2015.pdf)  
4. Curso de Capacitación sobre el Programa de Bitácora Electrónica para Obra Pública (BEOP) \- Secoem, fecha de acceso: diciembre 31, 2025, [https://secoem.michoacan.gob.mx/wp-content/uploads/2015/09/gu%C3%ADa-informativa-manejo-de-sistema-para-adm-local-y-usuario-final.pdf](https://secoem.michoacan.gob.mx/wp-content/uploads/2015/09/gu%C3%ADa-informativa-manejo-de-sistema-para-adm-local-y-usuario-final.pdf)  
5. BITACORA DE OBRA REGLAS Y USO \- UNAM, fecha de acceso: diciembre 31, 2025, [https://tesiunamdocumentos.dgb.unam.mx/pmig2016/0220286/0220286.pdf](https://tesiunamdocumentos.dgb.unam.mx/pmig2016/0220286/0220286.pdf)  
6. BITÁCORA ELECTRÓNICA DE OBRA PÚBLICA \- OFS TLAXCALA, fecha de acceso: diciembre 31, 2025, [https://ofstlaxcala.gob.mx/images/cursos/evidencia/2016/doc/MANUAL%20TLAXCALA%20BEOP%202016.pdf](https://ofstlaxcala.gob.mx/images/cursos/evidencia/2016/doc/MANUAL%20TLAXCALA%20BEOP%202016.pdf)  
7. MP-200-PR03-P06-F01.docx, fecha de acceso: diciembre 31, 2025, [https://www.sct.gob.mx/obrapublica/formatoshomologacion/MP-200-PR03-P06-F01.docx](https://www.sct.gob.mx/obrapublica/formatoshomologacion/MP-200-PR03-P06-F01.docx)  
8. MANUAL DE AUDITORÍA DE OBRA PÚBLICA Contaduría Mayor de Hacienda del Estado de Colima Subcontaduría Mayor de Obra Pública y, fecha de acceso: diciembre 31, 2025, [http://ordenjuridico.gob.mx/Estatal/COLIMA/Manuales/COLMAN01.pdf](http://ordenjuridico.gob.mx/Estatal/COLIMA/Manuales/COLMAN01.pdf)  
9. La Bitácora de Obra: El Instrumento Jurídico que Protege tu Proyecto | BFC Arquitectos, fecha de acceso: diciembre 31, 2025, [https://bfcarquitectos.com/es/blog-articulos-sobre-control-de-obra/la-bitacora-de-obra](https://bfcarquitectos.com/es/blog-articulos-sobre-control-de-obra/la-bitacora-de-obra)  
10. What to Include in Construction Daily Logs: Best Practices \- Blog \- Sonar Labs, fecha de acceso: diciembre 31, 2025, [https://blog.sonarlabs.ai/resources/construction-daily-log-best-practices](https://blog.sonarlabs.ai/resources/construction-daily-log-best-practices)  
11. Construction daily reports: Best practices for jobsite teams \- Fieldwire, fecha de acceso: diciembre 31, 2025, [https://www.fieldwire.com/blog/construction-daily-report-best-practices/](https://www.fieldwire.com/blog/construction-daily-report-best-practices/)  
12. Guide to Getting Started with Construction Daily Logs \- ConstructionOnline Knowledge Base, fecha de acceso: diciembre 31, 2025, [https://help.constructiononline.com/en/guide-to-getting-started-with-daily-logs](https://help.constructiononline.com/en/guide-to-getting-started-with-daily-logs)  
13. Log Format Standards: JSON, XML, and Key-Value Explained \- Last9, fecha de acceso: diciembre 31, 2025, [https://last9.io/blog/log-format/](https://last9.io/blog/log-format/)  
14. Understanding JSON Logging and Analysis \- OpenObserve, fecha de acceso: diciembre 31, 2025, [https://openobserve.ai/blog/json-logging-guide-examples/](https://openobserve.ai/blog/json-logging-guide-examples/)  
15. JSON Schema Examples Tutorial \- MongoDB, fecha de acceso: diciembre 31, 2025, [https://www.mongodb.com/resources/languages/json-schema-examples](https://www.mongodb.com/resources/languages/json-schema-examples)  
16. React Account Block Activity Log \- shadcn.io, fecha de acceso: diciembre 31, 2025, [https://www.shadcn.io/blocks/account-activity-log-01](https://www.shadcn.io/blocks/account-activity-log-01)  
17. Components \- Astro Docs, fecha de acceso: diciembre 31, 2025, [https://docs.astro.build/en/basics/astro-components/](https://docs.astro.build/en/basics/astro-components/)  
18. Project structure \- Astro Docs, fecha de acceso: diciembre 31, 2025, [https://docs.astro.build/en/basics/project-structure/](https://docs.astro.build/en/basics/project-structure/)  
19. React Recap, years later, thanks to Astro \- DEV Community, fecha de acceso: diciembre 31, 2025, [https://dev.to/ingosteinke/react-recap-years-later-thanks-to-astro-2b4a](https://dev.to/ingosteinke/react-recap-years-later-thanks-to-astro-2b4a)  
20. Share state between islands \- Astro Docs, fecha de acceso: diciembre 31, 2025, [https://docs.astro.build/en/recipes/sharing-state-islands/](https://docs.astro.build/en/recipes/sharing-state-islands/)  
21. Minimal state management tools \- iO tech\_hub, fecha de acceso: diciembre 31, 2025, [https://techhub.iodigital.com/articles/minimal-state-management-tools](https://techhub.iodigital.com/articles/minimal-state-management-tools)  
22. Examples \- shadcn/ui, fecha de acceso: diciembre 31, 2025, [https://ui.shadcn.com/docs/registry/examples](https://ui.shadcn.com/docs/registry/examples)  
23. shadcn-ui/ui: A set of beautifully-designed, accessible components and a code distribution platform. Works with your favorite frameworks. Open Source. Open Code. \- GitHub, fecha de acceso: diciembre 31, 2025, [https://github.com/shadcn-ui/ui](https://github.com/shadcn-ui/ui)  
24. Animated Interactive Shadcn Timeline Component for React \- NextGen JavaScript, fecha de acceso: diciembre 31, 2025, [https://next.jqueryscript.net/shadcn-ui/animated-interactive-timeline/](https://next.jqueryscript.net/shadcn-ui/animated-interactive-timeline/)  
25. Shadcn Timeline \- Free React Nextjs Template, fecha de acceso: diciembre 31, 2025, [https://www.shadcn.io/template/timdehof-shadcn-timeline](https://www.shadcn.io/template/timdehof-shadcn-timeline)  
26. Shadcn Components \- UI Components and Variants, fecha de acceso: diciembre 31, 2025, [https://shadcnstudio.com/components](https://shadcnstudio.com/components)  
27. BESOP Help Guides: "Opening a Log" \- YouTube, fecha de acceso: diciembre 31, 2025, [https://www.youtube.com/watch?v=jM1tulkwqao](https://www.youtube.com/watch?v=jM1tulkwqao)  
28. How to create winning daily reports in construction \- Digital Builder \- Autodesk, fecha de acceso: diciembre 31, 2025, [https://www.autodesk.com/blogs/construction/daily-reports-construction/](https://www.autodesk.com/blogs/construction/daily-reports-construction/)  
29. Bitácora de Peritaje on the App Store \- Apple, fecha de acceso: diciembre 31, 2025, [https://apps.apple.com/ro/app/bit%C3%A1cora-de-peritaje/id1360417388](https://apps.apple.com/ro/app/bit%C3%A1cora-de-peritaje/id1360417388)
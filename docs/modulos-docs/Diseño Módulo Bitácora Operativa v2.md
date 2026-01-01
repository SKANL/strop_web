# **Arquitectura de Sistemas de Registro en Construcción: Diseño de la "Bitácora Operativa" y Diario de Obra Digital**

## **1\. Contexto Estratégico: La Fuente de la Verdad Fáctica**

La industria de la construcción se enfrenta a una dicotomía crítica: la **Bitácora Legal** (rígida, burocrática y obligatoria) frente a la realidad caótica del día a día en la obra. El error de muchas soluciones "PropTech" es intentar digitalizar la bitácora legal directamente, creando herramientas que nadie usa por miedo a las implicaciones jurídicas inmediatas.

Para el SaaS **Strop**, la oportunidad reside en posicionar su módulo no como un sustituto legal, sino como la **"Bitácora Operativa"** o **"Diario de Obra Digital"**. Este módulo actúa como el repositorio de **Evidencia Irrefutable**: una "caja negra" del proyecto que captura la realidad fáctica (lo que realmente sucedió) para alimentar y respaldar la verdad jurídica (lo que se asienta en el contrato).

La propuesta de valor se resume en una analogía estratégica: **"En un pleito legal, la Bitácora Oficial es el escudo, pero Strop es la munición"**. Mientras el documento oficial cumple el requisito, este software provee las fotos, coordenadas, horas exactas y metadatos forenses que ganan las disputas sobre estimaciones y retrasos.

## **2\. Marco Normativo y Definición del Alcance: ¿Sustitución o Complemento?**

### **2.1. La Respuesta Categórica: NO Sustituir la Bitácora Legal**

Intentar reemplazar la bitácora oficial (física o BESOP) conlleva un riesgo existencial para el cliente:

* **Riesgo Jurídico:** La Bitácora de Obra es un instrumento regulado por la LOPSRM. Para reemplazarla, el software requeriría certificaciones ante la Secretaría de la Función Pública y uso estricto de la FIEL (e.firma), lo cual añade una fricción de uso inmensa.  
* **Consecuencia:** Si un cliente usa Strop como "única bitácora" y enfrenta un litigio federal, sus registros podrían ser desestimados por falta de solemnidad legal, perdiendo el juicio.

### **2.2. El Enfoque Correcto: El "Filtro de Trascendencia"**

El módulo debe diseñarse bajo el principio de **Alimentación Jerárquica**. Uno de los problemas más graves en obra es "contaminar" la bitácora legal con trivialidades (ej. "llegaron 5 sacos de cemento"), lo que diluye la importancia de las notas críticas.

**Flujo de Valor Propuesto:**

1. **Captura Masiva (Diario):** El SaaS captura *todo* el ruido operativo (clima, asistencias, fotos de acero oxidado, retrasos de 15 minutos).  
2. **Filtrado Inteligente:** El sistema permite al Superintendente revisar este cúmulo de datos y seleccionar solo los eventos con impacto contractual.  
3. **Transmisión Legal:** El Superintendente usa la información depurada y estructurada por Strop para redactar la nota en la Bitácora Oficial, anexando los reportes de Strop como prueba técnica.

## **3\. Arquitectura de Información y Taxonomía de Datos**

Para que el registro tenga valor forense, no puede ser texto libre. Debe estructurarse para impedir la ambigüedad.

### **3.1. Catálogo de Tipos de Incidencia**

El sistema debe prohibir títulos genéricos. Se obliga al usuario a clasificar el evento para generar inteligencia de negocios (ej. "El 40% de tus retrasos son por Suministros").

| Categoría | Subtipos | Datos Obligatorios (Hard-Constraints) |
| :---- | :---- | :---- |
| **Operativa** | Avance, Suministros, Maquinaria | Volúmenes, IDs de Equipo, Horómetros. |
| **Incidencia** | Seguridad (HSE), Clima, Conflictos | Tipo de Lesión, Datos Climáticos API \+ Real. |
| **Bloqueo** | Falta de Frente, Falta de Material, RFI | Causa Raíz, Tiempo de Paro Estimado. |
| **Administrativa** | Visitas, Minutas, Instrucciones Verbales | Nombres de Asistentes, Acuerdos. |

### **3.2. Estructura del "Dato Forense" (Evidence-First)**

Cada entrada en la base de datos debe ser tratada como evidencia judicial potencial.

* **Geolocalización Forzosa (Geofencing):** Bloquear la subida de reportes o fotos si el dispositivo no está dentro del polígono GPS de la obra. Esto elimina los "reportes de sillón" hechos desde casa.  
* **Timestamp de Servidor:** Ignorar la hora del teléfono (que es manipulable). Se registra la hora de recepción en el servidor (server\_timestamp) para impedir que se reporten accidentes del martes como si hubieran ocurrido el lunes.  
* **Metadata EXIF:** Extraer y guardar permanentemente la metadata de las fotos (modelo de cámara, hora original, coordenadas) antes de cualquier compresión.

## **4\. Diseño Técnico y Stack Tecnológico (Astro \+ React)**

La elección tecnológica debe priorizar la **Inmutabilidad Técnica** y la operación **Offline**, ya que la bitácora operativa debe funcionar donde la bitácora web oficial (BESOP) falla: en sótanos y zonas rurales.

### **4.1. Arquitectura Frontend: Astro \+ React Islands**

* **Base:** Astro para un "shell" ligero y rápido.  
* **Islas:** React para los componentes complejos de captura (formularios dinámicos, mapas, manipulación de fotos).  
* **Estado:** **Nano Stores** para el manejo de estado global agnóstico y persistencia local (Offline-First). Los datos se guardan en IndexedDB localmente y se sincronizan cuando hay red.

### **4.2. Inmutabilidad Técnica (Audit Trail)**

Aunque no se tenga la ley detrás, el software debe aplicar reglas de hierro en su base de datos:

* **Append-Only:** Prohibido el UPDATE o DELETE en registros ya firmados/cerrados.  
* **Corrección por Adición:** Si un usuario se equivoca, el sistema crea una "Nota Aclaratoria" vinculada (Linked List) a la original, pero jamás borra la versión errónea.  
* **Historial de Cambios (Audit Log):** Un panel lateral visible que muestra: *"Editado por Juan (Residente) \- Cambió '5 toneladas' por '50 toneladas' \- hace 10 min"*. Esto da seguridad al Dueño de que sus empleados no están maquillando cifras.

## **5\. Experiencia de Usuario (UX) y Flujos de Trabajo: Niveles de Responsabilidad**

El diseño debe reflejar la jerarquía de la obra para facilitar el "Filtro de Trascendencia".

### **5.1. Nivel 1: La Captura Operativa (Cabo / Residente)**

* **Interfaz:** Móvil, botones grandes, alto contraste.  
* **Acción:** "Reportar Incidencia".  
* **UX:** Enfocada en velocidad (\< 60 segundos). Dictado por voz a texto, foto rápida, selección de categoría. Sin preocupación por redacción formal. Es el "Diario Sucio".

### **5.2. Nivel 2: La Oficialización (Superintendente / Gerente)**

* **Interfaz:** Escritorio / Tablet (Dashboard).  
* **Acción:** "Revisión de Diario" y "Generar Nota Legal".  
* **Flujo:**  
  1. Visualiza las 20 incidencias del día reportadas por los residentes.  
  2. Descarta las triviales o las resuelve internamente.  
  3. Selecciona las 3 críticas (ej. retraso por lluvias, cambio de especificación).  
  4. **Feature Clave:** El sistema toma los datos crudos de esas 3 incidencias y, mediante un template (o IA), genera un borrador de texto formal y jurídico.  
  5. **Output:** El Superintendente copia ese texto "blindado" y lo pega en la Bitácora Oficial (BESOP/Física), sabiendo que tiene el respaldo documental en Strop.

### **5.3. Firma Simple y Cadena de Mando**

Aunque no se use la FIEL del SAT, se debe implementar una firma simple para responsabilidad interna.

* **Visto Bueno:** El Residente marca el reporte del Cabo como "Verificado".  
* **Cierre Diario:** El Superintendente aplica su "Firma Digital" (PIN \+ IP) para cerrar el día, bloqueando la edición de todos los eventos de esa fecha.

## **6\. Conclusiones y Recomendaciones para Strop**

Para desarrollar este módulo con éxito, Strop debe renunciar a ser "otra bitácora legal" y abrazar su identidad como herramienta de **Inteligencia Forense de Obra**.

**Resumen de la Propuesta de Valor:**

1. **No vendas legalidad, vende protección financiera:** "Protege tu dinero con evidencia que la bitácora de papel no puede guardar".  
2. **Tecnología Forense:** Geolocalización forzosa y timestamps inmutables son tus diferenciadores contra WhatsApp o Excel.  
3. **Puente, no Isla:** Tu software es el puente entre el caos de la obra y la formalidad del contrato. Captura el caos, fíltralo y entrega orden.

Al seguir esta arquitectura, Strop se convierte en el aliado indispensable del constructor: la herramienta que le permite dormir tranquilo sabiendo que, si llega una auditoría o demanda, tiene "la munición" lista y ordenada.
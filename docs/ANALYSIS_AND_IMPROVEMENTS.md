# Análisis de Diagnóstico y Plan de Mejoras — AgenticBank for Belo

**Fecha:** Marzo 2026
**Proyecto:** AgenticBank for Belo (Sistema Operativo Financiero Multi-Agente)
**Versión evaluada:** Prototipo / MVP Demonstrator

---

## 1. Resumen Ejecutivo

**AgenticBank for Belo** es un prototipo conceptual innovador que propone evolucionar la banca digital tradicional hacia la **banca agéntica** en América Latina. A través de un orquestador multi-agente, automatiza decisiones financieras complejas (ahorro, aislamiento de impuestos, cobertura cambiaria FX, remesas y tesorería) bajo reglas aprobadas por el usuario y un índice de autonomía medible (**ADF — Autonomous Decision Factor**).

El proyecto cuenta con una propuesta de valor sólida, una arquitectura teórica clara y una presentación visual bien alineada con el branding fintech. Sin embargo, en su estado actual, la implementación se comporta predominantemente como un **demo estático/simulado**.

Este documento presenta un diagnóstico detallado de **qué le falta al proyecto** y una guía estructurada sobre **cómo mejorarlo**, tanto para elevar la calidad del prototipo actual como para prepararlo para un despliegue en entorno de producción.

---

## 2. Diagnóstico del Estado Actual

### 2.1 Stack Técnico Identificado
- **Frontend:** Next.js 15 (App Router), React 19, Tailwind CSS v4, TypeScript.
- **Backend / AI:** Next.js API Routes (`/api/copilot`, `/api/belo/execute`), integración en vivo con API pública de Belo (`api.belo.app/public/price`) y proveedor de LLM en la nube (Groq Llama-3.3-70b con fallback local).
- **Lógica de Dominio:** Rules Engine básico (regla `income-20-20-60`, `ars-devaluation-shield`), Audit Trail con encadenamiento SHA-256 y calculadora de ADF.

### 2.2 Puntos Fuertes Existentes
1. **Concepto Innovador:** Definición clara del factor ADF y la regla 20/20/60 para freelancers de LatAm.
2. **Precios Belo en Tiempo Real:** El Copiloto consulta las cotizaciones públicas de Belo (`USDT/ARS`, `BRL/ARS`, etc.) dinámicamente.
3. **Auditoría Criptográfica:** Implementación limpia del hash encadenado SHA-256 para trazabilidad de decisiones.
4. **Claridad Estratégica:** Excelente documentación para inversores (`INVESTOR_BRIEF.md`, `ARCHITECTURE.md`, `ROADMAP.md`).

---

## 3. ¿Qué le falta? (Brechas y Oportunidades de Mejora)

### A. Gestión de Estado e Interactividad en la UI (Faltante Principal)
- **Saldos Inmutables en Pantalla:** Al ejecutar la simulación de cobro en el Dashboard (`DemoRunner`), el endpoint `/api/belo/execute` retorna el reparto, pero los saldos del usuario (`Disponible`, `Vault`, `Impuestos`) en la UI permanecen fijos.
- **Goal Engine de Solo Lectura:** La vista `/goals` muestra metas harcodeadas sin posibilidad de crear nuevas metas, editar importes o pausar/cancelar objetivos.
- **Rules Engine Estático:** La vista `/agents` enumera reglas, pero el usuario no puede crear nuevas reglas (ej. "IF cobro > $1.000 THEN 10% a viaje"), ni ajustar límites de autonomía.
- **Falta de Flujo 2FA Interactivo:** Cuando un cobro supera el umbral de riesgo (ej. $5.000) y requiere 2FA (`requires_2fa`), la UI solo muestra un mensaje de texto. No existe un modal o pantalla para que el usuario ingrese un código o apruebe la transacción.

### B. Capacidades Agénticas e Integración de IA
- **Ausencia de Tool Calling (Function Calling):** El Copiloto responde preguntas informativas, pero no puede ejecutar acciones sobre el sistema (ej. "Creá una meta para ahorrar $2.000" o "Ejecutá una simulación de $1.500").
- **Discrepancia de Proveedores LLM:** El `README.md` menciona `@google/genai` (Gemini), mientras que el código en `/api/copilot/route.ts` utiliza **Groq Llama-3.3-70b**. Debe unificarse la documentación y abstraer la capa de LLM.
- **Falta de Memoria Contextual Persistente:** Cada mensaje enviado al Copiloto se procesa de forma aislada sin mantener el historial de la conversación previa.

### C. Capa de Ejecución e Integración Belo
- **APIs Totalmente Simuladas:** El endpoint `/api/belo/execute` es una simulación en memoria. Falta una estructura de adaptadores (Adapter Pattern) que permita alternar transparentemente entre `MockBeloAdapter` y `RealBeloSandboxAdapter`.
- **Soporte Limitado de Eventos:** Solo soporta el evento `income_received`. Faltan eventos como `fx_trigger`, `card_purchase`, `bill_payment` o `scheduled_payout`.

### D. Persistencia de Datos
- Todos los saldos, auditorías y metas residen en archivos TypeScript (`mock-data.ts`). Al recargar la página se pierde cualquier interacción.

### E. Inconsistencias en Documentación y Archivos
- `README.md` referencia un archivo `server.ts` y scripts que no existen en el `package.json`.
- Placeholders pendientes en el README (`TODO(owner): capturas...`, `TODO(owner): link de demo...`).

---

## 4. Plan Recomendado de Mejoras (Roadmap de Evolución)

### Fase 1: Prototipo Interactivo en Tiempo Real (Inmediato)
1. **Estado Global React (`StateContext`):**
   - Implementar un proveedor de estado dinámico que sostenga el balance del usuario, metas activas y registros de auditoría.
   - Conectar `DemoRunner` para que cada simulación incremente o distribuya los fondos reales mostrados en la pantalla en tiempo real.
2. **Creación Dinámica de Metas y Reglas:**
   - Habilitar formularios en `/goals` y `/agents` para interactuar verdaderamente con el prototipo.
3. **Flujo de Seguridad 2FA Interactivo:**
   - Diseñar un modal modal/pop-up de aprobación 2FA cuando el Risk Engine marque `requires_2fa`, permitiendo al usuario autorizar o rechazar la operación.
4. **Sincronización de Documentación:**
   - Actualizar `README.md` y `APP.md` eliminando referencias obsoletas a `server.ts` o bibliotecas no utilizadas.

### Fase 2: Copiloto con Tool Calling y Memoria (Corto Plazo)
1. **Integración de Function Calling en LLM:**
   - Configurar herramientas para que el Copiloto interprete intenciones (`create_goal`, `execute_allocation`, `list_rules`) y responda realizando acciones directas.
2. **Historial de Conversación:**
   - Enviar el arreglo completo de mensajes previos al proveedor LLM para mantener coherencia en el diálogo.

### Fase 3: Arquitectura Lista para Producción (Mediano/Largo Plazo)
1. **Capa de Adaptadores Belo (Adapter Pattern):**
   - Interfaz `BeloProvider` con implementaciones `MockBeloProvider` y `BeloApiSandboxProvider`.
2. **Base de Datos & Autenticación:**
   - Integración con Supabase / PostgreSQL y Prisma/Drizzle ORM para persistir usuarios, reglas y auditoría.
3. **Matriz de Compliance Latinoamericana:**
   - Módulo interactivo de visualización de límites normativos (BCRA en Argentina, PIX/BACEN en Brasil, SPEI/Banxico en México).

---

## 5. Conclusión

El proyecto **AgenticBank for Belo** posee un potencial destacado como concepto de producto de banca autónoma de próxima generación. Implementando la reactividad en tiempo real en la UI, corrigiendo la documentación y conectando el estado global, el prototipo pasará de ser una maqueta estática a una experiencia completamente interactiva y convincente para usuarios e inversores.

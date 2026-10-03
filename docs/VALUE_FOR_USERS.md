# Valor para el usuario

AgenticBank es un prototipo. Los ejemplos usan datos simulados.

## Por perfil

| Perfil | Qué resuelve el prototipo |
|--------|---------------------------|
| Freelancer / remoto | Aparta 20% de impuestos y 20% de ahorro al cobrar y dolariza según su regla. |
| Nómada digital | Cobertura FX, topes de gasto, PIX en Brasil. |
| Familia | Remesas programadas y presupuesto protegido de la inflación. |
| Creador | Pronóstico de caja y fondo de emergencia. |
| Pyme / agencia | Proyección de 30 a 90 días y pago por lotes a contratistas. |

## Transversal

- Menos tareas manuales: metas y reglas en lugar de operaciones una por una.
- Protección ante inflación y devaluación mediante reglas (ej. escudo ARS → USDT).
- Transparencia: cada decisión genera un recibo SHA-256 verificable.
- Control total: el usuario aprueba, limita autonomía y puede activar el killswitch.

## Ejemplo concreto (simulado)

Cobro de USD 2.500 con regla 20/20/60:

| Riel | Monto |
|------|-------|
| BELO_VAULT_SWEEP (ahorro) | 500 |
| BELO_TAX_ISOLATION_ESCROW (impuestos) | 500 |
| AVAILABLE_BALANCE | 1.500 |

El Risk Engine evalúa (puntaje simulado), se aplica 2FA si el umbral lo requiere, se genera el recibo de auditoría y se actualiza el ADF.

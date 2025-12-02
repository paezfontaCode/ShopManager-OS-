# 📱 Configuración de Notificaciones WhatsApp/SMS

## Descripción General
El sistema ahora soporta notificaciones automáticas vía WhatsApp y SMS cuando:
- ✅ Una reparación está lista para retirar (Estado: "Reparado")
- ✅ Un equipo ha sido entregado (Estado: "Entregado")

---

## 🚀 Configuración Rápida

### Opción 1: Modo Simulación (Sin Twilio)
Para probar sin configurar Twilio, las notificaciones se registrarán en los logs:

```bash
# En .env
NOTIFICATIONS_ENABLED=false
```

Los mensajes aparecerán en los logs como:
```
📱 [SIMULATION] WhatsApp to +584141234567: ¡Hola Juan! Su iPhone 13 Pro está listo...
```

### Opción 2: Twilio Sandbox (Gratis para pruebas)
1. **Crear cuenta Twilio**: https://www.twilio.com/try-twilio
2. **Activar WhatsApp Sandbox**:
   - Ve a: Console → Messaging → Try it out → Send a WhatsApp message
   - Envía mensaje a +1 415 523 8886 con el código que te dan
3. **Configurar .env**:
```bash
NOTIFICATIONS_ENABLED=true
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

**Limitaciones Sandbox**:
- Solo funciona con números que se registren enviando el código
- Máximo 5 números de prueba
- Gratis

### Opción 3: Twilio Producción (Pago)
1. **Aprobar número WhatsApp Business**: Requiere verificación de negocio
2. **Configurar número SMS**: Comprar número Twilio (~$1/mes)
3. **Configurar .env**:
```bash
NOTIFICATIONS_ENABLED=true
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_NUMBER=whatsapp:+58XXXXXXXXXX  # Tu número aprobado
TWILIO_SMS_NUMBER=+58XXXXXXXXXX  # Número Twilio para SMS
```

**Costos aproximados**:
- WhatsApp: $0.005 por mensaje
- SMS Venezuela: $0.02-0.05 por mensaje

---

## 📋 Variables de Entorno

Agregar a tu archivo `.env`:

```bash
# Notificaciones (WhatsApp/SMS via Twilio)
NOTIFICATIONS_ENABLED=true  # true para activar, false para simular
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886  # Sandbox o tu número
TWILIO_SMS_NUMBER=+1234567890  # Opcional: para SMS fallback
```

---

## 🔔 Mensajes Automáticos

### Cuando está "Reparado" (Listo para retirar):
```
¡Hola Juan Pérez! 👋

Su iPhone 13 Pro está listo para retirar. ✅

📋 Código: ABC123
🕐 Horario: Lunes a Viernes 9am-6pm

¡Gracias por confiar en nosotros!
```

### Cuando está "Entregado":
```
¡Gracias Juan Pérez! 🙏

Su iPhone 13 Pro ha sido entregado.

🛡️ Garantía: 8 días
📞 Cualquier problema, contáctenos.

¡Que disfrute su equipo!
```

---

## 🧪 Cómo Probar

### 1. Crear orden de trabajo con teléfono:
```
Nombre: Juan Pérez
Teléfono: +584141234567  (o tu número de prueba)
Cédula: V-12345678
Equipo: iPhone 13 Pro
Problema: Pantalla rota
```

### 2. Cambiar estado a "Reparado":
- Ve a la orden
- Cambia estado de "En Reparación" → "Reparado"
- **Automáticamente** se enviará WhatsApp/SMS

### 3. Verificar logs:
```bash
# Si NOTIFICATIONS_ENABLED=false
📱 [SIMULATION] WhatsApp to +584141234567: ¡Hola Juan!...

# Si NOTIFICATIONS_ENABLED=true
✅ WhatsApp sent to +584141234567 - SID: SMxxxxxxxx
📱 Notification sent for order ABC123 - Status: Reparado
```

---

## 🐳 Docker Configuration

Agregar a `docker-compose.yml`:

```yaml
backend:
  environment:
    - NOTIFICATIONS_ENABLED=${NOTIFICATIONS_ENABLED:-false}
    - TWILIO_ACCOUNT_SID=${TWILIO_ACCOUNT_SID}
    - TWILIO_AUTH_TOKEN=${TWILIO_AUTH_TOKEN}
    - TWILIO_WHATSAPP_NUMBER=${TWILIO_WHATSAPP_NUMBER:-whatsapp:+14155238886}
    - TWILIO_SMS_NUMBER=${TWILIO_SMS_NUMBER}
```

---

## 🔧 Personalizar Mensajes

Editar `backend/app/services/notifications.py`:

```python
class NotificationTemplates:
    @staticmethod
    def repair_ready(customer_name: str, device: str, code: str) -> str:
        return (
            f"¡Hola {customer_name}! 👋\n\n"
            f"Su {device} está listo. ✅\n\n"
            # Personaliza aquí...
        )
```

---

## ❓ Troubleshooting

### "Twilio not installed"
```bash
pip install twilio
```

### "Failed to initialize Twilio client"
- Verifica TWILIO_ACCOUNT_SID y TWILIO_AUTH_TOKEN
- Revisa que sean correctos en Twilio Console

### "No phone number for order"
- Asegúrate de agregar teléfono al crear la orden
- Formato: +58414XXXXXXX (con +)

### Mensajes no llegan
- **Sandbox**: Verifica que el número esté registrado
- **Producción**: Verifica que el número WhatsApp esté aprobado
- Revisa logs del backend para errores

---

## 📊 Monitoreo

Ver logs en tiempo real:
```bash
docker-compose logs -f backend
```

Buscar notificaciones:
```bash
docker-compose logs backend | grep "📱"
```

---

## 🎯 Próximos Pasos Sugeridos

1. **Recordatorios de Garantía**: Notificar 1 día antes de expirar
2. **Confirmación de Cita**: Recordar al cliente su cita
3. **Encuesta de Satisfacción**: Enviar después de entrega
4. **Promociones**: Notificar ofertas especiales

¿Necesitas ayuda? Revisa la documentación de Twilio: https://www.twilio.com/docs

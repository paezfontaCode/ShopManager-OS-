"""
Notification service for sending WhatsApp and SMS messages to customers.
Supports Twilio for both WhatsApp Business API and SMS.
"""
import os
import logging
from typing import Optional
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class NotificationService:
    """Service for sending notifications via WhatsApp and SMS"""
    
    def __init__(self):
        self.enabled = os.getenv("NOTIFICATIONS_ENABLED", "false").lower() == "true"
        self.twilio_account_sid = os.getenv("TWILIO_ACCOUNT_SID")
        self.twilio_auth_token = os.getenv("TWILIO_AUTH_TOKEN")
        self.twilio_whatsapp_number = os.getenv("TWILIO_WHATSAPP_NUMBER", "whatsapp:+14155238886")
        self.twilio_sms_number = os.getenv("TWILIO_SMS_NUMBER")
        
        self.client = None
        if self.enabled and self.twilio_account_sid and self.twilio_auth_token:
            try:
                from twilio.rest import Client
                self.client = Client(self.twilio_account_sid, self.twilio_auth_token)
                logger.info("✅ Twilio client initialized successfully")
            except ImportError:
                logger.warning("⚠️ Twilio not installed. Run: pip install twilio")
                self.enabled = False
            except Exception as e:
                logger.error(f"❌ Failed to initialize Twilio client: {e}")
                self.enabled = False
        else:
            logger.info("ℹ️ Notifications disabled or credentials not configured")
    
    def send_whatsapp(self, phone: str, message: str) -> bool:
        """
        Send WhatsApp message using Twilio
        
        Args:
            phone: Phone number in international format (e.g., +584141234567)
            message: Message text to send
            
        Returns:
            True if sent successfully, False otherwise
        """
        if not self.enabled or not self.client:
            logger.info(f"📱 [SIMULATION] WhatsApp to {phone}: {message}")
            return False
        
        try:
            # Ensure phone number starts with +
            if not phone.startswith('+'):
                phone = f'+{phone}'
            
            message_obj = self.client.messages.create(
                from_=self.twilio_whatsapp_number,
                body=message,
                to=f'whatsapp:{phone}'
            )
            
            logger.info(f"✅ WhatsApp sent to {phone} - SID: {message_obj.sid}")
            return True
            
        except Exception as e:
            logger.error(f"❌ Failed to send WhatsApp to {phone}: {e}")
            return False
    
    def send_sms(self, phone: str, message: str) -> bool:
        """
        Send SMS message using Twilio
        
        Args:
            phone: Phone number in international format
            message: Message text to send
            
        Returns:
            True if sent successfully, False otherwise
        """
        if not self.enabled or not self.client or not self.twilio_sms_number:
            logger.info(f"📧 [SIMULATION] SMS to {phone}: {message}")
            return False
        
        try:
            # Ensure phone number starts with +
            if not phone.startswith('+'):
                phone = f'+{phone}'
            
            message_obj = self.client.messages.create(
                from_=self.twilio_sms_number,
                body=message,
                to=phone
            )
            
            logger.info(f"✅ SMS sent to {phone} - SID: {message_obj.sid}")
            return True
            
        except Exception as e:
            logger.error(f"❌ Failed to send SMS to {phone}: {e}")
            return False
    
    def send_notification(self, phone: str, message: str, prefer_whatsapp: bool = True) -> bool:
        """
        Send notification with automatic fallback
        
        Args:
            phone: Phone number in international format
            message: Message text to send
            prefer_whatsapp: Try WhatsApp first, fallback to SMS if it fails
            
        Returns:
            True if any method succeeded, False otherwise
        """
        if not phone:
            logger.warning("⚠️ No phone number provided")
            return False
        
        if prefer_whatsapp:
            # Try WhatsApp first
            if self.send_whatsapp(phone, message):
                return True
            # Fallback to SMS
            logger.info("📱 WhatsApp failed, trying SMS fallback...")
            return self.send_sms(phone, message)
        else:
            # Send SMS directly
            return self.send_sms(phone, message)


# Notification message templates
class NotificationTemplates:
    """Pre-defined message templates for common notifications"""
    
    @staticmethod
    def repair_ready(customer_name: str, device: str, code: str) -> str:
        """Template for when repair is ready for pickup"""
        return (
            f"¡Hola {customer_name}! 👋\n\n"
            f"Su {device} está listo para retirar. ✅\n\n"
            f"📋 Código: {code}\n"
            f"🕐 Horario: Lunes a Viernes 9am-6pm\n\n"
            f"¡Gracias por confiar en nosotros!"
        )
    
    @staticmethod
    def repair_delivered(customer_name: str, device: str, warranty_days: int = 8) -> str:
        """Template for delivery confirmation"""
        return (
            f"¡Gracias {customer_name}! 🙏\n\n"
            f"Su {device} ha sido entregado.\n\n"
            f"🛡️ Garantía: {warranty_days} días\n"
            f"📞 Cualquier problema, contáctenos.\n\n"
            f"¡Que disfrute su equipo!"
        )
    
    @staticmethod
    def warranty_reminder(customer_name: str, device: str, days_left: int) -> str:
        """Template for warranty expiration reminder"""
        return (
            f"Hola {customer_name},\n\n"
            f"Recordatorio: La garantía de su {device} vence en {days_left} días.\n\n"
            f"Si tiene algún problema, repórtelo antes de que expire.\n\n"
            f"Gracias! 🙂"
        )
    
    @staticmethod
    def custom_message(customer_name: str, message: str) -> str:
        """Template for custom messages"""
        return f"Hola {customer_name},\n\n{message}"


# Global instance
notification_service = NotificationService()

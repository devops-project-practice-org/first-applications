import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import type { Property, User } from "@shared/schema";

interface WhatsAppButtonProps {
  property: Property;
  agent?: User | null;
  language: string;
}

export default function WhatsAppButton({ property, agent, language }: WhatsAppButtonProps) {
  const handleWhatsAppClick = () => {
    const propertyUrl = `${window.location.origin}/properties/${property.id}`;
    
    const messages = {
      en: {
        greeting: `Hello! I'm interested in this property:`,
        details: `Property: ${property.title}
Location: ${property.address}, ${property.city}
Price: ${formatPrice(property.price)}
Link: ${propertyUrl}

Could you please provide more details?`,
      },
      ur: {
        greeting: `السلام علیکم! میں اس پراپرٹی میں دلچسپی رکھتا ہوں:`,
        details: `پراپرٹی: ${property.title}
مقام: ${property.address}, ${property.city}
قیمت: ${formatPrice(property.price)}
لنک: ${propertyUrl}

کیا آپ مزید تفصیلات فراہم کر سکتے ہیں؟`,
      }
    };

    const currentLang = language as keyof typeof messages;
    const message = messages[currentLang] || messages.en;
    const fullMessage = `${message.greeting}\n\n${message.details}`;
    
    // Pakistani phone number format (example, replace with actual agent phone)
    const phoneNumber = agent?.phone || "923001234567"; // Default Pakistani number format
    const cleanPhone = phoneNumber.replace(/[^\d]/g, '');
    
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(fullMessage)}`;
    window.open(whatsappUrl, '_blank');
  };

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    if (numPrice >= 10000000) { // 1 crore
      return `Rs. ${(numPrice / 10000000).toFixed(1)} Crore`;
    } else if (numPrice >= 100000) { // 1 lakh
      return `Rs. ${(numPrice / 100000).toFixed(1)} Lakh`;
    } else {
      return `Rs. ${numPrice.toLocaleString()}`;
    }
  };

  return (
    <Button
      onClick={handleWhatsAppClick}
      className="w-full bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
    >
      <MessageSquare className="h-4 w-4" />
      {language === 'ur' ? 'WhatsApp پر رابطہ' : 'Contact via WhatsApp'}
    </Button>
  );
}
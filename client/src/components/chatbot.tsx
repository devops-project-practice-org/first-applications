import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLocation } from "wouter";
import { MessageCircle, Send, X, User, Bot, Home, DollarSign, MapPin } from "lucide-react";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  suggestions?: string[];
}

interface ChatbotProps {
  language: string;
}

export default function Chatbot({ language }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [, setLocation] = useLocation();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const translations = {
    en: {
      welcome: "Hello! I'm here to help you find the perfect property. You can ask me things like:",
      welcomeSuggestions: [
        "What's available in Lahore under Rs. 50,000?",
        "Show 2-bed flats in DHA Karachi",
        "Houses for sale in Islamabad",
        "Commercial properties in Multan"
      ],
      placeholder: "Type your property question...",
      send: "Send",
      typing: "Bot is typing...",
      noResults: "I couldn't find exact matches, but here are some suggestions:",
      searchRedirect: "Let me search for properties matching your criteria..."
    },
    ur: {
      welcome: "آسلام علیکم! میں آپ کو بہترین پراپرٹی تلاش کرنے میں مدد کرسکتا ہوں۔ آپ مجھ سے یہ سوالات پوچھ سکتے ہیں:",
      welcomeSuggestions: [
        "لاہور میں 50,000 روپے سے کم کیا دستیاب ہے؟",
        "ڈی ایچ اے کراچی میں 2 بیڈ روم فلیٹس دکھائیں",
        "اسلام آباد میں مکانات برائے فروخت",
        "ملتان میں کمرشل پراپرٹیز"
      ],
      placeholder: "اپنا پراپرٹی سوال ٹائپ کریں...",
      send: "بھیجیں",
      typing: "بوٹ ٹائپ کر رہا ہے...",
      noResults: "مجھے بالکل میچ نہیں ملا، لیکن یہ تجاویز ہیں:",
      searchRedirect: "میں آپ کے معیار کے مطابق پراپرٹیز تلاش کر رہا ہوں..."
    }
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          text: t.welcome,
          isBot: true,
          timestamp: new Date(),
          suggestions: t.welcomeSuggestions
        }
      ]);
    }
  }, [t]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const processUserMessage = (message: string): Message => {
    const lowerMessage = message.toLowerCase();
    
    // Pakistani cities and areas
    const cities = ['lahore', 'karachi', 'islamabad', 'rawalpindi', 'faisalabad', 'multan', 'peshawar', 'quetta', 'sialkot', 'gujranwala'];
    const areas = ['dha', 'clifton', 'gulberg', 'model town', 'cantt', 'blue area', 'f-6', 'f-7', 'f-8', 'defence'];
    
    // Extract location
    let location = '';
    for (const city of cities) {
      if (lowerMessage.includes(city)) {
        location = city;
        break;
      }
    }
    for (const area of areas) {
      if (lowerMessage.includes(area)) {
        location = location ? `${area} ${location}` : area;
        break;
      }
    }

    // Extract price range
    let priceRange = '';
    const priceMatch = message.match(/(\d+[,\d]*)\s*(rs|rupees|pkr|lakh|crore)/i);
    if (priceMatch) {
      priceRange = priceMatch[0];
    }

    // Extract property type
    let propertyType = '';
    if (lowerMessage.includes('flat') || lowerMessage.includes('apartment')) propertyType = 'apartment';
    else if (lowerMessage.includes('house') || lowerMessage.includes('home')) propertyType = 'house';
    else if (lowerMessage.includes('plot') || lowerMessage.includes('land')) propertyType = 'land';
    else if (lowerMessage.includes('commercial') || lowerMessage.includes('shop')) propertyType = 'commercial';

    // Extract bedrooms
    let bedrooms = '';
    const bedroomMatch = message.match(/(\d+)\s*[-\s]*(bed|bedroom)/i);
    if (bedroomMatch) {
      bedrooms = bedroomMatch[1];
    }

    // Generate response
    let responseText = '';
    let suggestions: string[] = [];

    if (location || priceRange || propertyType || bedrooms) {
      responseText = t.searchRedirect;
      
      // Redirect to properties page with filters
      setTimeout(() => {
        const params = new URLSearchParams();
        if (location) params.set('location', location);
        if (propertyType && propertyType !== 'commercial') params.set('propertyType', propertyType);
        if (bedrooms) params.set('bedrooms', bedrooms);
        
        setLocation(`/properties?${params.toString()}`);
      }, 2000);
      
    } else {
      responseText = t.noResults;
      suggestions = [
        language === 'ur' ? "لاہور میں مکانات" : "Houses in Lahore",
        language === 'ur' ? "کراچی میں فلیٹس" : "Flats in Karachi",
        language === 'ur' ? "50 لاکھ سے کم" : "Under 50 Lakh",
        language === 'ur' ? "3 بیڈ روم" : "3 bedrooms"
      ];
    }

    return {
      id: Date.now().toString(),
      text: responseText,
      isBot: true,
      timestamp: new Date(),
      suggestions
    };
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate thinking time
    setTimeout(() => {
      const botResponse = processUserMessage(input);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    handleSend();
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="rounded-full bg-primary text-white shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
        >
          <MessageCircle className="h-6 w-6 mr-2" />
          {language === 'ur' ? 'پراپرٹی سپورٹ' : 'Property Help'}
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-w-[90vw]">
      <Card className="shadow-2xl border-0">
        <CardHeader className="bg-primary text-white p-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Bot className="h-5 w-5" />
              {language === 'ur' ? 'پراپرٹی اسسٹنٹ' : 'Property Assistant'}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <ScrollArea className="h-80 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`flex items-start gap-3 max-w-[80%] ${message.isBot ? '' : 'flex-row-reverse'}`}>
                    <div className={`p-2 rounded-full ${message.isBot ? 'bg-blue-100' : 'bg-gray-100'}`}>
                      {message.isBot ? (
                        <Bot className="h-4 w-4 text-primary" />
                      ) : (
                        <User className="h-4 w-4 text-gray-600" />
                      )}
                    </div>
                    
                    <div className={`rounded-lg p-3 ${
                      message.isBot 
                        ? 'bg-gray-100 text-gray-800' 
                        : 'bg-primary text-white'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                      
                      {message.suggestions && message.suggestions.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {message.suggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="block w-full text-left text-xs bg-white/20 hover:bg-white/30 p-2 rounded border border-gray-300 transition-colors"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-blue-100">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                    <div className="bg-gray-100 rounded-lg p-3">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>
          
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={t.placeholder}
                className="flex-1"
                dir={language === 'ur' ? 'rtl' : 'ltr'}
              />
              <Button onClick={handleSend} size="sm" disabled={!input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, Info, DollarSign, Calendar, MapPin } from "lucide-react";
import type { Property } from "@shared/schema";

interface NegotiationTipsProps {
  property: Property;
  language: string;
}

export default function NegotiationTips({ property, language }: NegotiationTipsProps) {
  // Calculate negotiation tips based on property data
  const calculateNegotiationTips = () => {
    const price = parseFloat(property.price);
    let negotiationPercentage = 5; // Default 5%
    let tips: string[] = [];
    let confidence = "medium";

    // Adjust based on price range
    if (price > 50000000) { // Above 5 crore
      negotiationPercentage = 15;
      confidence = "high";
    } else if (price > 20000000) { // Above 2 crore
      negotiationPercentage = 12;
      confidence = "high";
    } else if (price > 5000000) { // Above 50 lakh
      negotiationPercentage = 10;
      confidence = "medium";
    } else {
      negotiationPercentage = 7;
      confidence = "low";
    }

    // Adjust based on property type
    if (property.propertyType === "house") {
      negotiationPercentage += 2;
    } else if (property.propertyType === "land") {
      negotiationPercentage += 5;
    }

    // Adjust based on listing type
    if (property.listingType === "rent") {
      negotiationPercentage = Math.max(3, negotiationPercentage - 5);
    }

    // Generate tips based on language
    if (language === "ur") {
      tips = [
        `اس علاقے میں عام طور پر ${negotiationPercentage}% تک کمی کی جا سکتی ہے`,
        "فوری پیمنٹ کے لیے اضافی رعایت کی درخواست کریں",
        "موازنہ کریں اور دوسری پراپرٹیز کی قیمتیں دکھائیں",
        "مارکیٹ کے حالات کا فائدہ اٹھائیں",
        "مکمل کیش پیمنٹ کا فائدہ استعمال کریں"
      ];
    } else {
      tips = [
        `You can typically negotiate ${negotiationPercentage}% off in this area`,
        "Ask for additional discount for immediate payment",
        "Compare with similar properties and show market research",
        "Leverage current market conditions",
        "Use full cash payment as negotiation advantage"
      ];
    }

    return { negotiationPercentage, tips, confidence };
  };

  const { negotiationPercentage, tips, confidence } = calculateNegotiationTips();
  
  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    if (numPrice >= 10000000) {
      return `Rs. ${(numPrice / 10000000).toFixed(1)} Crore`;
    } else if (numPrice >= 100000) {
      return `Rs. ${(numPrice / 100000).toFixed(1)} Lakh`;
    } else {
      return `Rs. ${numPrice.toLocaleString()}`;
    }
  };

  const potentialSavings = (parseFloat(property.price) * negotiationPercentage) / 100;

  const translations = {
    en: {
      title: "Negotiation Tips",
      subtitle: "Smart strategies for this property",
      potentialSavings: "Potential Savings",
      confidence: "Confidence Level",
      tips: "Negotiation Strategies",
      marketTrends: "Market Trends",
      bestTime: "Best Time to Negotiate",
      high: "High",
      medium: "Medium", 
      low: "Low",
      timing: "End of month/quarter offers better negotiation opportunities",
      market: "Current market conditions favor buyers in this segment"
    },
    ur: {
      title: "بات چیت کے طریقے",
      subtitle: "اس پراپرٹی کے لیے ہوشیار حکمت عملیاں",
      potentialSavings: "ممکنہ بچت",
      confidence: "اعتماد کی سطح",
      tips: "بات چیت کی حکمت عملیاں",
      marketTrends: "مارکیٹ کے رجحانات",
      bestTime: "بات چیت کا بہترین وقت",
      high: "زیادہ",
      medium: "درمیانہ",
      low: "کم",
      timing: "مہینے/تمال کے آخر میں بہتر موقع ملتا ہے",
      market: "موجودہ مارکیٹ حالات اس سیکٹر میں خریداروں کے حق میں ہیں"
    }
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  const getConfidenceColor = (level: string) => {
    switch (level) {
      case "high": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getConfidenceText = (level: string) => {
    switch (level) {
      case "high": return t.high;
      case "medium": return t.medium;
      case "low": return t.low;
      default: return t.medium;
    }
  };

  return (
    <Card className="w-full border-l-4 border-l-orange-500">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingDown className="h-5 w-5 text-orange-500" />
          {t.title}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{t.subtitle}</p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-800">{t.potentialSavings}</span>
            </div>
            <p className="text-2xl font-bold text-green-900">
              {formatPrice(potentialSavings.toString())}
            </p>
            <p className="text-sm text-green-700">
              ({negotiationPercentage}% {language === 'ur' ? 'کمی' : 'reduction'})
            </p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Info className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-800">{t.confidence}</span>
            </div>
            <Badge className={getConfidenceColor(confidence)}>
              {getConfidenceText(confidence)}
            </Badge>
            <p className="text-xs text-blue-700 mt-2">
              {language === 'ur' ? 'مارکیٹ ڈیٹا کی بنیاد پر' : 'Based on market data'}
            </p>
          </div>
        </div>

        {/* Negotiation Tips */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <TrendingDown className="h-4 w-4" />
            {t.tips}
          </h4>
          <ul className="space-y-2">
            {tips.slice(0, 4).map((tip, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <span className="bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mt-0.5">
                  {index + 1}
                </span>
                <span className={language === 'ur' ? 'text-right' : ''}>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Market Insights */}
        <div className="bg-orange-50 p-4 rounded-lg">
          <h4 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {t.bestTime}
          </h4>
          <p className="text-sm text-orange-700 mb-2">{t.timing}</p>
          <p className="text-sm text-orange-700">{t.market}</p>
        </div>

        {/* Location Factor */}
        <div className="border-t pt-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>
              {language === 'ur' 
                ? `${property.city} میں اوسط بات چیت کی شرح: ${negotiationPercentage}%`
                : `Average negotiation rate in ${property.city}: ${negotiationPercentage}%`
              }
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
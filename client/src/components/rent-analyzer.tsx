import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, Building, Home } from "lucide-react";

interface RentAnalyzerProps {
  language: string;
}

export default function RentAnalyzer({ language }: RentAnalyzerProps) {
  const [selectedCity, setSelectedCity] = useState("lahore");
  const [selectedType, setSelectedType] = useState("all");

  // Sample data - in real app, this would come from API
  const rentData = {
    lahore: {
      apartment: { avg: 45000, trend: "up", change: 8 },
      house: { avg: 75000, trend: "up", change: 12 },
      townhouse: { avg: 65000, trend: "down", change: -3 },
      condo: { avg: 55000, trend: "up", change: 5 }
    },
    karachi: {
      apartment: { avg: 40000, trend: "up", change: 10 },
      house: { avg: 80000, trend: "up", change: 15 },
      townhouse: { avg: 70000, trend: "down", change: -2 },
      condo: { avg: 50000, trend: "up", change: 7 }
    },
    islamabad: {
      apartment: { avg: 55000, trend: "up", change: 6 },
      house: { avg: 95000, trend: "up", change: 18 },
      townhouse: { avg: 85000, trend: "up", change: 4 },
      condo: { avg: 65000, trend: "up", change: 9 }
    },
    rawalpindi: {
      apartment: { avg: 35000, trend: "up", change: 4 },
      house: { avg: 60000, trend: "up", change: 8 },
      townhouse: { avg: 55000, trend: "down", change: -1 },
      condo: { avg: 45000, trend: "up", change: 3 }
    }
  };

  const translations = {
    en: {
      title: "Rent Analyzer",
      subtitle: "Average rental prices across Pakistan",
      city: "City",
      propertyType: "Property Type",
      all: "All Types",
      apartment: "Apartments",
      house: "Houses", 
      townhouse: "Townhouses",
      condo: "Condos",
      avgRent: "Avg. Rent",
      monthlyChange: "Monthly Change",
      chartTitle: "Average Rent by Property Type",
      rupees: "Rs."
    },
    ur: {
      title: "کرایہ تجزیہ کار",
      subtitle: "پاکستان بھر میں اوسط کرائے کی قیمتیں",
      city: "شہر",
      propertyType: "پراپرٹی کی قسم",
      all: "تمام اقسام",
      apartment: "فلیٹس",
      house: "مکانات",
      townhouse: "ٹاؤن ہاؤس",
      condo: "کنڈو",
      avgRent: "اوسط کرایہ",
      monthlyChange: "ماہانہ تبدیلی",
      chartTitle: "پراپرٹی کی قسم کے لحاظ سے اوسط کرایہ",
      rupees: "روپے"
    }
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  const cities = [
    { value: "lahore", label: language === "ur" ? "لاہور" : "Lahore" },
    { value: "karachi", label: language === "ur" ? "کراچی" : "Karachi" },
    { value: "islamabad", label: language === "ur" ? "اسلام آباد" : "Islamabad" },
    { value: "rawalpindi", label: language === "ur" ? "راولپنڈی" : "Rawalpindi" }
  ];

  const propertyTypes = [
    { value: "all", label: t.all },
    { value: "apartment", label: t.apartment },
    { value: "house", label: t.house },
    { value: "townhouse", label: t.townhouse },
    { value: "condo", label: t.condo }
  ];

  const formatPrice = (price: number) => {
    if (price >= 100000) {
      return `${(price / 100000).toFixed(1)} ${language === 'ur' ? 'لاکھ' : 'Lakh'}`;
    }
    return `${(price / 1000).toFixed(0)}K`;
  };

  const chartData = Object.entries(rentData[selectedCity as keyof typeof rentData]).map(([type, data]) => ({
    name: t[type as keyof typeof t] || type,
    value: data.avg,
    trend: data.trend,
    change: data.change
  }));

  const filteredData = selectedType === "all" 
    ? chartData 
    : chartData.filter(item => item.name === t[selectedType as keyof typeof t]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          {t.title}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{t.subtitle}</p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">{t.city}</label>
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city.value} value={city.value}>
                    {city.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">{t.propertyType}</label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {propertyTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {chartData.map((item) => (
            <Card key={item.name} className="border-l-4 border-l-primary">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-muted-foreground">{item.name}</h4>
                  <Home className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold">
                    {t.rupees} {formatPrice(item.value)}
                  </p>
                  <div className="flex items-center text-sm">
                    {item.trend === "up" ? (
                      <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                    )}
                    <span className={item.trend === "up" ? "text-green-500" : "text-red-500"}>
                      {item.change > 0 ? "+" : ""}{item.change}%
                    </span>
                    <span className="text-muted-foreground ml-1">{t.monthlyChange}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Chart */}
        <div>
          <h3 className="text-lg font-semibold mb-4">{t.chartTitle}</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => formatPrice(value)}
                />
                <Tooltip 
                  formatter={(value: number) => [`${t.rupees} ${value.toLocaleString()}`, t.avgRent]}
                  labelStyle={{ color: '#000' }}
                />
                <Bar 
                  dataKey="value" 
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Market Insights */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">
            {language === 'ur' ? 'مارکیٹ کی بصیرت' : 'Market Insights'}
          </h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>
              • {language === 'ur' 
                ? `${cities.find(c => c.value === selectedCity)?.label} میں اوسط کرایہ ${formatPrice(Object.values(rentData[selectedCity as keyof typeof rentData]).reduce((acc, curr) => acc + curr.avg, 0) / 4)} ہے`
                : `Average rent in ${cities.find(c => c.value === selectedCity)?.label} is ${t.rupees} ${formatPrice(Object.values(rentData[selectedCity as keyof typeof rentData]).reduce((acc, curr) => acc + curr.avg, 0) / 4)}`
              }
            </li>
            <li>
              • {language === 'ur' 
                ? 'مکانات عام طور پر فلیٹس سے زیادہ مہنگے ہیں'
                : 'Houses are generally more expensive than apartments'
              }
            </li>
            <li>
              • {language === 'ur' 
                ? 'کرائے کی قیمتیں پچھلے مہینے سے بڑھ رہی ہیں'
                : 'Rental prices are trending upward from last month'
              }
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
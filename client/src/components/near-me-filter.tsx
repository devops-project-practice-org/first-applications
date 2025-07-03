import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NearMeFilterProps {
  onLocationFound: (location: { lat: number; lng: number; address?: string }) => void;
  language: string;
}

export default function NearMeFilter({ onLocationFound, language }: NearMeFilterProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const translations = {
    en: {
      buttonText: "Near Me",
      loading: "Finding location...",
      error: "Location access denied",
      errorDesc: "Please enable location access to find properties near you",
      success: "Location found!",
      successDesc: "Searching for properties in your area"
    },
    ur: {
      buttonText: "میرے قریب",
      loading: "مقام تلاش کر رہے ہیں...",
      error: "مقام تک رسائی سے انکار",
      errorDesc: "آپ کے قریب پراپرٹیز تلاش کرنے کے لیے مقام کی رسائی فعال کریں",
      success: "مقام مل گیا!",
      successDesc: "آپ کے علاقے میں پراپرٹیز تلاش کر رہے ہیں"
    }
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  const handleNearMeClick = () => {
    if (!navigator.geolocation) {
      toast({
        title: t.error,
        description: "Geolocation is not supported by this browser",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Reverse geocoding to get address (using a free service)
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          
          if (response.ok) {
            const data = await response.json();
            const address = `${data.locality || ''}, ${data.city || ''}, ${data.principalSubdivision || ''}`;
            
            onLocationFound({
              lat: latitude,
              lng: longitude,
              address: address.trim().replace(/^,\s*|,\s*$/g, '') // Clean up commas
            });

            toast({
              title: t.success,
              description: t.successDesc,
            });
          } else {
            // Fallback without address
            onLocationFound({
              lat: latitude,
              lng: longitude
            });

            toast({
              title: t.success,
              description: t.successDesc,
            });
          }
        } catch (error) {
          // Even if reverse geocoding fails, we can still use coordinates
          onLocationFound({
            lat: latitude,
            lng: longitude
          });

          toast({
            title: t.success,
            description: t.successDesc,
          });
        }
        
        setIsLoading(false);
      },
      (error) => {
        setIsLoading(false);
        
        let errorMessage = t.errorDesc;
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = t.errorDesc;
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = language === 'ur' 
              ? "مقام کی معلومات دستیاب نہیں" 
              : "Location information unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = language === 'ur' 
              ? "مقام تلاش کرنے میں وقت ختم" 
              : "Location request timed out";
            break;
        }

        toast({
          title: t.error,
          description: errorMessage,
          variant: "destructive",
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  return (
    <Button
      onClick={handleNearMeClick}
      disabled={isLoading}
      variant="outline"
      className="flex items-center gap-2"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <MapPin className="h-4 w-4" />
      )}
      {isLoading ? t.loading : t.buttonText}
    </Button>
  );
}
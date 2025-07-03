import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';

interface PropertyMapProps {
  latitude: number;
  longitude: number;
  propertyTitle?: string;
  address?: string;
  language?: string;
}

export default function PropertyMap({ 
  latitude, 
  longitude, 
  propertyTitle, 
  address,
  language = 'en' 
}: PropertyMapProps) {
  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(url, '_blank');
  };

  const openDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    window.open(url, '_blank');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          {language === 'ur' ? 'مقام' : 'Location'}
        </CardTitle>
        {address && (
          <p className="text-sm text-neutral-600">{address}</p>
        )}
      </CardHeader>
      <CardContent>
        {/* Static Map Placeholder with Property Info */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 mb-4 border-2 border-blue-200">
          <div className="text-center">
            <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-8 w-8 text-white" />
            </div>
            <h3 className="font-semibold text-lg text-neutral-800 mb-2">
              {propertyTitle || (language === 'ur' ? 'پراپرٹی کا مقام' : 'Property Location')}
            </h3>
            <p className="text-neutral-600 mb-4">{address}</p>
            
            {/* Coordinates */}
            <div className="bg-white rounded-lg p-3 mb-4 inline-block">
              <p className="text-sm text-neutral-600">
                <span className="font-medium">
                  {language === 'ur' ? 'احداثیات:' : 'Coordinates:'}
                </span>
              </p>
              <p className="font-mono text-sm text-blue-600">
                {Number(latitude).toFixed(6)}, {Number(longitude).toFixed(6)}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button 
            onClick={openInGoogleMaps}
            className="w-full flex items-center gap-2"
            variant="default"
          >
            <ExternalLink className="h-4 w-4" />
            {language === 'ur' ? 'Google Maps میں دیکھیں' : 'View on Google Maps'}
          </Button>
          
          <Button 
            onClick={openDirections}
            className="w-full flex items-center gap-2"
            variant="outline"
          >
            <Navigation className="h-4 w-4" />
            {language === 'ur' ? 'راستہ دیکھیں' : 'Get Directions'}
          </Button>
        </div>

        {/* Additional Location Info */}
        <div className="mt-4 p-3 bg-neutral-50 rounded-lg">
          <p className="text-xs text-neutral-600 text-center">
            {language === 'ur' 
              ? 'بہتر نقشہ دیکھنے کے لیے اوپر کے بٹن استعمال کریں'
              : 'Use the buttons above to view interactive maps and get directions'
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
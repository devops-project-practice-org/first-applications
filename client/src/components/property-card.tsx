import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Bed, Bath, Square, MapPin } from "lucide-react";
import { Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { getAuthHeaders } from "@/lib/auth";
import type { Property } from "@shared/schema";

interface PropertyCardProps {
  property: Property;
  isSaved?: boolean;
  showSaveButton?: boolean;
}

export default function PropertyCard({ property, isSaved = false, showSaveButton = true }: PropertyCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  const toggleSaved = useMutation({
    mutationFn: async () => {
      const method = isSaved ? "DELETE" : "POST";
      await fetch(`/api/saved-properties/${property.id}`, {
        method,
        headers: getAuthHeaders(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/saved-properties"] });
      toast({
        title: isSaved ? "Property removed" : "Property saved",
        description: isSaved 
          ? "Property removed from your saved list" 
          : "Property added to your saved list",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save properties",
        variant: "destructive",
      });
      return;
    }
    
    toggleSaved.mutate();
  };

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(numPrice);
  };

  const primaryImage = property.images && property.images.length > 0 
    ? property.images[0] 
    : 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600';

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="relative">
        <Link href={`/properties/${property.id}`}>
          <img
            src={primaryImage}
            alt={property.title}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        
        <div className="absolute top-4 left-4 flex gap-2">
          {property.isFeatured && (
            <Badge className="bg-secondary text-white">Featured</Badge>
          )}
          {property.status === "pending" && (
            <Badge className="bg-yellow-600 text-white">Pending</Badge>
          )}
          {property.status === "sold" && (
            <Badge className="bg-red-600 text-white">Sold</Badge>
          )}
        </div>
        
        {showSaveButton && (
          <div className="absolute top-4 right-4">
            <Button
              variant="secondary"
              size="icon"
              className="bg-white/80 hover:bg-white"
              onClick={handleSaveClick}
              disabled={toggleSaved.isPending}
            >
              <Heart 
                className={`h-4 w-4 ${isSaved ? "fill-red-500 text-red-500" : "text-neutral-600"}`} 
              />
            </Button>
          </div>
        )}
        
        <div className="absolute bottom-4 left-4">
          <div className="bg-black/75 text-white px-3 py-1 rounded-lg text-lg font-bold">
            {formatPrice(property.price)}
          </div>
        </div>
      </div>
      
      <CardContent className="p-6">
        <Link href={`/properties/${property.id}`}>
          <h3 className="text-xl font-semibold text-neutral-800 mb-2 hover:text-primary transition-colors cursor-pointer">
            {property.title}
          </h3>
        </Link>
        
        <p className="text-neutral-600 mb-4 flex items-center">
          <MapPin className="h-4 w-4 mr-2" />
          {property.address}, {property.city}, {property.state}
        </p>
        
        <div className="flex items-center space-x-6 text-sm text-neutral-600 mb-4">
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-1" />
            <span>{property.bedrooms}</span> bed{property.bedrooms !== 1 ? 's' : ''}
          </div>
          <div className="flex items-center">
            <Bath className="h-4 w-4 mr-1" />
            <span>{property.bathrooms}</span> bath{parseFloat(property.bathrooms) !== 1 ? 's' : ''}
          </div>
          <div className="flex items-center">
            <Square className="h-4 w-4 mr-1" />
            <span>{property.sqft.toLocaleString()}</span> sqft
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-neutral-500">
            {property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1)} • {property.listingType === "sale" ? "For Sale" : "For Rent"}
          </div>
          <Link href={`/properties/${property.id}`}>
            <Button variant="ghost" className="text-primary hover:text-blue-700 font-medium text-sm">
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

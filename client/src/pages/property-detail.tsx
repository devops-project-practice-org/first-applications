import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute } from "wouter";
import Navigation from "@/components/navigation";
import WhatsAppButton from "@/components/whatsapp-button";
import NegotiationTips from "@/components/negotiation-tips";
import PropertyMap from "@/components/property-map";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { getAuthHeaders } from "@/lib/auth";
import {
  Bed,
  Bath,
  Square,
  Calendar,
  MapPin,
  Heart,
  Phone,
  Video,
  Images,
  Star,
  Check,
} from "lucide-react";
import { useState } from "react";
import type { Property, User, InsertInquiry } from "@shared/schema";

export default function PropertyDetail() {
  const [, params] = useRoute("/properties/:id");
  const { user } = useAuth();
  const { language } = useLanguage();
  const { toast } = useToast();
  const [inquiryForm, setInquiryForm] = useState({
    name: user ? `${user.firstName} ${user.lastName}` : "",
    email: user?.email || "",
    phone: "",
    message: "",
  });

  const propertyId = params?.id ? parseInt(params.id) : 0;

  const { data: property, isLoading } = useQuery<Property & { agent: User | null }>({
    queryKey: [`/api/properties/${propertyId}`],
    enabled: !!propertyId,
  });

  const { data: isSaved } = useQuery<{ isSaved: boolean }>({
    queryKey: [`/api/saved-properties/${propertyId}/status`],
    enabled: !!user && !!propertyId,
    queryFn: async () => {
      const response = await fetch(`/api/saved-properties/${propertyId}/status`, {
        headers: getAuthHeaders(),
      });
      return response.json();
    },
  });

  const toggleSaved = useMutation({
    mutationFn: async () => {
      const method = isSaved?.isSaved ? "DELETE" : "POST";
      await fetch(`/api/saved-properties/${propertyId}`, {
        method,
        headers: getAuthHeaders(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/saved-properties/${propertyId}/status`] });
      queryClient.invalidateQueries({ queryKey: ["/api/saved-properties"] });
      toast({
        title: isSaved?.isSaved ? "Property removed" : "Property saved",
        description: isSaved?.isSaved 
          ? "Property removed from your saved list" 
          : "Property added to your saved list",
      });
    },
  });

  const submitInquiry = useMutation({
    mutationFn: async (inquiryData: InsertInquiry) => {
      const response = await apiRequest("POST", "/api/inquiries", inquiryData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Inquiry sent!",
        description: "Your message has been sent to the agent. They will contact you soon.",
      });
      setInquiryForm({
        name: user ? `${user.firstName} ${user.lastName}` : "",
        email: user?.email || "",
        phone: "",
        message: "",
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

  const handleSaveClick = () => {
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

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryForm.name || !inquiryForm.email || !inquiryForm.message) {
      toast({
        title: "Required fields missing",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    submitInquiry.mutate({
      propertyId,
      userId: user?.id,
      name: inquiryForm.name,
      email: inquiryForm.email,
      phone: inquiryForm.phone || undefined,
      message: inquiryForm.message,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-300 rounded-2xl mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-8 bg-gray-300 rounded mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-6 w-2/3"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
              </div>
              <div className="lg:col-span-1">
                <div className="h-64 bg-gray-300 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-neutral-800 mb-4">Property Not Found</h1>
            <p className="text-neutral-600">The property you're looking for doesn't exist or has been removed.</p>
          </div>
        </div>
      </div>
    );
  }

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
    : 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800';

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Property Gallery */}
          <div className="relative h-96 md:h-[500px]">
            <img
              src={primaryImage}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            
            <div className="absolute bottom-6 left-6">
              <div className="flex space-x-2">
                <Button variant="secondary" className="bg-white/90 hover:bg-white">
                  <Images className="mr-2 h-4 w-4" />
                  View All Photos ({property.images?.length || 1})
                </Button>
                <Button variant="secondary" className="bg-white/90 hover:bg-white">
                  <Video className="mr-2 h-4 w-4" />
                  Virtual Tour
                </Button>
              </div>
            </div>
            
            <div className="absolute top-6 right-6">
              <Button
                variant="secondary"
                size="icon"
                className="bg-white/90 hover:bg-white p-3"
                onClick={handleSaveClick}
                disabled={toggleSaved.isPending}
              >
                <Heart 
                  className={`h-5 w-5 ${isSaved?.isSaved ? "fill-red-500 text-red-500" : "text-neutral-700"}`} 
                />
              </Button>
            </div>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h1 className="text-3xl font-bold text-neutral-800">{property.title}</h1>
                    <span className="text-3xl font-bold text-primary">{formatPrice(property.price)}</span>
                  </div>
                  
                  <p className="text-lg text-neutral-600 flex items-center mb-4">
                    <MapPin className="mr-2 h-5 w-5" />
                    {property.address}, {property.city}, {property.state} {property.zipCode}
                  </p>
                  
                  <div className="flex items-center space-x-8 text-neutral-600 mb-6">
                    <div className="flex items-center">
                      <Bed className="mr-2 h-5 w-5 text-primary" />
                      <span className="font-semibold">{property.bedrooms}</span> Bedrooms
                    </div>
                    <div className="flex items-center">
                      <Bath className="mr-2 h-5 w-5 text-primary" />
                      <span className="font-semibold">{property.bathrooms}</span> Bathrooms
                    </div>
                    <div className="flex items-center">
                      <Square className="mr-2 h-5 w-5 text-primary" />
                      <span className="font-semibold">{property.sqft.toLocaleString()}</span> sq ft
                    </div>
                    {property.yearBuilt && (
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-5 w-5 text-primary" />
                        Built in <span className="font-semibold ml-1">{property.yearBuilt}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2 mb-6">
                    <Badge variant="secondary">
                      {property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1)}
                    </Badge>
                    <Badge variant={property.listingType === "sale" ? "default" : "outline"}>
                      For {property.listingType === "sale" ? "Sale" : "Rent"}
                    </Badge>
                    {property.isFeatured && (
                      <Badge className="bg-secondary">Featured</Badge>
                    )}
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-6 mb-6">
                  <h2 className="text-xl font-semibold text-neutral-800 mb-4">Description</h2>
                  <p className="text-neutral-600 leading-relaxed whitespace-pre-line">
                    {property.description}
                  </p>
                </div>
                
                {property.features && property.features.length > 0 && (
                  <div className="border-t border-gray-200 pt-6 mb-6">
                    <h2 className="text-xl font-semibold text-neutral-800 mb-4">Features & Amenities</h2>
                    <div className="grid grid-cols-2 gap-4">
                      {property.features.map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <Check className="h-4 w-4 text-secondary mr-3" />
                          <span className="text-neutral-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Google Maps Integration */}
                <div className="border-t border-gray-200 pt-6">
                  {property.latitude && property.longitude ? (
                    <PropertyMap
                      latitude={Number(property.latitude)}
                      longitude={Number(property.longitude)}
                      propertyTitle={property.title}
                      address={`${property.address}, ${property.city}, ${property.state} ${property.zipCode}`}
                      language={language}
                    />
                  ) : (
                    <div>
                      <h2 className="text-xl font-semibold text-neutral-800 mb-4">
                        {language === 'ur' ? 'مقام اور محلہ' : 'Location & Neighborhood'}
                      </h2>
                      <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                        <div className="text-center text-neutral-500">
                          <MapPin className="h-12 w-12 mx-auto mb-2" />
                          <p className="font-medium">
                            {language === 'ur' ? 'مقام کی معلومات دستیاب نہیں' : 'Location information not available'}
                          </p>
                          <p className="text-sm">{property.address}, {property.city}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Contact Sidebar */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardHeader>
                    {property.agent ? (
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={property.agent.profileImage || ""} />
                          <AvatarFallback>
                            {property.agent.firstName?.[0]}{property.agent.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">
                            {property.agent.firstName} {property.agent.lastName}
                          </CardTitle>
                          <p className="text-sm text-neutral-600">Real Estate Agent</p>
                          <div className="flex items-center mt-1">
                            <div className="flex text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="h-3 w-3 fill-current" />
                              ))}
                            </div>
                            <span className="text-xs text-neutral-600 ml-2">4.9 (127 reviews)</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <CardTitle>Contact About This Property</CardTitle>
                    )}
                  </CardHeader>
                  
                  <CardContent>
                    <form onSubmit={handleInquirySubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={inquiryForm.name}
                          onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                          placeholder="Enter your name"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={inquiryForm.email}
                          onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={inquiryForm.phone}
                          onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                          placeholder="Enter your phone"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                          id="message"
                          rows={4}
                          value={inquiryForm.message}
                          onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                          placeholder="I'm interested in this property..."
                          required
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={submitInquiry.isPending}
                      >
                        {submitInquiry.isPending ? "Sending..." : "Send Message"}
                      </Button>
                    </form>
                    
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="flex space-x-3">
                        <WhatsAppButton 
                          property={property} 
                          agent={property.agent} 
                          language={language} 
                        />
                        <Button variant="outline" className="flex-1">
                          <Calendar className="mr-2 h-4 w-4" />
                          {language === 'ur' ? 'ٹور' : 'Tour'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Negotiation Tips Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <NegotiationTips property={property} language={language} />
      </div>
    </div>
  );
}

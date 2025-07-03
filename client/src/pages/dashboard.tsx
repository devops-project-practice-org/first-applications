import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Navigation from "@/components/navigation";
import PropertyCard from "@/components/property-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { getAuthHeaders } from "@/lib/auth";
import {
  User,
  Heart,
  Search,
  Settings,
  PlusCircle,
  Home,
  BarChart3,
  MessageSquare,
  Calendar,
  MapPin,
  Bed,
  Bath,
  Square,
  Trash2,
  Edit,
  Eye,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPropertySchema, insertUserSchema } from "@shared/schema";
import type { Property, SavedProperty, Inquiry, InsertProperty, User as UserType } from "@shared/schema";

export default function Dashboard() {
  const [location, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Parse tab from URL params
  const urlParams = new URLSearchParams(location.split("?")[1] || "");
  const [activeTab, setActiveTab] = useState(urlParams.get("tab") || "overview");

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      setLocation("/auth");
    }
  }, [user, setLocation]);

  // Update URL when tab changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (activeTab !== "overview") {
      params.set("tab", activeTab);
    }
    const newUrl = params.toString() ? `/dashboard?${params.toString()}` : "/dashboard";
    if (location !== newUrl) {
      window.history.replaceState({}, "", newUrl);
    }
  }, [activeTab, location]);

  // Queries
  const { data: savedProperties, isLoading: savedLoading } = useQuery<(SavedProperty & { property: Property })[]>({
    queryKey: ["/api/saved-properties"],
    enabled: !!user,
  });

  const { data: myInquiries } = useQuery<Inquiry[]>({
    queryKey: ["/api/inquiries/my"],
    enabled: !!user,
  });

  const { data: myProperties } = useQuery<Property[]>({
    queryKey: [`/api/properties/agent/${user?.id}`],
    enabled: !!user && user.role === "agent",
    queryFn: async () => {
      const response = await fetch(`/api/properties?agentId=${user?.id}`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch properties");
      const data = await response.json();
      return data.properties || [];
    },
  });

  // Profile update form
  const profileForm = useForm({
    resolver: zodResolver(insertUserSchema.partial().omit({ password: true })),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
    },
  });

  // Property creation form
  const propertyForm = useForm({
    resolver: zodResolver(insertPropertySchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      propertyType: "house",
      listingType: "sale",
      bedrooms: 1,
      bathrooms: "1",
      sqft: 1000,
      address: "",
      city: "",
      state: "",
      zipCode: "",
      features: [],
    },
  });

  // Mutations
  const updateProfile = useMutation({
    mutationFn: async (data: Partial<UserType>) => {
      const response = await apiRequest("PUT", "/api/users/profile", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
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

  const createProperty = useMutation({
    mutationFn: async (data: InsertProperty) => {
      const response = await apiRequest("POST", "/api/properties", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/properties/agent/${user?.id}`] });
      toast({
        title: "Property created",
        description: "Your property has been listed successfully.",
      });
      propertyForm.reset();
      setActiveTab("properties");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteProperty = useMutation({
    mutationFn: async (propertyId: number) => {
      await fetch(`/api/properties/${propertyId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/properties/agent/${user?.id}`] });
      toast({
        title: "Property deleted",
        description: "The property has been removed successfully.",
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

  const onProfileSubmit = (data: any) => {
    updateProfile.mutate(data);
  };

  const onPropertySubmit = (data: any) => {
    createProperty.mutate({
      ...data,
      price: data.price.toString(),
      bathrooms: data.bathrooms.toString(),
      features: data.features ? data.features.split(",").map((f: string) => f.trim()) : [],
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
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

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-6">
                  <Avatar className="h-16 w-16 mr-4">
                    <AvatarImage src={user.profileImage || ""} />
                    <AvatarFallback>
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-neutral-800">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-sm text-neutral-600">{user.email}</p>
                    <Badge variant="secondary" className="mt-1">
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                  </div>
                </div>
                
                <nav className="space-y-2">
                  <Button
                    variant={activeTab === "overview" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("overview")}
                  >
                    <BarChart3 className="mr-3 h-4 w-4" />
                    Dashboard
                  </Button>
                  <Button
                    variant={activeTab === "saved" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("saved")}
                  >
                    <Heart className="mr-3 h-4 w-4" />
                    Saved Properties
                  </Button>
                  <Button
                    variant={activeTab === "inquiries" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("inquiries")}
                  >
                    <MessageSquare className="mr-3 h-4 w-4" />
                    My Inquiries
                  </Button>
                  {user.role === "agent" && (
                    <>
                      <Button
                        variant={activeTab === "properties" ? "default" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => setActiveTab("properties")}
                      >
                        <Home className="mr-3 h-4 w-4" />
                        My Properties
                      </Button>
                      <Button
                        variant={activeTab === "add-property" ? "default" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => setActiveTab("add-property")}
                      >
                        <PlusCircle className="mr-3 h-4 w-4" />
                        Add Property
                      </Button>
                    </>
                  )}
                  <Button
                    variant={activeTab === "settings" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("settings")}
                  >
                    <Settings className="mr-3 h-4 w-4" />
                    Settings
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-neutral-800 mb-2">
                    Welcome back, {user.firstName}!
                  </h1>
                  <p className="text-neutral-600">Here's what's happening with your real estate activity</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <Card className="bg-blue-50">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-blue-600 mb-1">Saved Properties</p>
                          <p className="text-2xl font-bold text-blue-900">
                            {savedProperties?.length || 0}
                          </p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-full">
                          <Heart className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-green-50">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-green-600 mb-1">
                            {user.role === "agent" ? "Listed Properties" : "Inquiries Sent"}
                          </p>
                          <p className="text-2xl font-bold text-green-900">
                            {user.role === "agent" ? myProperties?.length || 0 : myInquiries?.length || 0}
                          </p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-full">
                          {user.role === "agent" ? (
                            <Home className="h-5 w-5 text-green-600" />
                          ) : (
                            <MessageSquare className="h-5 w-5 text-green-600" />
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-purple-50">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-purple-600 mb-1">Profile Views</p>
                          <p className="text-2xl font-bold text-purple-900">0</p>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-full">
                          <Eye className="h-5 w-5 text-purple-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Saved Properties */}
                {savedProperties && savedProperties.length > 0 && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Recent Saved Properties</CardTitle>
                        <Button variant="ghost" onClick={() => setActiveTab("saved")}>
                          View All
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {savedProperties.slice(0, 4).map((saved) => (
                          <div key={saved.id} className="flex bg-gray-50 rounded-lg overflow-hidden">
                            <img
                              src={saved.property.images?.[0] || 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200'}
                              alt={saved.property.title}
                              className="w-24 h-24 object-cover"
                            />
                            <div className="p-4 flex-1">
                              <h3 className="font-semibold text-neutral-800 mb-1 truncate">
                                {saved.property.title}
                              </h3>
                              <p className="text-sm text-neutral-600 mb-2">
                                {formatPrice(saved.property.price)} • {saved.property.bedrooms} bed, {saved.property.bathrooms} bath
                              </p>
                              <p className="text-xs text-neutral-500">
                                Saved {new Date(saved.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {activeTab === "saved" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-neutral-800">Saved Properties</h2>
                
                {savedLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                        <div className="h-48 bg-gray-300"></div>
                        <div className="p-6">
                          <div className="h-4 bg-gray-300 rounded mb-2"></div>
                          <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : savedProperties && savedProperties.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {savedProperties.map((saved) => (
                      <PropertyCard
                        key={saved.id}
                        property={saved.property}
                        isSaved={true}
                      />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Heart className="h-12 w-12 mx-auto mb-4 text-neutral-400" />
                      <h3 className="text-lg font-semibold mb-2">No saved properties yet</h3>
                      <p className="text-neutral-600 mb-4">
                        Start browsing properties and save your favorites here.
                      </p>
                      <Button onClick={() => setLocation("/properties")}>
                        Browse Properties
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {activeTab === "inquiries" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-neutral-800">My Inquiries</h2>
                
                {myInquiries && myInquiries.length > 0 ? (
                  <div className="space-y-4">
                    {myInquiries.map((inquiry) => (
                      <Card key={inquiry.id}>
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-semibold text-neutral-800">Property Inquiry</h3>
                              <p className="text-sm text-neutral-600">
                                Property ID: {inquiry.propertyId}
                              </p>
                            </div>
                            <Badge 
                              variant={inquiry.status === "new" ? "default" : "secondary"}
                            >
                              {inquiry.status}
                            </Badge>
                          </div>
                          <p className="text-neutral-600 mb-2">{inquiry.message}</p>
                          <p className="text-sm text-neutral-500">
                            Sent on {new Date(inquiry.createdAt).toLocaleDateString()}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 text-neutral-400" />
                      <h3 className="text-lg font-semibold mb-2">No inquiries sent</h3>
                      <p className="text-neutral-600">
                        When you contact agents about properties, your inquiries will appear here.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {user.role === "agent" && activeTab === "properties" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-neutral-800">My Properties</h2>
                  <Button onClick={() => setActiveTab("add-property")}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Property
                  </Button>
                </div>
                
                {myProperties && myProperties.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {myProperties.map((property) => (
                      <Card key={property.id} className="overflow-hidden">
                        <div className="relative">
                          <img
                            src={property.images?.[0] || 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600'}
                            alt={property.title}
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute top-4 left-4">
                            <Badge 
                              variant={property.status === "active" ? "default" : "secondary"}
                            >
                              {property.status}
                            </Badge>
                          </div>
                          <div className="absolute top-4 right-4 flex space-x-2">
                            <Button size="icon" variant="secondary" className="bg-white/90">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="icon" 
                              variant="secondary" 
                              className="bg-white/90 hover:bg-red-100"
                              onClick={() => deleteProperty.mutate(property.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </div>
                        <CardContent className="p-6">
                          <h3 className="text-lg font-semibold mb-2">{property.title}</h3>
                          <p className="text-2xl font-bold text-primary mb-2">
                            {formatPrice(property.price)}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-neutral-600 mb-2">
                            <div className="flex items-center">
                              <Bed className="h-4 w-4 mr-1" />
                              {property.bedrooms}
                            </div>
                            <div className="flex items-center">
                              <Bath className="h-4 w-4 mr-1" />
                              {property.bathrooms}
                            </div>
                            <div className="flex items-center">
                              <Square className="h-4 w-4 mr-1" />
                              {property.sqft}
                            </div>
                          </div>
                          <p className="text-sm text-neutral-600 flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {property.city}, {property.state}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Home className="h-12 w-12 mx-auto mb-4 text-neutral-400" />
                      <h3 className="text-lg font-semibold mb-2">No properties listed</h3>
                      <p className="text-neutral-600 mb-4">
                        Start adding properties to showcase your listings.
                      </p>
                      <Button onClick={() => setActiveTab("add-property")}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Your First Property
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {user.role === "agent" && activeTab === "add-property" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-neutral-800">Add New Property</h2>
                
                <Card>
                  <CardContent className="p-6">
                    <form onSubmit={propertyForm.handleSubmit(onPropertySubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="title">Property Title</Label>
                          <Input
                            id="title"
                            placeholder="e.g., Modern Luxury Villa"
                            {...propertyForm.register("title")}
                            className="mt-2"
                          />
                          {propertyForm.formState.errors.title && (
                            <p className="text-sm text-red-600 mt-1">
                              {propertyForm.formState.errors.title.message}
                            </p>
                          )}
                        </div>
                        
                        <div>
                          <Label htmlFor="price">Price</Label>
                          <Input
                            id="price"
                            type="number"
                            placeholder="500000"
                            {...propertyForm.register("price")}
                            className="mt-2"
                          />
                          {propertyForm.formState.errors.price && (
                            <p className="text-sm text-red-600 mt-1">
                              {propertyForm.formState.errors.price.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          rows={4}
                          placeholder="Describe the property features, location, and amenities..."
                          {...propertyForm.register("description")}
                          className="mt-2"
                        />
                        {propertyForm.formState.errors.description && (
                          <p className="text-sm text-red-600 mt-1">
                            {propertyForm.formState.errors.description.message}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="propertyType">Property Type</Label>
                          <Select
                            value={propertyForm.watch("propertyType")}
                            onValueChange={(value) => propertyForm.setValue("propertyType", value as any)}
                          >
                            <SelectTrigger className="mt-2">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="house">House</SelectItem>
                              <SelectItem value="apartment">Apartment</SelectItem>
                              <SelectItem value="condo">Condo</SelectItem>
                              <SelectItem value="townhouse">Townhouse</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="listingType">Listing Type</Label>
                          <Select
                            value={propertyForm.watch("listingType")}
                            onValueChange={(value) => propertyForm.setValue("listingType", value as any)}
                          >
                            <SelectTrigger className="mt-2">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="sale">For Sale</SelectItem>
                              <SelectItem value="rent">For Rent</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="bedrooms">Bedrooms</Label>
                          <Input
                            id="bedrooms"
                            type="number"
                            min="1"
                            {...propertyForm.register("bedrooms", { valueAsNumber: true })}
                            className="mt-2"
                          />
                        </div>

                        <div>
                          <Label htmlFor="bathrooms">Bathrooms</Label>
                          <Input
                            id="bathrooms"
                            step="0.5"
                            min="1"
                            placeholder="2.5"
                            {...propertyForm.register("bathrooms")}
                            className="mt-2"
                          />
                        </div>

                        <div>
                          <Label htmlFor="sqft">Square Feet</Label>
                          <Input
                            id="sqft"
                            type="number"
                            min="1"
                            {...propertyForm.register("sqft", { valueAsNumber: true })}
                            className="mt-2"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="address">Address</Label>
                          <Input
                            id="address"
                            placeholder="123 Main Street"
                            {...propertyForm.register("address")}
                            className="mt-2"
                          />
                        </div>

                        <div>
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            placeholder="Los Angeles"
                            {...propertyForm.register("city")}
                            className="mt-2"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="state">State</Label>
                          <Input
                            id="state"
                            placeholder="CA"
                            {...propertyForm.register("state")}
                            className="mt-2"
                          />
                        </div>

                        <div>
                          <Label htmlFor="zipCode">ZIP Code</Label>
                          <Input
                            id="zipCode"
                            placeholder="90210"
                            {...propertyForm.register("zipCode")}
                            className="mt-2"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="features">Features (comma-separated)</Label>
                        <Input
                          id="features"
                          placeholder="Hardwood Floors, Central Air, Garage, Pool"
                          {...propertyForm.register("features")}
                          className="mt-2"
                        />
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={createProperty.isPending}
                      >
                        {createProperty.isPending ? "Creating..." : "Create Property"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-neutral-800">Profile Settings</h2>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            {...profileForm.register("firstName")}
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            {...profileForm.register("lastName")}
                            className="mt-2"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          {...profileForm.register("email")}
                          className="mt-2"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          {...profileForm.register("phone")}
                          className="mt-2"
                        />
                      </div>
                      
                      <Button type="submit" disabled={updateProfile.isPending}>
                        {updateProfile.isPending ? "Updating..." : "Update Profile"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

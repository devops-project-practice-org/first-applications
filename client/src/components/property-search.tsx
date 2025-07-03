import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, MapPin } from "lucide-react";
import { useLocation } from "wouter";
import type { PropertySearchParams } from "@shared/schema";

interface PropertySearchProps {
  initialValues?: Partial<PropertySearchParams>;
  onSearch?: (params: PropertySearchParams) => void;
  compact?: boolean;
}

export default function PropertySearch({ initialValues = {}, onSearch, compact = false }: PropertySearchProps) {
  const [, setLocation] = useLocation();
  const [searchParams, setSearchParams] = useState<Partial<PropertySearchParams>>({
    location: initialValues.location || "",
    propertyType: initialValues.propertyType,
    listingType: initialValues.listingType,
    minPrice: initialValues.minPrice,
    maxPrice: initialValues.maxPrice,
    ...initialValues,
  });

  const handleInputChange = (field: keyof PropertySearchParams, value: any) => {
    setSearchParams(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== undefined && value !== "" && value !== null) {
        params.set(key, value.toString());
      }
    });
    
    if (onSearch) {
      onSearch(searchParams as PropertySearchParams);
    } else {
      setLocation(`/properties?${params.toString()}`);
    }
  };

  if (compact) {
    return (
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <Input
            placeholder="Location..."
            value={searchParams.location || ""}
            onChange={(e) => handleInputChange("location", e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit" size="icon">
          <Search className="h-4 w-4" />
        </Button>
      </form>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-6">
      <form onSubmit={handleSearch}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <Label className="block text-sm font-medium text-neutral-700 mb-2">
              Location
            </Label>
            <div className="relative">
              <Input
                type="text"
                placeholder="City, neighborhood, or ZIP"
                value={searchParams.location || ""}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className="pl-10"
              />
              <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
            </div>
          </div>
          
          <div>
            <Label className="block text-sm font-medium text-neutral-700 mb-2">
              Property Type
            </Label>
            <Select
              value={searchParams.propertyType || ""}
              onValueChange={(value) => handleInputChange("propertyType", value || undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="house">Houses</SelectItem>
                <SelectItem value="apartment">Apartments</SelectItem>
                <SelectItem value="condo">Condos</SelectItem>
                <SelectItem value="townhouse">Townhouses</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="block text-sm font-medium text-neutral-700 mb-2">
              Price Range
            </Label>
            <Select
              value={
                searchParams.minPrice && searchParams.maxPrice
                  ? `${searchParams.minPrice}-${searchParams.maxPrice}`
                  : ""
              }
              onValueChange={(value) => {
                if (value === "") {
                  handleInputChange("minPrice", undefined);
                  handleInputChange("maxPrice", undefined);
                } else {
                  const [min, max] = value.split("-").map(Number);
                  handleInputChange("minPrice", min);
                  handleInputChange("maxPrice", max);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Any Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Price</SelectItem>
                <SelectItem value="0-500000">Under $500K</SelectItem>
                <SelectItem value="500000-1000000">$500K - $1M</SelectItem>
                <SelectItem value="1000000-2000000">$1M - $2M</SelectItem>
                <SelectItem value="2000000-99999999">$2M+</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            type="submit" 
            className="bg-primary text-white hover:bg-blue-700 flex items-center justify-center space-x-2"
          >
            <Search className="h-4 w-4" />
            <span>Search</span>
          </Button>
        </div>
      </form>
    </div>
  );
}

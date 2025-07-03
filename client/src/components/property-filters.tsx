import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PropertySearchParams } from "@shared/schema";

interface PropertyFiltersProps {
  filters: Partial<PropertySearchParams>;
  onFiltersChange: (filters: Partial<PropertySearchParams>) => void;
  onApply: () => void;
  onClear: () => void;
}

export default function PropertyFilters({
  filters,
  onFiltersChange,
  onApply,
  onClear,
}: PropertyFiltersProps) {
  const [priceRange, setPriceRange] = useState([
    filters.minPrice || 0,
    filters.maxPrice || 2000000,
  ]);

  const handlePriceChange = (values: number[]) => {
    setPriceRange(values);
    onFiltersChange({
      ...filters,
      minPrice: values[0] || undefined,
      maxPrice: values[1] || undefined,
    });
  };

  const handlePropertyTypeChange = (type: string, checked: boolean) => {
    const currentTypes = filters.propertyType ? [filters.propertyType] : [];
    let newTypes;
    
    if (checked) {
      newTypes = [...currentTypes, type];
    } else {
      newTypes = currentTypes.filter(t => t !== type);
    }
    
    onFiltersChange({
      ...filters,
      propertyType: newTypes.length === 1 ? newTypes[0] as any : undefined,
    });
  };

  const handleBedroomChange = (bedrooms: number) => {
    onFiltersChange({
      ...filters,
      bedrooms: filters.bedrooms === bedrooms ? undefined : bedrooms,
    });
  };

  const handleBathroomChange = (bathrooms: number) => {
    onFiltersChange({
      ...filters,
      bathrooms: filters.bathrooms === bathrooms ? undefined : bathrooms,
    });
  };

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `$${(price / 1000).toFixed(0)}K`;
    } else {
      return `$${price}`;
    }
  };

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Price Range */}
        <div>
          <Label className="text-sm font-medium text-neutral-700 mb-3 block">
            Price Range
          </Label>
          <div className="px-2">
            <Slider
              value={priceRange}
              onValueChange={handlePriceChange}
              max={2000000}
              min={0}
              step={25000}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-neutral-600 mt-2">
              <span>{formatPrice(priceRange[0])}</span>
              <span>{formatPrice(priceRange[1])}</span>
            </div>
          </div>
        </div>

        {/* Property Type */}
        <div>
          <Label className="text-sm font-medium text-neutral-700 mb-3 block">
            Property Type
          </Label>
          <div className="space-y-2">
            {[
              { value: "house", label: "Houses" },
              { value: "apartment", label: "Apartments" },
              { value: "condo", label: "Condos" },
              { value: "townhouse", label: "Townhouses" },
            ].map((type) => (
              <div key={type.value} className="flex items-center space-x-2">
                <Checkbox
                  id={type.value}
                  checked={filters.propertyType === type.value}
                  onCheckedChange={(checked) =>
                    handlePropertyTypeChange(type.value, checked as boolean)
                  }
                />
                <Label
                  htmlFor={type.value}
                  className="text-sm text-neutral-700 cursor-pointer"
                >
                  {type.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Bedrooms */}
        <div>
          <Label className="text-sm font-medium text-neutral-700 mb-3 block">
            Bedrooms
          </Label>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((num) => (
              <Button
                key={num}
                variant={filters.bedrooms === num ? "default" : "outline"}
                size="sm"
                className="text-center"
                onClick={() => handleBedroomChange(num)}
              >
                {num}+
              </Button>
            ))}
          </div>
        </div>

        {/* Bathrooms */}
        <div>
          <Label className="text-sm font-medium text-neutral-700 mb-3 block">
            Bathrooms
          </Label>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((num) => (
              <Button
                key={num}
                variant={filters.bathrooms === num ? "default" : "outline"}
                size="sm"
                className="text-center"
                onClick={() => handleBathroomChange(num)}
              >
                {num}+
              </Button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-4">
          <Button onClick={onApply} className="w-full">
            Apply Filters
          </Button>
          <Button onClick={onClear} variant="outline" className="w-full">
            Clear All
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

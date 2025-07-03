import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Navigation from "@/components/navigation";
import PropertyCard from "@/components/property-card";
import PropertyFilters from "@/components/property-filters";
import PropertySearch from "@/components/property-search";
import NearMeFilter from "@/components/near-me-filter";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Grid, List, ChevronLeft, ChevronRight } from "lucide-react";
import type { Property, PropertySearchParams } from "@shared/schema";

export default function Properties() {
  const [location] = useLocation();
  const { language } = useLanguage();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<Partial<PropertySearchParams>>({});

  // Parse URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(location.split("?")[1] || "");
    const newFilters: Partial<PropertySearchParams> = {};
    
    urlParams.forEach((value, key) => {
      if (key === "minPrice" || key === "maxPrice" || key === "bedrooms" || key === "bathrooms" || key === "page" || key === "limit") {
        newFilters[key as keyof PropertySearchParams] = parseInt(value) as any;
      } else {
        newFilters[key as keyof PropertySearchParams] = value as any;
      }
    });
    
    setFilters(newFilters);
    if (newFilters.page) {
      setCurrentPage(newFilters.page);
    }
  }, [location]);

  const searchParams = {
    ...filters,
    page: currentPage,
    limit: 12,
  };

  const { data, isLoading, error } = useQuery<{ properties: Property[]; total: number }>({
    queryKey: ["/api/properties", searchParams],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value !== undefined && value !== "" && value !== null) {
          params.set(key, value.toString());
        }
      });
      
      const response = await fetch(`/api/properties?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch properties");
      }
      return response.json();
    },
  });

  const handleFiltersChange = (newFilters: Partial<PropertySearchParams>) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleApplyFilters = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "" && value !== null) {
        params.set(key, value.toString());
      }
    });
    window.history.pushState({}, "", `/properties?${params.toString()}`);
  };

  const handleClearFilters = () => {
    setFilters({});
    setCurrentPage(1);
    window.history.pushState({}, "", "/properties");
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalPages = data ? Math.ceil(data.total / 12) : 0;
  const properties = data?.properties || [];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Search Header */}
      <section className="bg-neutral-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <PropertySearch 
              initialValues={filters}
              onSearch={handleFiltersChange}
              compact
            />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4 space-y-6">
            <NearMeFilter 
              onLocationFound={(location) => {
                handleFiltersChange({
                  ...filters,
                  location: location.address || `${location.lat}, ${location.lng}`
                });
              }}
              language={language}
            />
            <PropertyFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onApply={handleApplyFilters}
              onClear={handleClearFilters}
            />
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-neutral-800">
                  {isLoading ? "Loading..." : `${data?.total || 0} Properties Found`}
                </h2>
                {filters.location && (
                  <p className="text-neutral-600 mt-1">in {filters.location}</p>
                )}
              </div>
              
              <div className="flex items-center space-x-4">
                <Select defaultValue="price-low">
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="flex border border-gray-300 rounded-lg">
                  <Button
                    variant={view === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setView("grid")}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={view === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setView("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Properties Grid/List */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-300"></div>
                    <div className="p-6">
                      <div className="h-4 bg-gray-300 rounded mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-2/3 mb-4"></div>
                      <div className="flex space-x-4">
                        <div className="h-3 bg-gray-300 rounded w-16"></div>
                        <div className="h-3 bg-gray-300 rounded w-16"></div>
                        <div className="h-3 bg-gray-300 rounded w-16"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600 text-lg">Error loading properties. Please try again.</p>
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-neutral-600 text-lg">No properties found matching your criteria.</p>
                <Button onClick={handleClearFilters} className="mt-4">
                  Clear Filters
                </Button>
              </div>
            ) : (
              <>
                <div className={view === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-6"}>
                  {properties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-12">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      
                      {[...Array(Math.min(5, totalPages))].map((_, i) => {
                        const page = i + 1;
                        if (totalPages <= 5) {
                          return (
                            <Button
                              key={page}
                              variant={currentPage === page ? "default" : "outline"}
                              size="sm"
                              onClick={() => handlePageChange(page)}
                            >
                              {page}
                            </Button>
                          );
                        }
                        // More complex pagination logic for many pages
                        return null;
                      })}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

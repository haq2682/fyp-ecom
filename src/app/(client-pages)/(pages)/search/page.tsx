"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import ProductItem from "@/components/product/product-item";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { getProductTypes, searchProducts } from "@/actions/products";
import { HomeProduct } from "@/types";

const ITEMS_PER_PAGE = 12;

export default function Search() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [productTypes, setProductTypes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<HomeProduct[]>([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [endCursor, setEndCursor] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const query = searchParams.get("query") || "";
  const type = searchParams.get("type") || "";
  const size = searchParams.get("size") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const sortBy = searchParams.get("sort") || "";

  useEffect(() => {
    fetchProductTypes();
    handleSearch();
  }, [query, type, size, minPrice, maxPrice, sortBy]);

  const fetchProductTypes = async () => {
    try {
      const fetchedProductTypes = await getProductTypes();
      setProductTypes(Array.from(fetchedProductTypes as Set<string>));
    } catch (error) {
      console.error("Error fetching product types:", error);
    }
  };

  const updateSearchParams = (updates: Record<string, string | null>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") {
        current.delete(key);
      } else {
        current.set(key, value);
      }
    });

    const search = current.toString();
    const query = search ? `?${search}` : "";

    router.push(`/search${query}`);
  };

  const handleSearch = async (resetCursor = true) => {
    setIsLoading(resetCursor);
    try {
      const results = await searchProducts({
        query: query || undefined,
        type: type || undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        size: size || undefined,
        sortBy: sortBy || undefined,
        after: resetCursor ? null : endCursor,
        limit: ITEMS_PER_PAGE,
      });

      if (resetCursor) {
        setProducts(results.products);
      } else {
        setProducts(prev => [...prev, ...results.products]);
      }

      setHasNextPage(results.hasNextPage);
      setEndCursor(results.endCursor);
    } catch (error) {
      console.error("Error searching products:", error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (value: string) => {
    updateSearchParams({ query: value || null });
  };

  const loadMore = () => {
    if (!hasNextPage || isLoadingMore) return;
    setIsLoadingMore(true);
    handleSearch(false).finally(() => setIsLoadingMore(false));
  };

  const clearAllFilters = () => {
    router.push('/search');
  };

  const applyFilters = () => {
    updateSearchParams({
      type: type || null,
      size: size || null,
      minPrice: minPrice || null,
      maxPrice: maxPrice || null,
      sort: sortBy || null
    });
    setIsDrawerOpen(false);
  };

  const removeFilter = (filterKey: string) => {
    updateSearchParams({ [filterKey]: null });
  };

  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <div className="container mx-auto py-8">
        <div className="space-y-6">
          {/* Search Bar and Filters Button */}
          <div className="flex justify-between items-center">
            <div className="space-y-3">
              <h1 className="text-2xl font-bold">Search Products</h1>
              <div className="flex space-x-2">
                <Input
                  placeholder="Search products..."
                  value={query}
                  onChange={(e) => handleInputChange(e.target.value)}
                  className="w-64"
                />
              </div>
            </div>
            <DrawerTrigger asChild>
              <Button>Filters</Button>
            </DrawerTrigger>
          </div>

          {/* Applied Filters */}
          <div className="flex flex-wrap gap-2">
            {type && (
              <Badge variant="secondary" className="px-2 py-1">
                Category: {type}
                <button onClick={() => removeFilter("type")} className="ml-2 text-xs">×</button>
              </Badge>
            )}
            {size && (
              <Badge variant="secondary" className="px-2 py-1">
                Size: {size}
                <button onClick={() => removeFilter("size")} className="ml-2 text-xs">×</button>
              </Badge>
            )}
            {(minPrice || maxPrice) && (
              <Badge variant="secondary" className="px-2 py-1">
                Price: ${minPrice || "0"} - ${maxPrice || "∞"}
                <button onClick={() => {
                  removeFilter("minPrice");
                  removeFilter("maxPrice");
                }} className="ml-2 text-xs">×</button>
              </Badge>
            )}
          </div>

          {/* Sort and Results Count */}
          <div className="flex justify-between items-center">
            <p>Showing {products.length} Results</p>
            <Select
              value={sortBy}
              onValueChange={(value) => updateSearchParams({ sort: value })}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort By..." />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="priceLowHigh">Price (Low to High)</SelectItem>
                  <SelectItem value="priceHighLow">Price (High to Low)</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Products Grid */}
          <div className="flex justify-center flex-wrap">
            {isLoading ? (
              <p>Loading products...</p>
            ) : products.length > 0 ? (
              <>
                {products.map((product, index) => (
                  <ProductItem key={index} {...product} />
                ))}
              </>
            ) : (
              <p>No products found. Try adjusting your search or filters.</p>
            )}
          </div>

          {/* Load More Button */}
          {hasNextPage && (
            <div className="flex justify-center mt-6">
              <Button
                onClick={loadMore}
                disabled={isLoadingMore}
                variant="outline"
              >
                {isLoadingMore ? "Loading..." : "Load More"}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Filters Drawer */}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-center text-2xl">Filters</DrawerTitle>
        </DrawerHeader>
        <div className="mx-auto container space-y-8 px-4">
          {/* Categories */}
          <div>
            <h2 className="font-bold text-xl text-center mb-4">Categories</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {productTypes.map((productType, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox
                    id={`type-${index}`}
                    checked={type === productType}
                    onCheckedChange={() => updateSearchParams({ type: type === productType ? null : productType })}
                  />
                  <label htmlFor={`type-${index}`} className="text-sm">
                    {productType}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div>
            <h2 className="font-bold text-xl text-center mb-4">Sizes</h2>
            <div className="grid grid-cols-3 gap-4">
              {["S", "M", "L", "XL", "XXL"].map((sizeOption) => (
                <div key={sizeOption} className="flex items-center space-x-2">
                  <Checkbox
                    id={`size-${sizeOption}`}
                    checked={size === sizeOption}
                    onCheckedChange={() => updateSearchParams({ size: size === sizeOption ? null : sizeOption })}
                  />
                  <label htmlFor={`size-${sizeOption}`}>{sizeOption}</label>
                </div>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h2 className="font-bold text-xl text-center mb-4">Price Range</h2>
            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center">
                <span className="mr-2">$</span>
                <Input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => updateSearchParams({ minPrice: e.target.value || null })}
                  className="w-24"
                />
              </div>
              <span className="text-xl">-</span>
              <div className="flex items-center">
                <span className="mr-2">$</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => updateSearchParams({ maxPrice: e.target.value || null })}
                  className="w-24"
                />
              </div>
            </div>
          </div>
        </div>

        <DrawerFooter>
          <div className="flex space-x-2 justify-center">
            <Button onClick={applyFilters}>Apply</Button>
            <Button variant="destructive" onClick={clearAllFilters}>
              Clear All
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
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

export default function Search() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [productTypes, setProductTypes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<HomeProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<HomeProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("query") || "");
  const [selectedProductType, setSelectedProductType] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [appliedFilters, setAppliedFilters] = useState<string[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [endCursor, setEndCursor] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    fetchProductTypes();
    if (searchParams.get("query")) {
      handleSearch();
    }
  }, []);

  useEffect(() => {
    const sortedAndFiltered = sortProducts(filterProducts(products));
    setFilteredProducts(sortedAndFiltered);
  }, [sortBy, products, selectedProductType, selectedSize, minPrice, maxPrice]);

  const fetchProductTypes = async () => {
    try {
      setIsLoading(true);
      const fetchedProductTypes = await getProductTypes();
      setProductTypes(Array.from(fetchedProductTypes as Set<string>));
    } catch (error) {
      console.error("Error fetching product types:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      if (searchQuery) {
        router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
      } else {
        router.push('/search');
      }

      const results = await searchProducts({
        query: searchQuery,
        type: selectedProductType,
        minPrice: Number(minPrice) || undefined,
        maxPrice: Number(maxPrice) || undefined,
        size: selectedSize,
        sortBy,
      });

      setProducts(results.products);
      setHasNextPage(results.hasNextPage);
      setEndCursor(results.endCursor);
    } catch (error) {
      console.error("Error searching products:", error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = async () => {
    if (!hasNextPage || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      const results = await searchProducts({
        query: searchQuery,
        type: selectedProductType,
        minPrice: Number(minPrice) || undefined,
        maxPrice: Number(maxPrice) || undefined,
        size: selectedSize,
        sortBy,
        after: endCursor,
      });

      setProducts([...products, ...results.products]);
      setHasNextPage(results.hasNextPage);
      setEndCursor(results.endCursor);
    } catch (error) {
      console.error("Error loading more products:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const filterProducts = (products: HomeProduct[]) => {
    return products.filter(product => {
      const priceMatch = (!minPrice || product.price >= Number(minPrice)) &&
        (!maxPrice || product.price <= Number(maxPrice));
      const typeMatch = !selectedProductType || product.type === selectedProductType;
      const sizeMatch = !selectedSize || product.sizes?.includes(selectedSize);

      return priceMatch && typeMatch && sizeMatch;
    });
  };

  const sortProducts = (products: HomeProduct[]) => {
    const sortedProducts = [...products];
    switch (sortBy) {
      case "name":
        return sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
      case "priceLowHigh":
        return sortedProducts.sort((a, b) => a.price - b.price);
      case "priceHighLow":
        return sortedProducts.sort((a, b) => b.price - a.price);
      default:
        return sortedProducts;
    }
  };

  const clearAllFilters = () => {
    setSelectedProductType("");
    setSelectedSize("");
    setMinPrice("");
    setMaxPrice("");
    setSearchQuery("");
    setSortBy("");
    setAppliedFilters([]);
    handleSearch();
  };

  const applyFilters = () => {
    const filters = [];
    if (selectedProductType) filters.push(`Category: ${selectedProductType}`);
    if (selectedSize) filters.push(`Size: ${selectedSize}`);
    if (minPrice || maxPrice) filters.push(`Price: $${minPrice || "0"} - $${maxPrice || "∞"}`);
    setAppliedFilters(filters);
    handleSearch();
    setIsDrawerOpen(false);
  };

  const removeFilter = (filter: string) => {
    const [type, value] = filter.split(": ");
    switch (type) {
      case "Category":
        setSelectedProductType("");
        break;
      case "Size":
        setSelectedSize("");
        break;
      case "Price":
        setMinPrice("");
        setMaxPrice("");
        break;
    }
    setAppliedFilters(appliedFilters.filter((f) => f !== filter));
    handleSearch();
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-64"
                />
                <Button onClick={handleSearch}>Search</Button>
              </div>
            </div>
            <DrawerTrigger asChild>
              <Button>Filters</Button>
            </DrawerTrigger>
          </div>

          {/* Applied Filters */}
          <div className="flex flex-wrap gap-2">
            {appliedFilters.map((filter, index) => (
              <Badge key={index} variant="secondary" className="px-2 py-1">
                {filter}
                <button onClick={() => removeFilter(filter)} className="ml-2 text-xs">×</button>
              </Badge>
            ))}
          </div>

          {/* Sort and Results Count */}
          <div className="flex justify-between items-center">
            <p>Showing {filteredProducts.length} Results</p>
            <Select onValueChange={setSortBy} value={sortBy}>
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
              <p className="text-center w-full">Loading products...</p>
            ) : products.length > 0 ? (
              <>
                {products.map((product) => (
                  <ProductItem key={product.id} {...product} />
                ))}
                
              </>
            ) : (
              <p className="text-center">
                  No products found. Try adjusting your search or filters.
              </p>
            )}
          </div>
          {hasNextPage && (
            <div className="col-span-full flex justify-center mt-6">
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
              {productTypes.map((type, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox
                    id={`type-${index}`}
                    checked={selectedProductType === type}
                    onCheckedChange={() => setSelectedProductType(type)}
                  />
                  <label htmlFor={`type-${index}`} className="text-sm">
                    {type}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div>
            <h2 className="font-bold text-xl text-center mb-4">Sizes</h2>
            <div className="grid grid-cols-3 gap-4">
              {["S", "M", "L", "XL", "XXL"].map((size) => (
                <div key={size} className="flex items-center space-x-2">
                  <Checkbox
                    id={`size-${size}`}
                    checked={selectedSize === size}
                    onCheckedChange={() => setSelectedSize(size)}
                  />
                  <label htmlFor={`size-${size}`}>{size}</label>
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
                  onChange={(e) => setMinPrice(e.target.value)}
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
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-24"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
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
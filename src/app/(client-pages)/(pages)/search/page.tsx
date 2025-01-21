"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import ProductItem from "@/components/product/product-item";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
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
import { getCategories, getProductTypes } from "@/actions/products";
import { searchProducts } from "@/actions/products";
import { HomeProduct } from "@/types";

export default function Search() {
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<string[]>([]);
  const [productTypes, setProductTypes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<HomeProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("query") || "");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProductType, setSelectedProductType] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [appliedFilters, setAppliedFilters] = useState<string[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const fetchedCategories = await getCategories();
        const fetchedProductTypes = await getProductTypes();
        setCategories(Array.from(fetchedCategories as Set<string>));
        setProductTypes(Array.from(fetchedProductTypes as Set<string>));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (searchQuery || selectedCategory || selectedProductType || selectedSize || minPrice || maxPrice) {
      handleSearch();
    }
  }, [searchQuery, selectedCategory, selectedProductType, selectedSize, minPrice, maxPrice]);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const results = await searchProducts({
        query: searchQuery,
        category: selectedCategory,
        type: selectedProductType,
        minPrice: Number(minPrice) || undefined,
        maxPrice: Number(maxPrice) || undefined,
        size: selectedSize,
      });
      setProducts(results);
    } catch (error) {
      console.error("Error searching products:", error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    const filters = [];
    if (selectedCategory) filters.push(`Category: ${selectedCategory}`);
    if (selectedProductType) filters.push(`Product Type: ${selectedProductType}`);
    if (selectedSize) filters.push(`Size: ${selectedSize}`);
    if (minPrice || maxPrice) filters.push(`Price: $${minPrice || "0"} - $${maxPrice || "∞"}`);
    setAppliedFilters(filters);
    handleSearch();
    setIsDrawerOpen(false); // Close the drawer
  };

  const removeFilter = (filter: string) => {
    const [type, value] = filter.split(": ");
    switch (type) {
      case "Category":
        setSelectedCategory("");
        break;
      case "Product Type":
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

  const sortProducts = (products: HomeProduct[]) => {
    switch (sortBy) {
      case "name":
        return [...products].sort((a, b) => a.title.localeCompare(b.title));
      case "priceLowHigh":
        return [...products].sort((a, b) => a.price - b.price);
      case "priceHighLow":
        return [...products].sort((a, b) => b.price - a.price);
      default:
        return products;
    }
  };

  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <div className="container mx-auto mb-12">
        <div className="w-full space-y-8">
          <div className="flex justify-between items-center">
            <div className="space-y-3">
              <h1 className="text-2xl font-bold">Search Products</h1>
              <div className="flex space-x-2">
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64"
                />
                <Button onClick={handleSearch}>Search</Button>
              </div>
            </div>
            <DrawerTrigger asChild>
              <Button>Apply Filters</Button>
            </DrawerTrigger>
          </div>
          <div className="flex flex-wrap gap-2">
            {appliedFilters.map((filter, index) => (
              <Badge key={index} variant="secondary" className="px-2 py-1">
                {filter}
                <button onClick={() => removeFilter(filter)} className="ml-2 text-xs">
                  ×
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex justify-between items-center">
            <p>Showing {products.length} Results</p>
            <div>
              <Select onValueChange={(value) => setSortBy(value)}>
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
          </div>
          <div className="mx-auto">
            <div className="flex flex-wrap justify-center w-full">
              {isLoading ? (
                <p>Loading products...</p>
              ) : products.length > 0 ? (
                sortProducts(products).map((product) => <ProductItem key={product.id} {...product} />)
              ) : (
                <p>No products found. Try adjusting your search or filters.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-center text-2xl">Filters</DrawerTitle>
        </DrawerHeader>
        <div className="mx-auto container">
          <div>
            <h1 className="font-bold text-xl text-center">Categories</h1>
            {isLoading ? (
              <p className="text-center">Loading categories...</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-4">
                {categories.map((category, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${index}`}
                      checked={selectedCategory === category}
                      onCheckedChange={() => setSelectedCategory(category)}
                    />
                    <label
                      htmlFor={`category-${index}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="mt-10">
            <h1 className="font-bold text-xl text-center">Product Types</h1>
            {isLoading ? (
              <p className="text-center">Loading product types...</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-4">
                {productTypes.map((type, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox
                      id={`type-${index}`}
                      checked={selectedProductType === type}
                      onCheckedChange={() => setSelectedProductType(type)}
                    />
                    <label
                      htmlFor={`type-${index}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {type}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="mt-10">
            <h1 className="font-bold text-xl text-center">Sizes</h1>
            <div className="w-full flex flex-wrap mt-4">
              {["S", "M", "L", "XL", "XXL"].map((size) => (
                <div key={size} className="w-1/4">
                  <Checkbox
                    id={`size-${size}`}
                    checked={selectedSize === size}
                    onCheckedChange={() => setSelectedSize(size)}
                  />
                  <label htmlFor={`size-${size}`} className="ml-2">
                    {size}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-10">
            <h1 className="font-bold text-xl text-center">Price</h1>
            <div className="flex items-center mt-4 justify-center">
              <div className="flex items-center">
                <span className="mr-2">$</span>
                <Input placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
              </div>
              <p className="font-bold mx-6 text-2xl"> - </p>
              <div className="flex items-center">
                <span className="mr-2">$</span>
                <Input placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
              </div>
            </div>
          </div>
        </div>
        <DrawerFooter className="w-full flex items-center">
          <Button className="w-32" onClick={applyFilters}>
            Apply
          </Button>
          <DrawerClose asChild>
            <Button className="w-32" variant="outline">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

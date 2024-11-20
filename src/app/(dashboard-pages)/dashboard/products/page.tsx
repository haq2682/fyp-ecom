'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LayoutDashboard, Package, ShoppingCart, Users, Star, Settings, Plus, MoreHorizontal, Search, ChevronRight, Menu, X } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"
import { usePathname } from 'next/navigation'

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const products = [
    {
      id: 1,
      name: "Raw Black T-Shirt Lineup",
      sku: "47514501",
      price: 75.00,
      stock: "In Stock",
      category: "T-shirt, Men",
      image: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1695457335_2236257.jpg?v=2"
    },
    {
      id: 2,
      name: "Classic Monochrome Tees",
      sku: "47514501",
      price: 35.00,
      stock: "In Stock",
      category: "T-shirt, Men",
      image: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1695457335_2236257.jpg?v=2"
    },
    {
      id: 3,
      name: "Monochromatic Wardrobe",
      sku: "47514501",
      price: 27.00,
      stock: "In Stock",
      category: "T-shirt",
      image: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1695457335_2236257.jpg?v=2"
    },
    {
      id: 4,
      name: "Essential Neutrals",
      sku: "47514501",
      price: 22.00,
      stock: "In Stock",
      category: "T-shirt, Raw",
      image: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1695457335_2236257.jpg?v=2"
    },
    {
      id: 5,
      name: "UTRAANET Black",
      sku: "47514501",
      price: 43.00,
      stock: "In Stock",
      category: "T-shirt, Trend",
      image: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1695457335_2236257.jpg?v=2"
    }
  ]

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  return (
    <div className="flex h-screen bg-background">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Products</h2>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="relative w-full sm:w-auto sm:flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products"
                  className="pl-8 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Link href="/dashboard/products/add">
                <Button className="w-full sm:w-auto">
                  <Plus className="mr-2 h-4 w-4" />
                  Add product
                </Button>
              </Link>
            </div>

            <div className="border rounded-lg overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Name</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Categories</TableHead>
                    <TableHead className="w-[50px]">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={40}
                            height={40}
                            className="rounded"
                          />
                          <span className="hidden sm:inline">{product.name}</span>
                          <span className="sm:hidden">{product.name.slice(0, 20)}...</span>
                        </div>
                      </TableCell>
                      <TableCell>{product.sku}</TableCell>
                      <TableCell>${product.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                          {product.stock}
                        </span>
                      </TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Duplicate</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
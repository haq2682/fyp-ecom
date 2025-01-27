"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { searchProducts } from "@/actions/products"
import { useRouter } from "next/navigation"
import type { HomeProduct } from "@/types/index"
import { ClipLoader} from "react-spinners"
import Image from "next/image"

const SearchBar = () => {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<HomeProduct[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const router = useRouter()
  const searchContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions([])
        return
      }

      setIsLoading(true)
      try {
        const results = await searchProducts({ query })
        setSuggestions(results.products.slice(0, 5))
      } catch (error) {
        console.error("Error fetching suggestions:", error)
        setSuggestions([])
      } finally {
        setIsLoading(false)
      }
    }

    const debounceTimer = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(debounceTimer)
  }, [query])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/search${query.trim() ? `?query=${encodeURIComponent(query.trim())}` : ""}`)
    setShowSuggestions(false)
  }

  const handleSuggestionClick = (product: HomeProduct) => {
    router.push(`/search?query=${encodeURIComponent(product.title)}`)
    setShowSuggestions(false)
  }

  return (
    <div ref={searchContainerRef} className="relative w-full max-w-md">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative flex items-center">
          <Input
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setShowSuggestions(true)
            }}
            className="pr-12"
          />
          <Button type="submit" variant="ghost" className="absolute right-0 px-3">
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </form>

      {showSuggestions && query.length >= 2 && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <div className="p-4 flex justify-center items-center">
                <ClipLoader color="#000" size={24} />
            </div>
          ) : suggestions.length > 0 ? (
            <ul className="py-2">
              {suggestions.map((product) => (
                <li
                  key={product.id}
                  onClick={() => handleSuggestionClick(product)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-3"
                >
                  <div className="flex-shrink-0">
                    <Image
                      src={product.imageSrc || "/placeholder.svg"}
                      alt={product.imageAlt || product.title}
                      width={48}
                      height={48}
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">{product.title}</span>
                    <span className="text-sm text-gray-500">
                      {product.currency} {product.discountedPrice || product.price}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-gray-500">No products found</div>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchBar


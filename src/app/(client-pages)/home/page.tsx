"use client"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useEffect, useState } from "react"
import { FaArrowRight } from "react-icons/fa6"
import { LuShieldCheck, LuTruck } from "react-icons/lu"
import { RiMedalLine } from "react-icons/ri"
import ProductItem from "@/components/product/product-item"
import { getHomeBestSellingProducts, getHomeLatestProducts } from "@/actions/products"
import type { HomeProduct } from "@/types"
import { ClipLoader } from "react-spinners"
import { useRouter } from "next/navigation"

export default function Home() {
  const [bestSellingProducts, setBestSellingProducts] = useState<HomeProduct[] | null>(null)
  const [bestSellingLoading, setBestSellingLoading] = useState<boolean>(false)
  const [bestSellingError, setBestSellingError] = useState<string>("")
  const [latestProducts, setLatestProducts] = useState<HomeProduct[] | null>(null)
  const [latestProductsLoading, setLatestProductsLoading] = useState<boolean>(false)
  const [latestProductsError, setLatestProductsError] = useState<string>("")
  const router = useRouter()

  useEffect(() => {
    const fetchBestSellingProducts = async () => {
      setBestSellingError("")
      setBestSellingLoading(true)
      try {
        const response: HomeProduct[] = await getHomeBestSellingProducts()
        setBestSellingProducts(response)
      } catch (error) {
        console.error(error)
        setBestSellingError("An error occurred while fetching Best Selling Products")
      } finally {
        setBestSellingLoading(false)
      }
    }

    fetchBestSellingProducts()
  }, [])

  useEffect(() => {
    const fetchLatestProducts = async () => {
      setLatestProductsError("")
      setLatestProductsLoading(true)
      try {
        const response: HomeProduct[] = await getHomeLatestProducts()
        setLatestProducts(response)
      } catch (error) {
        console.error(error)
        setLatestProductsError("An error occurred while fetching Latest Products")
      } finally {
        setLatestProductsLoading(false)
      }
    }

    fetchLatestProducts()
  }, [])

  const handleViewCollection = () => {
    router.push("/search")
  }

  const handleViewFashionParadise = () => {
    router.push("/search?maxPrice=800")
  }

  return (
    <>
      <div className="space-y-12">
        <div className="bg-secondary">
          <div className="mx-auto container flex flex-col items-center md:flex-row md:justify-between py-8 px-12">
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold">Fresh Arrivals Online</h1>
              <p className="text-gray-500">Get the latest fashion trends and styles</p>
              <Button className="bg-primary py-2 px-4 rounded-sm mt-12" onClick={handleViewCollection}>
                View Collection <FaArrowRight size={24} />
              </Button>
            </div>
            <div className="mt-16 md:mt-0">
              <Image src="https://img.freepik.com/free-vector/stylish-new-arrival-sale-offer-background-brush-stroke-style_1017-49946.jpg?semt=ais_hybrid" width={400} height={400} alt="Sample Photo" />
            </div>
          </div>
        </div>

        <div className="mx-auto container">
          <div className="bg-background">
            <div className="mx-auto container flex flex-col md:flex-row md:justify-between items-center md:items-start py-8 px-12 flex-wrap my-16">
              <div className="space-y-6 w-64 flex flex-col justify-center items-center md:items-start h-full my-6">
                <div className="bg-secondary p-2 w-10 aspect-square rounded-full">
                  <LuTruck size={24} />
                </div>
                <h1 className="text-lg font-bold">Free Shipping</h1>
                <p className="text-center md:text-left">
                  Upgrade your style today and get FREE shipping on all orders!
                </p>
              </div>
              <div className="space-y-6 w-64 flex flex-col justify-center items-center md:items-start h-full my-6">
                <div className="bg-secondary p-2 w-10 aspect-square rounded-full">
                  <RiMedalLine size={24} />
                </div>
                <h1 className="text-lg font-bold text-center md:text-left">Satisfaction Guarantee</h1>
                <p className="text-center md:text-left">
                  Ship confidently with our Satisfaction Guarantee: Love it or get a refund.
                </p>
              </div>
              <div className="space-y-6 w-64 flex flex-col justify-center items-center md:items-start my-6">
                <div className="bg-secondary p-2 w-10 aspect-square rounded-full">
                  <LuShieldCheck size={24} />
                </div>
                <h1 className="text-lg font-bold text-center md:text-left">Secure Payment</h1>
                <p className="text-center md:text-left">
                  Your security is our priority. Your payments are secure with us.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto container space-y-16">
          <div className="text-center">
            <h5 className="text-zinc-500 font-black">SHOP NOW</h5>
            <h1 className="text-3xl font-bold">Best Selling</h1>
          </div>
          <div className="flex items-center flex-wrap justify-center md:justify-between">
            {bestSellingLoading ? (
              <div className="flex justify-center items-center w-full h-64">
                <ClipLoader color="#000" size={30} />
              </div>
            ) : bestSellingError ? (
              <div className="text-red-500 text-center w-full">{bestSellingError}</div>
            ) : (
              bestSellingProducts &&
              bestSellingProducts.map((product: HomeProduct, index: number) => {
                return <ProductItem key={index} {...product} />
              })
            )}
          </div>
        </div>

        <div className="bg-secondary">
          <div className="mx-auto container flex flex-col items-center md:flex-row md:justify-between py-8 px-12">
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold">Best Sales on Fashion!</h1>
              <p className="text-gray-500">
                Step into a world of style and explore our diverse collection of clothing categories with best prices.
              </p>
              <Button className="bg-primary py-2 px-4 rounded-sm mt-12" onClick={handleViewFashionParadise}>
                View Collection <FaArrowRight size={24} />
              </Button>
            </div>
            <div className="mt-16 md:mt-0">
              <Image src="https://img.freepik.com/free-vector/exchange-offer-trendy-banner-design_1017-33509.jpg?ga=GA1.1.1992070656.1738257631&semt=ais_hybrid" width={500} height={500}  alt="Sample Photo" />
            </div>
          </div>
        </div>

        <div className="mx-auto container space-y-16 pb-24">
          <div className="text-center">
            <h5 className="text-zinc-500 font-black">SHOP NOW</h5>
            <h1 className="text-3xl font-bold">Latest</h1>
          </div>
          <div className="flex items-center flex-wrap justify-center md:justify-between">
            {latestProductsLoading ? (
              <div className="flex justify-center items-center w-full h-64">
                <ClipLoader color="#000" size={30} />
              </div>
            ) : latestProductsError ? (
              <div className="text-red-500 text-center w-full">{latestProductsError}</div>
            ) : (
              latestProducts &&
              latestProducts.map((product: HomeProduct, index: number) => {
                return <ProductItem key={index} {...product} />
              })
            )}
          </div>
        </div>
      </div>
    </>
  )
}


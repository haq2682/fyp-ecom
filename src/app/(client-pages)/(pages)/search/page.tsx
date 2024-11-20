import { Button } from "@/components/ui/button";
import ProductItem from "@/components/product/product-item";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
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

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

const categories = [
    "T-Shirts", "Polos", "Sweat Shirts", "Dress Shirts", "Overshirts", "Hooded Shirts",
    "Jeans", "Formal Pants", "Drawstring Pants", "Dress Pants", "Wool Pants", "Shorts"
];

export default function Search() {
    return (
        <>
            <Drawer>
                <div className="mx-auto container mb-12">
                    <div className="w-full space-y-8">
                        <div className="flex justify-between">
                            <div className="space-y-3">
                                <h1>Applied Filters:</h1>
                                <div className="flex gap-x-4">
                                    <Badge variant="outline">T-Shirts</Badge>
                                    <Badge variant="outline">XL</Badge>
                                </div>
                            </div>
                            <div>
                                <DrawerTrigger asChild>
                                    <Button>
                                        Apply Filters
                                    </Button>
                                </DrawerTrigger>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <p>Showing 1-9 Of 36 Results</p>
                            <div>
                                <Select>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Sort By..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="apple">Name</SelectItem>
                                            <SelectItem value="banana">Price (Low to High)</SelectItem>
                                            <SelectItem value="blueberry">Price (High to Low)</SelectItem>
                                            <SelectItem value="grapes">Date</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="mx-auto">
                            <div className="flex flex-wrap justify-center w-full">
                                <ProductItem />
                                <ProductItem />
                                <ProductItem />
                                <ProductItem />
                                <ProductItem />
                                <ProductItem />
                                <ProductItem />
                                <ProductItem />
                                <ProductItem />
                            </div>
                        </div>
                        <div>
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious href="#" />
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink href="#">1</PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink href="#" isActive>
                                            2
                                        </PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink href="#">3</PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationEllipsis />
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationNext href="#" />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
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
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-4">
                                {categories.map((category, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                        <Checkbox id={`category-${index}`} />
                                        <label
                                            htmlFor={`category-${index}`}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            {category}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="mt-10">
                            <h1 className="font-bold text-xl text-center">Sizes</h1>
                            <div className="w-full flex flex-wrap mt-4">
                                <div className="w-1/4">
                                    <Checkbox id="category1" />
                                    <label htmlFor="category1" className="ml-2">S</label>
                                </div>
                                <div className="w-1/4">
                                    <Checkbox id="category1" />
                                    <label htmlFor="category1" className="ml-2">M</label>
                                </div>
                                <div className="w-1/4">
                                    <Checkbox id="category1" />
                                    <label htmlFor="category1" className="ml-2">L</label>
                                </div>
                                <div className="w-1/4">
                                    <Checkbox id="category1" />
                                    <label htmlFor="category1" className="ml-2">XL</label>
                                </div>
                                <div className="w-1/4">
                                    <Checkbox id="category1" />
                                    <label htmlFor="category1" className="ml-2">XXL</label>
                                </div>
                            </div>
                        </div>
                        <div className="mt-10">
                            <h1 className="font-bold text-xl text-center">Price</h1>
                            <div className="flex items-center mt-4 justify-center">
                                <div className="flex items-center">
                                    <span className="mr-2">$</span><Input placeholder="Enter Price" />
                                </div>
                                <p className="font-bold mx-6 text-2xl"> - </p>
                                <div className="flex items-center">
                                    <span className="mr-2">$</span><Input placeholder="Enter Price" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <DrawerFooter className="w-full flex items-center">
                        <Button className="w-32">Submit</Button>
                        <DrawerClose asChild>
                            <Button className="w-32" variant="outline">Cancel</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    )
}
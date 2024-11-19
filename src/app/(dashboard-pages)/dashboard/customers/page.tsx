"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableCell,
    TableRow,
} from "@/components/ui/table";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

import { MoreHorizontal } from "lucide-react";

interface Customer {
    id: number;
    username: string;
    email: string;
    address: string;
}

const sampleCustomers: Customer[] = [
    { id: 1, username: 'john_doe', email: 'john@example.com', address: '123 Elm St' },
    { id: 2, username: 'jane_smith', email: 'jane@example.com', address: '456 Oak St' },
    { id: 3, username: 'alice_johnson', email: 'alice@example.com', address: '789 Pine St' },
    { id: 4, username: 'bob_brown', email: 'bob@example.com', address: '101 Maple St' },
];

const Customers = () => {
    const [customers, setCustomers] = useState<Customer[]>(sampleCustomers);
    const [editingCustomerId, setEditingCustomerId] = useState<number | null>(null);
    const [editedCustomer, setEditedCustomer] = useState<Customer | null>(null);

    const handleEditClick = (customer: Customer) => {
        setEditingCustomerId(customer.id);
        setEditedCustomer(customer);
    };

    const handleDiscard = () => {
        setEditingCustomerId(null);
        setEditedCustomer(null);
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Customer) => {
        if (editedCustomer) {
            setEditedCustomer({ ...editedCustomer, [field]: e.target.value });
        }
    };

    const handleSubmit = () => {
        if (editedCustomer) {
            setCustomers(customers.map(customer =>
                customer.id === editedCustomer.id ? editedCustomer : customer
            ));
            setEditingCustomerId(null);
            setEditedCustomer(null);
        }
    };

    return (
        <div className="container mx-auto mt-12">
            <header className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold w-1/6">Customers</h2>
                <Input className="w-1/3 md:w-1/4 lg:w-1/6" placeholder="Search Customers" />
            </header>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-center">Customer ID</TableHead>
                        <TableHead className="text-center">Username</TableHead>
                        <TableHead className="text-center">Email</TableHead>
                        <TableHead className="text-center">Address</TableHead>
                        <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {customers.map((customer) => (
                        <TableRow key={customer.id} className="text-center">
                            <TableCell>{customer.id}</TableCell>
                            <TableCell>
                                {editingCustomerId === customer.id ? (
                                    <Input
                                        value={editedCustomer?.username}
                                        onChange={(e) => handleInputChange(e, 'username')}
                                    />
                                ) : (
                                    customer.username
                                )}
                            </TableCell>
                            <TableCell>
                                {editingCustomerId === customer.id ? (
                                    <Input
                                        value={editedCustomer?.email}
                                        onChange={(e) => handleInputChange(e, 'email')}
                                    />
                                ) : (
                                    customer.email
                                )}
                            </TableCell>
                            <TableCell>
                                {editingCustomerId === customer.id ? (
                                    <Input
                                        value={editedCustomer?.address}
                                        onChange={(e) => handleInputChange(e, 'address')}
                                    />
                                ) : (
                                    customer.address
                                )}
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger>
                                        <MoreHorizontal />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        {editingCustomerId === customer.id ? (
                                            <>
                                                <DropdownMenuItem onClick={handleSubmit}>
                                                    Save
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={handleDiscard}>
                                                    Discard
                                                </DropdownMenuItem>
                                            </>
                                        ) : (
                                            <>
                                                <DropdownMenuItem onClick={() => handleEditClick(customer)}>Edit</DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                            </>

                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="mt-12">
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
        </div >
    );
};

export default Customers;
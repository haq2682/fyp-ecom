"use client";
import { getCustomers } from "@/actions/customers"
import { User } from "@prisma/client"
import { MoreHorizontal } from 'lucide-react'
import { Input } from "@/components/ui/input"
import React, {useState} from 'react'
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

interface CustomersTableProps {
    customers: User[],
    setCustomers: React.Dispatch<React.SetStateAction<User[]>>
}

export default function CustomersTable({
    customers,
    setCustomers
}: CustomersTableProps) {
    const [editingCustomerId, setEditingCustomerId] = useState<number | null>(null);
    const [editedCustomer, setEditedCustomer] = useState<User | null>(null);

    const handleEditClick = (customer: User) => {
        setEditingCustomerId(customer.id);
        setEditedCustomer(customer);
    };

    const handleDiscard = () => {
        setEditingCustomerId(null);
        setEditedCustomer(null);
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof User) => {
        if (editedCustomer) {
            setEditedCustomer({ ...editedCustomer, [field]: e.target.value });
        }
    };

    const handleSubmit = () => {
        if (editedCustomer) {
            setCustomers(customers?.map(customer =>
                customer.id === editedCustomer.id ? editedCustomer : customer
            ));
            setEditingCustomerId(null);
            setEditedCustomer(null);
        }
    };
    return (
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
                {customers?.map((customer: User) => (
                    <TableRow key={customer.id} className="text-center">
                        <TableCell>{customer.id}</TableCell>
                        <TableCell>
                            {editingCustomerId === customer.id ? (
                                <Input
                                    value={editedCustomer?.username}
                                    onChange={(e) => handleInputChange(e, "username")}
                                />
                            ) : (
                                customer.username
                            )}
                        </TableCell>
                        <TableCell>
                            {editingCustomerId === customer.id ? (
                                <Input
                                    value={editedCustomer?.email}
                                    onChange={(e) => handleInputChange(e, "email")}
                                />
                            ) : (
                                customer.email
                            )}
                        </TableCell>
                        <TableCell>
                            {editingCustomerId === customer.id ? (
                                <Input
                                    value={editedCustomer?.address}
                                    onChange={(e) => handleInputChange(e, "address")}
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
                                            <DropdownMenuItem onClick={handleSubmit}>Save</DropdownMenuItem>
                                            <DropdownMenuItem onClick={handleDiscard}>
                                                Discard
                                            </DropdownMenuItem>
                                        </>
                                    ) : (
                                        <>
                                            <DropdownMenuItem onClick={() => handleEditClick(customer)}>
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive">
                                                Delete
                                            </DropdownMenuItem>
                                        </>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}


import { getCustomers } from "@/actions/customers"
import { User } from "@prisma/client"
import { MoreHorizontal } from 'lucide-react'
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

interface CustomersTableProps {
    customers: User[]
    editingCustomerId: number | null
    editedCustomer: User | null
    onEditClick: (customer: User) => void
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>, field: keyof User) => void
    onSubmit: () => void
    onDiscard: () => void
}

export function CustomersTable({
    customers,
    editingCustomerId,
    editedCustomer,
    onEditClick,
    onInputChange,
    onSubmit,
    onDiscard,
}: CustomersTableProps) {
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
                                    onChange={(e) => onInputChange(e, "username")}
                                />
                            ) : (
                                customer.username
                            )}
                        </TableCell>
                        <TableCell>
                            {editingCustomerId === customer.id ? (
                                <Input
                                    value={editedCustomer?.email}
                                    onChange={(e) => onInputChange(e, "email")}
                                />
                            ) : (
                                customer.email
                            )}
                        </TableCell>
                        <TableCell>
                            {editingCustomerId === customer.id ? (
                                <Input
                                    value={editedCustomer?.address}
                                    onChange={(e) => onInputChange(e, "address")}
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
                                            <DropdownMenuItem onClick={onSubmit}>Save</DropdownMenuItem>
                                            <DropdownMenuItem onClick={onDiscard}>
                                                Discard
                                            </DropdownMenuItem>
                                        </>
                                    ) : (
                                        <>
                                            <DropdownMenuItem onClick={() => onEditClick(customer)}>
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


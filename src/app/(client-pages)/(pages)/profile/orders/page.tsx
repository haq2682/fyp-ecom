"use client";
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getOrders } from '@/actions/profile';
import { ProfileOrder, OrdersResponse } from '@/types';
import { ClipLoader } from 'react-spinners';
import formatDate from '@/utils/formatDate';

export default function Orders() {
    const [orders, setOrders] = useState<ProfileOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [endCursor, setEndCursor] = useState<string | null>(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async (cursor?: string | null) => {
        try {
            const isInitialFetch = !cursor;
            if (isInitialFetch) {
                setLoading(true);
            } else {
                setLoadingMore(true);
            }

            const response: OrdersResponse = await getOrders(cursor as string);
            const newOrders: ProfileOrder[] = response.customer.orders.edges.map(edge => edge.node);

            setOrders(prev => cursor ? [...prev, ...newOrders] : newOrders);
            setHasNextPage(response.customer.orders.pageInfo.hasNextPage);
            setEndCursor(response.customer.orders.pageInfo.endCursor);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const OrderItem = ({ order }: { order: ProfileOrder }) => {
        const firstItem = order.lineItems.edges[0]?.node;
        if (!firstItem) return null;

        return (
            <div className="flex flex-col md:flex-row justify-center md:justify-between items-center w-full border-b-2 border-border py-8">
                <div className="flex flex-col md:flex-row items-center justify-center">
                    <Image
                        src={firstItem.variant.image?.transformedSrc || firstItem.variant.product.featuredImage.url as string}
                        height={150}
                        width={150}
                        alt={firstItem.variant.image?.altText || "Product image"}
                    />
                    <div className="flex flex-col justify-center items-center md:items-start md:ml-8 gap-y-2">
                        <h1 className="text-xl font-bold">{firstItem.variant.title}</h1>
                        <p>Order #{order.orderNumber}</p>
                        <p>Ordered On: {formatDate(order.processedAt)}</p>
                        <p className="font-bold">
                            {order.totalPrice.currencyCode} {order.totalPrice.amount}
                        </p>
                    </div>
                </div>
                <div className="flex items-center flex-col md:flex-row gap-y-4 md:gap-y-0 mt-6">
                    <p className="text-lg font-bold mx-3">{order.financialStatus}</p>
                    <div className="flex items-center gap-x-4 border border-ring text-xl mx-3">
                        <Button variant="ghost" className="rounded-sm" asChild>
                            <Link href={`/item/${firstItem.variant.id}`}>
                                View Item
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <ClipLoader color="#000000" size={50} />
            </div>
        );
    }

    return (
        <div className="px-10 overflow-y-auto h-full">
            {orders.map((order) => (
                <OrderItem key={order.id} order={order} />
            ))}

            {hasNextPage && (
                <div className="flex justify-center my-8">
                    <Button
                        onClick={() => fetchOrders(endCursor || null)}
                        disabled={loadingMore}
                        className="min-w-[150px]"
                    >
                        {loadingMore ? (
                            <ClipLoader color="#ffffff" size={20} />
                        ) : (
                            'Load More'
                        )}
                    </Button>
                </div>
            )}

            {!loading && orders.length === 0 && (
                <div className="flex justify-center items-center h-full">
                    <p className="text-xl">No orders found</p>
                </div>
            )}
        </div>
    );
}
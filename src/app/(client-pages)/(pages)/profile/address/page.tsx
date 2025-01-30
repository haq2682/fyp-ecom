"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { getDefaultAddress, updateAddress } from "@/actions/profile";
import { AddressData } from "@/types";

export default function Address() {
    const [loading, setLoading] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);
    const [formData, setFormData] = useState<AddressData>({
        address1: "",
        city: "",
        province: "",
        zip: "",
        country: ""
    });
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');

    useEffect(() => {
        const fetchAddress = async () => {
            try {
                const address = await getDefaultAddress();
                if (address) {
                    setFormData({
                        address1: address.address1,
                        city: address.city,
                        province: address.province,
                        zip: address.zip,
                        country: address.country
                    });
                }
            } catch (error) {
                console.error("Error fetching address:", error);
                setError('Failed to fetch address');
            } finally {
                setInitialLoad(false);
            }
        };

        fetchAddress();
    }, []);

    const handleChange = (field: keyof AddressData) => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData(prev => ({
            ...prev,
            [field]: e.target.value
        }));
    };

    const isFormValid = (): boolean => {
        return Object.values(formData).every(value => value.trim().length > 0);
    };

    const handleSubmit = async () => {
        setError('');
        setSuccess('');
        if (!isFormValid()) {
            setError('Please fill in all fields');
            return;
        }

        try {
            setLoading(true);
            const response = await updateAddress(formData);

            if (response.success) {
                setSuccess(response.message);
            } else {
                setError(response.message);
            }
        } catch (error) {
            console.error('Failed to update address', error);
            setError('Failed to update address');
        } finally {
            setLoading(false);
        }
    };

    if (initialLoad) {
        return (
            <div className="md:w-2/6 mx-auto p-5 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="md:w-2/6 mx-auto p-5">
            <div className="w-full space-y-4">
                <div className="w-full">
                    <Input
                        placeholder="Street Address"
                        value={formData.address1}
                        onChange={handleChange("address1")}
                    />
                </div>
                <div className="w-full flex gap-x-6">
                    <Input
                        placeholder="City"
                        className="w-1/2"
                        value={formData.city}
                        onChange={handleChange("city")}
                    />
                    <Input
                        placeholder="State"
                        className="w-1/2"
                        value={formData.province}
                        onChange={handleChange("province")}
                    />
                </div>
                <div className="w-full flex gap-x-6">
                    <Input
                        placeholder="Zip Code"
                        className="w-1/2"
                        value={formData.zip}
                        onChange={handleChange("zip")}
                    />
                    <Input
                        placeholder="Country"
                        className="w-1/2"
                        value={formData.country}
                        onChange={handleChange("country")}
                    />
                </div>
                <div className="w-full">
                    <Button
                        className="rounded-sm w-full mt-12"
                        onClick={handleSubmit}
                        disabled={!isFormValid() || loading}
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
                {
                    error && <p className="text-red-500 mt-4 text-center">{error}</p>
                }
                {
                    success && <p className="text-green-500 mt-4 text-center">{success}</p>
                }
            </div>
        </div>
    );
}
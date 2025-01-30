"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "@/actions/profile";
import { ProfileUpdateData } from "@/types";

export default function Profile() {
    const [loading, setLoading] = useState(false);
    const [initialData, setInitialData] = useState<ProfileUpdateData>({
        firstName: "",
        lastName: "",
        email: "",
    });
    const [formData, setFormData] = useState<ProfileUpdateData>({
        firstName: "",
        lastName: "",
        email: "",
    });

    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchProfile = async () => {
            const profile = await getProfile();
            if (profile) {
                setInitialData(profile);
                setFormData(profile);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (field: keyof ProfileUpdateData) => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData((prev) => ({
            ...prev,
            [field]: e.target.value,
        }));
    };

    const isFormChanged = (): boolean => {
        return (
            formData.firstName !== initialData.firstName ||
            formData.lastName !== initialData.lastName ||
            formData.email !== initialData.email
        );
    };

    const handleSubmit = async () => {
        setError('');
        try {
            setLoading(true);
            const response = await updateProfile(formData);

            if (response.success) {
                setInitialData(formData);
            } else {
                setError(response.message);
            }
        } catch (error) {
            console.error('Failed to update info', error);
            setError('Failed to update info');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="md:w-2/6 mx-auto p-5">
            <div className="my-4">
                <Input
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange("firstName")}
                />
            </div>
            <div className="my-4">
                <Input
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange("lastName")}
                />
            </div>
            <div className="my-4">
                <Input
                    placeholder="Email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange("email")}
                />
            </div>
            <div className="flex flex-col my-12 gap-y-4">
                <Button
                    className="rounded-sm"
                    onClick={handleSubmit}
                    disabled={!isFormChanged() || loading}
                >
                    {loading ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                    onClick={() => signOut()}
                    className="rounded-sm"
                    variant="ghost"
                >
                    Log Out
                </Button>
                <Button className="rounded-sm" variant="destructive">
                    Delete Account
                </Button>
                {
                    error && <p className="text-red-500 text-center">{error}</p>
                }
            </div>
        </div>
    );
}
"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { updatePassword } from "@/actions/profile";
import { PasswordUpdateData } from "@/types";

export default function Password() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<PasswordUpdateData>({
        currentPassword: "",
        newPassword: ""
    });
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');

    const handleChange = (field: keyof PasswordUpdateData) => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData(prev => ({
            ...prev,
            [field]: e.target.value
        }));
    };

    const isFormValid = (): boolean => {
        return formData.currentPassword.length >= 8 && formData.newPassword.length >= 8;
    };

    const handleSubmit = async () => {
        setError('');
        setSuccess('');
        if (!isFormValid()) {
            setError('Password must be at least 8 characters long');
            return;
        }

        try {
            setLoading(true);
            const response = await updatePassword(formData);

            if (response.success) {
                setSuccess(response.message);
                setFormData({
                    currentPassword: "",
                    newPassword: ""
                });
            } else {
                setError(response.message);
            }
        } catch (error) {
            console.error('Failed to update password', error);
            setError('Failed to update password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="md:w-2/6 mx-auto p-5">
            <div className="my-4">
                <Input
                    placeholder="Old Password"
                    type="password"
                    value={formData.currentPassword}
                    onChange={handleChange("currentPassword")}
                />
            </div>
            <div className="my-4">
                <Input
                    placeholder="New Password"
                    type="password"
                    value={formData.newPassword}
                    onChange={handleChange("newPassword")}
                />
            </div>
            <div className="w-full my-12">
                <Button
                    className="rounded-sm w-full"
                    onClick={handleSubmit}
                    disabled={!isFormValid() || loading}
                >
                    {loading ? "Updating..." : "Save Changes"}
                </Button>
            </div>
            {
                error && <p className="text-red-500 text-center">{error}</p>
            }
            {
                success && <p className="text-green-500 text-center">{success}</p>
            }
        </div>
    );
}
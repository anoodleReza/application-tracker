'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, ArrowLeft } from "lucide-react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function CreateApplicationForm() {
    const router = useRouter();
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        companyName: '',
        positionTitle: '',
        status: 'Applied',
        applicationDate: new Date().toISOString().split('T')[0],
        jobUrl: '',
        notes: ''
    });

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/applications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to create application');
            }

            // Reset form
            setFormData({
                companyName: '',
                positionTitle: '',
                status: 'Applied',
                applicationDate: new Date().toISOString().split('T')[0],
                jobUrl: '',
                notes: ''
            });

            // Redirect to dashboard
            router.push('/dashboard');

        } catch (error) {
            console.error('Error creating application:', error);
            // You might want to add error state to show to the user
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleStatusChange = (value) => {
        setFormData(prev => ({
            ...prev,
            status: value
        }));
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
            <div className="w-full max-w-lg">
                <div className="flex items-center mb-6">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h2 className="text-3xl font-bold tracking-tight ml-2">Create Application</h2>
                </div>

                {error && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <Card className="w-full">
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="companyName">Company Name</Label>
                                <Input
                                    id="companyName"
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter company name"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="positionTitle">Position Title</Label>
                                <Input
                                    id="positionTitle"
                                    name="positionTitle"
                                    value={formData.positionTitle}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter position title"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={handleStatusChange}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Applied">Applied</SelectItem>
                                        <SelectItem value="Interview">Interview</SelectItem>
                                        <SelectItem value="Assessment">Assessment</SelectItem>
                                        <SelectItem value="Programming">Programming</SelectItem>
                                        <SelectItem value="Offer">Offer</SelectItem>
                                        <SelectItem value="Rejected">Rejected</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="applicationDate">Application Date</Label>
                                <div className="relative">
                                    <Input
                                        id="applicationDate"
                                        name="applicationDate"
                                        type="date"
                                        value={formData.applicationDate}
                                        onChange={handleChange}
                                        required
                                    />
                                    <CalendarIcon className="absolute right-3 top-2.5 h-4 w-4 text-gray-500" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="jobUrl">Job Posting URL</Label>
                                <Input
                                    id="jobUrl"
                                    name="jobUrl"
                                    type="url"
                                    value={formData.jobUrl}
                                    onChange={handleChange}
                                    placeholder="https://example.com/job-posting"
                                    className="font-mono text-sm"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="notes">Notes</Label>
                                <Textarea
                                    id="notes"
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    placeholder="Add any notes about the application"
                                    className="h-32"
                                />
                            </div>

                            <div className="flex justify-center space-x-4 pt-4">
                                <Button
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? 'Creating...' : 'Create Application'}
                                </Button>
                                <Link href="/dashboard">
                                    <Button variant="outline" type="button">
                                        Cancel
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

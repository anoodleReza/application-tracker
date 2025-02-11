'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CalendarIcon, ArrowLeft, Plus, Trash2 } from "lucide-react";
import InterviewModal from "@/components/forms/InterviewModal";
import Link from 'next/link';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function ApplicationPage({ params }: PageProps) {
    const router = useRouter();
    const { id } = React.use(params);
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState(null);
    const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
    const [selectedInterview, setSelectedInterview] = useState(null);

    useEffect(() => {
        const fetchApplication = async () => {
            try {
                const response = await fetch(`/api/applications/${id}`, {
                    credentials: 'include'
                });
                if (!response.ok) throw new Error('Failed to fetch application');
                const data = await response.json();
                setApplication(data);
                setFormData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchApplication();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/applications/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error('Failed to update application');

            const updatedApplication = await response.json();
            setApplication(updatedApplication);
            setEditing(false);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleInterviewSubmit = async (interviewData) => {
        try {
            const method = interviewData.id ? 'PUT' : 'POST';
            const url = interviewData.id
                ? `/api/interviews/${interviewData.id}`
                : '/api/interviews';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(interviewData),
            });

            if (!response.ok) throw new Error('Failed to save interview');

            // Refresh application data to get updated interviews
            const appResponse = await fetch(`/api/applications/${id}`, {
                credentials: 'include'
            });
            if (!appResponse.ok) throw new Error('Failed to refresh application data');

            const updatedApplication = await appResponse.json();
            setApplication(updatedApplication);
            setIsInterviewModalOpen(false);
            setSelectedInterview(null);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteInterview = async (interviewId) => {
        if (!window.confirm('Are you sure you want to delete this interview?')) return;

        try {
            const response = await fetch(`/api/interviews/${interviewId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (!response.ok) throw new Error('Failed to delete interview');

            // Refresh application data to get updated interviews
            const appResponse = await fetch(`/api/applications/${id}`, {
                credentials: 'include'
            });
            if (!appResponse.ok) throw new Error('Failed to refresh application data');

            const updatedApplication = await appResponse.json();
            setApplication(updatedApplication);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this application?')) return;

        try {
            const response = await fetch(`/api/applications/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (!response.ok) throw new Error('Failed to delete application');

            router.push('/dashboard');
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return <div className="text-center py-8">Loading...</div>;
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <h2 className="text-3xl font-bold tracking-tight">
                            {editing ? 'Edit Application' : application.companyName}
                        </h2>
                    </div>
                    <div className="flex gap-2">
                        {!editing && (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={() => setEditing(true)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={handleDelete}
                                >
                                    Delete
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    {editing ? (
                        <Card>
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
                                                value={formData.applicationDate.split('T')[0]}
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
                                            value={formData.jobUrl || ''}
                                            onChange={handleChange}
                                            placeholder="https://example.com/job-posting"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="notes">Notes</Label>
                                        <Textarea
                                            id="notes"
                                            name="notes"
                                            value={formData.notes || ''}
                                            onChange={handleChange}
                                            className="h-32"
                                        />
                                    </div>

                                    <div className="flex justify-end gap-2 pt-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                setFormData(application);
                                                setEditing(false);
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button type="submit">
                                            Save Changes
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    ) : (
                        <>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Application Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label className="text-sm">Position Title</Label>
                                        <p className="text-lg">{application.positionTitle}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm">Status</Label>
                                        <span className={`inline-block px-3 py-1 rounded-full text-sm mt-1
                      ${application.status === 'Applied' ? 'bg-blue-100 text-blue-800' :
                                            application.status === 'Interview' ? 'bg-yellow-100 text-yellow-800' :
                                                application.status === 'Offer' ? 'bg-green-100 text-green-800' :
                                                    application.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                                        'bg-gray-100 text-gray-800'}`}
                                        >
                      {application.status}
                    </span>
                                    </div>
                                    <div>
                                        <Label className="text-sm">Application Date</Label>
                                        <p>{new Date(application.applicationDate).toLocaleDateString()}</p>
                                    </div>
                                    {application.jobUrl && (
                                        <div>
                                            <Label className="text-sm">Job URL</Label>
                                            <p>
                                                <a
                                                    href={application.jobUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    {application.jobUrl}
                                                </a>
                                            </p>
                                        </div>
                                    )}
                                    {application.notes && (
                                        <div>
                                            <Label className="text-sm">Notes</Label>
                                            <p className="whitespace-pre-wrap">{application.notes}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle>Interviews</CardTitle>
                                    <Button
                                        size="sm"
                                        onClick={() => {
                                            setSelectedInterview(null);
                                            setIsInterviewModalOpen(true);
                                        }}
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Interview
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    {application.interviews?.length > 0 ? (
                                        <div className="space-y-4">
                                            {application.interviews.map((interview) => (
                                                <div
                                                    key={interview.id}
                                                    className="flex items-center justify-between p-4 border rounded-lg"
                                                >
                                                    <div>
                                                        <p className="font-medium">{interview.interviewType}</p>
                                                        <p className="text-sm text-gray-600">
                                                            {new Date(interview.interviewDate).toLocaleString()}
                                                        </p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => {
                                                                setSelectedInterview(interview);
                                                                setIsInterviewModalOpen(true);
                                                            }}
                                                        >
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() => handleDeleteInterview(interview.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-center text-gray-500 py-4">
                                            No interviews scheduled yet
                                        </p>
                                    )}
                                </CardContent>
                            </Card>

                            <InterviewModal
                                isOpen={isInterviewModalOpen}
                                onClose={() => {
                                    setIsInterviewModalOpen(false);
                                    setSelectedInterview(null);
                                }}
                                onSubmit={handleInterviewSubmit}
                                interview={selectedInterview}
                                applicationId={id}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
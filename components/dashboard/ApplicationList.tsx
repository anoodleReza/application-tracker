import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

const ApplicationList = () => {
    // Mock data - replace with real data from your API
    const applications = [
        {
            id: 1,
            company: "Tech Corp",
            position: "Senior Developer",
            status: "Interview",
            applicationDate: "2024-02-01",
            nextInterview: "2024-02-15",
        },
        {
            id: 2,
            company: "StartUp Inc",
            position: "Full Stack Engineer",
            status: "Applied",
            applicationDate: "2024-02-03",
        },
    ];

    const getStatusColor = (status: string) => {
        const colors = {
            Applied: "bg-blue-100 text-blue-800",
            Interview: "bg-yellow-100 text-yellow-800",
            Offer: "bg-green-100 text-green-800",
            Rejected: "bg-red-100 text-red-800",
        };
        return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Applications</CardTitle>
                <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Application
                </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {applications.map((application) => (
                        <div
                            key={application.id}
                            className="flex items-center justify-between p-4 border rounded-lg"
                        >
                            <div className="space-y-1">
                                <h3 className="font-medium">{application.company}</h3>
                                <p className="text-sm text-gray-500">{application.position}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-sm text-gray-500">
                                    Applied: {new Date(application.applicationDate).toLocaleDateString()}
                                </div>
                                <Badge className={getStatusColor(application.status)}>
                                    {application.status}
                                </Badge>
                                {application?.nextInterview && (
                                    <div className="text-sm text-gray-500">
                                        Next Interview: {new Date(application.nextInterview).toLocaleDateString()}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default ApplicationList;
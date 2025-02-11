import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ApplicationListItem from "@/components/dashboard/ApplicationListItem";
import { Plus, Search } from "lucide-react";

const ApplicationList = ({ applications }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Get unique statuses from applications
    const uniqueStatuses = ['all', ...new Set(applications.map(app => app.status))];

    // Filter applications based on search query and status
    const filteredApplications = applications.filter(application => {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch =
            application.companyName.toLowerCase().includes(searchLower) ||
            application.positionTitle.toLowerCase().includes(searchLower);

        const matchesStatus =
            statusFilter === 'all' ||
            application.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Applications</CardTitle>
                <Button size="sm" onClick={() => window.location.href = "/applications"}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Application
                </Button>
            </CardHeader>
            <CardContent>
                <div className="flex gap-4 mb-4">
                    <div className="relative flex-1">
                        <Input
                            type="text"
                            placeholder="Search applications..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-8"
                        />
                        <Search className="h-4 w-4 absolute left-2 top-3 text-gray-500" />
                    </div>
                    <Select
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            {uniqueStatuses.map((status) => (
                                <SelectItem key={status} value={status}>
                                    {status === 'all' ? 'All' : status}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-4">
                    {filteredApplications.length > 0 ? (
                        filteredApplications.map((application) => (
                            <ApplicationListItem
                                key={application.id}
                                application={application}
                            />
                        ))
                    ) : (
                        <div className="text-center text-gray-500 py-4">
                            No applications found matching your criteria.
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default ApplicationList;
import React, {useState} from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ApplicationListItem from "@/components/dashboard/ApplicationListItem";
import { Plus } from "lucide-react";

const ApplicationList = ({applications}) => {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Applications</CardTitle>
                <Button size="sm" onClick={() => window.location.href = "/applications"}>                    <Plus className="mr-2 h-4 w-4" />
                    Add Application
                </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {applications.map((application) => (
                        <ApplicationListItem
                            key={application.id}
                            application={application}
                        />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default ApplicationList;
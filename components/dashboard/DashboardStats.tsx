import React, {useEffect, useState} from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DashboardStats = ({applications}) => {

    const stats = {
        totalApplications: applications.length,
        activeInterviews: applications.filter(app => app.status === 'Interview').length,
        responseRate: Math.round((applications.filter(app =>
            ['Interview', 'Offer', 'Assessment', 'Programming'].includes(app.status)
        ).length / applications.length) * 100) || 0,
        offerRate: Math.round((applications.filter(app =>
            app.status === 'Offer'
        ).length / applications.length) * 100) || 0
    };

     const applicationHistory = applications.reduce((acc, app) => {
         const month = new Date(app.applicationDate).toLocaleString('default', {month: 'short'});
         const existingMonth = acc.find(item => item.name === month);

         if (existingMonth){
             existingMonth.applications++;
         } else {
             acc.push({name: month, applications: 1});
         }
         return acc;
     } , []).sort((a, b) => {
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return months.indexOf(a.name) - months.indexOf(b.name);
     });

    const statusBreakdown = applications.reduce((acc, app) => {
        const existingStatus = acc.find(item => item.status === app.status);
        if (existingStatus) {
            existingStatus.count++;
        } else {
            acc.push({ status: app.status, count: 1 });
        }
        return acc;
    }, []);

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Stats Cards */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.totalApplications}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Interviews</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.activeInterviews}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.responseRate}%</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Offer Rate</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.offerRate}%</div>
                </CardContent>
            </Card>

            {/* Charts */}
            <Card className="col-span-2">
                <CardHeader>
                    <CardTitle>Application History</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={applicationHistory}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="applications" stroke="#2563eb" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <Card className="col-span-2">
                <CardHeader>
                    <CardTitle>Status Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={statusBreakdown}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="status" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#2563eb" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default DashboardStats;
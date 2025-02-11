import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DashboardStats = ({applications}) => {
    const stats = {
        totalApplications: applications.length,
        activeInterviews: applications.filter(app =>
            ['Interview', 'Assessment', 'Programming'].includes(app.status)
        ).length,
        responseRate: Math.round((applications.filter(app =>
            ['Interview', 'Offer', 'Assessment', 'Programming'].includes(app.status)
        ).length / applications.length) * 100) || 0,
        offerRate: Math.round((applications.filter(app =>
            app.status === 'Offer'
        ).length / applications.length) * 100) || 0
    };

    const applicationHistory = applications.reduce((acc, app) => {
        const date = new Date(app.applicationDate);
        const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
        const existingMonth = acc.find(item => item.name === monthYear);

        if (existingMonth) {
            existingMonth.applications++;
        } else {
            acc.push({ name: monthYear, applications: 1 });
        }
        return acc;
    }, []).sort((a, b) => {
        const [aMonth, aYear] = a.name.split(' ');
        const [bMonth, bYear] = b.name.split(' ');
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        if (aYear !== bYear) {
            return parseInt(aYear) - parseInt(bYear);
        }
        return months.indexOf(aMonth) - months.indexOf(bMonth);
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
                    <CardTitle className="text-sm font-medium">Active Interviews/Assessments</CardTitle>
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

            <Card className="col-span-2">
                <CardHeader>
                    <CardTitle>Application History</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={applicationHistory}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="name"
                                    angle={-45}
                                    textAnchor="end"
                                    height={60}
                                />
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
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={statusBreakdown}
                                margin={{
                                    top: 20,
                                    right: 30,
                                    left: 20,
                                    bottom: 40
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="status"
                                    angle={-45}
                                    textAnchor="end"
                                    interval={0}
                                    height={70}
                                />
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
import { Metadata } from "next"
import DashboardContent from "./DashboardPage"

export const metadata: Metadata = {
    title: "Dashboard | Job Application Tracker",
    description: "Track your job applications and interviews",
}

export default function Page() {
    return <DashboardContent />
}
import { Metadata } from "next"
import ApplicationPage from "./ApplicationPage"
export const metadata: Metadata = {
    title: "Create | Job Application Tracker",
    description: "Track your job applications and interviews",
}

export default function Page() {
    return <ApplicationPage />
}
import { Metadata } from "next"
import ViewPage from "./ViewPage"

export const metadata: Metadata = {
    title: "View | Job Application Tracker",
    description: "Track your job applications and interviews",
}

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function Page({ params }: PageProps) {
    return <ViewPage  params={params}/>
}
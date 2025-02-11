import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const getStatusColor = (status: string) => {
    const colors = {
        Applied: "bg-blue-100 text-blue-800",
        Interview: "bg-yellow-100 text-yellow-800",
        Assessment: "bg-purple-100 text-yellow-800",
        Programming: "bg-pink-100 text-yellow-800",
        Offer: "bg-green-100 text-green-800",
        Rejected: "bg-red-100 text-red-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
};
const ApplicationListItem = ({ application }) => {
    return (
        <div className="flex flex-col gap-3">
            <Link href={`/applications/${application.id}`}>
                <div
                    className="flex items-center justify-between p-4 border rounded-lg cursor-pointer
                       transition-colors duration-200
                       hover:bg-gray-50 active:bg-gray-100
                       hover:border-gray-300 active:border-gray-400"
                >
                    <div className="space-y-1">
                        <h3 className="font-medium">{application.companyName}</h3>
                        <p className="text-sm text-gray-500">{application.positionTitle}</p>
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
            </Link>
        </div>
    );
};

export default ApplicationListItem;
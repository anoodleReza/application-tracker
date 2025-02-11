import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";

const InterviewModal = ({
                            isOpen,
                            onClose,
                            onSubmit,
                            interview = null,
                            applicationId
                        }) => {
    const [formData, setFormData] = React.useState({
        interviewDate: new Date().toISOString().slice(0, 16),
        interviewType: 'Phone',
        notes: '',
        applicationId,
        ...interview
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleTypeChange = (value) => {
        setFormData(prev => ({
            ...prev,
            interviewType: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {interview ? 'Edit Interview' : 'Add Interview'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="interviewType">Interview Type</Label>
                        <Select
                            value={formData.interviewType}
                            onValueChange={handleTypeChange}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Phone">Phone</SelectItem>
                                <SelectItem value="Video">Video</SelectItem>
                                <SelectItem value="In-person">In-person</SelectItem>
                                <SelectItem value="Technical">Technical</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="interviewDate">Date and Time</Label>
                        <div className="relative">
                            <Input
                                id="interviewDate"
                                name="interviewDate"
                                type="datetime-local"
                                value={formData.interviewDate}
                                onChange={handleChange}
                                required
                            />
                            <CalendarIcon className="absolute right-3 top-2.5 h-4 w-4 text-gray-500" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                            id="notes"
                            name="notes"
                            value={formData.notes || ''}
                            onChange={handleChange}
                            placeholder="Add any notes about the interview"
                            className="h-32"
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button type="submit">
                            {interview ? 'Save Changes' : 'Add Interview'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default InterviewModal;
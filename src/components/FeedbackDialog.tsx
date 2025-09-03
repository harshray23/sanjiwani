
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from "./StarRating";
import type { AppointmentFeedback } from "@/lib/types";

interface FeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (feedback: AppointmentFeedback) => void;
  children: React.ReactNode;
}

export function FeedbackDialog({ open, onOpenChange, onSubmit, children }: FeedbackDialogProps) {
  const [doctorBehaviour, setDoctorBehaviour] = useState(0);
  const [clinicExperience, setClinicExperience] = useState(0);
  const [overallService, setOverallService] = useState(0);
  const [comments, setComments] = useState("");

  const handleSubmit = () => {
    onSubmit({
      doctorBehaviour,
      clinicExperience,
      overallService,
      comments,
    });
    onOpenChange(false); // Close dialog on submit
    // Reset state for next time
    setDoctorBehaviour(0);
    setClinicExperience(0);
    setOverallService(0);
    setComments("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share Your Feedback</DialogTitle>
          <DialogDescription>
            Your feedback helps us improve our service. Please rate your recent appointment.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Doctor's Behaviour</label>
            <StarRating rating={doctorBehaviour} onRatingChange={setDoctorBehaviour} />
          </div>
           <div className="space-y-2">
            <label className="text-sm font-medium">Clinic/Hospital Experience</label>
            <StarRating rating={clinicExperience} onRatingChange={setClinicExperience} />
          </div>
           <div className="space-y-2">
            <label className="text-sm font-medium">Overall Service Quality</label>
            <StarRating rating={overallService} onRatingChange={setOverallService} />
          </div>
           <div className="space-y-2">
            <label className="text-sm font-medium">Additional Comments (Optional)</label>
            <Textarea 
              placeholder="Tell us more about your experience..." 
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
           <DialogClose asChild>
                <Button type="button" variant="secondary">Cancel</Button>
            </DialogClose>
            <Button type="button" onClick={handleSubmit}>Submit Feedback</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

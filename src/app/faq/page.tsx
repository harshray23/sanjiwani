
"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";

const faqSections = [
  {
    title: "General Services",
    faqs: [
      {
        question: "What services does Sanjiwani Health provide?",
        answer: "Sanjiwani Health offers online doctor consultations, appointment booking, medical record storage, medicine delivery, and diagnostic test booking—all in one app.",
      },
      {
        question: "How do I create a patient account?",
        answer: "Open the app, tap “Sign Up”, enter your basic details, verify your phone or email, and you’re ready to go.",
      },
      {
        question: "Can I choose my preferred doctor?",
        answer: "Yes, you can browse doctors by specialization, experience, ratings, or availability before booking.",
      },
      {
        question: "How do I cancel or reschedule an appointment?",
        answer: "Go to My Appointments → Select Appointment → Reschedule/Cancel, and confirm your changes.",
      },
      {
        question: "Can I consult doctors from other cities?",
        answer: "Yes! Sanjiwani Health enables cross-city online consultations, so you can talk to specialists anywhere in India.",
      },
      {
        question: "How do I receive my prescription after a consultation?",
        answer: "Your digital prescription will appear in the My Records section immediately after the doctor completes your consultation.",
      },
      {
        question: "Can family members use my account?",
        answer: "You can add family members under Family Profiles, making it easy to book and manage appointments for them.",
      },
      {
        question: "Can I track my health records over time?",
        answer: "Yes, your app automatically stores reports, prescriptions, and test results so you can monitor progress anytime.",
      },
      {
        question: "Do I need internet access to use the app?",
        answer: "Some features work offline, like viewing downloaded prescriptions, but booking or consultations need internet access.",
      },
      {
        question: "How can I contact customer support?",
        answer: "Type “Talk to Support” in the app or email us at support@sanjiwanihealth.in for quick help.",
      },
    ],
  },
  {
    title: "Doctor & Hospital Management",
    faqs: [
      {
        question: "How can doctors register?",
        answer: "Select Join as Doctor, complete your details, and upload verification documents. Our team will approve your profile within 24 hours.",
      },
      {
        question: "Is there a fee for doctors to join?",
        answer: "Basic registration is free. Premium features like analytics and digital clinic management come with subscription plans.",
      },
      {
        question: "How do I set my availability?",
        answer: "Go to Doctor Dashboard → Schedule → Set Availability to manage consultation hours.",
      },
      {
        question: "Can I view a patient’s previous consultations?",
        answer: "Yes, you can view complete patient history, reports, and prescriptions from your dashboard.",
      },
      {
        question: "How do I issue a digital prescription?",
        answer: "After consultation, click Generate Prescription, fill in the details, and submit—it will auto-save to the patient’s account.",
      },
      {
        question: "Can hospitals register multiple doctors?",
        answer: "Yes, hospital admins can create sub-profiles for each doctor and manage them under one hospital dashboard.",
      },
      {
        question: "How do I get payments for consultations?",
        answer: "Payments are automatically credited to your registered account within 48 hours after each session.",
      },
      {
        question: "Can I conduct video consultations?",
        answer: "Yes, you can start a secure HD video call directly from your dashboard using the built-in video system.",
      },
    ],
  },
  {
    title: "Pharmacy & Diagnostic Services",
    faqs: [
        {
            question: "How can I order medicines online?",
            answer: "Upload your prescription or select from your saved ones, choose a partner pharmacy, and confirm delivery."
        },
        {
            question: "How long does medicine delivery take?",
            answer: "Typically within 24–48 hours, depending on your location and pharmacy partner availability."
        },
        {
            question: "Can I track my medicine order?",
            answer: "Yes, go to My Orders to track your delivery in real time."
        },
        {
            question: "How can I book a diagnostic test?",
            answer: "Visit Diagnostics → Choose Test → Select Lab → Confirm Booking, and you’ll receive the appointment details instantly."
        },
        {
            question: "Will I get my lab reports digitally?",
            answer: "Yes, once your test is completed, the lab uploads your report, and it appears under My Reports."
        },
        {
            question: "Can I use health insurance for payments?",
            answer: "Yes, Sanjiwani Health supports selected health insurance partners. You can upload your policy details in your profile."
        }
    ]
  },
  {
    title: "AI Health Assistant Queries",
    faqs: [
        {
            question: "What can this chatbot do?",
            answer: "I can help you book doctors, order medicines, schedule lab tests, manage your health records, and answer basic health-related questions."
        },
        {
            question: "Can you recommend a doctor for my symptoms?",
            answer: "Sure! Please describe your symptoms or choose from categories like Fever, Skin Issues, or Diabetes."
        },
        {
            question: "Can you remind me to take my medicine?",
            answer: "Yes! You can set medicine reminders by typing “Set medicine reminder for [medicine name] at [time].”"
        },
        {
            question: "Can I track my fitness and health data here?",
            answer: "Yes, you can sync your wearable devices to track vitals like heart rate, steps, and blood pressure."
        },
        {
            question: "What if I have an emergency?",
            answer: "In case of emergencies, I’ll show you the nearest hospitals and ambulance services immediately."
        }
    ]
  },
  {
    title: "Technical Support & Account Help",
    faqs: [
        {
            question: "How do I update my profile?",
            answer: "Go to Profile → Edit Profile, make your changes, and save."
        },
        {
            question: "I didn’t receive my OTP. What should I do?",
            answer: "Please check your network or use the “Resend OTP” option after 30 seconds."
        },
        {
            question: "How can I change my registered email or phone number?",
            answer: "Go to Settings → Account → Update Contact Info and verify your new details."
        },
        {
            question: "How do I change my password?",
            answer: "Click Forgot Password on the login screen or change it under Settings → Security."
        },
        {
            question: "How can I delete my account?",
            answer: "Navigate to Settings → Privacy → Delete Account, and your data will be securely erased within 48 hours."
        },
        {
            question: "The app is slow or not loading. What should I do?",
            answer: "Please clear cache, check for updates, or reinstall the app. If the issue persists, contact support."
        },
        {
            question: "How do I update the app?",
            answer: "Visit Google Play Store or Apple App Store, search “Sanjiwani Health,” and tap Update."
        }
    ]
  },
  {
    title: "Feedback & Engagement",
    faqs: [
        {
            question: "How can I give feedback on my doctor consultation?",
            answer: "After your session, rate your doctor and share feedback under My Consultations → Feedback."
        },
        {
            question: "Can I refer Sanjiwani Health to others?",
            answer: "Yes! Use your referral code in Profile → Refer & Earn to invite friends and earn rewards."
        },
        {
            question: "How do I report an issue or bug?",
            answer: "Type “Report issue” in the app, and I’ll log it automatically or connect you to our support team."
        },
        {
            question: "Is Sanjiwani Health available in regional languages?",
            answer: "Yes, the app supports English, Hindi, and several Indian languages for better accessibility."
        },
        {
            question: "Does Sanjiwani Health have a premium plan?",
            answer: "Yes, premium members get unlimited consultations, faster service, and exclusive wellness features."
        }
    ]
  }
];

export default function FAQPage() {
  return (
    <div className="py-12 w-full">
      <Card className="w-full max-w-4xl mx-auto shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-accent/10 p-3 rounded-full w-fit mb-4">
            <HelpCircle className="h-10 w-10 text-accent" />
          </div>
          <CardTitle className="text-3xl font-headline text-accent">
            Frequently Asked Questions
          </CardTitle>
          <CardDescription>
            Find answers to common questions about our services and platform.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-2 sm:px-6">
          {faqSections.map((section) => (
            <div key={section.title} className="mb-8">
              <h2 className="text-2xl font-bold font-headline text-accent mb-4">{section.title}</h2>
              <Accordion type="single" collapsible className="w-full">
                {section.faqs.map((faq, index) => (
                  <AccordionItem value={`item-${section.title}-${index}`} key={index}>
                    <AccordionTrigger className="text-left text-base">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-base text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Privacy() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          This Privacy Policy describes how we collect, use, and handle your information when you use our services.
        </p>
      </div>

      <div className="space-y-8 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Information Collection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We collect information to provide better services to our users. The types of information we collect include:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Personal information such as name, email address, and phone number</li>
              <li>Demographic information such as age, gender, and location</li>
              <li>Payment information</li>
              <li>Device information</li>
              <li>Usage data</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How We Use Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>We use the collected information for various purposes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide and maintain our service</li>
              <li>To notify you about changes to our service</li>
              <li>To provide customer support</li>
              <li>To gather analysis or valuable information</li>
              <li>To detect, prevent, and address technical issues</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              The security of your data is important to us. We implement appropriate security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal information.
            </p>
            <p>
              We regularly review our information collection, storage, and processing practices to guard against unauthorized access to systems.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cookie Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We use cookies and similar tracking technologies to track activity on our service and hold certain information.
            </p>
            <p>Cookies are files with a small amount of data which may include an anonymous unique identifier.</p>
            <div className="mt-4">
              <p className="font-medium mb-2">Types of cookies we use:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Essential cookies required for the operation of our website</li>
                <li>Analytics cookies that help us understand how visitors interact with our website</li>
                <li>Marketing cookies used to track visitors across websites</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Rights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>You have the following data protection rights:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access your personal data</li>
              <li>Correct your personal data</li>
              <li>Delete your personal data</li>
              <li>Object to processing of your personal data</li>
              <li>Data portability</li>
              <li>Withdraw your consent</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Changes to This Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the date below.
            </p>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground pt-8">
          <p>Last updated: January 31, 2024</p>
          <p>Contact us if you have any questions about this Privacy Policy.</p>
        </div>
      </div>
    </div>
  )
}

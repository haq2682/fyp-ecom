"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, MapPin, Phone } from "lucide-react"

export default function Contact() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {"Have a question or concern? We're here to help. Reach out to us through any of the following channels."}
        </p>
      </div>

      <div className="grid gap-12">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Find us through these channels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Visit Us</h3>
                  <p className="text-sm text-muted-foreground">
                    123 Fashion Street
                    <br />
                    New York, NY 10001
                    <br />
                    United States
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Email Us</h3>
                  <p className="text-sm text-muted-foreground">
                    General Inquiries: info@example.com
                    <br />
                    Support: support@example.com
                    <br />
                    Business: business@example.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Call Us</h3>
                  <p className="text-sm text-muted-foreground">
                    Toll-Free: 1-800-123-4567
                    <br />
                    International: +1 234 567 8900
                    <br />
                    Hours: Mon-Fri, 9AM-6PM EST
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Business Hours</CardTitle>
              <CardDescription>When you can reach us</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monday - Friday</span>
                  <span className="font-medium">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Saturday</span>
                  <span className="font-medium">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sunday</span>
                  <span className="font-medium">Closed</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


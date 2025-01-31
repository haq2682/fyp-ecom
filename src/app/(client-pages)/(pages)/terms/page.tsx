"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Terms() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Terms and Conditions</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Please read these terms and conditions carefully before using our service.
        </p>
      </div>

      <div className="space-y-8 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>1. Agreement to Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              
                By accessing our website, you agree to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.
              
            </p>
            <p>
              If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Use License</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              
                Permission is granted to temporarily download one copy of the materials information or software on our website for personal, non-commercial transitory viewing only.
              
            </p>
            <p>This is the grant of a license, not a transfer of title, and under this license you may not:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose</li>
              <li>Attempt to decompile or reverse engineer any software contained on our website</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transfer the materials to another person or mirror the materials on any other server</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Disclaimer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              
                The materials on our website are provided on an as is basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Limitations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              
                In no event shall our company or our suppliers be liable for any damages including, without limitation, damages for loss of data or profit, or due to business interruption arising out of the use or inability to use the materials on our website.
              
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              
                Your use of our website is also subject to our Privacy Policy. Please review our Privacy Policy, which also governs the Site and informs users of our data collection practices.
              
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Governing Law</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              
                These terms and conditions are governed by and construed in accordance with the laws of your country and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
              
            </p>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground pt-8">
          <p>Last updated: January 31, 2024</p>
          <p>If you have any questions about these Terms and Conditions, please contact us.</p>
        </div>
      </div>
    </div>
  )
}


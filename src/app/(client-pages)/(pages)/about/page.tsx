"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Clock, Globe2, Users } from 'lucide-react'

export default function About() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">About Us</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          We're passionate about bringing you the latest fashion trends while maintaining quality and affordability.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Founded</h3>
                <p className="text-sm text-muted-foreground">2015</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Customers</h3>
                <p className="text-sm text-muted-foreground">1M+</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Globe2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Countries</h3>
                <p className="text-sm text-muted-foreground">50+</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Delivery</h3>
                <p className="text-sm text-muted-foreground">24/7</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <Card>
          <CardHeader>
            <CardTitle>Our Story</CardTitle>
            <CardDescription>
              From humble beginnings to a global fashion destination
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Founded in 2015, our journey began with a simple mission: to make quality fashion accessible to everyone. What started as a small boutique has grown into a global fashion destination, serving customers across more than 50 countries.
            </p>
            <p>
              We believe that style shouldn't come with a hefty price tag. Our commitment to quality, affordability, and customer satisfaction has helped us build a community of over 1 million satisfied customers worldwide.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Our Values</CardTitle>
            <CardDescription>
              The principles that guide everything we do
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                <Badge variant="secondary">Quality</Badge>
                <Badge variant="secondary">Affordability</Badge>
                <Badge variant="secondary">Sustainability</Badge>
                <Badge variant="secondary">Innovation</Badge>
                <Badge variant="secondary">Customer First</Badge>
              </div>
              <p>
                We're committed to sustainable fashion practices, ensuring our products are ethically sourced and environmentally conscious. Our innovative approach to fashion retail combines traditional craftsmanship with modern technology to deliver the best possible shopping experience.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

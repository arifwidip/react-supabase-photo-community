import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Camera, Users, Heart, Shield, Zap, Globe } from 'lucide-react'

export function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-8">
            <div className="p-4 bg-blue-100 rounded-full">
              <Camera className="h-12 w-12 text-blue-600" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Share Your World Through
            <span className="text-blue-600"> Photos</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join a community of passionate photographers sharing their unique perspectives and moments with the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link to="/signup">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8">
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose PhotoShare?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover the features that make our community special
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto p-3 bg-blue-100 rounded-full w-fit">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Community-Driven</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Connect with photographers worldwide, discover new perspectives, and build meaningful relationships through visual storytelling.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto p-3 bg-green-100 rounded-full w-fit">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Privacy First</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Your photos and data are secure with enterprise-grade encryption and privacy controls. You own your content, always.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto p-3 bg-purple-100 rounded-full w-fit">
                  <Zap className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Lightning Fast</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Upload, view, and share photos instantly with our optimized infrastructure. No waiting, just seamless photo sharing.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto p-3 bg-red-100 rounded-full w-fit">
                  <Heart className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle>Discover & Love</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Explore trending photos, like your favorites, and engage with creators through comments and meaningful interactions.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto p-3 bg-yellow-100 rounded-full w-fit">
                  <Camera className="h-6 w-6 text-yellow-600" />
                </div>
                <CardTitle>High Quality</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Upload and store your photos in full resolution. Every detail preserved, every memory crystal clear.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto p-3 bg-indigo-100 rounded-full w-fit">
                  <Globe className="h-6 w-6 text-indigo-600" />
                </div>
                <CardTitle>Global Reach</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Share your perspective with a worldwide audience. Your photos can inspire people across continents and cultures.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Share Your Story?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of photographers who are already sharing their unique perspective with our community.
          </p>
          <Button asChild size="lg" className="text-lg px-8">
            <Link to="/signup">Start Sharing Today</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Camera className="h-6 w-6" />
              <span className="text-xl font-bold">PhotoShare</span>
            </div>
            <p className="text-gray-400">
              © 2024 PhotoShare. Built with ❤️ for the photography community.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
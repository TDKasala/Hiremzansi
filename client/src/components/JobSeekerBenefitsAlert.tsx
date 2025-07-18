import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import {
  Bell,
  Gift,
  TrendingUp,
  Star,
  Eye,
  Users,
  CheckCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export function JobSeekerBenefitsAlert() {
  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 my-8">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <Gift className="h-6 w-6 text-green-600" />
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              You're Part of Our Premium Matching Network
            </h3>
            <Badge className="bg-green-100 text-green-800 text-xs">
              100% FREE
            </Badge>
          </div>
          
          <p className="text-gray-700 mb-4">
            Your CV is automatically matched against exclusive job opportunities from top South African employers. 
            Get anonymous notifications when you're a strong fit and receive personalized optimization tips.
          </p>

          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-gray-600">Anonymous match alerts</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-600" />
              <span className="text-sm text-gray-600">CV improvement tips</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-orange-600" />
              <span className="text-sm text-gray-600">Market insights</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/dashboard">
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                <Eye className="h-4 w-4 mr-2" />
                View My Matches
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link href="/upload">
              <Button size="sm" variant="outline" className="border-green-200 text-green-700 hover:bg-green-50">
                <Sparkles className="h-4 w-4 mr-2" />
                Optimize My CV
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function JobSeekerMatchingBanner() {
  return (
    <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <Badge className="mb-3 bg-blue-100 text-blue-800 px-4 py-2">
            For Job Seekers
          </Badge>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Your CV Works for You 24/7
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            While you sleep, our AI matches your profile with exclusive job opportunities. 
            Get notified anonymously when employers are interested in candidates like you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          

          

          

          
        </div>

        

        <div className="text-center mt-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Bell className="h-5 w-5 mr-2" />
                Check My Matches
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <Link href="/upload">
              <Button size="lg" variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                <TrendingUp className="h-5 w-5 mr-2" />
                Improve My CV
              </Button>
            </Link>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Join 500+ active job seekers already benefiting from our matching network
          </p>
        </div>
      </div>
    </div>
  );
}
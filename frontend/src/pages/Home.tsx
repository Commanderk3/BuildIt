import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowRight, Sparkles, Star, Users, Zap } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden from-primary/5 to-background pt-16 pb-24 lg:pt-24 lg:pb-32">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm">
              <Sparkles className="h-4 w-4 mr-2" />
              New: AI-powered analytics dashboard
            </Badge>
            
            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6">
              Build better products with{" "}
              <span className="from-primary to-primary/60 bg-clip-text text-transparent">
                modern tools
              </span>
            </h1>
            
            <p className="text-lg lg:text-xl text-muted-foreground mb-8 max-w-2xl">
              The complete platform for modern web applications. Everything you need to build, 
              deploy, and scale your next project.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8 w-full max-w-md">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="h-12"
              />
              <Button size="lg" className="h-12">
                Get started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                <span>4.9/5 from 2k+ reviews</span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                <span>10k+ active users</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Features</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Powerful features to help you build and scale your applications faster
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <Card key={i} className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="pt-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Testimonials</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Loved by developers
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join thousands of satisfied developers who are building better products
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <Card key={i} className="bg-card">
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={testimonial.avatar} />
                      <AvatarFallback>{testimonial.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Ready to get started?
          </h2>
          <p className="text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Join thousands of developers who are already building better products with our platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="h-12">
              Start free trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="h-12 bg-transparent text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/10">
              Contact sales
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

const features = [
  {
    title: "Lightning Fast",
    description: "Optimized for performance with automatic code splitting and lazy loading.",
    icon: <Zap className="h-6 w-6 text-primary" />,
  },
  {
    title: "Built-in Analytics",
    description: "Track user behavior and make data-driven decisions with our analytics suite.",
    icon: <Sparkles className="h-6 w-6 text-primary" />,
  },
  {
    title: "Team Collaboration",
    description: "Work together seamlessly with real-time updates and role-based access.",
    icon: <Users className="h-6 w-6 text-primary" />,
  },
];

const testimonials = [
  {
    content: "This platform has completely transformed how we build and deploy our applications. The developer experience is unmatched.",
    name: "Sarah Chen",
    role: "Lead Developer",
    initials: "SC",
    avatar: "",
  },
  {
    content: "The best investment we've made for our development workflow. Our team's productivity has increased by 200%.",
    name: "Michael Rodriguez",
    role: "CTO",
    initials: "MR",
    avatar: "",
  },
  {
    content: "Incredible features and even better support. Highly recommended for any team building modern web apps.",
    name: "Emily Watson",
    role: "Product Manager",
    initials: "EW",
    avatar: "",
  },
];
'use client'

import { useState } from 'react'
import { Check, X, ChevronDown, ArrowRight, ArrowUp } from 'lucide-react'
import { motion } from 'framer-motion'

export default function PricingPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [billingType, setBillingType] = useState<'monthly' | 'yearly'>('yearly')

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index)
  }

  const pricingData = {
    monthly: {
      free: { price: '$0', period: '/forever', originalPrice: null },
      starter: { price: '$10', period: '/month', originalPrice: '$29 regularly' },
      pro: { price: '$24', period: '/month', originalPrice: '$79 regularly' }
    },
    yearly: {
      free: { price: '$0', period: '/forever', originalPrice: null },
      starter: { price: '$8', period: '/month', originalPrice: '$19 regularly', yearlyBilled: '$96' },
      pro: { price: '$16', period: '/month', originalPrice: '$39 regularly', yearlyBilled: '$192' }
    }
  }

  const faqData = [
    {
      question: "How much time will this actually save me?",
      answer: "Our AI tools can reduce story development time by 70-80%. Instead of spending weeks on character development, world-building, and plot structuring, you get comprehensive story foundations in minutes. The AI handles the heavy lifting while you focus on the creative storytelling."
    },
    {
      question: "What's included in the free plan?",
      answer: "The free plan includes 3 story concept generations per month, basic character and world-building tools, access to story templates, and export to basic text formats. It's perfect for trying out our AI writing assistance."
    },
    {
      question: "How good is the AI-generated content?",
      answer: "Our AI uses advanced language models trained specifically for creative writing. The content serves as a strong foundation that you can build upon, edit, and personalize. Many users report that AI-generated chapters need only light editing to match their style."
    },
    {
      question: "Can I maintain my unique writing style?",
      answer: "Absolutely! The AI learns from your input and preferences. You can guide the tone, style, and direction of your story. The AI is a collaborative writing partner, not a replacement for your creativity and voice."
    },
    {
      question: "Can I cancel anytime?",
      answer: "Yes, you can cancel your subscription anytime. Your access will continue until the end of your current billing period. No questions asked, and you keep all the content you've created."
    },
    {
      question: "What export formats are supported?",
      answer: "Free users can export to basic text formats. Starter users get PDF, EPUB, and Word formats. Pro users also get access to AI-generated audiobooks and direct publishing platform integration for platforms like Amazon KDP."
    },
    {
      question: "How does the AI audiobook generation work?",
      answer: "Pro users can convert their completed stories into audiobooks using our AI voice synthesis. You can choose from multiple voice profiles and the AI will generate chapter-by-chapter audio files with professional quality."
    },
    {
      question: "Do I own the rights to AI-generated content?",
      answer: "Yes, you own all rights to the stories and content created with ProftPen. This includes AI-generated text, character descriptions, world-building elements, and any other creative output. You're free to publish, sell, or modify your content however you choose."
    },
    {
      question: "Is my content private and secure?",
      answer: "Yes, your stories and creative content are completely private. We use enterprise-grade encryption to protect your work. Your stories are never shared with other users or used to train our AI models. Only you have access to your creative projects."
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <motion.div 
          className="text-center space-y-8 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="inline-flex items-center justify-center px-2.5 py-1 rounded-sm text-xs font-medium bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-md"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="relative z-10">Choose Your Plan</span>
          </motion.div>
          <motion.h1 
            className="text-5xl font-medium tracking-tight text-gray-900"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Write Your Next Great Story
          </motion.h1>
          <motion.p 
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Stop struggling with writer's block and blank pages. Get AI-powered story development tools that help you create compelling narratives from concept to completion.
            <br />
            Turn your ideas into published stories with professional guidance.
          </motion.p>
        </motion.div>

        {/* Billing Toggle */}
        <motion.div 
          className="flex justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="inline-flex items-center bg-white rounded-full p-1 shadow-lg border-1 border-transparent bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-border">
            <div className="inline-flex items-center bg-white rounded-full p-1">
              <button
                onClick={() => setBillingType('monthly')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-in-out ${
                  billingType === 'monthly'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingType('yearly')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-in-out relative ${
                  billingType === 'yearly'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Yearly
                <span className="absolute -top-3 -right-2 inline-flex items-center rounded-full bg-white border border-gray-200 px-1.5 py-0.5 text-xs font-bold text-black shadow-sm">
                  -20%
                </span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div 
          key={billingType} 
          className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
            {/* Free Plan */}
            <motion.div 
              className="rounded-2xl p-8 flex flex-col h-full relative border border-gray-200 hover:shadow-lg transition-shadow duration-300"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
            >
              <div className="space-y-4 flex-grow">
                <h2 className="text-2xl font-medium text-gray-900 pt-6">Free - Story Starter</h2>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold tracking-tight text-gray-900 font-montserrat">{pricingData[billingType].free.price}</span>
                  <span className="text-sm font-semibold text-gray-600">{pricingData[billingType].free.period}</span>
                </div>
                <div className="w-full space-y-3">
                  <a className="w-full" href="/sign-up">
                    <button className="whitespace-nowrap inline-flex h-11 items-center justify-center rounded-xl px-8 py-2 font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground w-full">
                      Start Writing Free
                    </button>
                  </a>
                </div>
                <div className="border-b border-gray-200"></div>
                <p className="text-gray-600">
                  Perfect for aspiring writers who want to explore AI-assisted storytelling and develop their creative skills.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Get started with basic story generation tools and see how AI can enhance your writing process.
                </p>
                <ul className="space-y-3 mt-6">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">Generate 3 story concepts per month</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">Basic character and world-building tools</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">Access to story templates and prompts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">Export to basic text formats</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Starter Plan */}
            <motion.div 
              className="rounded-2xl p-8 flex flex-col h-full relative border border-gray-200 hover:shadow-lg transition-shadow duration-300"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <span className="absolute top-4 right-4 inline-flex items-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-2.5 py-0.5 text-xs font-bold text-white">
                Most Popular
              </span>
              <div className="space-y-4 flex-grow">
                <h2 className="text-2xl font-medium text-gray-900 pt-6">Starter - Story Creator</h2>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold tracking-tight text-gray-900 font-montserrat">{pricingData[billingType].starter.price}</span>
                  <span className="text-sm font-semibold text-gray-600">{pricingData[billingType].starter.period}</span>
                  {pricingData[billingType].starter.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">{pricingData[billingType].starter.originalPrice}</span>
                  )}
                </div>
                {billingType === 'yearly' && pricingData[billingType].starter.yearlyBilled && (
                  <p className="text-sm text-gray-500">Billed yearly at {pricingData[billingType].starter.yearlyBilled}</p>
                )}
                <div className="w-full space-y-3">
                  <button className="whitespace-nowrap inline-flex h-11 items-center justify-center rounded-xl px-8 py-2 font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 group relative cursor-pointer border-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 w-full">
                    Select
                  </button>
                </div>
                <div className="border-b border-gray-200"></div>
                <p className="text-gray-600">
                  Perfect for serious writers who want to develop complete stories with AI assistance and professional tools.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Create compelling narratives faster with advanced AI writing tools and unlimited story development.
                </p>
                <ul className="space-y-3 mt-6">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">Unlimited story concepts and development</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">Advanced character development and world-building</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">AI-powered chapter generation and editing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">Export to PDF, EPUB, and Word formats</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">Story structure and pacing guidance</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Pro Plan */}
            <motion.div 
              className="rounded-2xl p-8 flex flex-col h-full relative ring-2 ring-purple-500 shadow-xl hover:shadow-2xl transition-shadow duration-300"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.25 }}
            >
              <span className="absolute top-4 right-4 inline-flex items-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-2.5 py-0.5 text-xs font-bold text-white">
                Launch Price
              </span>
              <div className="space-y-4 flex-grow">
                <h2 className="text-2xl font-medium text-gray-900 pt-6">Pro - Author's Studio</h2>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold tracking-tight text-gray-900 font-montserrat">{pricingData[billingType].pro.price}</span>
                  <span className="text-sm font-semibold text-gray-600">{pricingData[billingType].pro.period}</span>
                  {pricingData[billingType].pro.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">{pricingData[billingType].pro.originalPrice}</span>
                  )}
                </div>
                {billingType === 'yearly' && pricingData[billingType].pro.yearlyBilled && (
                  <p className="text-sm text-gray-500">Billed yearly at {pricingData[billingType].pro.yearlyBilled}</p>
                )}
                <div className="w-full space-y-3">
                  <button className="whitespace-nowrap inline-flex h-11 items-center justify-center rounded-xl px-8 py-2 font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 group relative cursor-pointer border-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 w-full">
                    Select
                  </button>
                </div>
                <div className="border-b border-gray-200"></div>
                <p className="text-gray-600">
                  Professional writers who need advanced AI assistance and publishing-ready tools for complete story creation.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Get everything you need to write, edit, and publish professional-quality stories with cutting-edge AI assistance.
                </p>
                <ul className="space-y-3 mt-6">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">Everything in Starter + unlimited generation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">AI-generated professional cover art & illustrations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">Premium editing AI that perfects your writing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">Create audiobooks instantly with AI voices</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">One-click publishing to Amazon KDP & more</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">Lightning-fast AI processing (10x faster)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">VIP access to cutting-edge AI features first</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </motion.div>

        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <a href="#faq" className="text-gray-600 hover:text-gray-900 underline underline-offset-4 text-sm">
            Have questions? Check our FAQ →
          </a>
        </motion.div>

        {/* Compare Plans Section */}
        <motion.div 
          className="mt-24 max-w-6xl mx-auto px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <h2 className="text-4xl font-medium tracking-tight text-gray-900 text-center mb-12">Compare Plans</h2>
          
          {/* Features Tables */}
          <div className="space-y-12">
            {/* Story Creation */}
            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-medium">Story Creation</h3>
                <p className="text-gray-600 mt-1">AI-powered story concepts and guided development tools</p>
              </div>
              <div className="rounded-xl shadow overflow-hidden">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                      <tr className="border-b text-white">
                        <th className="h-12 px-4 text-left align-middle font-medium w-[300px] text-white">Feature</th>
                        <th className="h-12 px-4 align-middle font-medium text-center text-white">Free</th>
                        <th className="h-12 px-4 align-middle font-medium text-center text-white">Starter</th>
                        <th className="h-12 px-4 align-middle font-medium text-center text-white">Pro</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-4 align-middle font-medium">Story Concepts per Month</td>
                        <td className="p-4 align-middle text-center">3 concepts</td>
                        <td className="p-4 align-middle text-center">Unlimited</td>
                        <td className="p-4 align-middle text-center">Unlimited</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-4 align-middle font-medium">Genre Templates</td>
                        <td className="p-4 align-middle text-center">Basic templates</td>
                        <td className="p-4 align-middle text-center">All templates</td>
                        <td className="p-4 align-middle text-center">All templates + premium</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-4 align-middle font-medium">Character Development Tools</td>
                        <td className="p-4 align-middle text-center"><X className="h-4 w-4 mx-auto text-gray-400" /></td>
                        <td className="p-4 align-middle text-center"><Check className="h-4 w-4 mx-auto text-green-500" /></td>
                        <td className="p-4 align-middle text-center"><Check className="h-4 w-4 mx-auto text-green-500" /></td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-4 align-middle font-medium">AI Chapter Generation</td>
                        <td className="p-4 align-middle text-center"><X className="h-4 w-4 mx-auto text-gray-400" /></td>
                        <td className="p-4 align-middle text-center">10 chapters/month</td>
                        <td className="p-4 align-middle text-center">Unlimited</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Writing & Export Tools */}
            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-medium">Writing & Export Tools</h3>
                <p className="text-gray-600 mt-1">Professional writing environment with multiple export formats</p>
              </div>
              <div className="rounded-xl shadow overflow-hidden">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                      <tr className="border-b text-white">
                        <th className="h-12 px-4 text-left align-middle font-medium w-[300px] text-white">Feature</th>
                        <th className="h-12 px-4 align-middle font-medium text-center text-white">Free</th>
                        <th className="h-12 px-4 align-middle font-medium text-center text-white">Starter</th>
                        <th className="h-12 px-4 align-middle font-medium text-center text-white">Pro</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-4 align-middle font-medium">Text Export</td>
                        <td className="p-4 align-middle text-center"><Check className="h-4 w-4 mx-auto text-green-500" /></td>
                        <td className="p-4 align-middle text-center"><Check className="h-4 w-4 mx-auto text-green-500" /></td>
                        <td className="p-4 align-middle text-center"><Check className="h-4 w-4 mx-auto text-green-500" /></td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-4 align-middle font-medium">PDF & EPUB Export</td>
                        <td className="p-4 align-middle text-center"><X className="h-4 w-4 mx-auto text-gray-400" /></td>
                        <td className="p-4 align-middle text-center"><Check className="h-4 w-4 mx-auto text-green-500" /></td>
                        <td className="p-4 align-middle text-center"><Check className="h-4 w-4 mx-auto text-green-500" /></td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-4 align-middle font-medium">Auto-Save & Cloud Sync</td>
                        <td className="p-4 align-middle text-center"><span className="text-xs text-gray-500">Limited</span></td>
                        <td className="p-4 align-middle text-center"><Check className="h-4 w-4 mx-auto text-green-500" /></td>
                        <td className="p-4 align-middle text-center"><Check className="h-4 w-4 mx-auto text-green-500" /></td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-4 align-middle font-medium">Audiobook Generation</td>
                        <td className="p-4 align-middle text-center"><X className="h-4 w-4 mx-auto text-gray-400" /></td>
                        <td className="p-4 align-middle text-center"><X className="h-4 w-4 mx-auto text-gray-400" /></td>
                        <td className="p-4 align-middle text-center"><Check className="h-4 w-4 mx-auto text-green-500" /></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* AI Features */}
            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-medium">AI Writing Assistant</h3>
                <p className="text-gray-600 mt-1">Advanced AI features to enhance your creative writing process</p>
              </div>
              <div className="rounded-xl shadow overflow-hidden">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                      <tr className="border-b text-white">
                        <th className="h-12 px-4 text-left align-middle font-medium w-[300px] text-white">Feature</th>
                        <th className="h-12 px-4 align-middle font-medium text-center text-white">Free</th>
                        <th className="h-12 px-4 align-middle font-medium text-center text-white">Starter</th>
                        <th className="h-12 px-4 align-middle font-medium text-center text-white">Pro</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-4 align-middle font-medium">AI Writing Suggestions</td>
                        <td className="p-4 align-middle text-center"><X className="h-4 w-4 mx-auto text-gray-400" /></td>
                        <td className="p-4 align-middle text-center">50 suggestions/day</td>
                        <td className="p-4 align-middle text-center">Unlimited</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-4 align-middle font-medium">AI Cover Art Generation</td>
                        <td className="p-4 align-middle text-center"><X className="h-4 w-4 mx-auto text-gray-400" /></td>
                        <td className="p-4 align-middle text-center"><X className="h-4 w-4 mx-auto text-gray-400" /></td>
                        <td className="p-4 align-middle text-center">5 covers/month</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-4 align-middle font-medium">Publishing Integration</td>
                        <td className="p-4 align-middle text-center"><X className="h-4 w-4 mx-auto text-gray-400" /></td>
                        <td className="p-4 align-middle text-center"><X className="h-4 w-4 mx-auto text-gray-400" /></td>
                        <td className="p-4 align-middle text-center"><Check className="h-4 w-4 mx-auto text-green-500" /></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="flex justify-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
        >
          <a className="whitespace-nowrap inline-flex h-11 items-center justify-center rounded-xl px-8 py-2 font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 group relative cursor-pointer border-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700" href="/studio">
            Explore Writing Studio
            <ArrowRight className="h-4 w-4 ml-2" />
          </a>
        </motion.div>

        {/* FAQ Section */}
        <motion.div 
          className="mt-24" 
          id="faq"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
        >
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-medium tracking-tight text-gray-900 text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqData.map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button 
                    className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                    onClick={() => toggleFaq(index)}
                  >
                    <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                    <ChevronDown 
                      className={`h-5 w-5 text-gray-500 transition-transform ${
                        expandedFaq === index ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>
                  <div 
                    className={`overflow-hidden transition-all duration-200 ${
                      expandedFaq === index ? 'max-h-96' : 'max-h-0'
                    }`}
                  >
                    <div className="px-6 py-4 border-t border-gray-100">
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="max-w-3xl mx-auto mt-16">
            <div className="mt-24 text-center py-16 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl">
            <h2 className="text-3xl font-medium tracking-tight text-gray-900 mb-4">
              Ready to Write Your Next Great Story?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Join thousands of writers bringing their stories to life with AI. Start your journey with our free plan or dive right into creating.
            </p>
            <button 
              className="whitespace-nowrap inline-flex h-11 items-center justify-center rounded-xl px-8 py-2 font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground"
              onClick={() => {
                document.querySelector('.grid.md\\:grid-cols-3')?.scrollIntoView({ 
                  behavior: 'smooth' 
                })
              }}
            >
              <ArrowUp className="h-4 w-4 mr-2" />
              Back to choose your plan
            </button>
          </div>
        </div>
        </motion.div>
      </div>
    </div>
  )
}

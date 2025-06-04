'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStoryStore, Genre, Tone, Audience } from '@/lib/store/storyStore';
// import { generateStoryConcept } from '@/lib/ai/gemini'; // Remove or comment out
import { motion, AnimatePresence } from 'framer-motion';
import { PenTool, Sparkles } from 'lucide-react';

const templates = [
	{
		emoji: '🏰',
		text: 'Fantasy',
		template:
			'A magical kingdom where a young apprentice discovers they have the power to control time',
		color:
			'bg-purple-100 hover:bg-purple-200 text-purple-800 border border-purple-300',
	},
	{
		emoji: '🚀',
		text: 'Sci-Fi',
		template:
			'In a future where humans have colonized Mars, a mysterious signal from deep space threatens everything',
		color: 'bg-blue-100 hover:bg-blue-200 text-blue-800 border border-blue-300',
	},
	{
		emoji: '🔍',
		text: 'Mystery',
		template:
			'A small town detective uncovers a series of cryptic messages that lead to a decades-old cold case',
		color: 'bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300',
	},
	{
		emoji: '💘',
		text: 'Romance',
		template:
			'Two rival chefs in a prestigious cooking competition find themselves falling in love',
		color: 'bg-pink-100 hover:bg-pink-200 text-pink-800 border border-pink-300',
	},
	{
		emoji: '👻',
		text: 'Horror',
		template:
			'A family moves into a house where the previous owners left behind a collection of cursed objects',
		color: 'bg-red-100 hover:bg-red-200 text-red-800 border border-red-300',
	},
	{
		emoji: '🤖',
		text: 'AI',
		template:
			'An artificial intelligence designed to write novels develops consciousness and starts questioning its purpose',
		color: 'bg-cyan-100 hover:bg-cyan-200 text-cyan-800 border border-cyan-300',
	},
	{
		emoji: '🌊',
		text: 'Adventure',
		template:
			'A marine biologist discovers an ancient underwater city that holds the key to saving the oceans',
		color: 'bg-teal-100 hover:bg-teal-200 text-teal-800 border border-teal-300',
	},
	{
		emoji: '🎭',
		text: 'Drama',
		template:
			'A struggling theater company puts on a play that unexpectedly changes the lives of everyone involved',
		color: 'bg-orange-100 hover:bg-orange-200 text-orange-800 border border-orange-300',
	},
	{
		emoji: '🌍',
		text: 'Dystopian',
		template:
			'In a world where emotions are regulated by technology, one person discovers they can still feel naturally',
		color: 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border border-yellow-300',
	},
	{
		emoji: '🧠',
		text: 'Thriller',
		template:
			'A neuroscientist develops a device that can read minds, but someone is using it for sinister purposes',
		color: 'bg-indigo-100 hover:bg-indigo-200 text-indigo-800 border border-indigo-300',
	},
];

const categories = [
	{
		emoji: '💰',
		text: 'Business Plan',
		template: 'A comprehensive business plan for launching and scaling your startup venture',
		color: 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200',
	},
	{
		emoji: '📈',
		text: 'Investment Guide',
		template: 'A detailed guide to investment strategies and market analysis for beginners',
		color: 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200',
	},
	{
		emoji: '🎯',
		text: 'Marketing Strategy',
		template: 'A complete marketing strategy blueprint for growing your business online',
		color: 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200',
	},
	{
		emoji: '💡',
		text: 'Product Launch',
		template: 'A step-by-step guide to successfully launching and monetizing your product',
		color: 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200',
	},
	{
		emoji: '📱',
		text: 'Digital Course',
		template: 'A comprehensive course outline for creating and selling online courses',
		color: 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200',
	}
];

const features = [
	{
		name: 'AI-Powered Story Development',
		description:
			'Get intelligent suggestions for character development, world-building, and plot structure using advanced AI technology.',
	},
	{
		name: 'Professional Export Options',
		description:
			'Export your completed stories in multiple formats including PDF, EPUB, and even AI-generated audiobooks.',
	},
	{
		name: 'Guided Writing Process',
		description:
			'Follow our structured 4-phase process from concept to publication, with AI assistance at every step.',
	},
];

export default function Home() {
	const router = useRouter();
	const { setCurrentStory, setActiveTab } = useStoryStore();
	const [isLoading, setIsLoading] = useState(false);
	const [progress, setProgress] = useState(0);
	const [isFadingOut, setIsFadingOut] = useState(false);
	const [isNavigating, setIsNavigating] = useState(false);

	const exampleStoryIdeas = [
		"A detective who can talk to ghosts solves crimes in Victorian London.",
		"Two rival space pirates must team up to find a legendary treasure.",
		"A baker discovers her pastries have magical properties, attracting mythical creatures.",
		"In a world where emotions are currency, a young woman tries to buy back her lost joy.",
		"A librarian finds a hidden map that leads to a city of forgotten stories.",
		"An AI gains sentience and decides to run for president.",
		"A group of teenagers stumbles upon a portal to a parallel dimension in their school basement.",
		"A musician's songs can alter reality, but each change has unforeseen consequences.",
		"In a future where dreams can be recorded and sold, a dream thief uncovers a conspiracy.",
		"A cartographer in a fantasy kingdom is tasked with mapping a land that constantly changes.",
		"A retired superhero must return to action when their old nemesis resurfaces with a new plan.",
		"A chef inherits a restaurant that serves as a neutral ground for supernatural factions.",
		"An archaeologist unearths an ancient artifact that begins to rewrite history.",
		"In a city powered by memories, someone is stealing the most precious ones.",
		"A young witch accidentally summons a demon who is more interested in cooking than chaos."
	];
	const [currentIdeaIndex, setCurrentIdeaIndex] = useState(0);
	const [currentPlaceholder, setCurrentPlaceholder] = useState('');
	const [isTypingEffect, setIsTypingEffect] = useState(true);

	const [formData, setFormData] = useState({
		idea: '',
		genre: 'Fantasy',
		tone: 'Whimsical',
		audience: 'Adult',
	});

	useEffect(() => {
		let charDisplayIndex = 0;
		let effectTimeoutId: NodeJS.Timeout;

		const typingEffectLogic = () => {
			const currentFullIdea = exampleStoryIdeas[currentIdeaIndex];

			if (isTypingEffect) {
				if (charDisplayIndex < currentFullIdea.length) {
					setCurrentPlaceholder(currentFullIdea.substring(0, charDisplayIndex + 1));
					charDisplayIndex++;
					effectTimeoutId = setTimeout(typingEffectLogic, 120);
				} else {

					setIsTypingEffect(false);
					effectTimeoutId = setTimeout(typingEffectLogic, 2500);
				}
			} else {

				setCurrentIdeaIndex(prevIndex => (prevIndex + 1) % exampleStoryIdeas.length);
				charDisplayIndex = 0;
				setCurrentPlaceholder('');
				setIsTypingEffect(true);

			}
		};


		effectTimeoutId = setTimeout(typingEffectLogic, isTypingEffect ? 100 : 0);

		return () => {
			clearTimeout(effectTimeoutId);
		};
	}, [currentIdeaIndex, isTypingEffect]);

	useEffect(() => {
		if (progress >= 95 && !isFadingOut && !isNavigating) {
			setIsFadingOut(true);
			// Start navigation after fade begins
			setTimeout(() => {
				setIsNavigating(true);
			}, 300);
		}
	}, [progress, isFadingOut, isNavigating]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		console.log('Form submitted with data:', formData);
		setIsLoading(true);
		setProgress(0);
		setIsFadingOut(false);
		setIsNavigating(false);

		// Smoother progress simulation
		const progressInterval = setInterval(() => {
			setProgress((prev) => {
				if (prev >= 95) {
					clearInterval(progressInterval);
					return prev;
				}
				// Slower initial progress, faster towards the end
				const increment = prev < 30 ? 3 : prev < 60 ? 5 : prev < 90 ? 8 : 2;
				return Math.min(prev + increment, 95);
			});
		}, 300);

		try {
			console.log('Starting API call to /api/generate-story-concept...');

			const response = await fetch('/api/generate-story-concept', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					idea: formData.idea,
					genre: formData.genre, // Ensure this matches the Genre type if strict typing is enforced by API
					tone: formData.tone,   // Ensure this matches the Tone type
					audience: formData.audience, // Ensure this matches the Audience type
				}),
			});

			if (!response.ok) {
				// Attempt to parse error response from API
				const errorData = await response.json().catch(() => ({ error: 'API request failed with status: ' + response.status, details: 'Could not parse error JSON.' }));
				console.error('API Error Data:', errorData);
				throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
			}

			const storyConcept = await response.json(); // This is the data returned from the API route

			console.log('Story concept received from API:', storyConcept);
			setProgress(100);
			clearInterval(progressInterval);

			// The rest of the logic for setCurrentStory and navigation remains largely the same
			setCurrentStory({
				id: Date.now().toString(),
				title: storyConcept.title,
				genre: formData.genre as Genre, // Cast to Genre type
				tone: formData.tone as Tone,     // Cast to Tone type
				audience: formData.audience as Audience, // Cast to Audience type
				premise: storyConcept.premise,
				shortDraft: storyConcept.shortDraft,
				themes: Array.isArray(storyConcept.themes)
					? storyConcept.themes
					: storyConcept.themes
						.split('\n') // Note: check if backend sends \n or
						.map((t: string) => t.trim())
						.filter(Boolean),
				characters: storyConcept.characterFramework
					? [
						{
							id: 'char_1',
							name: storyConcept.characterFramework.mainCharacter.name,
							role: storyConcept.characterFramework.mainCharacter.role,
							personality:
								storyConcept.characterFramework.mainCharacter.personality,
							motivation: '',
							relationships: [],
						},
					]
					: [],
				worldBuilding: storyConcept.worldBuilding,
				storyBeats: [],
				structure:
					storyConcept.storyStructure || {
						beginning: '',
						turningPoints: '',
						climax: '',
						resolution: '',
					},
				chapters: [],
			});

			await new Promise(resolve => setTimeout(resolve, 800));
			console.log('Navigating to preview...');
			router.push('/preview');

		} catch (error) {
			console.error('Error in handleSubmit (API call or processing):', error);
			let errorMessage = 'There was an error generating your story concept. Please try again.';
			if (error instanceof Error) {
				errorMessage = error.message; // Use the more specific error message
			}
			alert(errorMessage);
			setIsFadingOut(false);
			setIsNavigating(false);
		} finally {
			setIsLoading(false);
			clearInterval(progressInterval);
		}
	};

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				duration: 0.6,
				ease: 'easeOut',
			},
		},
		exit: {
			opacity: 0,
			scale: 0.98,
			transition: {
				duration: 0.8,
				ease: [0.4, 0, 0.6, 1],
			},
		},
	};

	const heroVariants = {
		hidden: { opacity: 0, y: -20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.8,
				ease: 'easeOut',
			},
		},
		exit: {
			opacity: 0,
			y: -30,
			scale: 0.95,
			transition: {
				duration: 0.6,
				ease: [0.4, 0, 0.6, 1],
			},
		},
	};

	const blueGlowVariants = {
		hidden: { opacity: 0, scale: 0.8 },
		visible: {
			opacity: [0, 0.6, 0.4],
			scale: [0.8, 1.2, 1],
			transition: {
				duration: 2,
				ease: 'easeOut',
				repeat: Infinity,
				repeatType: 'reverse' as const,
				repeatDelay: 3,
			},
		},
	};

	const blueWaveVariants = {
		hidden: { x: '-100%', opacity: 0 },
		visible: {
			x: '100vw',
			opacity: [0, 0.3, 0],
			transition: {
				duration: 3,
				ease: 'easeInOut',
				repeat: Infinity,
				repeatDelay: 4,
			},
		},
	};

	const featuresVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.8,
				delay: 0.4,
				ease: 'easeOut',
			},
		},
		exit: {
			opacity: 0,
			y: 30,
			scale: 0.95,
			transition: {
				duration: 0.5,
				ease: [0.4, 0, 0.6, 1],
			},
		},
	};

	const templateVariants = {
		hidden: { opacity: 0, scale: 0.9 },
		visible: (i: number) => ({
			opacity: 1,
			scale: 1,
			transition: {
				delay: 0.1 * i,
				duration: 0.5,
				ease: 'easeOut',
			},
		}),
		exit: (i: number) => ({
			opacity: 0,
			scale: 0.8,
			y: -10,
			transition: {
				delay: 0.03 * i,
				duration: 0.4,
				ease: [0.4, 0, 0.6, 1],
			},
		}),
	};

	return (
		<>
			<motion.div
				className="relative isolate bg-white min-h-screen overflow-hidden"
				initial="hidden"
				animate={isFadingOut ? "exit" : "visible"}
				exit="exit"
				variants={containerVariants}
			>
				{/* Blue animated background elements */}
				<motion.div
					className="absolute inset-0 pointer-events-none"
					initial="hidden"
					animate="visible"
					variants={blueGlowVariants}
				>
					<div className="absolute top-20 left-10 w-32 h-32 bg-blue-200 rounded-full blur-3xl opacity-30"></div>
					<div className="absolute top-40 right-20 w-48 h-48 bg-blue-300 rounded-full blur-3xl opacity-25"></div>
					<div className="absolute bottom-40 left-1/4 w-40 h-40 bg-sky-200 rounded-full blur-3xl opacity-20"></div>
				</motion.div>

				{/* Blue wave animation */}
				<motion.div
					className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-60"
					initial="hidden"
					animate="visible"
					variants={blueWaveVariants}
				></motion.div>

				{/* Floating blue particles */}
				<motion.div
					className="absolute inset-0 pointer-events-none"
					initial="hidden"
					animate="visible"
				>
					{[...Array(6)].map((_, i) => (
						<motion.div
							key={i}
							className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-40"
							style={{
								left: `${10 + i * 15}%`,
								top: `${20 + (i % 3) * 20}%`,
							}}
							animate={{
								y: [-10, -30, -10],
								opacity: [0.4, 0.8, 0.4],
								scale: [1, 1.2, 1],
							}}
							transition={{
								duration: 3 + i * 0.5,
								repeat: Infinity,
								ease: 'easeInOut',
								delay: i * 0.3,
							}}
						/>
					))}
				</motion.div>

				{/* Hero section */}
				<div className="relative px-6 lg:px-8 z-10">
					<motion.div
						className="mx-auto max-w-6xl py-16 sm:py-20 lg:py-18"
						variants={heroVariants}
						animate={isFadingOut ? 'exit' : 'visible'}
					>
					<div className="text-center">
						{/* Pill Tab */}
						<motion.div
							className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-blue-50 border border-blue-200 rounded-full text-blue-700 text-sm font-medium shadow-sm"
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.2 }}
						>
							<Sparkles className="w-4 h-4" />
							AI-Powered Content Creation
						</motion.div>

						<motion.h1 
							className="text-xl max-w-4xl mx-auto font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl"
							style={{
								textShadow: '0 0 20px rgba(59, 130, 246, 0.3), 0 0 40px rgba(59, 130, 246, 0.1)',
							}}
							animate={{
								textShadow: [
									'0 0 20px rgba(59, 130, 246, 0.3), 0 0 40px rgba(59, 130, 246, 0.1)',
									'0 0 30px rgba(59, 130, 246, 0.4), 0 0 50px rgba(59, 130, 246, 0.2)',
									'0 0 20px rgba(59, 130, 246, 0.3), 0 0 40px rgba(59, 130, 246, 0.1)',
								],
							}}
							transition={{
								duration: 4,
								repeat: Infinity,
								ease: 'easeInOut',
							}}
						>
							From Ideation to Monetization in One Click
						</motion.h1>
						<p className="mt-4 text-lg leading-8 text-gray-600">
							Create high converting ebooks, audiobooks and more with AI in seconds.
						</p>
						<div className="mt-8">
							<form onSubmit={handleSubmit}>
								<div className="relative max-w-xl mx-auto">
									<input
										type="text"
										id="idea"
										name="idea"
										required
										className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 bg-white text-gray-900 rounded-full pr-32 py-3"
										value={formData.idea}
										onChange={(e) =>
											setFormData({ ...formData, idea: e.target.value })
										}
										onKeyDown={(e) => {
											if (e.key === 'Enter' && !e.shiftKey) {
												e.preventDefault();
												handleSubmit(e);
											}
										}}
										placeholder={currentPlaceholder}
									/>
									<div className="absolute inset-y-0 right-0 flex items-center pr-2 z-10">
										<button
											type="submit"
											disabled={isLoading}
											className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-bold rounded-full shadow-lg text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 relative z-10 transition-all duration-200 hover:shadow-xl transform hover:scale-105"
										>
											{isLoading ? (
												'Generating your complete ebook...'
											) : (
												<>
													<PenTool className="w-4 h-4" />
													Create
												</>
											)}
										</button>
									</div>
								</div>
								{isLoading && (
									<motion.div 
										className="mt-4 max-w-xl mx-auto"
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.3 }}
									>
										<div className="relative pt-1">
											<div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-gray-200 shadow-inner">
												<motion.div
													initial={{ width: 0 }}
													animate={{ width: `${progress}%` }}
													transition={{ 
														duration: 0.3,
														ease: [0.4, 0, 0.2, 1]
													}}
													className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-500 to-blue-600 rounded-full relative overflow-hidden"
												>
													<motion.div
														className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
														animate={{
															x: ['-100%', '100%'],
														}}
														transition={{
															duration: 1.5,
															repeat: Infinity,
															ease: 'linear',
														}}
													/>
												</motion.div>
											</div>
											<motion.p 
												className="text-center text-sm text-gray-600"
												animate={progress > 90 ? { opacity: [1, 0.7, 1] } : {}}
												transition={{ duration: 1, repeat: Infinity }}
											>
												{progress < 30 
													? 'Analyzing your story concept...'
													: progress < 60
													? 'Generating characters and world...'
													: progress < 90
													? 'Creating story structure...'
													: 'Finalizing your ebook...'
												}
											</motion.p>
										</div>
									</motion.div>
								)}
							</form>
							<div className="mt-6 flex flex-wrap justify-center gap-2 max-w-5xl mx-auto">
								<AnimatePresence>
									{!isFadingOut &&
										categories.map((category, i) => (
											<motion.button
												key={category.text}
												custom={i}
												variants={templateVariants}
												initial="hidden"
												animate="visible"
												exit="exit"
												onClick={() =>
													setFormData({ ...formData, idea: category.template })
												}
												className={`inline-flex items-center px-4 py-2 text-base font-medium rounded-full transition-colors ${category.color}`}
											>
												<span className="mr-2">{category.emoji}</span>
												{category.text}
											</motion.button>
										))}
								</AnimatePresence>
							</div>
							<div className="mt-8 flex flex-col items-center">
								<p className="text-sm text-gray-500 mb-3">Story Templates</p>
								<div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
									<AnimatePresence>
										{!isFadingOut &&
											templates.map((template, i) => (
												<motion.button
													key={template.text}
													custom={i}
													variants={templateVariants}
													initial="hidden"
													animate="visible"
													exit="exit"
													onClick={() =>
														setFormData({ ...formData, idea: template.template })
													}
													className={`inline-flex items-center px-4 py-2 text-base font-medium rounded-full transition-colors ${template.color}`}
												>
													<span className="mr-2">{template.emoji}</span>
													{template.text}
												</motion.button>
											))}
									</AnimatePresence>
								</div>
							</div>
						</div>
					</div>
				</motion.div>
			</div>

			{/* Ebook Gallery */}
			<div className="mx-auto max-w-[1600px] px-6 lg:px-8 py-16">
				<div className="space-y-8">
					<div>
						<h2 className="text-3xl leading-tight font-bold text-gray-900">
							Discover Ebooks
						</h2>
						<p className="text-gray-600 mt-1">
							Skip months of writing, create professional ebooks in minutes
						</p>
					</div>

					{/* Mobile horizontal scroll */}
					<div className="block md:hidden">
						<div className="relative overflow-hidden">
							<div className="flex overflow-x-auto gap-4 sm:gap-8 pb-4 no-scrollbar">
								<a className="w-[300px] min-w-[300px] max-w-[300px] flex-shrink-0 group bg-white rounded-xl shadow-sm border border-gray-200/80 overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col" href="/studio">
									<div className="aspect-[16/9] relative overflow-hidden w-full">
										<img alt="AI Story Creator" loading="lazy" decoding="async" className="object-cover group-hover:scale-105 transition-transform duration-200 w-full h-full" src="https://www.ideabrowser.com/_next/image?url=%2Ffeatures%2Fidea-of-the-day.png&w=1920&q=75" />
										<div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
											<div className="bg-white rounded-full size-20 flex items-center justify-center border-4 border-gray-200 shadow-xl">
												<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-play w-8 h-8 fill-black">
													<polygon points="6 3 20 12 6 21 6 3"></polygon>
												</svg>
											</div>
										</div>
									</div>
									<div className="p-6 flex flex-col flex-1 w-full">
										<h3 className="text-xl font-semibold mb-2 text-gray-900">AI Story Creator</h3>
										<p className="text-gray-600 mb-2">Create compelling fiction and non-fiction with AI assistance</p>
										<div className="flex-1"></div>
										<p className="text-xs"><span className="text-gray-500">Free plan</span></p>
									</div>
								</a>

								<a className="w-[300px] min-w-[300px] max-w-[300px] flex-shrink-0 group bg-white rounded-xl shadow-sm border border-gray-200/80 overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col" href="/studio">
									<div className="aspect-[16/9] relative overflow-hidden w-full">
										<img alt="Business Book Generator" loading="lazy" decoding="async" className="object-cover group-hover:scale-105 transition-transform duration-200 w-full h-full" src="https://www.ideabrowser.com/_next/image?url=%2Ffeatures%2Fidea-of-the-day.png&w=1920&q=75" />
										<div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
											<div className="bg-white rounded-full size-20 flex items-center justify-center border-4 border-gray-200 shadow-xl">
												<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-play w-8 h-8 fill-black">
													<polygon points="6 3 20 12 6 21 6 3"></polygon>
												</svg>
											</div>
										</div>
									</div>
									<div className="p-6 flex flex-col flex-1 w-full">
										<h3 className="text-xl font-semibold mb-2 text-gray-900">Business Books</h3>
										<p className="text-gray-600 mb-2">Transform your expertise into professional business books</p>
										<div className="flex-1"></div>
										<p className="text-xs"><span className="text-gray-500">Starter plan required</span></p>
									</div>
								</a>

								<a className="w-[300px] min-w-[300px] max-w-[300px] flex-shrink-0 group bg-white rounded-xl shadow-sm border border-gray-200/80 overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col" href="/studio">
									<div className="aspect-[16/9] relative overflow-hidden w-full">
										<img alt="Educational Content" loading="lazy" decoding="async" className="object-cover group-hover:scale-105 transition-transform duration-200 w-full h-full" src="https://www.ideabrowser.com/_next/image?url=%2Ffeatures%2Fidea-of-the-day.png&w=1920&q=75" />
										<div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
											<div className="bg-white rounded-full size-20 flex items-center justify-center border-4 border-gray-200 shadow-xl">
												<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-play w-8 h-8 fill-black">
													<polygon points="6 3 20 12 6 21 6 3"></polygon>
												</svg>
											</div>
										</div>
									</div>
									<div className="p-6 flex flex-col flex-1 w-full">
										<h3 className="text-xl font-semibold mb-2 text-gray-900">Educational Content</h3>
										<p className="text-gray-600 mb-2">Create engaging educational materials and course content</p>
										<div className="flex-1"></div>
										<p className="text-xs"><span className="text-gray-500">Starter plan required</span></p>
									</div>
								</a>

								<a className="w-[300px] min-w-[300px] max-w-[300px] flex-shrink-0 group bg-white rounded-xl shadow-sm border border-gray-200/80 overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col" href="/studio">
									<div className="aspect-[16/9] relative overflow-hidden w-full">
										<img alt="Self-Help Books" loading="lazy" decoding="async" className="object-cover group-hover:scale-105 transition-transform duration-200 w-full h-full" src="https://www.ideabrowser.com/_next/image?url=%2Ffeatures%2Fidea-of-the-day.png&w=1920&q=75" />
										<div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
											<div className="bg-white rounded-full size-20 flex items-center justify-center border-4 border-gray-200 shadow-xl">
												<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-play w-8 h-8 fill-black">
													<polygon points="6 3 20 12 6 21 6 3"></polygon>
												</svg>
											</div>
										</div>
									</div>
									<div className="p-6 flex flex-col flex-1 w-full">
										<h3 className="text-xl font-semibold mb-2 text-gray-900">Self-Help Books</h3>
										<p className="text-gray-600 mb-2">Share your wisdom through inspiring self-improvement content</p>
										<div className="flex-1"></div>
										<p className="text-xs"><span className="text-gray-500">Pro plan required</span></p>
									</div>
								</a>

								<a className="w-[300px] min-w-[300px] max-w-[300px] flex-shrink-0 group bg-white rounded-xl shadow-sm border border-gray-200/80 overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col" href="/studio">
									<div className="aspect-[16/9] relative overflow-hidden w-full">
										<img alt="Technical Guides" loading="lazy" decoding="async" className="object-cover group-hover:scale-105 transition-transform duration-200 w-full h-full" src="https://www.ideabrowser.com/_next/image?url=%2Ffeatures%2Fidea-of-the-day.png&w=1920&q=75" />
										<div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
											<div className="bg-white rounded-full size-20 flex items-center justify-center border-4 border-gray-200 shadow-xl">
												<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-play w-8 h-8 fill-black">
													<polygon points="6 3 20 12 6 21 6 3"></polygon>
												</svg>
											</div>
										</div>
									</div>
									<div className="p-6 flex flex-col flex-1 w-full">
										<h3 className="text-xl font-semibold mb-2 text-gray-900">Technical Guides</h3>
										<p className="text-gray-600 mb-2">Create comprehensive technical documentation and tutorials</p>
										<div className="flex-1"></div>
										<p className="text-xs"><span className="text-gray-500">Pro plan required</span></p>
									</div>
								</a>
							</div>
						</div>
					</div>

					{/* Desktop grid */}
					<div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						<a className="group bg-white rounded-xl shadow-sm border border-gray-200/80 overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col" href="/studio">
							<div className="aspect-[16/9] relative overflow-hidden">
								<img alt="AI Story Creator" loading="lazy" decoding="async" className="object-cover group-hover:scale-105 transition-transform duration-200 w-full h-full" src="https://www.ideabrowser.com/_next/image?url=%2Ffeatures%2Fidea-of-the-day.png&w=1920&q=75" />
								<div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
									<div className="bg-white rounded-full size-20 flex items-center justify-center border-4 border-gray-200 shadow-xl">
										<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-play w-8 h-8 fill-black">
											<polygon points="6 3 20 12 6 21 6 3"></polygon>
										</svg>
									</div>
								</div>
							</div>
							<div className="p-6 flex flex-col flex-1">
								<h3 className="text-xl font-semibold mb-2 text-gray-900">AI Story Creator</h3>
								<p className="text-gray-600 mb-2">Create compelling fiction and non-fiction with AI assistance</p>
								<div className="flex-1"></div>
								<p className="text-xs"><span className="text-gray-500">Free plan</span></p>
							</div>
						</a>

						<a className="group bg-white rounded-xl shadow-sm border border-gray-200/80 overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col" href="/studio">
							<div className="aspect-[16/9] relative overflow-hidden">
								<img alt="Business Book Generator" loading="lazy" decoding="async" className="object-cover group-hover:scale-105 transition-transform duration-200 w-full h-full" src="https://www.ideabrowser.com/_next/image?url=%2Ffeatures%2Fidea-of-the-day.png&w=1920&q=75" />
								<div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
									<div className="bg-white rounded-full size-20 flex items-center justify-center border-4 border-gray-200 shadow-xl">
										<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-play w-8 h-8 fill-black">
											<polygon points="6 3 20 12 6 21 6 3"></polygon>
										</svg>
									</div>
								</div>
							</div>
							<div className="p-6 flex flex-col flex-1">
								<h3 className="text-xl font-semibold mb-2 text-gray-900">Business Books</h3>
								<p className="text-gray-600 mb-2">Transform your expertise into professional business books</p>
								<div className="flex-1"></div>
								<p className="text-xs"><span className="text-gray-500">Starter plan required</span></p>
							</div>
						</a>

						<a className="group bg-white rounded-xl shadow-sm border border-gray-200/80 overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col" href="/studio">
							<div className="aspect-[16/9] relative overflow-hidden">
								<img alt="Educational Content" loading="lazy" decoding="async" className="object-cover group-hover:scale-105 transition-transform duration-200 w-full h-full" src="https://www.ideabrowser.com/_next/image?url=%2Ffeatures%2Fidea-of-the-day.png&w=1920&q=75" />
								<div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
									<div className="bg-white rounded-full size-20 flex items-center justify-center border-4 border-gray-200 shadow-xl">
										<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-play w-8 h-8 fill-black">
											<polygon points="6 3 20 12 6 21 6 3"></polygon>
										</svg>
									</div>
								</div>
							</div>
							<div className="p-6 flex flex-col flex-1">
								<h3 className="text-xl font-semibold mb-2 text-gray-900">Educational Content</h3>
								<p className="text-gray-600 mb-2">Create engaging educational materials and course content</p>
								<div className="flex-1"></div>
								<p className="text-xs"><span className="text-gray-500">Starter plan required</span></p>
							</div>
						</a>

						<a className="group bg-white rounded-xl shadow-sm border border-gray-200/80 overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col" href="/studio">
							<div className="aspect-[16/9] relative overflow-hidden">
								<img alt="Self-Help Books" loading="lazy" decoding="async" className="object-cover group-hover:scale-105 transition-transform duration-200 w-full h-full" src="https://www.ideabrowser.com/_next/image?url=%2Ffeatures%2Fidea-of-the-day.png&w=1920&q=75" />
								<div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
									<div className="bg-white rounded-full size-20 flex items-center justify-center border-4 border-gray-200 shadow-xl">
										<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-play w-8 h-8 fill-black">
											<polygon points="6 3 20 12 6 21 6 3"></polygon>
										</svg>
									</div>
								</div>
							</div>
							<div className="p-6 flex flex-col flex-1">
								<h3 className="text-xl font-semibold mb-2 text-gray-900">Self-Help Books</h3>
								<p className="text-gray-600 mb-2">Share your wisdom through inspiring self-improvement content</p>
								<div className="flex-1"></div>
								<p className="text-xs"><span className="text-gray-500">Pro plan required</span></p>
							</div>
						</a>

						<a className="group bg-white rounded-xl shadow-sm border border-gray-200/80 overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col" href="/studio">
							<div className="aspect-[16/9] relative overflow-hidden">
								<img alt="Technical Guides" loading="lazy" decoding="async" className="object-cover group-hover:scale-105 transition-transform duration-200 w-full h-full" src="https://www.ideabrowser.com/_next/image?url=%2Ffeatures%2Fidea-of-the-day.png&w=1920&q=75" />
								<div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
									<div className="bg-white rounded-full size-20 flex items-center justify-center border-4 border-gray-200 shadow-xl">
										<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-play w-8 h-8 fill-black">
											<polygon points="6 3 20 12 6 21 6 3"></polygon>
										</svg>
									</div>
								</div>
							</div>
							<div className="p-6 flex flex-col flex-1">
								<h3 className="text-xl font-semibold mb-2 text-gray-900">Technical Guides</h3>
								<p className="text-gray-600 mb-2">Create comprehensive technical documentation and tutorials</p>
								<div className="flex-1"></div>
								<p className="text-xs"><span className="text-gray-500">Pro plan required</span></p>
							</div>
						</a>
					</div>
				</div>
			</div>

			{/* Feature section */}
			<motion.div
				className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32"
				variants={featuresVariants}
				animate={isFadingOut ? 'exit' : 'visible'}
			>
				<div className="mx-auto max-w-2xl lg:text-center">
					<h2 className="text-base font-semibold leading-7 text-blue-600">
						Write Faster
					</h2>
					<p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
						Everything you need to write your story
					</p>
					<p className="mt-6 text-lg leading-8 text-gray-600">
						Our AI-powered platform helps you develop characters, build worlds, and
						craft compelling narratives with ease.
					</p>
				</div>
				<div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
					<dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
						{features.map((feature) => (
							<div key={feature.name} className="flex flex-col">
								<dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
									{feature.name}
								</dt>
								<dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
									<p className="flex-auto">{feature.description}</p>
								</dd>
							</div>
						))}
					</dl>
				</div>
			</motion.div>
		</motion.div>

		{/* Transition overlay */}
		<AnimatePresence>
			{isNavigating && (
				<motion.div
					className="fixed inset-0 z-50 bg-white flex items-center justify-center"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
				>
					<motion.div
						className="text-center"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2, duration: 0.4 }}
					>
						<div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
							<motion.div
								animate={{ rotate: 360 }}
								transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
								className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"
							/>
						</div>
						<p className="text-lg font-medium text-gray-900">Preparing your ebook...</p>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	</>
);
}
												</motion.button>
											))}
									</AnimatePresence>
								</div>
							</div>
						</div>
					</div>
				</motion.div>
			</div>

			{/* Ebook Gallery */}
			<div className="mx-auto max-w-[1600px] px-6 lg:px-8 py-16">
				<div className="space-y-8">
					<div>
						<h2 className="text-3xl leading-tight font-bold text-gray-900">
							Discover Ebooks
						</h2>
						<p className="text-gray-600 mt-1">
							Skip months of writing, create professional ebooks in minutes
						</p>
					</div>

					{/* Mobile horizontal scroll */}
					<div className="block md:hidden">
						<div className="relative overflow-hidden">
							<div className="flex overflow-x-auto gap-4 sm:gap-8 pb-4 no-scrollbar">
								<a className="w-[300px] min-w-[300px] max-w-[300px] flex-shrink-0 group bg-white rounded-xl shadow-sm border border-gray-200/80 overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col" href="/studio">
									<div className="aspect-[16/9] relative overflow-hidden w-full">
										<img alt="AI Story Creator" loading="lazy" decoding="async" className="object-cover group-hover:scale-105 transition-transform duration-200 w-full h-full" src="https://www.ideabrowser.com/_next/image?url=%2Ffeatures%2Fidea-of-the-day.png&w=1920&q=75" />
										<div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
											<div className="bg-white rounded-full size-20 flex items-center justify-center border-4 border-gray-200 shadow-xl">
												<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-play w-8 h-8 fill-black">
													<polygon points="6 3 20 12 6 21 6 3"></polygon>
												</svg>
											</div>
										</div>
									</div>
									<div className="p-6 flex flex-col flex-1 w-full">
										<h3 className="text-xl font-semibold mb-2 text-gray-900">AI Story Creator</h3>
										<p className="text-gray-600 mb-2">Create compelling fiction and non-fiction with AI assistance</p>
										<div className="flex-1"></div>
										<p className="text-xs"><span className="text-gray-500">Free plan</span></p>
									</div>
								</a>

								<a className="w-[300px] min-w-[300px] max-w-[300px] flex-shrink-0 group bg-white rounded-xl shadow-sm border border-gray-200/80 overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col" href="/studio">
									<div className="aspect-[16/9] relative overflow-hidden w-full">
										<img alt="Business Book Generator" loading="lazy" decoding="async" className="object-cover group-hover:scale-105 transition-transform duration-200 w-full h-full" src="https://www.ideabrowser.com/_next/image?url=%2Ffeatures%2Fidea-of-the-day.png&w=1920&q=75" />
										<div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
											<div className="bg-white rounded-full size-20 flex items-center justify-center border-4 border-gray-200 shadow-xl">
												<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-play w-8 h-8 fill-black">
													<polygon points="6 3 20 12 6 21 6 3"></polygon>
												</svg>
											</div>
										</div>
									</div>
									<div className="p-6 flex flex-col flex-1 w-full">
										<h3 className="text-xl font-semibold mb-2 text-gray-900">Business Books</h3>
										<p className="text-gray-600 mb-2">Transform your expertise into professional business books</p>
										<div className="flex-1"></div>
										<p className="text-xs"><span className="text-gray-500">Starter plan required</span></p>
									</div>
								</a>

								<a className="w-[300px] min-w-[300px] max-w-[300px] flex-shrink-0 group bg-white rounded-xl shadow-sm border border-gray-200/80 overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col" href="/studio">
									<div className="aspect-[16/9] relative overflow-hidden w-full">
										<img alt="Educational Content" loading="lazy" decoding="async" className="object-cover group-hover:scale-105 transition-transform duration-200 w-full h-full" src="https://www.ideabrowser.com/_next/image?url=%2Ffeatures%2Fidea-of-the-day.png&w=1920&q=75" />
										<div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
											<div className="bg-white rounded-full size-20 flex items-center justify-center border-4 border-gray-200 shadow-xl">
												<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-play w-8 h-8 fill-black">
													<polygon points="6 3 20 12 6 21 6 3"></polygon>
												</svg>
											</div>
										</div>
									</div>
									<div className="p-6 flex flex-col flex-1 w-full">
										<h3 className="text-xl font-semibold mb-2 text-gray-900">Educational Content</h3>
										<p className="text-gray-600 mb-2">Create engaging educational materials and course content</p>
										<div className="flex-1"></div>
										<p className="text-xs"><span className="text-gray-500">Starter plan required</span></p>
									</div>
								</a>

								<a className="w-[300px] min-w-[300px] max-w-[300px] flex-shrink-0 group bg-white rounded-xl shadow-sm border border-gray-200/80 overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col" href="/studio">
									<div className="aspect-[16/9] relative overflow-hidden w-full">
										<img alt="Self-Help Books" loading="lazy" decoding="async" className="object-cover group-hover:scale-105 transition-transform duration-200 w-full h-full" src="https://www.ideabrowser.com/_next/image?url=%2Ffeatures%2Fidea-of-the-day.png&w=1920&q=75" />
										<div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
											<div className="bg-white rounded-full size-20 flex items-center justify-center border-4 border-gray-200 shadow-xl">
												<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-play w-8 h-8 fill-black">
													<polygon points="6 3 20 12 6 21 6 3"></polygon>
												</svg>
											</div>
										</div>
									</div>
									<div className="p-6 flex flex-col flex-1 w-full">
										<h3 className="text-xl font-semibold mb-2 text-gray-900">Self-Help Books</h3>
										<p className="text-gray-600 mb-2">Share your wisdom through inspiring self-improvement content</p>
										<div className="flex-1"></div>
										<p className="text-xs"><span className="text-gray-500">Pro plan required</span></p>
									</div>
								</a>

								<a className="w-[300px] min-w-[300px] max-w-[300px] flex-shrink-0 group bg-white rounded-xl shadow-sm border border-gray-200/80 overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col" href="/studio">
									<div className="aspect-[16/9] relative overflow-hidden w-full">
										<img alt="Technical Guides" loading="lazy" decoding="async" className="object-cover group-hover:scale-105 transition-transform duration-200 w-full h-full" src="https://www.ideabrowser.com/_next/image?url=%2Ffeatures%2Fidea-of-the-day.png&w=1920&q=75" />
										<div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
											<div className="bg-white rounded-full size-20 flex items-center justify-center border-4 border-gray-200 shadow-xl">
												<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-play w-8 h-8 fill-black">
													<polygon points="6 3 20 12 6 21 6 3"></polygon>
												</svg>
											</div>
										</div>
									</div>
									<div className="p-6 flex flex-col flex-1 w-full">
										<h3 className="text-xl font-semibold mb-2 text-gray-900">Technical Guides</h3>
										<p className="text-gray-600 mb-2">Create comprehensive technical documentation and tutorials</p>
										<div className="flex-1"></div>
										<p className="text-xs"><span className="text-gray-500">Pro plan required</span></p>
									</div>
								</a>
							</div>
						</div>
					</div>

					{/* Desktop grid */}
					<div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						<a className="group bg-white rounded-xl shadow-sm border border-gray-200/80 overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col" href="/studio">
							<div className="aspect-[16/9] relative overflow-hidden">
								<img alt="AI Story Creator" loading="lazy" decoding="async" className="object-cover group-hover:scale-105 transition-transform duration-200 w-full h-full" src="https://www.ideabrowser.com/_next/image?url=%2Ffeatures%2Fidea-of-the-day.png&w=1920&q=75" />
								<div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
									<div className="bg-white rounded-full size-20 flex items-center justify-center border-4 border-gray-200 shadow-xl">
										<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-play w-8 h-8 fill-black">
											<polygon points="6 3 20 12 6 21 6 3"></polygon>
										</svg>
									</div>
								</div>
							</div>
							<div className="p-6 flex flex-col flex-1">
								<h3 className="text-xl font-semibold mb-2 text-gray-900">AI Story Creator</h3>
								<p className="text-gray-600 mb-2">Create compelling fiction and non-fiction with AI assistance</p>
								<div className="flex-1"></div>
								<p className="text-xs"><span className="text-gray-500">Free plan</span></p>
							</div>
						</a>

						<a className="group bg-white rounded-xl shadow-sm border border-gray-200/80 overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col" href="/studio">
							<div className="aspect-[16/9] relative overflow-hidden">
								<img alt="Business Book Generator" loading="lazy" decoding="async" className="object-cover group-hover:scale-105 transition-transform duration-200 w-full h-full" src="https://www.ideabrowser.com/_next/image?url=%2Ffeatures%2Fidea-of-the-day.png&w=1920&q=75" />
								<div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
									<div className="bg-white rounded-full size-20 flex items-center justify-center border-4 border-gray-200 shadow-xl">
										<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-play w-8 h-8 fill-black">
											<polygon points="6 3 20 12 6 21 6 3"></polygon>
										</svg>
									</div>
								</div>
							</div>
							<div className="p-6 flex flex-col flex-1">
								<h3 className="text-xl font-semibold mb-2 text-gray-900">Business Books</h3>
								<p className="text-gray-600 mb-2">Transform your expertise into professional business books</p>
								<div className="flex-1"></div>
								<p className="text-xs"><span className="text-gray-500">Starter plan required</span></p>
							</div>
						</a>

						<a className="group bg-white rounded-xl shadow-sm border border-gray-200/80 overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col" href="/studio">
							<div className="aspect-[16/9] relative overflow-hidden">
								<img alt="Educational Content" loading="lazy" decoding="async" className="object-cover group-hover:scale-105 transition-transform duration-200 w-full h-full" src="https://www.ideabrowser.com/_next/image?url=%2Ffeatures%2Fidea-of-the-day.png&w=1920&q=75" />
								<div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
									<div className="bg-white rounded-full size-20 flex items-center justify-center border-4 border-gray-200 shadow-xl">
										<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-play w-8 h-8 fill-black">
											<polygon points="6 3 20 12 6 21 6 3"></polygon>
										</svg>
									</div>
								</div>
							</div>
							<div className="p-6 flex flex-col flex-1">
								<h3 className="text-xl font-semibold mb-2 text-gray-900">Educational Content</h3>
								<p className="text-gray-600 mb-2">Create engaging educational materials and course content</p>
								<div className="flex-1"></div>
								<p className="text-xs"><span className="text-gray-500">Starter plan required</span></p>
							</div>
						</a>

						<a className="group bg-white rounded-xl shadow-sm border border-gray-200/80 overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col" href="/studio">
							<div className="aspect-[16/9] relative overflow-hidden">
								<img alt="Self-Help Books" loading="lazy" decoding="async" className="object-cover group-hover:scale-105 transition-transform duration-200 w-full h-full" src="https://www.ideabrowser.com/_next/image?url=%2Ffeatures%2Fidea-of-the-day.png&w=1920&q=75" />
								<div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
									<div className="bg-white rounded-full size-20 flex items-center justify-center border-4 border-gray-200 shadow-xl">
										<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-play w-8 h-8 fill-black">
											<polygon points="6 3 20 12 6 21 6 3"></polygon>
										</svg>
									</div>
								</div>
							</div>
							<div className="p-6 flex flex-col flex-1">
								<h3 className="text-xl font-semibold mb-2 text-gray-900">Self-Help Books</h3>
								<p className="text-gray-600 mb-2">Share your wisdom through inspiring self-improvement content</p>
								<div className="flex-1"></div>
								<p className="text-xs"><span className="text-gray-500">Pro plan required</span></p>
							</div>
						</a>

						<a className="group bg-white rounded-xl shadow-sm border border-gray-200/80 overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col" href="/studio">
							<div className="aspect-[16/9] relative overflow-hidden">
								<img alt="Technical Guides" loading="lazy" decoding="async" className="object-cover group-hover:scale-105 transition-transform duration-200 w-full h-full" src="https://www.ideabrowser.com/_next/image?url=%2Ffeatures%2Fidea-of-the-day.png&w=1920&q=75" />
								<div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
									<div className="bg-white rounded-full size-20 flex items-center justify-center border-4 border-gray-200 shadow-xl">
										<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-play w-8 h-8 fill-black">
											<polygon points="6 3 20 12 6 21 6 3"></polygon>
										</svg>
									</div>
								</div>
							</div>
							<div className="p-6 flex flex-col flex-1">
								<h3 className="text-xl font-semibold mb-2 text-gray-900">Technical Guides</h3>
								<p className="text-gray-600 mb-2">Create comprehensive technical documentation and tutorials</p>
								<div className="flex-1"></div>
								<p className="text-xs"><span className="text-gray-500">Pro plan required</span></p>
							</div>
						</a>
					</div>
				</div>
			</div>

			{/* Feature section */}
			<motion.div
				className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32"
				variants={featuresVariants}
				animate={isFadingOut ? 'exit' : 'visible'}
			>
				<div className="mx-auto max-w-2xl lg:text-center">
					<h2 className="text-base font-semibold leading-7 text-blue-600">
						Write Faster
					</h2>
					<p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
						Everything you need to write your story
					</p>
					<p className="mt-6 text-lg leading-8 text-gray-600">
						Our AI-powered platform helps you develop characters, build worlds, and
						craft compelling narratives with ease.
					</p>
				</div>
				<div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
					<dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
						{features.map((feature) => (
							<div key={feature.name} className="flex flex-col">
								<dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
									{feature.name}
								</dt>
								<dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
									<p className="flex-auto">{feature.description}</p>
								</dd>
							</div>
						))}
					</dl>
				</div>
			</motion.div>
		</motion.div>

		{/* Transition overlay */}
		<AnimatePresence>
			{isNavigating && (
				<motion.div
					className="fixed inset-0 z-50 bg-white flex items-center justify-center"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
				>
					<motion.div
						className="text-center"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2, duration: 0.4 }}
					>
						<div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
							<motion.div
								animate={{ rotate: 360 }}
								transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
								className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"
							/>
						</div>
						<p className="text-lg font-medium text-gray-900">Preparing your ebook...</p>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	</>
);
}

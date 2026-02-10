import { Link } from 'react-router-dom';

const features = [
    {
        icon: '🤖',
        title: 'Gemini AI Chat',
        description: 'Chat with Google Gemini AI — ask anything and get intelligent responses powered by the latest AI model.',
        link: '/chat',
        gradient: 'from-violet-500 to-purple-600',
        shadow: 'shadow-violet-500/20',
    },
    {
        icon: '🗺️',
        title: 'Google Maps',
        description: 'Search places, get directions, and explore locations with the fully-integrated Google Maps experience.',
        link: '/map',
        gradient: 'from-emerald-500 to-teal-600',
        shadow: 'shadow-emerald-500/20',
    },
    {
        icon: '🗄️',
        title: 'PostgreSQL Database',
        description: 'Full CRUD operations with PostgreSQL — create, read, update, and delete records seamlessly.',
        link: '/database',
        gradient: 'from-blue-500 to-cyan-600',
        shadow: 'shadow-blue-500/20',
    },
];

function HomePage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {/* Hero Section */}
            <div className="text-center mb-20">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-6">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                    </span>
                    Full-Stack Application
                </div>
                <h1 className="text-5xl sm:text-6xl font-extrabold mb-6">
                    <span className="bg-gradient-to-r from-white via-indigo-200 to-purple-300 bg-clip-text text-transparent">
                        Phak-Chat-Jen
                    </span>
                </h1>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                    A modern full-stack application powered by{' '}
                    <span className="text-indigo-400 font-medium">React</span>,{' '}
                    <span className="text-purple-400 font-medium">Express</span>,{' '}
                    <span className="text-emerald-400 font-medium">PostgreSQL</span>,{' '}
                    <span className="text-cyan-400 font-medium">Gemini AI</span>, and{' '}
                    <span className="text-green-400 font-medium">Google Maps</span>.
                </p>
            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-6">
                {features.map((feature) => (
                    <Link
                        key={feature.title}
                        to={feature.link}
                        className={`group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 p-8 hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${feature.shadow}`}
                    >
                        <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} text-2xl mb-5 shadow-lg ${feature.shadow}`}>
                            {feature.icon}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-200 transition-colors">
                            {feature.title}
                        </h3>
                        <p className="text-slate-400 leading-relaxed text-sm">
                            {feature.description}
                        </p>
                        <div className="mt-5 flex items-center gap-1 text-indigo-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                            Explore →
                        </div>
                        {/* Hover glow effect */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`}></div>
                    </Link>
                ))}
            </div>

            {/* Tech Stack */}
            <div className="mt-20 text-center">
                <p className="text-sm text-slate-500 mb-4 uppercase tracking-wider font-medium">Tech Stack</p>
                <div className="flex flex-wrap justify-center gap-3">
                    {['React 19', 'Vite', 'Tailwind CSS', 'Express.js', 'PostgreSQL', 'Gemini AI', 'Google Maps'].map(
                        (tech) => (
                            <span
                                key={tech}
                                className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-300 text-sm font-medium hover:bg-white/10 transition-colors cursor-default"
                            >
                                {tech}
                            </span>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}

export default HomePage;

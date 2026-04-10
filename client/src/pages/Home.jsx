import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Shield,
  FolderTree,
  Database,
  Key,
  Upload,
  ChevronRight,
  Lock,
  Plus,
  Unlink,
  History,
  Folder,
  Copy,
  Download,
  StickyNote,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const problemPoints = [
  "Delete a project -> your env is gone",
  "Switch devices -> no access",
  "You don't commit .env -> nowhere to store",
  "Saved in notes or chats -> messy and unreliable",
];

const featureCards = [
  {
    icon: FolderTree,
    title: "Project hierarchy",
    description: "Deep nesting for multi-service architectures and monorepos.",
  },
  {
    icon: Folder,
    title: "Section-based storage",
    description: "Logical grouping of variables by environment or microservice.",
  },
  {
    icon: Key,
    title: "Credentials manager",
    description: "Dedicated fields for SSH keys, private keys, and certificates.",
  },
  {
    icon: StickyNote,
    title: "Developer notes",
    description: "Contextual documentation attached directly to your variable blocks.",
  },
  {
    icon: Download,
    title: ".env import/export",
    description: "Seamless migration from existing workflows with two-click exports.",
  },
  {
    icon: Copy,
    title: "Fast copy & reveal",
    description: "Keyboard-centric UI for lightning-fast secret retrieval.",
  },
];

const securityPoints = [
  "Pre-storage encryption",
  "Auth-Gated decryption",
  "Zero Plaintext",
  "Session-based access",
];

const howSteps = [
  "Create project",
  "Structure zones",
  "Store variables",
  "Access anytime",
];

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [loading, isAuthenticated, navigate]);

  return (
    <div className="relative min-h-screen bg-white text-gray-800 antialiased">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-white border-b border-gray-200 flex justify-between items-center px-8 py-4 max-w-full font-['Inter'] antialiased tracking-tight">
        <div className="text-xl font-bold tracking-tighter text-gray-800">Envora</div>
        <div className="flex items-center space-x-4">
          <Link to="/login" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 scale-95 active:opacity-80">Sign In</Link>
          <Link to="/register" className="bg-blue-600 text-white px-4 py-1.5 rounded-3xl font-medium scale-95 active:opacity-80 transition-transform hover:bg-blue-700">Get Started</Link>
        </div>
      </nav>
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="w-full px-8 pt-20 pb-32 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-gray-50">
          <div className="space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tighter text-gray-800 leading-[1.1]">
              One place for your .env, secrets, and project structure
            </h1>
            <p className="text-gray-700 leading-relaxed">
              Envora is a structured developer vault to manage environment variables, credentials, notes, and project sections without losing track.
            </p>
            <div className="flex items-center gap-4">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-3xl font-semibold hover:bg-blue-700 transition-colors">Get Started</button>
              <button className="border border-gray-300 px-8 py-3 rounded-3xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors">Login</button>
            </div>
          </div>
          
          <div className="relative group">
            <div className="bg-[#11192c] border border-[#697596]/10 rounded-3xl overflow-hidden technical-glow">
              <div className="flex items-center gap-2 px-4 py-3 bg-[#151f36] border-b border-[#697596]/10">
                <div className="w-3 h-3 rounded-full bg-[#bb5551]/40"></div>
                <div className="w-3 h-3 rounded-full bg-[#8f9fb7]/40"></div>
                <div className="w-3 h-3 rounded-full bg-[#c5c7c8]/40"></div>
                <div className="ml-4 text-[0.6875rem] uppercase tracking-widest text-[#8f9fb7]">System-Terminal-v2.0</div>
              </div>
              <div className="flex h-[400px]">
                {/* Sidebar Mock */}
                <div className="w-48 bg-gray-900 border-r border-gray-300 p-4 space-y-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-gray-300 font-bold text-sm">
                      <FolderTree className="w-4 h-4" />
                      <span className="ml-2">Amazon</span>
                    </div>
                    <div className="pl-6 space-y-1">
                      <div className="flex items-center gap-2 text-white text-sm hover:text-gray-900 cursor-pointer">
                        <Folder className="w-4 h-4" />
                        <span className="ml-2">frontend</span>
                      </div>
                      <div className="flex items-center gap-2 text-white text-sm py-1 rounded cursor-pointer">
                        <Folder className="w-4 h-4" />
                        <span className="ml-2">backend</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Content Mock */}
                <div className="flex-1 p-6 space-y-6">
                  <div className="flex justify-between items-end border-b border-gray-200 pb-4">
                    <div>
                      <div className="text-[0.6875rem] uppercase tracking-widest text-white mb-1">Current Directory</div>
                      <div className="text-white font-mono text-sm">Project / backend</div>
                    </div>
                    <Plus className="text-gray-500 text-lg" />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-[0.6875rem] uppercase tracking-widest text-white">
                      <span>Key</span>
                      <span>Value</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 items-center group/row">
                      <div className="font-mono text-sm text-white">DATABASE_URL</div>
                      <div className="bg-gray-100 px-2 py-1 font-mono text-sm text-gray-600 truncate">postgres://admin:••••••@db...</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 items-center group/row">
                      <div className="font-mono text-sm text-white">STRIPE_SK</div>
                      <div className="bg-gray-100 px-2 py-1 font-mono text-sm text-gray-600 truncate">sk_live_51M... <Copy className="float-right text-xs" /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 items-center group/row opacity-50">
                      <div className="font-mono text-sm text-white">NODE_ENV</div>
                      <div className="bg-gray-100 px-2 py-1 font-mono text-sm text-gray-600">production</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Abstract UI elements */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-500/10 blur-3xl -z-10"></div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="bg-gray-50 py-32 border-y border-gray-200">
          <div className="w-full px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
              <div>
                <h2 className="text-3xl font-bold tracking-tighter text-gray-800 mb-6">Developers lose track of env and secrets</h2>
                <p className="text-gray-700 leading-relaxed">The modern stack is fragmented. Secrets shouldn't be.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Unlink className="text-red-500 text-2xl" />
                  <h3 className="font-bold text-gray-800">Scattered .env files</h3>
                  <p className="text-sm text-gray-600">Variables hidden across local machines, servers, and CI/CD pipelines.</p>
                </div>
                <div className="space-y-3">
                  <History className="text-orange-500 text-2xl" />
                  <h3 className="font-bold text-gray-800">No Structure</h3>
                  <p className="text-sm text-gray-600">Credentials saved in random notes or Slack messages. Hard to manage separation.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-gradient-to-br from-gray-50 to-white py-16">
          <div className="w-full px-8">
            <div className="text-center mb-20 space-y-4">
              <h2 className="text-5xl font-bold tracking-tighter text-gray-900 mb-4">Built for how developers actually work</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Envora isn't just storage - it's a structured system to manage environment variables, credentials, and project data without losing anything.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {/* Feature 1 */}
              <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FolderTree className="text-white text-xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Structured env storage</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Store your environment variables the same way your project is structured. Create a project, organize it into folders like frontend and backend, and store env files inside them. You can also nest folders as deep as your architecture requires.
                </p>
                <p className="text-gray-600 leading-relaxed mt-3">
                  No more flat lists or messy files - everything stays organized and predictable.
                </p>
              </div>
              
              {/* Feature 2 */}
              <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Database className="text-white text-xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Persistent env backup</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Your environment variables stay safe even if your project doesn't. Delete a project from your local machine, switch devices, or clean up old repos - your env is still stored and accessible whenever you need it again.
                </p>
                <p className="text-gray-600 leading-relaxed mt-3">
                  Re-clone your code, fetch your env from Envora, and continue working instantly.
                </p>
              </div>
              
              {/* Feature 3 */}
              <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Upload className="text-white text-xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Manual input and .env upload</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Add variables your way. You can manually create key-value pairs or upload a full .env file and let Envora automatically parse and store everything.
                </p>
                <p className="text-gray-600 leading-relaxed mt-3">
                  Edit, update, or remove variables anytime without dealing with raw files.
                </p>
              </div>
              
              {/* Feature 4 */}
              <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Key className="text-white text-xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Credentials storage</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Store important account details alongside your projects. Save website logins, API keys, and credentials in a structured format with fields like title, website, email/username, password, and notes.
                </p>
                <p className="text-gray-600 leading-relaxed mt-3">
                  Everything stays organized and easy to retrieve when needed.
                </p>
              </div>
              
              {/* Feature 5 */}
              <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <StickyNote className="text-white text-xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Project notes</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Keep important information where it belongs - with your project. Add notes for setup steps, configurations, reminders, or anything you might forget later.
                </p>
                <p className="text-gray-600 leading-relaxed mt-3">
                  No need to rely on random documents or scattered notes.
                </p>
              </div>
              
              {/* Feature 6 */}
              <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Lock className="text-white text-xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Encrypted and private</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Your data is protected by design. All sensitive values are encrypted before being stored, and only you can access them through your authenticated session.
                </p>
                <p className="text-gray-600 leading-relaxed mt-3">
                  Your env, credentials, and notes remain completely private and isolated to your account.
                </p>
              </div>
            </div>
            
            <div className="text-center mt-16">
              <p className="text-lg text-gray-700 font-medium">
                No more lost env files. No more scattered data. Everything stays in one place.
              </p>
            </div>
          </div>
        </section>

        {/* Workflow Section */}
        <section className="bg-gray-50 py-32">
          <div className="w-full px-8">
            <div className="text-center mb-20 space-y-4">
              <h2 className="text-5xl font-bold tracking-tighter text-gray-900 mb-4">How it works</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 max-w-7xl mx-auto">
              <div className="relative">
                <div className="text-5xl font-bold text-blue-600 mb-4">01</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Create project</h3>
                <p className="text-lg text-gray-600">Initialize your workspace with project-specific scope.</p>
              </div>
              <div className="relative">
                <div className="text-5xl font-bold text-blue-600 mb-4">02</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Structure zones</h3>
                <p className="text-lg text-gray-600">Choose: add env or create folders for logic separation.</p>
              </div>
              <div className="relative">
                <div className="text-5xl font-bold text-blue-600 mb-4">03</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Store variables</h3>
                <p className="text-lg text-gray-600">Fill in keys and secrets with instant encryption.</p>
              </div>
              <div className="relative">
                <div className="text-5xl font-bold text-blue-600 mb-4">04</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Access anytime</h3>
                <p className="text-lg text-gray-600">Retrieve values via dashboard or upcoming CLI tool.</p>
              </div>
            </div>
          </div>
        </section>

      
        {/* Final CTA */}
        <section className="py-40 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(197,199,200,0.03),transparent_60%)]"></div>
          <div className="max-w-3xl mx-auto px-8 relative z-10 space-y-8">
            <h2 className="text-5xl font-bold tracking-tighter text-gray-900">Stop losing track of your environment variables</h2>
            <p className="text-gray-600 text-lg">Join developers who prioritize structure and security.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="w-full sm:w-auto bg-blue-600 text-white px-10 py-4 rounded-3xl font-bold hover:bg-blue-700 transition-colors">
                Start Free
              </Link>
              <Link to="/login" className="w-full sm:w-auto border border-gray-300 px-10 py-4 rounded-3xl font-bold text-gray-700 hover:bg-gray-50 transition-colors">
                Login
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0a0e18] border-t border-[#3b4766]/15 py-12 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1 space-y-4">
            <div className="text-lg font-bold text-[#c5c7c8]">Envora</div>
            <div className="text-[0.6875rem] uppercase tracking-[0.05em] font-['Inter'] text-[#8f9fb7]">
              2024 Envora. All rights reserved.
            </div>
          </div>
          <div className="space-y-4">
            <div className="text-[0.6875rem] uppercase tracking-[0.05em] font-bold text-[#c5c7c8]">Resources</div>
            <ul className="space-y-2">
              <li><a className="text-[0.6875rem] uppercase tracking-[0.05em] text-[#8f9fb7] hover:text-[#c5c7c8] underline decoration-[#8f9fb7]/30 transition-opacity" href="#">Docs</a></li>
              <li><a className="text-[0.6875rem] uppercase tracking-[0.05em] text-[#8f9fb7] hover:text-[#c5c7c8] underline decoration-[#8f9fb7]/30 transition-opacity" href="#">GitHub</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <div className="text-[0.6875rem] uppercase tracking-[0.05em] font-bold text-[#c5c7c8]">Social</div>
            <ul className="space-y-2">
              <li><a className="text-[0.6875rem] uppercase tracking-[0.05em] text-[#8f9fb7] hover:text-[#c5c7c8] underline decoration-[#8f9fb7]/30 transition-opacity" href="#">Twitter</a></li>
              <li><a className="text-[0.6875rem] uppercase tracking-[0.05em] text-[#8f9fb7] hover:text-[#c5c7c8] underline decoration-[#8f9fb7]/30 transition-opacity" href="#">Legal</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

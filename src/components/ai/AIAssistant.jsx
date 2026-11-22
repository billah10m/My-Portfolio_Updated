'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, X, Send } from 'lucide-react';

export default function AIAssistant({ data = {} }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMsg, setInputMsg] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "👋 Hi! I'm Asif AI, Asif Billah's portfolio intelligence engine. Ask me anything about his flagship projects (Campus Gig, Orivo, Brain CT), medical AI research, DIU-CPC leadership, or technical skills!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatBodyRef = useRef(null);

  const person = data.personInfo || {};
  const projectsList = data.projects || [];
  const experiencesList = data.experiences || [];
  const researchList = data.researchPapers || [];

  useEffect(() => {
    if (isOpen && chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  // Quick Prompt Chips
  const promptChips = [
    { label: '🚀 Flagship Projects', query: 'Show flagship projects' },
    { label: '💼 DIU-CPC Leadership', query: 'Tell me about work and leadership' },
    { label: '🧠 AI & Tech Arsenal', query: 'What is his tech stack?' },
    { label: '📚 Medical AI Research', query: 'Tell me about his research' },
    { label: '✉️ Contact Details', query: 'How can I contact Asif?' },
  ];

  const generateAIResponse = (query) => {
    const q = query.toLowerCase();

    // 1. Projects Query
    if (q.includes('project') || q.includes('work') || q.includes('build') || q.includes('campus gig') || q.includes('orivo')) {
      const topProjects = projectsList.slice(0, 3).map(p => `• **${p.title}**: ${p.description}`).join('\n');
      
      const projSec = document.getElementById('projects');
      if (projSec) projSec.scrollIntoView({ behavior: 'smooth' });

      return {
        text: `Here are Asif's top flagship projects:\n\n${topProjects}\n\nI have scrolled to the **Projects** showcase!`,
        action: 'projects'
      };
    }

    // 2. Research Query
    if (q.includes('research') || q.includes('paper') || q.includes('ct') || q.includes('medical') || q.includes('brain')) {
      const topResearch = researchList.map(r => `• **${r.title}**: ${r.description}`).join('\n');
      
      const resSec = document.getElementById('research');
      if (resSec) resSec.scrollIntoView({ behavior: 'smooth' });

      return {
        text: `Here is Asif's medical AI research:\n\n${topResearch || 'Explainable Multi-Label Brain CT Findings Detection and Report Generation Using Vision-Language Learning.'}\n\nI have navigated to the **Research** section!`,
        action: 'research'
      };
    }

    // 3. Experience & Leadership Query
    if (q.includes('experience') || q.includes('job') || q.includes('role') || q.includes('leadership') || q.includes('club') || q.includes('diu') || q.includes('cpc')) {
      const topExp = experiencesList.slice(0, 3).map(e => `• **${e.role}** at *${e.organization}* (${e.period})`).join('\n');
      
      const expSec = document.getElementById('experience');
      if (expSec) expSec.scrollIntoView({ behavior: 'smooth' });

      return {
        text: `Here is a summary of Asif's leadership and professional experience:\n\n${topExp}\n\nI have scrolled to the **Experience** section!`,
        action: 'experience'
      };
    }

    // 4. Tech Stack Query
    if (q.includes('tech') || q.includes('skill') || q.includes('stack') || q.includes('language') || q.includes('python') || q.includes('next') || q.includes('ai')) {
      const techSec = document.getElementById('tech-stack');
      if (techSec) techSec.scrollIntoView({ behavior: 'smooth' });

      return {
        text: `Asif specializes in **Software Development** (Next.js, React, Node.js, TypeScript, Python) and **Artificial Intelligence & Deep Learning** (PyTorch, TensorFlow, Computer Vision, Vision-Language Models).\n\nCheck out the interactive **Skills** terminal!`,
        action: 'techstack'
      };
    }

    // 5. Contact / Hire Query
    if (q.includes('contact') || q.includes('email') || q.includes('hire') || q.includes('reach') || q.includes('phone') || q.includes('location')) {
      const contactSec = document.getElementById('contact');
      if (contactSec) contactSec.scrollIntoView({ behavior: 'smooth' });

      return {
        text: `You can reach Asif Billah directly via:\n• **Email**: ${person.email || 'asifbillah.cse@gmail.com'}\n• **Location**: ${person.location || 'Daffodil Smart City, Ashulia, Dhaka, Bangladesh'}\n• **GitHub**: ${person.github || person.github_url || 'https://github.com/asifbillah'}\n• **LinkedIn**: ${person.linkedin || 'https://linkedin.com/in/asifbillah'}\n\nI have opened the **Contact** form below!`,
        action: 'contact'
      };
    }

    // 6. General Bio Query
    return {
      text: `${person.name || 'Asif Billah'} is a **${person.title || person.role || 'Software Developer & AI Researcher'}** and **General Secretary of DIU Computer & Programming Club (DIU-CPC)** at Daffodil International University. ${person.about || person.bio || 'He architects scalable software systems, leads national tech tournaments, and conducts medical AI research.'}`
    };
  };

  const handleSend = (textToSend) => {
    const query = textToSend || inputMsg;
    if (!query.trim()) return;

    const userMsg = {
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMsg('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateAIResponse(query);
      const aiMsg = {
        sender: 'ai',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-mono select-none">
      {/* Floating Circular AI Icon Launcher */}
      {!isOpen && (
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative group flex justify-end"
        >
          {/* Tooltip */}
          <div 
            className="absolute right-16 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none translate-x-2 group-hover:translate-x-0"
            style={{
              background: 'var(--color-surface-2)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text)',
            }}
          >
            Asif AI Assistant
          </div>

          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open AI Assistant"
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-2xl flex items-center justify-center cursor-pointer transition-all duration-300 relative backdrop-blur-xl group-hover:scale-110 active:scale-95"
            style={{
              background: 'var(--color-surface)',
              border: '2px solid var(--color-accent)',
              boxShadow: '0 0 24px rgba(56, 189, 248, 0.45), 0 8px 20px rgba(0,0,0,0.5)',
            }}
          >
            <span className="absolute -inset-1 rounded-full border border-accent/60 animate-ping pointer-events-none" />
            <Bot className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-110" style={{ color: 'var(--color-accent)' }} />
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-[var(--color-surface)] shadow-md" />
          </button>
        </motion.div>
      )}

      {/* Interactive Folder Deck Chat Window Modal */}
      {isOpen && (
        <div className="w-[340px] sm:w-[380px] relative z-50">
          <div className="flex justify-end pr-6 relative z-20">
            <div 
              className="px-4 py-1 rounded-t-2xl text-[10px] font-mono font-bold flex items-center gap-1.5 shadow-md relative -mb-[1px]"
              style={{
                background: 'var(--color-surface)',
                borderTop: '1px solid var(--color-border-accent)',
                borderLeft: '1px solid var(--color-border-accent)',
                borderRight: '1px solid var(--color-border-accent)',
                color: 'var(--color-accent)',
              }}
            >
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span>ASIF AI // INTELLIGENCE</span>
            </div>
          </div>

          <div 
            className="w-full h-[480px] rounded-3xl rounded-tr-none flex flex-col overflow-hidden shadow-2xl relative z-10 transition-all duration-300"
            style={{
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
            }}
          >
            <div 
              className="absolute inset-x-0 top-0 h-[2px] z-30" 
              style={{ background: 'linear-gradient(to right, transparent, var(--color-accent), transparent)' }} 
            />

            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b flex-shrink-0" style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface-2)' }}>
              <div className="flex items-center gap-2.5">
                <div 
                  className="w-8 h-8 rounded-xl flex items-center justify-center shadow-inner"
                  style={{ background: 'var(--color-surface-3)', border: '1px solid var(--color-border)' }}
                >
                  <Bot className="w-4 h-4 text-accent" style={{ color: 'var(--color-accent)' }} />
                </div>
                <div>
                  <h3 className="text-xs font-bold font-sans flex items-center gap-1.5" style={{ color: 'var(--color-text)' }}>
                    <span>Asif AI Assistant</span>
                    <span 
                      className="text-[9px] font-mono px-1.5 py-0.2 rounded font-bold"
                      style={{ background: 'var(--color-surface-3)', color: 'var(--color-accent)', border: '1px solid var(--color-border-accent)' }}
                    >
                      LIVE
                    </span>
                  </h3>
                  <p className="text-[10px] font-mono" style={{ color: 'var(--color-text-muted)' }}>Portfolio Intelligence Engine</p>
                </div>
              </div>

              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg transition-colors cursor-pointer"
                style={{ color: 'var(--color-text-muted)' }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Prompt Chips */}
            <div className="px-3 py-2 border-b flex gap-1.5 overflow-x-auto custom-scrollbar flex-shrink-0" style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface-3)' }}>
              {promptChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(chip.query)}
                  className="px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold whitespace-nowrap transition-all cursor-pointer shadow-sm"
                  style={{
                    background: 'var(--color-surface-2)',
                    color: 'var(--color-text-muted)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Messages Body */}
            <div ref={chatBodyRef} className="flex-1 p-4 overflow-y-auto space-y-3 custom-scrollbar text-xs font-sans">
              {messages.map((m, idx) => (
                <div 
                  key={idx} 
                  className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div 
                    className={`max-w-[85%] p-3 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                      m.sender === 'user' 
                        ? 'font-semibold rounded-tr-none shadow-md' 
                        : 'rounded-tl-none font-mono text-[11px] shadow-sm'
                    }`}
                    style={m.sender === 'user' ? {
                      background: 'var(--color-accent)',
                      color: '#000',
                    } : {
                      background: 'var(--color-surface-2)',
                      color: 'var(--color-text)',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    {m.text}
                  </div>
                  <span className="text-[9px] font-mono mt-1 px-1" style={{ color: 'var(--color-text-faint)' }}>{m.timestamp}</span>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-1.5 text-xs font-mono p-2" style={{ color: 'var(--color-text-muted)' }}>
                  <Bot className="w-3.5 h-3.5 animate-spin" style={{ color: 'var(--color-accent)' }} />
                  <span>Asif AI is analyzing...</span>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t flex-shrink-0" style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface-2)' }}>
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  placeholder="Ask about projects, AI research, skills..."
                  className="flex-1 px-3.5 py-2 rounded-xl text-xs outline-none font-mono transition-colors"
                  style={{
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                />
                <button
                  type="submit"
                  className="p-2 rounded-xl font-bold transition-opacity cursor-pointer shadow-md"
                  style={{
                    background: 'var(--color-accent)',
                    color: '#000',
                  }}
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

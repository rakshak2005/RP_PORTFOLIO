import { useState, useRef } from 'react';
import { Mail, MapPin, Send, Github, Linkedin, Twitter, Sparkles } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const form = useRef();
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);
  const [magBtn, setMagBtn] = useState({ x: 0, y: 0 });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleMagMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    setMagBtn({ x: x * 0.35, y: y * 0.35 });
  };

  const handleMagLeave = () => {
    setMagBtn({ x: 0, y: 0 });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSending(true);

    const serviceId = 'service_gnyj8k2';
    const templateId = 'template_5bea2zl';
    const publicKey = 'zSbCOTclSiWTmwsnZ';

    const templateParams = {
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message
    };

    emailjs.send(serviceId, templateId, templateParams, publicKey)
      .then(() => {
        toast({
          title: "Message Sent",
          description: "Your transmission reached my inbox successfully.",
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
      })
      .catch((error) => {
        console.error("EmailJS Error:", error);
        toast({
          variant: "destructive",
          title: "Connection Error",
          description: error?.text || "The message couldn't be sent. Check dashboard settings.",
        });
      })
      .finally(() => setIsSending(false));
  };

  const contactCards = [
    { icon: Mail, label: "Email", value: "rakshakpatel2005@gmail.com", link: "mailto:rakshakpatel2005@gmail.com", color: "text-blue-400" },
    { icon: Linkedin, label: "LinkedIn", value: "Rakshak Patel V", link: "https://www.linkedin.com/in/rakshak-patel-v-12b2b624a", color: "text-indigo-400" },
    { icon: MapPin, label: "Location", value: "Bangalore, India", link: "#", color: "text-[#d946ef]" }
  ];

  return (
    <section id="contact" className="py-16 md:py-20 bg-[#050208] text-white relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#d946ef]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-[#d946ef] mb-2">
              <Sparkles size={14} />
              <span className="uppercase tracking-[0.3em] text-[10px] font-bold">Inquiry Terminal</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter leading-none">
              START A <br /> <span className="text-[#d946ef]">CONVERSATION</span>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-3.5">
            {contactCards.map((card, i) => (
              <a key={i} href={card.link} target="_blank" rel="noreferrer" className="group block p-4.5 rounded-[1.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all">
                <div className="flex items-center gap-3.5">
                  <div className={`p-3 rounded-xl bg-white/5 ${card.color} group-hover:scale-110 transition-transform`}>
                    <card.icon size={20} />
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-slate-500 font-bold mb-0.5">{card.label}</p>
                    <p className="text-xs font-semibold text-slate-200">{card.value}</p>
                  </div>
                </div>
              </a>
            ))}

            {/* Availability Box */}
            <div className="p-5 rounded-[1.5rem] bg-gradient-to-br from-[#d946ef]/5 to-[#8b1ff5]/5 border border-[#d946ef]/15 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-[#d946ef]/10 blur-[35px] pointer-events-none" />
              <p className="text-[9px] uppercase tracking-widest text-[#d946ef] font-mono font-bold mb-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" /> Availability
              </p>
              <h4 className="text-xs font-black uppercase tracking-wider text-white mb-3">Open to Opportunities</h4>
              <div className="flex flex-wrap gap-1.5">
                {["Full-Time", "Internship", "Freelance", "Remote", "Hybrid"].map((type, idx) => (
                  <span key={idx} className="px-2.5 py-1 text-[8px] font-mono font-bold uppercase tracking-wider rounded-lg bg-black/40 border border-white/5 text-slate-300 hover:border-[#d946ef]/30 hover:text-white transition-colors duration-300">
                    {type}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-6 md:p-8">
              <form ref={form} onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input name="name" value={formData.name} onChange={handleChange} placeholder="Name" required className="bg-transparent border-0 border-b border-white/10 rounded-none h-10 text-sm focus:border-[#d946ef]" />
                  <Input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required className="bg-transparent border-0 border-b border-white/10 rounded-none h-10 text-sm focus:border-[#d946ef]" />
                </div>
                <Input name="subject" value={formData.subject} onChange={handleChange} placeholder="Subject" required className="bg-transparent border-0 border-b border-white/10 rounded-none h-10 text-sm focus:border-[#d946ef]" />
                <Textarea name="message" value={formData.message} onChange={handleChange} placeholder="Tell me about your vision..." required className="bg-transparent border-0 border-b border-white/10 rounded-none min-h-[90px] text-sm focus:border-[#d946ef] resize-none" />

                <Button 
                  type="submit" 
                  disabled={isSending} 
                  onMouseMove={handleMagMove}
                  onMouseLeave={handleMagLeave}
                  className="group relative px-7 py-4.5 overflow-hidden rounded-full bg-white text-black font-black uppercase tracking-widest text-[10px] hover:text-white transition-shadow duration-300"
                  style={{
                    transform: `translate(${magBtn.x}px, ${magBtn.y}px)`,
                    transition: magBtn.x === 0 && magBtn.y === 0 ? 'transform 0.45s cubic-bezier(0.23, 1, 0.32, 1)' : 'transform 0.1s ease-out'
                  }}
                >
                  <div className="absolute inset-0 bg-[#d946ef] translate-y-full group-hover:translate-y-0 transition-transform duration-500 pointer-events-none" />
                  <span className="relative z-10 flex items-center gap-2">
                    {isSending ? 'Sending...' : 'Send Message'} <Send size={14} />
                  </span>
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
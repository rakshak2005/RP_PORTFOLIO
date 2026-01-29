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
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
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
    <section id="contact" className="py-32 bg-[#050208] text-white relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#d946ef]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-[#d946ef] mb-4">
              <Sparkles size={18} />
              <span className="uppercase tracking-[0.3em] text-xs font-bold">Inquiry Terminal</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
              START A <br /> <span className="text-[#d946ef]">CONVERSATION</span>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-4">
            {contactCards.map((card, i) => (
              <a key={i} href={card.link} target="_blank" rel="noreferrer" className="group block p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-2xl bg-white/5 ${card.color} group-hover:scale-110 transition-transform`}>
                    <card.icon size={24} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-1">{card.label}</p>
                    <p className="text-sm font-medium text-slate-200">{card.value}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>

          <div className="lg:col-span-8">
            <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 md:p-12">
              <form ref={form} onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Input name="name" value={formData.name} onChange={handleChange} placeholder="Name" required className="bg-transparent border-0 border-b border-white/10 rounded-none h-12 text-lg focus:border-[#d946ef]" />
                  <Input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required className="bg-transparent border-0 border-b border-white/10 rounded-none h-12 text-lg focus:border-[#d946ef]" />
                </div>
                <Input name="subject" value={formData.subject} onChange={handleChange} placeholder="Subject" required className="bg-transparent border-0 border-b border-white/10 rounded-none h-12 text-lg focus:border-[#d946ef]" />
                <Textarea name="message" value={formData.message} onChange={handleChange} placeholder="Tell me about your vision..." required className="bg-transparent border-0 border-b border-white/10 rounded-none min-h-[150px] text-lg focus:border-[#d946ef] resize-none" />
                
                <Button type="submit" disabled={isSending} className="group relative px-12 py-8 overflow-hidden rounded-full bg-white text-black font-bold text-sm uppercase tracking-widest hover:text-white transition-colors">
                  <div className="absolute inset-0 bg-[#d946ef] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  <span className="relative z-10 flex items-center gap-2">
                    {isSending ? 'Sending...' : 'Send Message'} <Send size={16} />
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
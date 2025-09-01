import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { analytics } from '@/services/analytics';

type LocalTestimonial = {
  id: string;
  name: string;
  email: string;
  role?: string;
  quote: string;
  imageDataUrl?: string | null; // stored as data URL for local drafts
  imageName?: string | null;
  consent_text: boolean;
  consent_image: boolean;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
};

const TestimonialForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [text, setText] = useState('');
  const [consentText, setConsentText] = useState(false);
  const [consentImage, setConsentImage] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (f?: File | null) => {
    if (!f) {
      setImageFile(null);
      setImagePreview(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(String(reader.result || ''));
    };
    reader.readAsDataURL(f);
    setImageFile(f);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0];
    handleImageChange(f || null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentText) {
      toast({ title: 'Consentimento necessário', description: 'Você precisa concordar para que possamos publicar seu depoimento.' });
      return;
    }
    // If user uploaded an image, require image consent
    if (imageFile && !consentImage) {
      toast({ title: 'Consentimento da imagem necessário', description: 'Você precisa concordar que podemos exibir sua foto junto ao depoimento.' });
      return;
    }

    const item: LocalTestimonial = {
      id: 'local_' + Date.now(),
      name,
      email,
      role,
      quote: text,
      imageDataUrl: imagePreview ?? null,
      imageName: imageFile?.name ?? null,
      consent_text: consentText,
      consent_image: consentImage,
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    try {
      const prev = JSON.parse(localStorage.getItem('storyspark-testimonials') || '[]');
      prev.unshift(item);
      localStorage.setItem('storyspark-testimonials', JSON.stringify(prev));
    } catch {}

    try {
      analytics.track('testimonial_submitted_local', { id: item.id, hasImage: Boolean(item.imageDataUrl), consent_text: item.consent_text, consent_image: item.consent_image });
    } catch {}

    toast({ title: 'Obrigado', description: 'Seu depoimento foi salvo como rascunho (pendente de revisão).' });
    try { window.dispatchEvent(new CustomEvent('testimonial:submitted', { detail: item })); } catch {}

    setName(''); setEmail(''); setRole(''); setText(''); setConsentText(false); setConsentImage(false); handleImageChange(null);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 max-w-xl" aria-live="polite">
      <Input placeholder="Nome" value={name} onChange={e => setName(e.target.value)} required />
      <Input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} type="email" required />
      <Input placeholder="Cargo / função" value={role} onChange={e => setRole(e.target.value)} />
      <textarea placeholder="Seu depoimento" value={text} onChange={e => setText(e.target.value)} className="p-3 rounded" required />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="text-sm">
          <input type="checkbox" checked={consentText} onChange={e => setConsentText(e.target.checked)} />{' '}
          Concordo que meu depoimento (texto) pode ser analisado e exibido na landing.
        </label>
        <label className="text-sm">
          <input type="checkbox" checked={consentImage} onChange={e => setConsentImage(e.target.checked)} />{' '}
          Concordo que minha foto pode ser exibida junto ao depoimento (se enviada).
        </label>
      </div>

      <div>
        <label className="text-sm block mb-1">Foto (opcional) — JPG/PNG, até 5MB</label>
        <input type="file" accept="image/*" onChange={handleFileInput} />
        {imagePreview ? (
          <div className="mt-2">
            <img src={imagePreview} alt="Pré-visualização" className="w-32 h-32 object-cover rounded" />
            <div>
              <button type="button" className="text-sm underline mt-2" onClick={() => handleImageChange(null)}>Remover foto</button>
            </div>
          </div>
        ) : null}
      </div>

      <div><Button type="submit">Enviar depoimento</Button></div>
      <p className="text-xs text-muted-foreground">Após envio o depoimento ficará com status <strong>pendente</strong> até revisão do time; somente depoimentos aprovados serão publicados.</p>
    </form>
  );
};

export default TestimonialForm;

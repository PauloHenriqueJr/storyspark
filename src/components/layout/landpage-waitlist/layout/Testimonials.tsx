import React from 'react';

const Testimonials: React.FC = () => {
  return (
    <section aria-label="Testimonials" className="max-w-4xl mx-auto">
      <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border/10">
        <h3 className="text-lg font-semibold text-foreground mb-2">O que early adopters dizem</h3>
        <p className="text-sm text-muted-foreground">Depoimentos serão coletados em breve — este espaço exibirá opiniões reais de usuários beta.</p>
      </div>
    </section>
  );
};

export default Testimonials;

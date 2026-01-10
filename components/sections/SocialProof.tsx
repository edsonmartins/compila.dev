"use client";

import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { companies } from "@/lib/data";

/**
 * Social Proof - Números de usuários e logos de empresas
 */
export function SocialProof() {
  const userCount = 1247;
  const avatars = [
    { id: 1, img: "https://i.pravatar.cc/150?img=1" },
    { id: 2, img: "https://i.pravatar.cc/150?img=5" },
    { id: 3, img: "https://i.pravatar.cc/150?img=9" },
    { id: 4, img: "https://i.pravatar.cc/150?img=12" },
    { id: 5, img: "https://i.pravatar.cc/150?img=32" },
  ];

  return (
    <section className="py-12 border-y border-neutral-light dark:border-dark-border bg-neutral-light/30 dark:bg-dark-background">
      <Container>
        {/* Contador de usuários */}
        <div className="text-center mb-8">
          <p className="text-lg sm:text-xl text-neutral-dark dark:text-dark-muted">
            Junte-se a{" "}
            <span className="font-semibold text-accent">
              {new Intl.NumberFormat("pt-BR").format(userCount)}
            </span>{" "}
            desenvolvedores praticando código em português
          </p>
        </div>

        {/* Avatares de usuários */}
        <div className="flex justify-center items-center mb-8">
          <div className="flex -space-x-3">
            {avatars.map((avatar) => (
              <div
                key={avatar.id}
                className="w-12 h-12 rounded-full border-2 border-white dark:border-dark-border overflow-hidden relative"
              >
                <Image
                  src={avatar.img}
                  alt={`Avatar do usuário ${avatar.id}`}
                  width={48}
                  height={48}
                  className="object-cover"
                />
              </div>
            ))}
            <div className="w-12 h-12 rounded-full bg-neutral-light dark:bg-dark-card border-2 border-white dark:border-dark-border flex items-center justify-center text-neutral-dark dark:text-dark-foreground text-sm font-medium">
              +{userCount - avatars.length}
            </div>
          </div>
        </div>

        {/* Logos de empresas */}
        <div className="text-center">
          <p className="text-sm text-neutral-dark dark:text-dark-muted mb-6">
            Confiado por desenvolvedores de:
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12 opacity-60">
            {companies.map((company) => (
              <CompanyLogo key={company.name} name={company.name} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

function CompanyLogo({ name }: { name: string }) {
  return (
    <div className="text-primary dark:text-dark-foreground font-semibold text-lg hover:text-accent transition-colors cursor-default">
      {name}
    </div>
  );
}

// ─── FAQ data: all 50 questions × 3 languages ────────────────────────────────
// Source of truth for /faq page. Sections map to semantic categories.

export interface FAQItem {
  q: string;
  a: string;
}

export interface FAQSection {
  id:    string;
  title: string;
  icon:  string; // emoji or short label for section tab
  items: FAQItem[];
}

export type FAQLang = "en" | "pt" | "es";

// ─── ENGLISH ──────────────────────────────────────────────────────────────────

const en: FAQSection[] = [
  {
    id: "general",
    title: "General Insurance",
    icon: "🛡️",
    items: [
      {
        q: "What is an independent insurance agency?",
        a: "An independent agency like Ativa Insurance works with multiple insurance carriers — not just one. That means we shop around on your behalf to find the best coverage at the best price. We're not tied to any single company, so our loyalty is always to you. If you'd like us to compare your current coverage, we're happy to help.",
      },
      {
        q: "What's the difference between an insurance agent and an insurance broker?",
        a: "In most states, the terms are used interchangeably, but the distinction matters: an agent can bind coverage on behalf of a carrier, while a broker shops coverage but may not bind it directly. As an independent agency, we act as agents for multiple carriers — giving you broker-level choice with agent-level service. Want to see what we can find for your situation? Get a free quote in under 2 minutes.",
      },
      {
        q: "What does 'liability coverage' mean?",
        a: "Liability coverage pays for damages or injuries you cause to other people or their property. For example, if you're at fault in a car accident, your auto liability coverage pays for the other driver's repairs and medical bills. Without it, you'd pay those costs out of pocket. Not sure if your liability limits are adequate? Our agents can review your coverage at no cost.",
      },
      {
        q: "What is a deductible and how does it work?",
        a: "A deductible is the amount you pay out of pocket before your insurance kicks in. For example, if you have a $1,000 deductible and file a $5,000 claim, your insurer pays $4,000 and you pay $1,000. Higher deductibles generally mean lower premiums — and lower deductibles mean less out-of-pocket when something happens. We can help you find the right balance for your budget.",
      },
      {
        q: "What is a premium?",
        a: "Your premium is the amount you pay for your insurance policy — monthly, quarterly, or annually. Premiums are calculated based on your risk profile: your location, claims history, coverage amount, and many other factors depending on the type of insurance. As an independent agency, we compare rates across multiple carriers to find the lowest premium for your coverage needs.",
      },
      {
        q: "How do I know how much coverage I need?",
        a: "Coverage needs vary based on what you're protecting — your assets, your income, your risk tolerance, and your state's requirements. A simple rule: insure for enough to replace what you'd lose and protect what you'd owe. Our agents will walk through your specific situation and recommend coverage that fits without overcharging. No pressure — just an honest conversation.",
      },
      {
        q: "Can I bundle multiple insurance policies together?",
        a: "Yes — and it's one of the easiest ways to save money. Bundling your home and auto (or multiple commercial policies) with the same carrier typically saves 10–25% on both. We'll look at what you currently have and find bundling options that make sense for your needs.",
      },
      {
        q: "What should I do when I need to file a claim?",
        a: "First, make sure everyone is safe and document the damage with photos. Then contact your insurance carrier's claims line directly — the number is on your policy documents. Your agent can also help guide you through the process. At Ativa, we stay available to answer questions even after you've purchased your policy — that's part of the service.",
      },
    ],
  },

  {
    id: "auto",
    title: "Auto Insurance",
    icon: "🚗",
    items: [
      {
        q: "Is auto insurance required in Florida?",
        a: "Yes. Florida requires all registered vehicles to carry at least Personal Injury Protection (PIP) and Property Damage Liability (PDL). Florida is a no-fault state, meaning your own PIP coverage pays for your injuries regardless of who caused the accident. We can help you meet the state minimum and also make sure you have enough coverage to protect yourself beyond the basics.",
      },
      {
        q: "What are the minimum auto insurance requirements in Florida?",
        a: "Florida requires a minimum of $10,000 in Personal Injury Protection (PIP) and $10,000 in Property Damage Liability (PDL). These minimums are low — a single accident can easily exceed them. We strongly recommend higher limits and uninsured motorist coverage, especially in Florida where the rate of uninsured drivers is among the highest in the nation.",
      },
      {
        q: "What is PIP (Personal Injury Protection) coverage?",
        a: "PIP covers your medical expenses and lost wages after an accident, regardless of who was at fault. In Florida, it pays up to 80% of medical bills and 60% of lost wages up to your policy limit. PIP is mandatory in Florida and applies to you, your household members, and any passengers who don't have their own PIP coverage. Want to make sure your PIP limits are right? We can review your options.",
      },
      {
        q: "What's the difference between comprehensive and collision coverage?",
        a: "Collision covers damage to your vehicle when you hit another car or object. Comprehensive covers everything else — theft, vandalism, weather damage, hitting an animal, falling objects, and more. Together they're called 'full coverage.' Whether you need both depends on your vehicle's value, your loan or lease requirements, and your budget. Our agents can help you decide what makes sense.",
      },
      {
        q: "Does my credit score affect my auto insurance rate?",
        a: "In most states — including Florida — insurers use a credit-based insurance score as one factor when calculating your premium. A higher credit score typically results in lower premiums. This is different from your credit score for loans; it's a separate model specifically tied to insurance risk prediction. If your credit has improved, it may be worth shopping for new rates. We can run quotes across multiple carriers at once.",
      },
      {
        q: "What should I do immediately after a car accident?",
        a: "Check for injuries and call 911 if anyone is hurt. Move to a safe location if possible, then exchange information with the other driver: name, phone, license number, insurance company and policy number. Take photos of both vehicles and the scene. File a police report when possible. Then notify your insurance company. If you're not sure who to call first, your Ativa agent can help you navigate the process.",
      },
      {
        q: "Can I insure a car I don't own?",
        a: "Generally, auto insurance follows the vehicle, not the driver. If you regularly drive a car you don't own, you can be added as a listed driver on the owner's policy — or you may be covered as a permissive driver. Non-owner auto insurance is also an option for people who frequently drive rental or borrowed vehicles. We can help you figure out which setup makes sense for your situation.",
      },
      {
        q: "Will my auto insurance rates go up after I file a claim?",
        a: "It depends on the claim type, your carrier, and your history. At-fault accidents typically cause a rate increase at renewal. Not-at-fault claims and comprehensive claims (like weather damage) may not affect your rate as much, depending on your carrier. Some policies include accident forgiveness. Shopping for a new policy before your renewal is often worth it — we compare rates for you at no charge.",
      },
    ],
  },

  {
    id: "home",
    title: "Home Insurance",
    icon: "🏠",
    items: [
      {
        q: "What does a standard homeowners insurance policy cover?",
        a: "A standard HO-3 homeowners policy covers your dwelling (the structure), other structures on your property (like a garage or fence), your personal belongings, liability if someone is injured on your property, and loss of use (living expenses if your home becomes uninhabitable). It does NOT cover flood or earthquake damage by default. If you're wondering whether your current policy has the right coverage, we're happy to review it with you.",
      },
      {
        q: "Is flood insurance included in homeowners insurance?",
        a: "No — standard homeowners policies explicitly exclude flood damage. Flood insurance is a separate policy, available through the National Flood Insurance Program (NFIP) or private carriers. In Florida, even properties not in a designated flood zone are at risk. The 30-day waiting period on most NFIP policies means you shouldn't wait until storm season to think about it. We can quote flood insurance quickly — get a quote in under 2 minutes.",
      },
      {
        q: "What is replacement cost vs. actual cash value?",
        a: "Replacement cost pays to rebuild or replace your property at today's prices — no depreciation. Actual cash value pays only what your property is worth today, accounting for age and wear. For most homeowners, replacement cost coverage is worth the small premium difference. After a major loss, the difference between the two can mean tens of thousands of dollars. We'll make sure you have the right option.",
      },
      {
        q: "How much homeowners insurance do I need?",
        a: "You need enough coverage to fully rebuild your home at current construction costs — not its market value. Many homeowners are underinsured because they base coverage on what they paid for the house, which includes land (which can't burn down). Our free Replacement Cost Estimator can help you find the right number in under 2 minutes. An Ativa agent will follow up with a personalized quote.",
      },
      {
        q: "What is a home inventory and why is it important?",
        a: "A home inventory is a documented list of everything you own — furniture, electronics, clothing, jewelry, and more — along with their estimated values. If you ever file a claim for stolen or destroyed belongings, a home inventory makes the process faster and ensures you get properly reimbursed. You can use a smartphone video walkthrough as your inventory. Don't wait for a loss to discover you weren't adequately covered.",
      },
      {
        q: "Does homeowners insurance cover hurricane damage in Florida?",
        a: "Standard homeowners policies typically cover wind damage from hurricanes. However, flood damage from storm surge is NOT covered — that requires separate flood insurance. Many Florida policies also carry a hurricane deductible (separate from your regular deductible) that applies specifically to named storms. It's important to know exactly what your policy covers before hurricane season. Our agents can walk you through your coverage in plain language.",
      },
      {
        q: "What is covered under 'other structures' in my homeowners policy?",
        a: "Other structures coverage protects detached structures on your property that aren't the main dwelling — like a detached garage, fence, shed, pool enclosure, or pergola. Standard policies typically cover other structures at 10% of your dwelling coverage limit. If you have significant structures, you may want to increase this. It's an easy thing to miss until you need it.",
      },
      {
        q: "What's the difference between an HO-3 and an HO-6 policy?",
        a: "An HO-3 is a standard homeowners policy for single-family homes. It covers the structure on an open-perils basis (covers everything except what's specifically excluded). An HO-6 is a condo unit policy — it covers only the interior of your unit (walls, floors, fixtures, appliances, personal belongings) since your HOA's master policy covers the building exterior and common areas. Condo owners typically need significantly less coverage than homeowners. Want to see what the right amount looks like for your unit?",
      },
    ],
  },

  {
    id: "renters",
    title: "Renters Insurance",
    icon: "🏢",
    items: [
      {
        q: "Why do I need renters insurance if my landlord has insurance?",
        a: "Your landlord's insurance covers the building — not your belongings. If there's a fire, theft, or water damage, your landlord's policy won't pay to replace your furniture, electronics, clothing, or other personal property. Renters insurance covers your stuff, your liability, and your temporary housing if your unit becomes uninhabitable. Most policies cost less than $20/month. Want to see what it would cost? Get a free quote in under 2 minutes.",
      },
      {
        q: "What does renters insurance typically cover?",
        a: "Renters insurance covers three main things: personal property (your belongings, even when you're traveling), personal liability (if someone is injured in your apartment or you accidentally damage someone else's property), and loss of use (hotel and living expenses if your unit becomes uninhabitable due to a covered loss). Some policies also cover identity theft and high-value items like jewelry or electronics. Our agents can help you find the right level of coverage for what you own.",
      },
      {
        q: "How much does renters insurance typically cost?",
        a: "Renters insurance is one of the most affordable insurance products available. Most policies run $15–$30 per month depending on your location, the amount of coverage, and your deductible. In Florida, rates can vary — but it's almost always worth the cost. As an independent agency, we compare multiple carriers to find the best rate for you.",
      },
      {
        q: "Does my renters insurance cover my roommate?",
        a: "Not automatically. A standard renters insurance policy covers the named insured and their family members living in the unit. A roommate is NOT covered under your policy unless they are specifically listed as an additional insured. Your roommate should get their own renters policy — it's inexpensive and protects them separately. We can quote both of you at the same time.",
      },
      {
        q: "What is 'loss of use' coverage in a renters insurance policy?",
        a: "Loss of use (also called additional living expenses) pays for your hotel, meals, and other living costs if a covered loss — like a fire or severe water damage — forces you out of your apartment. Coverage typically applies until your unit is repaired or until the policy limit is exhausted. This is one of the most valuable features of renters insurance that most people don't think about until they need it.",
      },
      {
        q: "Does renters insurance cover theft of my car?",
        a: "Renters insurance covers personal property stolen from your car — like a laptop or bag left on the seat — but it does NOT cover the car itself. Theft of the vehicle is covered by your auto insurance under the comprehensive portion of your policy. If you have both auto and renters insurance, we can often bundle them for a discount. Want to check your rates?",
      },
    ],
  },

  {
    id: "commercial",
    title: "Commercial & Business Insurance",
    icon: "🏗️",
    items: [
      {
        q: "What insurance does my small business need?",
        a: "Most small businesses need at minimum: general liability (to protect against third-party injury and property damage claims), commercial property (if you have a physical space or equipment), and workers' compensation (if you have employees). Depending on your industry, you may also need professional liability, commercial auto, or cyber coverage. We specialize in small business insurance — tell us about your business and we'll build the right package.",
      },
      {
        q: "What is a Business Owner Policy (BOP)?",
        a: "A BOP bundles general liability and commercial property insurance into a single, affordable policy designed for small to mid-size businesses. It's typically less expensive than buying the coverages separately. Some BOPs can also include business interruption coverage. A BOP is a great starting point for most service businesses, retail stores, and offices. Want to see if your business qualifies and what it would cost?",
      },
      {
        q: "What is general liability insurance and why does my business need it?",
        a: "General liability (GL) covers your business against claims of bodily injury or property damage caused by your operations, products, or employees. For example: a customer slips in your store, a contractor damages a client's property, or someone sues you for advertising injury. Without GL, you'd pay defense costs and any settlement out of pocket. Many clients, landlords, and contracts require proof of GL before they'll work with you.",
      },
      {
        q: "Is workers' compensation required for businesses in Florida?",
        a: "In Florida, most businesses with 4 or more employees (full or part-time) are required to carry workers' compensation. Construction companies must carry it with even 1 employee. Workers' comp covers medical expenses and lost wages for employees injured on the job — and it protects the employer from employee lawsuits related to workplace injuries. We can get you compliant quickly and affordably.",
      },
      {
        q: "What is professional liability (E&O) insurance?",
        a: "Professional liability, also called Errors & Omissions (E&O), protects service businesses from claims that their professional advice, services, or work caused a client financial harm. It's essential for consultants, accountants, lawyers, real estate agents, IT professionals, and many others. Even if you didn't make a mistake, defending a lawsuit is expensive. E&O covers legal defense even if the claim is groundless.",
      },
      {
        q: "What is cyber liability insurance and does my business need it?",
        a: "Cyber liability insurance covers your business if it experiences a data breach, ransomware attack, or cyber theft. It pays for notifying affected customers, credit monitoring services, legal fees, regulatory fines, and business interruption losses. If your business stores customer data — emails, payment info, health records — you have cyber exposure. Even small businesses are targeted. Our agents can explain your risk and find affordable coverage.",
      },
      {
        q: "What's the difference between a BOP and a Commercial Package Policy?",
        a: "A BOP is a pre-packaged policy designed for small businesses with limited customization. A Commercial Package Policy (CPP) is more flexible and can be tailored for larger, more complex businesses with specialized needs. If you're a small business with straightforward operations, a BOP is usually the right fit. If you have unique exposures or higher revenue, a CPP may be better. We'll help you decide which makes sense for your operation.",
      },
      {
        q: "What happens to my business insurance if I hire more employees?",
        a: "Adding employees can affect your workers' compensation premium (it's often calculated per $100 of payroll), your general liability rates, and possibly your BOP. You're generally required to notify your insurer of significant changes in operations. The good news: adding staff shows your business is growing, and we can update your coverage quickly to stay compliant and properly protected.",
      },
    ],
  },

  {
    id: "trucking",
    title: "Trucking & Commercial Auto",
    icon: "🚛",
    items: [
      {
        q: "What insurance do I need for my commercial truck?",
        a: "Commercial trucks typically require primary liability (covering damage to others), physical damage coverage (collision and comprehensive for your truck), motor truck cargo insurance (covering the goods you haul), and, if you operate across state lines, you'll need to meet FMCSA filing requirements. Owner-operators may also need non-trucking liability for when the truck is off-duty. We specialize in trucking insurance — tell us what you haul and where, and we'll put together the right coverage.",
      },
      {
        q: "What is motor carrier insurance?",
        a: "Motor carrier insurance provides the primary liability coverage required for commercial vehicles operating under a carrier authority (USDOT and MC number). It protects against claims when your truck causes injury or property damage to others. The minimum FMCSA requirement is $750,000 for most freight and $1 million for hazardous materials. Our agents work with carriers who specialize in trucking — we'll get you the right coverage to stay compliant.",
      },
      {
        q: "Do I need separate insurance coverage for each truck in my fleet?",
        a: "Not necessarily. A fleet policy covers multiple vehicles under a single policy, which is typically more cost-effective and easier to manage than individual policies for each truck. Rates are based on the size and type of vehicles, driver history, cargo type, and operating territory. Even if you only have two or three trucks, a fleet policy may offer better rates and simplified management. Let's compare your options.",
      },
      {
        q: "What is cargo insurance and is it required?",
        a: "Cargo insurance (motor truck cargo) covers the freight you're hauling if it's damaged, stolen, or lost while in your custody. It's not always legally required, but many shippers and brokers require it as a condition of contracting. Coverage limits and exclusions vary — some policies exclude certain commodities. We'll make sure your cargo coverage matches what you actually haul, so there are no surprises at claim time.",
      },
      {
        q: "What is non-trucking liability (bobtail) coverage?",
        a: "Non-trucking liability (NTL), also called bobtail insurance, covers an owner-operator when driving their truck for personal use — not under dispatch or on behalf of the motor carrier. Your primary motor carrier policy may not cover you when you're off-duty. NTL fills that gap. It's an inexpensive but critical coverage for owner-operators. If you're not sure whether your current setup has this gap, our agents can check.",
      },
      {
        q: "How are commercial truck insurance rates calculated?",
        a: "Rates depend on several factors: the type and size of the vehicle, what you haul (commodity type), how far you operate (local, regional, or long-haul), your driving record and years of CDL experience, your loss history (prior claims), and the coverage limits you choose. Owner-operators with clean records and consistent experience generally get the best rates. We work with multiple trucking-specialized carriers to find the most competitive pricing for your profile.",
      },
    ],
  },

  {
    id: "about",
    title: "About Ativa Insurance",
    icon: "ℹ️",
    items: [
      {
        q: "Where is Ativa Insurance located?",
        a: "Our office is located at 2412 Irwin St, Suite 372, Melbourne, FL 32901. We serve clients in-person, by phone, by email, and via WhatsApp — so no matter where you are in our licensed states, we can help. Call us at 561-946-8261 or message us on WhatsApp anytime.",
      },
      {
        q: "What states does Ativa Insurance operate in?",
        a: "We are currently licensed and operating in Connecticut, Florida, Georgia, Maryland, Massachusetts, New Jersey, North Carolina, Ohio, Pennsylvania, South Carolina, and Tennessee. Florida is our primary and most active market, where we specialize in home, auto, flood, and commercial insurance. If you're in one of those states and looking for coverage, we'd love to help.",
      },
      {
        q: "What languages does Ativa Insurance serve clients in?",
        a: "We serve clients in English, Portuguese, and Spanish. Our founder has deep roots in the Brazilian community in Florida, and our team is equipped to assist clients who are more comfortable in Portuguese or Spanish. Insurance documents and explanations can be confusing enough in your first language — we want to remove that barrier entirely.",
      },
      {
        q: "How do I get a quote from Ativa Insurance?",
        a: "The fastest way is to click any product card on our homepage and complete the short intake form — it takes under 2 minutes. You can also call us at 561-946-8261, send us a message on WhatsApp, or chat with our AI assistant on the site. We'll get back to you with personalized options, usually within one business day.",
      },
      {
        q: "How long does it take to get insured through Ativa?",
        a: "It depends on the product. Auto insurance can often be bound same-day. Homeowners, renters, and condo coverage is typically 1–2 business days. Commercial policies may take 2–5 business days depending on complexity. We move as fast as the carriers allow — and we'll always keep you informed of your status. If you have a deadline, tell us and we'll prioritize your file.",
      },
      {
        q: "What makes Ativa Insurance different from other insurance agencies?",
        a: "Three things: we're independent (we shop multiple carriers, not just one), we're bilingual (English, Portuguese, and Spanish), and we're built for communities that are often underserved by traditional agencies — particularly Florida's Brazilian and Hispanic families and small business owners. We're not here to sell you the most expensive policy. We're here to find you the right one. That's it.",
      },
    ],
  },
];

// ─── PORTUGUESE ────────────────────────────────────────────────────────────────

const pt: FAQSection[] = [
  {
    id: "general",
    title: "Seguros em Geral",
    icon: "🛡️",
    items: [
      {
        q: "O que é uma agência de seguros independente?",
        a: "Uma agência independente como a Ativa Insurance trabalha com várias seguradoras — não apenas uma. Isso significa que cotamos em seu nome para encontrar a melhor cobertura pelo melhor preço. Não temos vínculo com nenhuma empresa específica, então nossa lealdade é sempre com você. Se quiser comparar sua cobertura atual, estamos prontos para ajudar.",
      },
      {
        q: "Qual a diferença entre um agente e um corretor de seguros?",
        a: "Em muitos estados os termos são usados de forma intercambiável, mas a distinção importa: um agente pode emitir apólices em nome da seguradora, enquanto um corretor compara coberturas mas pode não emitir diretamente. Como agência independente, atuamos como agentes de várias seguradoras — oferecendo a você a liberdade de escolha de um corretor com o serviço de um agente. Quer ver o que conseguimos para sua situação?",
      },
      {
        q: "O que significa 'cobertura de responsabilidade civil'?",
        a: "A responsabilidade civil paga por danos ou lesões que você causa a outras pessoas ou à propriedade delas. Por exemplo, se você causar um acidente de carro, sua cobertura paga o conserto do outro veículo e as despesas médicas do outro motorista. Sem ela, você pagaria esses custos do próprio bolso. Não tem certeza se seus limites estão adequados? Nossos agentes revisam sua cobertura sem custo algum.",
      },
      {
        q: "O que é uma franquia e como funciona?",
        a: "A franquia é o valor que você paga do próprio bolso antes de o seguro entrar em ação. Por exemplo, com uma franquia de $1.000 em um sinistro de $5.000, a seguradora paga $4.000 e você paga $1.000. Franquias mais altas geralmente significam prêmios menores — e franquias menores significam menos gastos quando algo acontece. Podemos ajudá-lo a encontrar o equilíbrio certo para seu orçamento.",
      },
      {
        q: "O que é um prêmio de seguro?",
        a: "O prêmio é o valor que você paga pela sua apólice — mensal, trimestral ou anualmente. Ele é calculado com base no seu perfil de risco: localização, histórico de sinistros, valor da cobertura e muitos outros fatores. Como agência independente, comparamos tarifas de várias seguradoras para encontrar o menor prêmio para sua cobertura.",
      },
      {
        q: "Como saber de quanto seguro preciso?",
        a: "Suas necessidades dependem do que você está protegendo — seus bens, sua renda, sua tolerância ao risco e os requisitos do seu estado. Uma regra simples: segurar o suficiente para repor o que você perderia e proteger o que você deveria. Nossos agentes analisam sua situação específica e recomendam a cobertura certa sem cobrar a mais. Sem pressão — apenas uma conversa honesta.",
      },
      {
        q: "Posso combinar várias apólices de seguro?",
        a: "Sim — e é uma das maneiras mais fáceis de economizar. Combinar casa e auto (ou várias apólices comerciais) na mesma seguradora geralmente economiza 10–25% em ambas. Analisamos o que você já tem e encontramos as melhores opções de combinação para suas necessidades.",
      },
      {
        q: "O que devo fazer quando preciso acionar o seguro?",
        a: "Primeiro, garanta que todos estejam seguros e documente os danos com fotos. Depois, entre em contato diretamente com a central de sinistros da sua seguradora — o número está nos documentos da sua apólice. Seu agente também pode orientá-lo pelo processo. Na Ativa, estamos disponíveis para tirar dúvidas mesmo depois que você já comprou sua apólice — isso faz parte do serviço.",
      },
    ],
  },
  {
    id: "auto",
    title: "Seguro Auto",
    icon: "🚗",
    items: [
      {
        q: "O seguro de carro é obrigatório na Flórida?",
        a: "Sim. A Flórida exige que todos os veículos registrados tenham no mínimo PIP (Personal Injury Protection) e PDL (Property Damage Liability). A Flórida é um estado de \"no-fault\", o que significa que seu próprio PIP cobre suas lesões independentemente de quem causou o acidente. Podemos ajudá-lo a atender o mínimo exigido e também garantir que você tenha cobertura suficiente além do básico.",
      },
      {
        q: "Quais são os requisitos mínimos de seguro auto na Flórida?",
        a: "A Flórida exige no mínimo $10.000 em PIP e $10.000 em PDL. Esses limites são baixos — um único acidente pode facilmente ultrapassá-los. Recomendamos fortemente limites mais altos e cobertura contra motoristas sem seguro, especialmente na Flórida, onde a taxa de motoristas sem seguro está entre as mais altas do país.",
      },
      {
        q: "O que é cobertura PIP (Personal Injury Protection)?",
        a: "O PIP cobre suas despesas médicas e salários perdidos após um acidente, independentemente de quem teve culpa. Na Flórida, ele paga até 80% das despesas médicas e 60% dos salários perdidos até o limite da apólice. O PIP é obrigatório na Flórida e se aplica a você, aos membros da sua família e a qualquer passageiro que não tenha seu próprio PIP. Quer verificar se seus limites de PIP estão corretos?",
      },
      {
        q: "Qual a diferença entre cobertura abrangente (comprehensive) e colisão?",
        a: "A colisão cobre danos ao seu veículo quando você bate em outro carro ou objeto. A cobertura abrangente cobre todo o resto — roubo, vandalismo, danos climáticos, atropelamento de animal, objetos caindo e mais. Juntas, formam a chamada \"cobertura total\". Se você precisa de ambas depende do valor do veículo, dos requisitos do financiamento e do seu orçamento. Nossos agentes ajudam você a decidir o que faz sentido.",
      },
      {
        q: "Minha pontuação de crédito afeta minha taxa de seguro auto?",
        a: "Na maioria dos estados — incluindo a Flórida — as seguradoras usam uma pontuação de crédito para seguro como um dos fatores no cálculo do prêmio. Uma pontuação mais alta geralmente resulta em prêmios menores. Se seu crédito melhorou, pode valer a pena buscar novas cotações. Podemos comparar tarifas de várias seguradoras de uma só vez.",
      },
      {
        q: "O que devo fazer imediatamente após um acidente de carro?",
        a: "Verifique se há feridos e ligue para o 911 se alguém estiver machucado. Mova-se para um local seguro se possível, depois troque informações com o outro motorista: nome, telefone, número de habilitação, seguradora e número de apólice. Tire fotos dos dois veículos e do local. Registre um boletim de ocorrência quando possível. Depois notifique sua seguradora. Se não souber a quem ligar primeiro, seu agente da Ativa pode orientá-lo.",
      },
      {
        q: "Posso fazer seguro de um carro que não é meu?",
        a: "Em geral, o seguro auto segue o veículo, não o motorista. Se você dirige regularmente um carro que não é seu, pode ser adicionado como motorista listado na apólice do proprietário — ou pode estar coberto como motorista com permissão. O seguro de não-proprietário também é uma opção para pessoas que frequentemente dirigem carros alugados ou emprestados. Podemos ajudá-lo a descobrir qual configuração faz sentido para sua situação.",
      },
      {
        q: "Minha taxa de seguro auto vai aumentar depois de um sinistro?",
        a: "Depende do tipo de sinistro, da sua seguradora e do seu histórico. Acidentes com sua culpa geralmente causam aumento da taxa na renovação. Sinistros sem culpa sua e sinistros abrangentes (como danos por clima) podem não afetar tanto a taxa, dependendo da seguradora. Algumas apólices incluem perdão de acidente. Vale a pena comparar tarifas antes da renovação — fazemos isso para você sem custo.",
      },
    ],
  },
  {
    id: "home",
    title: "Seguro Residencial",
    icon: "🏠",
    items: [
      {
        q: "O que um seguro residencial padrão cobre?",
        a: "Uma apólice residencial padrão HO-3 cobre sua casa (a estrutura), outras construções na propriedade (como garagem ou cerca), seus pertences pessoais, responsabilidade civil caso alguém se machuque em sua propriedade e perda de uso (despesas de moradia se a casa ficar inabitável). Ela NÃO cobre danos por inundação ou terremoto por padrão. Se quiser revisar se sua apólice atual tem a cobertura certa, estamos à disposição.",
      },
      {
        q: "O seguro contra inundação está incluído no seguro residencial?",
        a: "Não — as apólices residenciais padrão excluem explicitamente danos por inundação. O seguro contra inundação é uma apólice separada, disponível pelo NFIP ou por seguradoras privadas. Na Flórida, mesmo imóveis fora de zonas de risco estão em perigo. O período de espera de 30 dias da maioria das apólices do NFIP significa que você não deve esperar a temporada de furacões para pensar nisso. Cotamos seguro contra inundação rapidamente.",
      },
      {
        q: "O que é custo de reposição versus valor de mercado atual?",
        a: "O custo de reposição paga para reconstruir ou substituir sua propriedade pelos preços atuais — sem depreciação. O valor de mercado atual paga apenas o que sua propriedade vale hoje, considerando a idade e o desgaste. Para a maioria dos proprietários, a cobertura pelo custo de reposição vale a pequena diferença de prêmio. Após uma perda significativa, a diferença pode representar dezenas de milhares de dólares.",
      },
      {
        q: "Quanto de seguro residencial preciso?",
        a: "Você precisa de cobertura suficiente para reconstruir totalmente sua casa pelos custos de construção atuais — não pelo valor de mercado. Muitos proprietários estão sub-segurados porque baseiam a cobertura no que pagaram pela casa, que inclui o terreno (que não pode pegar fogo). Nossa Calculadora de Custo de Reposição gratuita ajuda você a encontrar o número certo em menos de 2 minutos.",
      },
      {
        q: "O que é um inventário doméstico e por que é importante?",
        a: "Um inventário doméstico é uma lista documentada de tudo o que você possui — móveis, eletrônicos, roupas, joias e mais — com seus valores estimados. Se você precisar acionar o seguro por furto ou destruição de pertences, um inventário torna o processo mais rápido e garante que você seja reembolsado adequadamente. Um vídeo pelo celular percorrendo a casa já serve como inventário.",
      },
      {
        q: "O seguro residencial cobre danos de furacão na Flórida?",
        a: "As apólices residenciais padrão geralmente cobrem danos causados pelo vento de furacões. Porém, danos por inundação de maré de tempestade NÃO são cobertos — isso requer seguro contra inundação separado. Muitas apólices na Flórida têm uma franquia de furacão separada que se aplica especificamente a tempestades nomeadas. É importante saber exatamente o que sua apólice cobre antes da temporada de furacões.",
      },
      {
        q: "O que está coberto em 'outras estruturas' na minha apólice?",
        a: "A cobertura de outras estruturas protege construções separadas na sua propriedade que não são a residência principal — como garagem separada, cerca, galpão, área de lazer coberta ou pergolado. As apólices padrão geralmente cobrem outras estruturas em 10% do limite de cobertura da residência. Se você tem estruturas significativas, pode querer aumentar esse valor.",
      },
      {
        q: "Qual a diferença entre uma apólice HO-3 e HO-6?",
        a: "A HO-3 é a apólice residencial padrão para casas unifamiliares. Ela cobre a estrutura em base aberta (cobre tudo exceto o que é especificamente excluído). A HO-6 é uma apólice para unidades condominiais — cobre apenas o interior da sua unidade (paredes, pisos, acessórios, eletrodomésticos, pertences pessoais) pois a apólice mestra do seu condomínio cobre o exterior e as áreas comuns. Proprietários de condomínios geralmente precisam de significativamente menos cobertura.",
      },
    ],
  },
  {
    id: "renters",
    title: "Seguro para Inquilinos",
    icon: "🏢",
    items: [
      {
        q: "Por que preciso de seguro para inquilinos se o proprietário tem seguro?",
        a: "O seguro do proprietário cobre o prédio — não seus pertences. Se houver incêndio, roubo ou dano por água, a apólice do proprietário não vai pagar para substituir seus móveis, eletrônicos, roupas ou outros bens pessoais. O seguro para inquilinos cobre seus pertences, sua responsabilidade civil e sua moradia temporária se a unidade ficar inabitável. A maioria das apólices custa menos de $20/mês.",
      },
      {
        q: "O que o seguro para inquilinos geralmente cobre?",
        a: "O seguro para inquilinos cobre três coisas principais: bens pessoais (seus pertences, mesmo quando você está viajando), responsabilidade civil pessoal (se alguém se machucar no seu apartamento ou você danificar a propriedade de alguém) e perda de uso (hotel e despesas de moradia se sua unidade ficar inabitável). Algumas apólices também cobrem roubo de identidade e itens de alto valor como joias ou eletrônicos.",
      },
      {
        q: "Quanto custa o seguro para inquilinos?",
        a: "O seguro para inquilinos é um dos produtos de seguro mais acessíveis disponíveis. A maioria das apólices custa entre $15 e $30 por mês dependendo da sua localização, do valor da cobertura e da franquia. Como agência independente, comparamos várias seguradoras para encontrar a melhor tarifa para você.",
      },
      {
        q: "O meu seguro para inquilinos cobre meu colega de quarto?",
        a: "Não automaticamente. Uma apólice padrão cobre o segurado nomeado e os membros da família que moram na unidade. Um colega de quarto NÃO está coberto pela sua apólice, a menos que seja especificamente listado como segurado adicional. Seu colega deve obter sua própria apólice — é barata e o protege separadamente. Podemos cotá-los para os dois ao mesmo tempo.",
      },
      {
        q: "O que é cobertura de 'perda de uso' em uma apólice de inquilino?",
        a: "A perda de uso (também chamada de despesas de moradia adicionais) paga pelo hotel, refeições e outros custos de moradia se uma perda coberta — como um incêndio ou dano grave por água — forçar você a sair do apartamento. A cobertura geralmente se aplica até que sua unidade seja reparada ou até o limite da apólice ser esgotado. Este é um dos recursos mais valiosos do seguro para inquilinos.",
      },
      {
        q: "O seguro para inquilinos cobre o roubo do meu carro?",
        a: "O seguro para inquilinos cobre objetos pessoais roubados do seu carro — como um laptop ou bolsa deixada no banco — mas NÃO cobre o veículo em si. O roubo do veículo é coberto pelo seu seguro auto na parte abrangente (comprehensive) da apólice. Se você tem seguro auto e seguro para inquilinos, muitas vezes podemos combiná-los para obter desconto.",
      },
    ],
  },
  {
    id: "commercial",
    title: "Seguro Empresarial",
    icon: "🏗️",
    items: [
      {
        q: "Quais seguros minha pequena empresa precisa?",
        a: "A maioria das pequenas empresas precisa no mínimo de: responsabilidade geral (para proteger contra reclamações de lesões de terceiros e danos à propriedade), propriedade comercial (se você tiver espaço físico ou equipamentos) e compensação dos trabalhadores (se tiver funcionários). Dependendo do seu setor, você também pode precisar de responsabilidade profissional, auto comercial ou cobertura cibernética. Conte-nos sobre seu negócio e montamos o pacote certo.",
      },
      {
        q: "O que é uma Apólice Empresarial (BOP)?",
        a: "Uma BOP combina responsabilidade geral e seguro de propriedade comercial em uma única apólice acessível projetada para pequenas e médias empresas. Em geral é menos cara do que comprar as coberturas separadamente. Algumas BOP também incluem cobertura de interrupção de negócios. É um ótimo ponto de partida para a maioria das empresas de serviços, lojas de varejo e escritórios.",
      },
      {
        q: "O que é responsabilidade geral e por que minha empresa precisa?",
        a: "A responsabilidade geral (GL) cobre sua empresa contra reclamações de lesões corporais ou danos à propriedade causados por suas operações, produtos ou funcionários. Por exemplo: um cliente escorrega na sua loja, um empreiteiro danifica a propriedade de um cliente, ou alguém processa você por dano de publicidade. Sem GL, você pagaria os custos de defesa e qualquer acordo do próprio bolso.",
      },
      {
        q: "A compensação dos trabalhadores é obrigatória para empresas na Flórida?",
        a: "Na Flórida, a maioria das empresas com 4 ou mais funcionários (em tempo integral ou parcial) é obrigada a ter compensação dos trabalhadores. Empresas de construção devem tê-la mesmo com apenas 1 funcionário. A workers' comp cobre despesas médicas e salários perdidos de funcionários acidentados no trabalho — e protege o empregador de processos relacionados a lesões no local de trabalho.",
      },
      {
        q: "O que é seguro de responsabilidade profissional (E&O)?",
        a: "A responsabilidade profissional, também chamada de Errors & Omissions (E&O), protege empresas de serviços contra reclamações de que seu conselho, serviços ou trabalho profissional causou prejuízo financeiro a um cliente. É essencial para consultores, contadores, advogados, corretores de imóveis, profissionais de TI e muitos outros. Mesmo que você não tenha cometido um erro, defender um processo é caro. O E&O cobre a defesa legal mesmo que a reclamação seja infundada.",
      },
      {
        q: "O que é seguro de responsabilidade cibernética e minha empresa precisa disso?",
        a: "O seguro de responsabilidade cibernética cobre sua empresa em caso de violação de dados, ataque de ransomware ou roubo cibernético. Ele paga pela notificação de clientes afetados, serviços de monitoramento de crédito, honorários advocatícios, multas regulatórias e perdas por interrupção de negócios. Se sua empresa armazena dados de clientes — e-mails, informações de pagamento, registros de saúde — você tem exposição cibernética.",
      },
      {
        q: "Qual a diferença entre BOP e Apólice de Pacote Comercial?",
        a: "Uma BOP é uma apólice pré-formatada para pequenas empresas com personalização limitada. Uma Apólice de Pacote Comercial (CPP) é mais flexível e pode ser adaptada para empresas maiores com necessidades especializadas. Se você é uma pequena empresa com operações diretas, uma BOP geralmente é a opção certa. Se você tem exposições únicas ou receita maior, uma CPP pode ser mais adequada.",
      },
      {
        q: "O que acontece com meu seguro empresarial se eu contratar mais funcionários?",
        a: "Adicionar funcionários pode afetar seu prêmio de workers' comp (muitas vezes calculado por $100 de folha de pagamento), suas tarifas de responsabilidade geral e possivelmente sua BOP. Geralmente você é obrigado a notificar sua seguradora sobre mudanças significativas nas operações. A boa notícia: adicionar funcionários mostra que seu negócio está crescendo, e podemos atualizar sua cobertura rapidamente.",
      },
    ],
  },
  {
    id: "trucking",
    title: "Caminhões e Auto Comercial",
    icon: "🚛",
    items: [
      {
        q: "Que seguro preciso para meu caminhão comercial?",
        a: "Caminhões comerciais geralmente exigem: responsabilidade primária (cobrindo danos a terceiros), cobertura de danos físicos (colisão e abrangente para seu caminhão), seguro de carga (cobrindo as mercadorias transportadas) e, se você opera entre estados, precisará atender aos requisitos de registro da FMCSA. Proprietários-operadores também podem precisar de responsabilidade não-transporte para quando o caminhão está fora de serviço. Especializamo-nos em seguro para caminhões.",
      },
      {
        q: "O que é seguro de transportadora motorizada (motor carrier)?",
        a: "O seguro de transportadora fornece a cobertura de responsabilidade primária exigida para veículos comerciais que operam sob autoridade de transportadora (número USDOT e MC). Protege contra reclamações quando seu caminhão causa lesões ou danos à propriedade de terceiros. O requisito mínimo da FMCSA é $750.000 para a maioria das cargas e $1 milhão para materiais perigosos.",
      },
      {
        q: "Preciso de seguro separado para cada caminhão da minha frota?",
        a: "Não necessariamente. Uma apólice de frota cobre múltiplos veículos em uma única apólice, o que geralmente é mais econômico e fácil de gerenciar do que apólices individuais para cada caminhão. As tarifas são baseadas no tamanho e tipo dos veículos, histórico dos motoristas, tipo de carga e território de operação. Mesmo que você tenha apenas dois ou três caminhões, uma apólice de frota pode oferecer melhores tarifas.",
      },
      {
        q: "O que é seguro de carga e é obrigatório?",
        a: "O seguro de carga cobre o frete que você transporta se for danificado, roubado ou perdido enquanto está sob sua custódia. Nem sempre é legalmente exigido, mas muitos embarcadores e corretores o exigem como condição para contratar. Os limites de cobertura e exclusões variam — algumas apólices excluem certas mercadorias. Garantimos que sua cobertura de carga corresponda ao que você realmente transporta.",
      },
      {
        q: "O que é cobertura de responsabilidade não-transporte (bobtail)?",
        a: "A responsabilidade não-transporte (NTL), também chamada de bobtail, cobre um proprietário-operador quando dirige seu caminhão para uso pessoal — não sob despacho ou em nome da transportadora. Sua apólice primária de transportadora pode não cobri-lo quando você está fora de serviço. A NTL preenche essa lacuna. É uma cobertura barata mas crítica para proprietários-operadores.",
      },
      {
        q: "Como são calculadas as taxas de seguro para caminhões comerciais?",
        a: "As taxas dependem de vários fatores: tipo e tamanho do veículo, o que você transporta, a distância de operação (local, regional ou longa distância), seu histórico de direção e anos de experiência com CDL, seu histórico de sinistros e os limites de cobertura escolhidos. Proprietários-operadores com histórico limpo geralmente obtêm as melhores tarifas. Trabalhamos com várias seguradoras especializadas em caminhões.",
      },
    ],
  },
  {
    id: "about",
    title: "Sobre a Ativa Insurance",
    icon: "ℹ️",
    items: [
      {
        q: "Onde fica a Ativa Insurance?",
        a: "Nosso escritório está localizado na 2412 Irwin St, Suite 372, Melbourne, FL 32901. Atendemos clientes pessoalmente, por telefone, e-mail e WhatsApp — então não importa onde você esteja nos estados onde temos licença, podemos ajudar. Ligue para 561-946-8261 ou nos mande mensagem no WhatsApp a qualquer momento.",
      },
      {
        q: "Em quais estados a Ativa Insurance atua?",
        a: "Estamos licenciados e atuando na Flórida, Geórgia, Carolina do Norte, Carolina do Sul, Nova Jersey, Pensilvânia, Connecticut, Massachusetts, Maryland, Ohio e Tennessee. A Flórida é nosso mercado principal e mais ativo, onde nos especializamos em seguro residencial, auto, inundação e comercial. Se você está em um desses estados e procura cobertura, adoraríamos ajudar.",
      },
      {
        q: "Em quais idiomas a Ativa Insurance atende seus clientes?",
        a: "Atendemos clientes em inglês, português e espanhol. Nossa fundadora tem raízes profundas na comunidade brasileira na Flórida, e nossa equipe está preparada para atender clientes que se sentem mais confortáveis em português ou espanhol. Seguro já é complicado o suficiente no seu próprio idioma — queremos eliminar essa barreira completamente.",
      },
      {
        q: "Como faço para obter uma cotação da Ativa Insurance?",
        a: "A maneira mais rápida é clicar em qualquer cartão de produto na nossa página inicial e preencher o formulário rápido — leva menos de 2 minutos. Você também pode ligar para 561-946-8261, nos enviar uma mensagem no WhatsApp ou conversar com nosso assistente de IA no site. Responderemos com opções personalizadas, geralmente em até um dia útil.",
      },
      {
        q: "Quanto tempo leva para ser segurado pela Ativa?",
        a: "Depende do produto. O seguro auto muitas vezes pode ser vinculado no mesmo dia. Coberturas residenciais, para inquilinos e condomínio geralmente levam 1–2 dias úteis. Apólices comerciais podem levar 2–5 dias úteis dependendo da complexidade. Agimos o mais rápido que as seguradoras permitem — e sempre mantemos você informado sobre o status do seu processo.",
      },
      {
        q: "O que diferencia a Ativa Insurance de outras agências?",
        a: "Três coisas: somos independentes (cotamos em várias seguradoras, não apenas uma), somos bilíngues (inglês, português e espanhol) e fomos criados para comunidades muitas vezes mal atendidas por agências tradicionais — especialmente famílias brasileiras e hispânicas na Flórida e pequenos empresários. Não estamos aqui para vender a apólice mais cara. Estamos aqui para encontrar a certa. É isso.",
      },
    ],
  },
];

// ─── SPANISH ──────────────────────────────────────────────────────────────────

const es: FAQSection[] = [
  {
    id: "general",
    title: "Seguros en General",
    icon: "🛡️",
    items: [
      {
        q: "¿Qué es una agencia de seguros independiente?",
        a: "Una agencia independiente como Ativa Insurance trabaja con múltiples aseguradoras — no solo una. Eso significa que buscamos en tu nombre para encontrar la mejor cobertura al mejor precio. No tenemos vínculo con ninguna empresa en particular, por lo que nuestra lealtad siempre es hacia ti. Si quieres que comparemos tu cobertura actual, con gusto te ayudamos.",
      },
      {
        q: "¿Cuál es la diferencia entre un agente y un corredor de seguros?",
        a: "En la mayoría de los estados los términos se usan de forma intercambiable, pero la distinción importa: un agente puede emitir pólizas en nombre de la aseguradora, mientras que un corredor compara coberturas pero puede no emitirlas directamente. Como agencia independiente, actuamos como agentes de múltiples aseguradoras — dándote la libertad de elección de un corredor con el servicio de un agente. ¿Quieres ver lo que podemos encontrar para tu situación?",
      },
      {
        q: "¿Qué significa 'cobertura de responsabilidad civil'?",
        a: "La responsabilidad civil paga por daños o lesiones que causes a otras personas o a su propiedad. Por ejemplo, si causas un accidente de auto, tu cobertura paga las reparaciones del otro vehículo y los gastos médicos del otro conductor. Sin ella, pagarías esos costos de tu propio bolsillo. ¿No estás seguro si tus límites son adecuados? Nuestros agentes revisan tu cobertura sin costo alguno.",
      },
      {
        q: "¿Qué es un deducible y cómo funciona?",
        a: "El deducible es el monto que pagas de tu bolsillo antes de que el seguro entre en acción. Por ejemplo, con un deducible de $1,000 en un reclamo de $5,000, la aseguradora paga $4,000 y tú pagas $1,000. Los deducibles más altos generalmente significan primas más bajas — y los más bajos significan menos gastos cuando algo sucede. Podemos ayudarte a encontrar el equilibrio correcto para tu presupuesto.",
      },
      {
        q: "¿Qué es una prima de seguro?",
        a: "La prima es el monto que pagas por tu póliza de seguro — mensual, trimestral o anualmente. Se calcula en base a tu perfil de riesgo: ubicación, historial de reclamos, monto de cobertura y muchos otros factores. Como agencia independiente, comparamos tarifas de múltiples aseguradoras para encontrar la prima más baja para tus necesidades de cobertura.",
      },
      {
        q: "¿Cómo sé cuánto seguro necesito?",
        a: "Tus necesidades dependen de lo que estás protegiendo — tus bienes, tus ingresos, tu tolerancia al riesgo y los requisitos de tu estado. Una regla simple: asegúrate por lo suficiente para reemplazar lo que perderías y proteger lo que deberías. Nuestros agentes analizan tu situación específica y recomiendan la cobertura adecuada sin cobrar de más. Sin presión — solo una conversación honesta.",
      },
      {
        q: "¿Puedo combinar múltiples pólizas de seguro?",
        a: "Sí — y es una de las maneras más fáciles de ahorrar dinero. Combinar tu hogar y auto (o múltiples pólizas comerciales) con la misma aseguradora generalmente ahorra entre 10–25% en ambas. Analizaremos lo que tienes actualmente y encontraremos opciones de combinación que tengan sentido para tus necesidades.",
      },
      {
        q: "¿Qué debo hacer cuando necesito presentar un reclamo?",
        a: "Primero, asegúrate de que todos estén seguros y documenta los daños con fotos. Luego contacta directamente la línea de reclamos de tu aseguradora — el número está en los documentos de tu póliza. Tu agente también puede orientarte en el proceso. En Ativa, estamos disponibles para responder preguntas incluso después de que hayas adquirido tu póliza — eso es parte del servicio.",
      },
    ],
  },
  {
    id: "auto",
    title: "Seguro de Auto",
    icon: "🚗",
    items: [
      {
        q: "¿Es obligatorio el seguro de auto en Florida?",
        a: "Sí. Florida requiere que todos los vehículos registrados tengan al menos PIP (Personal Injury Protection) y PDL (Property Damage Liability). Florida es un estado de \"no-fault\", lo que significa que tu propio PIP cubre tus lesiones independientemente de quién causó el accidente. Podemos ayudarte a cumplir con el mínimo estatal y también asegurarnos de que tengas cobertura suficiente más allá de lo básico.",
      },
      {
        q: "¿Cuáles son los requisitos mínimos de seguro de auto en Florida?",
        a: "Florida requiere un mínimo de $10,000 en PIP y $10,000 en PDL. Estos mínimos son bajos — un solo accidente puede superarlos fácilmente. Recomendamos encarecidamente límites más altos y cobertura contra conductores sin seguro, especialmente en Florida donde la tasa de conductores sin seguro está entre las más altas del país.",
      },
      {
        q: "¿Qué es la cobertura PIP (Personal Injury Protection)?",
        a: "El PIP cubre tus gastos médicos y salarios perdidos después de un accidente, independientemente de quién tuvo la culpa. En Florida, paga hasta el 80% de los gastos médicos y el 60% de los salarios perdidos hasta el límite de la póliza. El PIP es obligatorio en Florida y se aplica a ti, a los miembros de tu hogar y a cualquier pasajero que no tenga su propio PIP. ¿Quieres verificar si tus límites de PIP son correctos?",
      },
      {
        q: "¿Cuál es la diferencia entre cobertura comprensiva y cobertura de colisión?",
        a: "La colisión cubre daños a tu vehículo cuando chocas contra otro auto u objeto. La cobertura comprensiva cubre todo lo demás — robo, vandalismo, daños climáticos, atropellamiento de animales, objetos que caen y más. Juntas forman la llamada 'cobertura total'. Si necesitas ambas depende del valor del vehículo, los requisitos del financiamiento y tu presupuesto. Nuestros agentes te ayudan a decidir qué tiene sentido.",
      },
      {
        q: "¿Mi puntaje de crédito afecta mi tarifa de seguro de auto?",
        a: "En la mayoría de los estados — incluida Florida — las aseguradoras usan un puntaje de crédito para seguro como uno de los factores al calcular tu prima. Un puntaje más alto generalmente resulta en primas más bajas. Si tu crédito ha mejorado, puede valer la pena buscar nuevas cotizaciones. Podemos comparar tarifas de múltiples aseguradoras a la vez.",
      },
      {
        q: "¿Qué debo hacer inmediatamente después de un accidente de auto?",
        a: "Verifica si hay heridos y llama al 911 si alguien está lesionado. Muévete a un lugar seguro si es posible, luego intercambia información con el otro conductor: nombre, teléfono, número de licencia, aseguradora y número de póliza. Toma fotos de ambos vehículos y del lugar. Presenta un reporte policial cuando sea posible. Luego notifica a tu aseguradora. Si no sabes a quién llamar primero, tu agente de Ativa puede orientarte.",
      },
      {
        q: "¿Puedo asegurar un auto que no es mío?",
        a: "En general, el seguro de auto sigue al vehículo, no al conductor. Si conduces regularmente un auto que no es tuyo, puedes ser agregado como conductor registrado en la póliza del propietario — o puedes estar cubierto como conductor con permiso. El seguro de no-propietario también es una opción para personas que frecuentemente conducen vehículos rentados o prestados.",
      },
      {
        q: "¿Subirán mis tarifas de seguro de auto después de presentar un reclamo?",
        a: "Depende del tipo de reclamo, tu aseguradora y tu historial. Los accidentes en que tuvieres culpa generalmente causan un aumento de tarifa en la renovación. Los reclamos sin culpa tuya y los reclamos comprensivos (como daños por clima) pueden no afectar tanto la tarifa, dependiendo de la aseguradora. Algunas pólizas incluyen perdón de accidente. Vale la pena comparar tarifas antes de la renovación — lo hacemos por ti sin costo.",
      },
    ],
  },
  {
    id: "home",
    title: "Seguro de Hogar",
    icon: "🏠",
    items: [
      {
        q: "¿Qué cubre una póliza de seguro de hogar estándar?",
        a: "Una póliza estándar HO-3 cubre tu vivienda (la estructura), otras estructuras en tu propiedad (como un garaje o cerca), tus pertenencias personales, responsabilidad civil si alguien se lesiona en tu propiedad, y pérdida de uso (gastos de vivienda si tu hogar se vuelve inhabitable). NO cubre daños por inundación o terremoto por defecto. Si quieres revisar si tu póliza actual tiene la cobertura correcta, con gusto te ayudamos.",
      },
      {
        q: "¿Está incluido el seguro contra inundaciones en el seguro de hogar?",
        a: "No — las pólizas de hogar estándar excluyen explícitamente los daños por inundación. El seguro contra inundaciones es una póliza separada, disponible a través del NFIP o aseguradoras privadas. En Florida, incluso las propiedades fuera de zonas de inundación designadas están en riesgo. El período de espera de 30 días de la mayoría de las pólizas del NFIP significa que no debes esperar a la temporada de huracanes para pensarlo. Cotizamos seguro contra inundaciones rápidamente.",
      },
      {
        q: "¿Qué es el costo de reposición versus el valor en efectivo actual?",
        a: "El costo de reposición paga para reconstruir o reemplazar tu propiedad a los precios actuales — sin depreciación. El valor en efectivo actual paga solo lo que vale tu propiedad hoy, considerando la edad y el desgaste. Para la mayoría de los propietarios, la cobertura por costo de reposición vale la pequeña diferencia de prima. Después de una pérdida mayor, la diferencia puede representar decenas de miles de dólares.",
      },
      {
        q: "¿Cuánto seguro de hogar necesito?",
        a: "Necesitas cobertura suficiente para reconstruir completamente tu casa a los costos de construcción actuales — no a su valor de mercado. Muchos propietarios están subasegurados porque basan la cobertura en lo que pagaron por la casa, que incluye el terreno (que no puede incendiarse). Nuestra Calculadora de Costo de Reposición gratuita puede ayudarte a encontrar el número correcto en menos de 2 minutos.",
      },
      {
        q: "¿Qué es un inventario del hogar y por qué es importante?",
        a: "Un inventario del hogar es una lista documentada de todo lo que posees — muebles, electrónicos, ropa, joyas y más — con sus valores estimados. Si alguna vez presentas un reclamo por pertenencias robadas o destruidas, un inventario hace el proceso más rápido y garantiza que seas reembolsado adecuadamente. Un video en tu celular recorriendo la casa ya sirve como inventario.",
      },
      {
        q: "¿El seguro de hogar cubre daños de huracán en Florida?",
        a: "Las pólizas de hogar estándar generalmente cubren daños por viento de huracanes. Sin embargo, los daños por inundación de marejada ciclónica NO están cubiertos — eso requiere seguro contra inundaciones separado. Muchas pólizas en Florida tienen un deducible de huracán separado que se aplica específicamente a tormentas nombradas. Es importante saber exactamente qué cubre tu póliza antes de la temporada de huracanes.",
      },
      {
        q: "¿Qué está cubierto bajo 'otras estructuras' en mi póliza de hogar?",
        a: "La cobertura de otras estructuras protege las construcciones separadas en tu propiedad que no son la vivienda principal — como un garaje independiente, cerca, cobertizo, área de piscina o pérgola. Las pólizas estándar generalmente cubren otras estructuras al 10% del límite de cobertura de la vivienda. Si tienes estructuras significativas, puede que quieras aumentar este monto.",
      },
      {
        q: "¿Cuál es la diferencia entre una póliza HO-3 y HO-6?",
        a: "La HO-3 es la póliza de hogar estándar para casas unifamiliares. Cubre la estructura en base abierta (cubre todo excepto lo que específicamente se excluye). La HO-6 es una póliza para unidades de condominio — cubre solo el interior de tu unidad (paredes, pisos, accesorios, electrodomésticos, pertenencias personales) ya que la póliza maestra de tu HOA cubre el exterior del edificio y las áreas comunes. Los propietarios de condominios generalmente necesitan significativamente menos cobertura.",
      },
    ],
  },
  {
    id: "renters",
    title: "Seguro para Inquilinos",
    icon: "🏢",
    items: [
      {
        q: "¿Por qué necesito seguro para inquilinos si mi arrendador tiene seguro?",
        a: "El seguro de tu arrendador cubre el edificio — no tus pertenencias. Si hay un incendio, robo o daño por agua, la póliza del arrendador no pagará para reemplazar tus muebles, electrónicos, ropa u otros bienes personales. El seguro para inquilinos cubre tus cosas, tu responsabilidad civil y tu alojamiento temporal si tu unidad se vuelve inhabitable. La mayoría de las pólizas cuestan menos de $20 al mes.",
      },
      {
        q: "¿Qué cubre típicamente el seguro para inquilinos?",
        a: "El seguro para inquilinos cubre tres cosas principales: propiedad personal (tus pertenencias, incluso cuando viajas), responsabilidad civil personal (si alguien se lesiona en tu apartamento o accidentalmente dañas la propiedad de alguien) y pérdida de uso (gastos de hotel y vivienda si tu unidad se vuelve inhabitable). Algunas pólizas también cubren robo de identidad y artículos de alto valor como joyas o electrónicos.",
      },
      {
        q: "¿Cuánto cuesta típicamente el seguro para inquilinos?",
        a: "El seguro para inquilinos es uno de los productos de seguro más asequibles disponibles. La mayoría de las pólizas cuestan entre $15 y $30 por mes dependiendo de tu ubicación, el monto de cobertura y el deducible. Como agencia independiente, comparamos múltiples aseguradoras para encontrar la mejor tarifa para ti.",
      },
      {
        q: "¿El seguro para inquilinos cubre a mi compañero de cuarto?",
        a: "No automáticamente. Una póliza estándar cubre al asegurado nombrado y a los miembros de la familia que viven en la unidad. Un compañero de cuarto NO está cubierto bajo tu póliza a menos que sea específicamente listado como asegurado adicional. Tu compañero debería obtener su propia póliza — es económica y lo protege por separado. Podemos cotizar para los dos al mismo tiempo.",
      },
      {
        q: "¿Qué es la cobertura de 'pérdida de uso' en una póliza para inquilinos?",
        a: "La pérdida de uso (también llamada gastos de vida adicionales) paga tu hotel, comidas y otros costos de vivienda si una pérdida cubierta — como un incendio o daño grave por agua — te obliga a salir del apartamento. La cobertura generalmente aplica hasta que tu unidad sea reparada o hasta que se agote el límite de la póliza. Esta es una de las características más valiosas del seguro para inquilinos.",
      },
      {
        q: "¿El seguro para inquilinos cubre el robo de mi auto?",
        a: "El seguro para inquilinos cubre objetos personales robados de tu auto — como una laptop o bolsa dejada en el asiento — pero NO cubre el vehículo en sí. El robo del vehículo está cubierto por tu seguro de auto bajo la porción comprensiva de la póliza. Si tienes seguro de auto y seguro para inquilinos, muchas veces podemos combinarlos para obtener un descuento.",
      },
    ],
  },
  {
    id: "commercial",
    title: "Seguro Comercial y Empresarial",
    icon: "🏗️",
    items: [
      {
        q: "¿Qué seguros necesita mi pequeño negocio?",
        a: "La mayoría de los pequeños negocios necesitan como mínimo: responsabilidad general (para proteger contra reclamos de lesiones de terceros y daños a la propiedad), propiedad comercial (si tienes espacio físico o equipos) y compensación de trabajadores (si tienes empleados). Dependiendo de tu industria, también puedes necesitar responsabilidad profesional, auto comercial o cobertura cibernética. Cuéntanos sobre tu negocio y armamos el paquete correcto.",
      },
      {
        q: "¿Qué es una Póliza para Empresarios (BOP)?",
        a: "Una BOP combina responsabilidad general y seguro de propiedad comercial en una sola póliza asequible diseñada para pequeñas y medianas empresas. Generalmente es menos cara que comprar las coberturas por separado. Algunas BOP también incluyen cobertura de interrupción de negocios. Es un excelente punto de partida para la mayoría de las empresas de servicios, tiendas minoristas y oficinas.",
      },
      {
        q: "¿Qué es el seguro de responsabilidad general y por qué lo necesita mi negocio?",
        a: "La responsabilidad general (GL) cubre tu negocio contra reclamos de lesiones corporales o daños a la propiedad causados por tus operaciones, productos o empleados. Por ejemplo: un cliente se resbala en tu tienda, un contratista daña la propiedad de un cliente, o alguien te demanda por daño publicitario. Sin GL, pagarías los costos de defensa y cualquier acuerdo de tu propio bolsillo.",
      },
      {
        q: "¿Es obligatoria la compensación de trabajadores para negocios en Florida?",
        a: "En Florida, la mayoría de los negocios con 4 o más empleados (tiempo completo o parcial) están obligados a tener compensación de trabajadores. Las empresas de construcción deben tenerla incluso con solo 1 empleado. La workers' comp cubre gastos médicos y salarios perdidos de empleados lesionados en el trabajo — y protege al empleador de demandas relacionadas con lesiones laborales.",
      },
      {
        q: "¿Qué es el seguro de responsabilidad profesional (E&O)?",
        a: "La responsabilidad profesional, también llamada Errors & Omissions (E&O), protege a las empresas de servicios de reclamos de que su consejo, servicios o trabajo profesional causó daño financiero a un cliente. Es esencial para consultores, contadores, abogados, agentes de bienes raíces, profesionales de TI y muchos otros. Incluso si no cometiste un error, defender una demanda es costoso. El E&O cubre la defensa legal incluso si el reclamo es infundado.",
      },
      {
        q: "¿Qué es el seguro de responsabilidad cibernética y lo necesita mi negocio?",
        a: "El seguro de responsabilidad cibernética cubre tu negocio si experimenta una violación de datos, ataque de ransomware o robo cibernético. Paga por notificar a los clientes afectados, servicios de monitoreo de crédito, honorarios legales, multas regulatorias y pérdidas por interrupción de negocios. Si tu negocio almacena datos de clientes — correos, información de pago, registros de salud — tienes exposición cibernética.",
      },
      {
        q: "¿Cuál es la diferencia entre una BOP y una Póliza de Paquete Comercial?",
        a: "Una BOP es una póliza preempaquetada diseñada para pequeños negocios con personalización limitada. Una Póliza de Paquete Comercial (CPP) es más flexible y puede adaptarse para empresas más grandes con necesidades especializadas. Si eres un pequeño negocio con operaciones directas, una BOP suele ser la opción correcta. Si tienes exposiciones únicas o mayores ingresos, una CPP puede ser mejor.",
      },
      {
        q: "¿Qué le pasa a mi seguro empresarial si contrato más empleados?",
        a: "Agregar empleados puede afectar tu prima de workers' comp (a menudo calculada por $100 de nómina), tus tarifas de responsabilidad general y posiblemente tu BOP. Generalmente estás obligado a notificar a tu aseguradora sobre cambios significativos en las operaciones. La buena noticia: agregar personal demuestra que tu negocio está creciendo, y podemos actualizar tu cobertura rápidamente.",
      },
    ],
  },
  {
    id: "trucking",
    title: "Camiones y Auto Comercial",
    icon: "🚛",
    items: [
      {
        q: "¿Qué seguro necesito para mi camión comercial?",
        a: "Los camiones comerciales generalmente requieren: responsabilidad primaria (cubriendo daños a terceros), cobertura de daños físicos (colisión y comprensiva para tu camión), seguro de carga (cubriendo la mercancía que transportas) y, si operas entre estados, deberás cumplir con los requisitos de registro de la FMCSA. Los propietarios-operadores también pueden necesitar responsabilidad no-transporte para cuando el camión está fuera de servicio. Nos especializamos en seguros para camiones.",
      },
      {
        q: "¿Qué es el seguro de transportista motorizado (motor carrier)?",
        a: "El seguro de transportista proporciona la cobertura de responsabilidad primaria requerida para vehículos comerciales que operan bajo autoridad de transportista (número USDOT y MC). Protege contra reclamos cuando tu camión causa lesiones o daños a la propiedad de terceros. El requisito mínimo de la FMCSA es $750,000 para la mayoría de la carga y $1 millón para materiales peligrosos.",
      },
      {
        q: "¿Necesito seguro separado para cada camión de mi flota?",
        a: "No necesariamente. Una póliza de flota cubre múltiples vehículos bajo una sola póliza, lo que generalmente es más rentable y fácil de administrar que pólizas individuales para cada camión. Las tarifas se basan en el tamaño y tipo de vehículos, historial de conductores, tipo de carga y territorio de operación. Incluso si tienes solo dos o tres camiones, una póliza de flota puede ofrecer mejores tarifas.",
      },
      {
        q: "¿Qué es el seguro de carga y es obligatorio?",
        a: "El seguro de carga cubre el flete que transportas si se daña, roba o pierde mientras está bajo tu custodia. No siempre es legalmente requerido, pero muchos embarcadores y corredores lo exigen como condición para contratar. Los límites de cobertura y exclusiones varían — algunas pólizas excluyen ciertas mercancías. Nos aseguramos de que tu cobertura de carga coincida con lo que realmente transportas.",
      },
      {
        q: "¿Qué es la cobertura de responsabilidad no-transporte (bobtail)?",
        a: "La responsabilidad no-transporte (NTL), también llamada bobtail, cubre a un propietario-operador cuando conduce su camión para uso personal — no bajo despacho o en nombre del transportista. Tu póliza primaria de transportista puede no cubrirte cuando estás fuera de servicio. La NTL llena ese vacío. Es una cobertura económica pero crítica para los propietarios-operadores.",
      },
      {
        q: "¿Cómo se calculan las tarifas de seguro para camiones comerciales?",
        a: "Las tarifas dependen de varios factores: tipo y tamaño del vehículo, qué transportas, qué tan lejos operas (local, regional o larga distancia), tu historial de manejo y años de experiencia con CDL, tu historial de reclamos y los límites de cobertura que eliges. Los propietarios-operadores con historial limpio generalmente obtienen las mejores tarifas. Trabajamos con múltiples aseguradoras especializadas en camiones.",
      },
    ],
  },
  {
    id: "about",
    title: "Sobre Ativa Insurance",
    icon: "ℹ️",
    items: [
      {
        q: "¿Dónde está ubicada Ativa Insurance?",
        a: "Nuestra oficina está ubicada en 2412 Irwin St, Suite 372, Melbourne, FL 32901. Atendemos clientes en persona, por teléfono, correo electrónico y WhatsApp — así que sin importar dónde estés en nuestros estados con licencia, podemos ayudarte. Llámanos al 561-946-8261 o escríbenos por WhatsApp en cualquier momento.",
      },
      {
        q: "¿En qué estados opera Ativa Insurance?",
        a: "Estamos licenciados y operando en Florida, Georgia, Carolina del Norte, Carolina del Sur, Nueva Jersey, Pensilvania, Connecticut, Massachusetts, Maryland, Ohio y Tennessee. Florida es nuestro mercado principal y más activo, donde nos especializamos en seguro de hogar, auto, inundaciones y comercial. Si estás en uno de esos estados y buscas cobertura, nos encantaría ayudarte.",
      },
      {
        q: "¿En qué idiomas atiende Ativa Insurance a sus clientes?",
        a: "Atendemos clientes en inglés, portugués y español. Nuestra fundadora tiene raíces profundas en la comunidad brasileña en Florida, y nuestro equipo está capacitado para atender a clientes que se sienten más cómodos en portugués o español. Los seguros ya son suficientemente complicados en tu propio idioma — queremos eliminar esa barrera por completo.",
      },
      {
        q: "¿Cómo obtengo una cotización de Ativa Insurance?",
        a: "La forma más rápida es hacer clic en cualquier tarjeta de producto en nuestra página principal y completar el formulario corto — toma menos de 2 minutos. También puedes llamarnos al 561-946-8261, enviarnos un mensaje por WhatsApp o chatear con nuestro asistente de IA en el sitio. Responderemos con opciones personalizadas, generalmente dentro de un día hábil.",
      },
      {
        q: "¿Cuánto tiempo tarda en estar asegurado a través de Ativa?",
        a: "Depende del producto. El seguro de auto a menudo puede vincularse el mismo día. Las coberturas de hogar, inquilinos y condominio típicamente tardan 1–2 días hábiles. Las pólizas comerciales pueden tardar 2–5 días hábiles dependiendo de la complejidad. Nos movemos tan rápido como las aseguradoras lo permiten — y siempre te mantenemos informado sobre el estado de tu proceso.",
      },
      {
        q: "¿Qué hace diferente a Ativa Insurance de otras agencias?",
        a: "Tres cosas: somos independientes (cotizamos en múltiples aseguradoras, no solo una), somos bilingües (inglés, portugués y español) y estamos construidos para comunidades que a menudo son desatendidas por las agencias tradicionales — especialmente familias brasileñas e hispanas en Florida y pequeños empresarios. No estamos aquí para venderte la póliza más cara. Estamos aquí para encontrarte la correcta. Eso es todo.",
      },
    ],
  },
];

export const FAQ_DATA: Record<FAQLang, FAQSection[]> = { en, pt, es };

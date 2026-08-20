"use client";
import { useState } from "react";

const plans = [
  { id: "launch", name: "Launch", price: 899, copy: "For teams shipping their first reliable production stack.", features: ["CI/CD pipeline setup", "Cloud infrastructure baseline", "Monitoring & alerts", "8 engineering hours / month"] },
  { id: "scale", name: "Scale", price: 1899, copy: "A complete platform function for a growing product team.", featured: true, features: ["Everything in Launch", "Kubernetes & GitOps", "Multi-environment IaC", "24 engineering hours / month", "Priority incident response"] },
  { id: "mission", name: "Mission", price: 3499, copy: "High-touch reliability for business-critical workloads.", features: ["Everything in Scale", "Multi-cloud architecture", "SRE roadmap & reviews", "50 engineering hours / month", "On-call escalation support"] },
];
const capabilities = [
  ["01", "Continuous delivery", "Fast, repeatable releases with tested pipelines, previews, and safe rollbacks."],
  ["02", "Infrastructure as code", "Versioned Terraform modules that make every environment predictable."],
  ["03", "Cloud operations", "Practical architecture and cost control across AWS, GCP, and Azure."],
  ["04", "Platform reliability", "Kubernetes, observability, backups, and incident playbooks built in."],
];

export default function Home() {
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  async function checkout(plan: string) {
    setBusy(plan); setNotice("");
    try {
      const response = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ plan }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Checkout is unavailable.");
      if (data.url) window.location.href = data.url;
    } catch (error) { setNotice(error instanceof Error ? error.message : "Checkout is unavailable."); }
    finally { setBusy(null); }
  }

  return <main>
    <header className="nav shell"><a className="brand" href="#top"><span className="brand-mark">S</span> SHIPOPS<span className="dot">.</span></a><nav><a href="#services">Services</a><a href="#process">Process</a><a href="#pricing">Pricing</a></nav><a className="nav-cta" href="#pricing">View plans <span>↗</span></a></header>
    <section className="hero shell" id="top">
      <div className="hero-copy"><p className="eyebrow"><span /> Your DevOps team, on subscription</p><h1>SHIP FASTER.<br />SLEEP <em>BETTER.</em></h1><p className="hero-lede">Senior DevOps expertise without the hiring cycle. We design, build, and operate the cloud platform behind your product.</p><div className="hero-actions"><a className="button primary" href="#pricing">Start shipping <span>↗</span></a><a className="text-link" href="#services">Explore the service <span>↓</span></a></div><div className="proof"><div className="avatars"><span>AK</span><span>JL</span><span>MR</span><span>+</span></div><p><strong>Trusted by technical founders</strong><br />From first deploy to global scale</p></div></div>
      <div className="terminal-wrap"><div className="terminal-top"><span>◈ shipops / production</span><span className="live"><i /> LIVE</span></div><div className="terminal-body"><p><span className="muted">$</span> shipops deploy <span className="green">--production</span></p><div className="log"><p><span>01:42:06</span> Validating Terraform plan...</p><p><span>01:42:08</span> Building container <b>api:8f2c1a</b></p><p><span>01:42:24</span> Running security checks...</p><p><span>01:42:31</span> Rolling out to <b>eu-west-1</b></p></div><div className="success"><div>✓</div><p><strong>Deployment successful</strong><br /><span>Production is healthy · 41s</span></p></div><div className="metrics"><div><span>UPTIME</span><strong>99.99%</strong></div><div><span>DEPLOY FREQ.</span><strong>12.4/day</strong></div><div><span>MTTR</span><strong>8 min</strong></div></div></div><div className="float-tag tag-one">ZERO DOWNTIME</div><div className="float-tag tag-two">COST ↓ 32%</div></div>
    </section>
    <div className="tech-strip"><div>CI/CD <span>✦</span> TERRAFORM <span>✦</span> DOCKER <span>✦</span> KUBERNETES <span>✦</span> AWS / GCP / AZURE <span>✦</span> GITOPS</div></div>
    <section className="services shell" id="services"><div className="section-intro"><div><p className="eyebrow"><span /> What we operate</p><h2>YOUR PLATFORM.<br /><em>ENGINEERED.</em></h2></div></div><div className="capability-grid">{capabilities.map(([num,title,text]) => <article key={num}><span className="cap-num">{num}</span><div className="cap-icon">{num === "01" ? "↗" : num === "02" ? "⌘" : num === "03" ? "☁" : "◉"}</div><h3>{title}</h3><p>{text}</p></article>)}</div></section>
    <section className="process" id="process"><div className="shell process-inner"><div><p className="eyebrow light"><span /> How it works</p><h2>ONE SUBSCRIPTION.<br /><em>ZERO BOTTLENECKS.</em></h2></div><ol><li><span>01</span><div><strong>Share your roadmap</strong><p>We audit the stack and prioritize the highest-leverage infrastructure work.</p></div></li><li><span>02</span><div><strong>We build in your stack</strong><p>Work ships in weekly cycles with full visibility in your existing tools.</p></div></li><li><span>03</span><div><strong>Scale without surprises</strong><p>Pause, upgrade, or change priorities as your product evolves.</p></div></li></ol></div></section>
    <section className="pricing shell" id="pricing"><div className="pricing-head"><div><p className="eyebrow"><span /> Simple monthly plans</p><h2>THE RIGHT CAPACITY.<br /><em>RIGHT NOW.</em></h2></div><p>No contracts. No hidden retainers. One predictable monthly payment for senior DevOps capacity.</p></div><div className="plan-grid">{plans.map(plan => <article className={plan.featured ? "plan featured" : "plan"} key={plan.id}>{plan.featured && <div className="popular">MOST POPULAR</div>}<p className="plan-name">{plan.name}</p><p className="plan-copy">{plan.copy}</p><div className="price"><sup>$</sup>{plan.price.toLocaleString()}<span>/mo</span></div><button onClick={() => checkout(plan.id)} disabled={busy !== null}>{busy === plan.id ? "Opening checkout…" : `Choose ${plan.name}`} <span>↗</span></button><ul>{plan.features.map(feature => <li key={feature}><span>✓</span>{feature}</li>)}</ul></article>)}</div>{notice && <p className="checkout-notice" role="status">{notice}</p>}<p className="secure-note">▣ Secure checkout powered by Stripe · Cancel or change plans anytime</p></section>
    <section className="cta"><div className="shell"><p className="eyebrow light"><span /> Ready when you are</p><h2>YOUR NEXT DEPLOY<br />STARTS <em>HERE.</em></h2><a className="button light-button" href="#pricing">Build my platform <span>↗</span></a></div></section>
    <footer className="shell"><a className="brand" href="#top"><span className="brand-mark">S</span> SHIPOPS<span className="dot">.</span></a><p>DevOps-as-a-Service for ambitious product teams.</p><p>© 2026 ShipOps</p></footer>
  </main>;
}

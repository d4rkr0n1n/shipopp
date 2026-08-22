"use client";
import Script from "next/script";
import { useState } from "react";

type RazorpaySuccess = { razorpay_payment_id: string; razorpay_subscription_id: string; razorpay_signature: string };
type RazorpayCheckout = { open: () => void; on: (event: "payment.failed", callback: (response: { error?: { description?: string } }) => void) => void };
declare global { interface Window { Razorpay?: new (options: Record<string, unknown>) => RazorpayCheckout } }

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
const scope = {
  included: ["Infrastructure and delivery work in your existing cloud accounts", "CI/CD, IaC, containers, observability, reliability, and cloud-cost tasks", "Implementation, documentation, reviews, and async progress updates", "Work up to the monthly engineering capacity included in your plan"],
  excluded: ["Application feature development or product design", "24/7 help desk, guaranteed on-call coverage, or unlimited incident response", "Cloud-provider, SaaS, domain, or other third-party charges", "Large migrations or projects beyond plan capacity without a separately agreed scope"],
};
const faqs = [
  ["How does the one-request model work?", "Add as many requests as you like to the queue. We work on one active request at a time, in priority order, so focus stays high and handoffs stay low. You can reprioritize anything that has not started."],
  ["What does async-only mean?", "Requests, feedback, approvals, and updates happen in your shared workspace. There are no recurring meetings. When a decision genuinely needs a conversation, we can arrange a focused call by exception."],
  ["How quickly will work be completed?", "Most focused requests move within a few business days. Larger work is broken into visible milestones. Timing depends on complexity, access, feedback, and the monthly capacity in your plan."],
  ["Can I pause or cancel?", "Yes. Cancel before your next renewal to stop future charges. You can request a pause at the end of the current billing period for up to three months; work and billing resume afterward unless you cancel."],
  ["What happens to unused capacity?", "Capacity reserves our availability for that billing month and does not roll over. If priorities change, use the queue to direct the remaining time to documentation, reliability, security, or cost improvements."],
  ["Who owns the work?", "You do. Work is delivered into your accounts and repositories. Once outstanding invoices are paid, the implementation and project-specific documentation are yours."],
];

export default function Home() {
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [noticeKind, setNoticeKind] = useState<"error" | "success">("error");
  const [checkoutReady, setCheckoutReady] = useState(false);
  async function checkout(plan: string) {
    if (!checkoutReady || !window.Razorpay) {
      setNoticeKind("error"); setNotice("Secure checkout is still loading. Please try again in a moment."); return;
    }
    setBusy(plan); setNotice("");
    try {
      const response = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ plan }) });
      const data = await response.json() as { subscriptionId?: string; keyId?: string; error?: string };
      if (!response.ok) throw new Error(data.error || "Checkout is unavailable.");
      if (!data.subscriptionId || !data.keyId) throw new Error("Checkout returned an incomplete response.");
      const razorpay = new window.Razorpay({
        key: data.keyId, subscription_id: data.subscriptionId, name: "ShipOps", currency: "INR",
        description: `${plans.find((item) => item.id === plan)?.name || "DevOps"} monthly subscription`, theme: { color: "#779d00" },
        modal: { ondismiss: () => { setNoticeKind("error"); setNotice("Checkout was cancelled. No payment was taken."); setBusy(null); } },
        handler: async (payment: RazorpaySuccess) => {
          try {
            const verification = await fetch("/api/checkout/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payment) });
            const result = await verification.json() as { verified?: boolean; error?: string };
            if (!verification.ok || !result.verified) throw new Error(result.error || "Payment verification failed.");
            setNoticeKind("success"); setNotice("Payment verified. Welcome to ShipOps — we’ll contact you with onboarding details.");
          } catch (error) { setNoticeKind("error"); setNotice(error instanceof Error ? error.message : "Payment verification failed."); }
          finally { setBusy(null); }
        },
      });
      razorpay.on("payment.failed", (payment) => { setNoticeKind("error"); setNotice(payment.error?.description || "Payment failed. Please try again."); setBusy(null); });
      razorpay.open();
    } catch (error) { setNoticeKind("error"); setNotice(error instanceof Error ? error.message : "Checkout is unavailable."); setBusy(null); }
  }

  return <main>
    <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" onReady={() => setCheckoutReady(true)} onError={() => { setCheckoutReady(false); setNoticeKind("error"); setNotice("Secure checkout could not be loaded. Please refresh and try again."); }} />
    <header className="nav shell"><a className="brand" href="#top"><span className="brand-mark">S</span> SHIPOPS<span className="dot">.</span></a><nav><a href="#services">Services</a><a href="#scope">Scope</a><a href="#process">Process</a><a href="#pricing">Pricing</a><a href="#faq">FAQ</a></nav><a className="nav-cta" href="#pricing">View plans <span>↗</span></a></header>
    <section className="hero shell" id="top">
      <div className="hero-copy"><p className="eyebrow"><span /> Your DevOps guy, on subscription</p><h1>SHIP FASTER.<br />SLEEP <em>BETTER.</em></h1><p className="hero-lede">Senior DevOps expertise without the hiring cycle. I design, build, and operate the cloud platform behind your product.</p><div className="hero-actions"><a className="button primary" href="#pricing">Start shipping <span>↗</span></a><a className="text-link" href="#services">Explore the service <span>↓</span></a></div></div>
      <div className="terminal-wrap"><div className="terminal-top"><span>◈ shipops / production</span><span className="live"><i /> LIVE</span></div><div className="terminal-body"><p><span className="muted">$</span> shipops deploy <span className="green">--production</span></p><div className="log"><p><span>01:42:06</span> Validating Terraform plan...</p><p><span>01:42:08</span> Building container <b>api:8f2c1a</b></p><p><span>01:42:24</span> Running security checks...</p><p><span>01:42:31</span> Rolling out to <b>eu-west-1</b></p></div><div className="success"><div>✓</div><p><strong>Deployment successful</strong><br /><span>Production is healthy · 41s</span></p></div><div className="metrics"><div><span>UPTIME</span><strong>99.99%</strong></div><div><span>DEPLOY FREQ.</span><strong>12.4/day</strong></div><div><span>MTTR</span><strong>8 min</strong></div></div></div><div className="float-tag tag-one">ZERO DOWNTIME</div><div className="float-tag tag-two">COST ↓ 32%</div></div>
    </section>
    <div className="tech-strip"><div>CI/CD <span>✦</span> TERRAFORM <span>✦</span> DOCKER <span>✦</span> KUBERNETES <span>✦</span> AWS / GCP / AZURE <span>✦</span> GITOPS</div></div>
    <section className="services shell" id="services"><div className="section-intro"><div><p className="eyebrow"><span /> What we operate</p><h2>YOUR PLATFORM.<br /><em>ENGINEERED.</em></h2></div></div><div className="capability-grid">{capabilities.map(([num, title, text]) => <article key={num}><span className="cap-num">{num}</span><div className="cap-icon">{num === "01" ? "↗" : num === "02" ? "⌘" : num === "03" ? "☁" : "◉"}</div><h3>{title}</h3><p>{text}</p></article>)}</div></section>
    <section className="scope" id="scope"><div className="shell"><div className="scope-head"><div><p className="eyebrow light"><span /> Clear boundaries</p><h2>KNOW EXACTLY<br /><em>WHAT YOU GET.</em></h2></div><p>ShipOps is focused DevOps delivery—not an open-ended staff augmentation contract. Every plan follows the same operating rules.</p></div><div className="scope-grid"><article><p className="scope-label included">✓ Included</p><ul>{scope.included.map(item => <li key={item}>{item}</li>)}</ul></article><article><p className="scope-label excluded">× Not included</p><ul>{scope.excluded.map(item => <li key={item}>{item}</li>)}</ul></article></div><div className="operating-rules"><article><span>01</span><h3>One active request</h3><p>Keep an unlimited prioritized queue; we execute one request at a time and move to the next after approval.</p></article><article><span>02</span><h3>Async by default</h3><p>Submit requests and receive written updates in your shared workspace—without recurring meetings or calendar drag.</p></article><article><span>03</span><h3>Pause or cancel</h3><p>Cancel before renewal or pause at a billing boundary for up to three months. Your current paid period remains active.</p></article></div></div></section>
    <section className="process" id="process"><div className="shell process-inner"><div><p className="eyebrow light"><span /> How it works</p><h2>ONE SUBSCRIPTION.<br /><em>ZERO BOTTLENECKS.</em></h2></div><ol><li><span>01</span><div><strong>Share your roadmap</strong><p>We audit the stack and prioritize the highest-leverage infrastructure work.</p></div></li><li><span>02</span><div><strong>We build in your stack</strong><p>Work ships in weekly cycles with full visibility in your existing tools.</p></div></li><li><span>03</span><div><strong>Scale without surprises</strong><p>Pause, upgrade, or change priorities as your product evolves.</p></div></li></ol></div></section>
    <section className="pricing shell" id="pricing"><div className="pricing-head"><div><p className="eyebrow"><span /> Simple monthly plans</p><h2>THE RIGHT CAPACITY.<br /><em>RIGHT NOW.</em></h2></div><p>No contracts. No hidden retainers. One predictable monthly payment for senior DevOps capacity.</p></div><div className="plan-grid">{plans.map(plan => <article className={plan.featured ? "plan featured" : "plan"} key={plan.id}>{plan.featured && <div className="popular">MOST POPULAR</div>}<p className="plan-name">{plan.name}</p><p className="plan-copy">{plan.copy}</p><div className="price"><sup>₹</sup>{plan.price.toLocaleString("en-IN")}<span>/mo</span></div><button onClick={() => checkout(plan.id)} disabled={busy !== null}>{busy === plan.id ? "Opening checkout…" : `Choose ${plan.name}`} <span>↗</span></button><ul>{plan.features.map(feature => <li key={feature}><span>✓</span>{feature}</li>)}</ul></article>)}</div>{notice && <p className={`checkout-notice ${noticeKind}`} role="status">{notice}</p>}<p className="secure-note">▣ Secure checkout powered by Razorpay · Cancel or change plans anytime</p></section>
    <section className="faq shell" id="faq"><div className="faq-intro"><p className="eyebrow"><span /> The fine print, plainly</p><h2>QUESTIONS.<br /><em>ANSWERED.</em></h2><p>Still unsure whether a request fits? Send it before subscribing and we’ll give you a direct answer.</p></div><div className="faq-list">{faqs.map(([question, answer], index) => <details key={question} open={index === 0}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></section>
    <section className="cta"><div className="shell"><p className="eyebrow light"><span /> Ready when you are</p><h2>YOUR NEXT DEPLOY<br />STARTS <em>HERE.</em></h2><a className="button light-button" href="#pricing">Build my platform <span>↗</span></a></div></section>
    <footer className="shell"><a className="brand" href="#top"><span className="brand-mark">S</span> SHIPOPS<span className="dot">.</span></a><p>DevOps-as-a-Service for ambitious product teams.</p><p>© 2026 ShipOps</p></footer>
  </main>;
}

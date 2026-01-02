import Header from "@/components/Header";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Header showSignin />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[85vh] flex items-center">
          <div className="absolute inset-0 bg-surface"></div>
          
          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-elevated border border-border mb-8">
              <span className="w-2 h-2 bg-success rounded-full"></span>
              <span className="text-sm text-text-muted">Live on Base Sepolia</span>
            </div>
            
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-tight mb-6 text-foreground">
              Bet on Anything,
              <br />
              with <span className="text-primary">Anyone</span>.
            </h1>
            
            <p className="mt-6 max-w-2xl mx-auto text-lg text-text-muted leading-relaxed">
              A decentralized betting platform on Base. Create or join wagers on anything with secure, transparent payouts.
            </p>
            
            <div className="mt-10 flex flex-wrap gap-4 justify-center">
              <Link
                href="/explore"
                className="btn-primary flex items-center justify-center h-12 px-8 text-base font-semibold"
              >
                Explore Wagers
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/wagers/create"
                className="btn-secondary flex items-center justify-center h-12 px-8 text-base font-semibold"
              >
                Create a Wager
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">$2.4M+</div>
                <div className="text-sm text-text-muted mt-1">Total Volume</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">1,200+</div>
                <div className="text-sm text-text-muted mt-1">Active Wagers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">5,000+</div>
                <div className="text-sm text-text-muted mt-1">Users</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                Why Choose Wagr?
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-text-muted">
                Built for transparency, security, and the thrill of the wager.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass p-8 card-hover">
                <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-primary/10 text-primary mb-6">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Secure & Transparent
                </h3>
                <p className="text-text-muted">
                  All wagers are secured by smart contracts on the Base
                  blockchain, ensuring transparent and automated payouts.
                </p>
              </div>
              
              <div className="glass p-8 card-hover">
                <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-accent/10 text-accent mb-6">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Decentralized & Trustless
                </h3>
                <p className="text-text-muted">
                  Wagr operates on a decentralized network, eliminating the need
                  for intermediaries and ensuring fair play.
                </p>
              </div>
              
              <div className="glass p-8 card-hover">
                <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-success/10 text-success mb-6">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Community-Driven
                </h3>
                <p className="text-text-muted">
                  Join a vibrant community of bettors, create your own wagers,
                  and participate in a wide range of betting opportunities.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-surface">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Ready to Wager?
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-text-muted mb-8">
              Sign up now and start creating or joining wagers on Wagr.
            </p>
            <Link href="/sign-in">
              <button className="btn-primary h-12 px-10 text-base font-semibold">
                Get Started Now
              </button>
            </Link>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-background border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <span className="font-bold text-foreground">Wagr</span>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-6">
              <Link
                className="text-sm text-text-muted hover:text-foreground transition-colors"
                href="/how"
              >
                How It Works
              </Link>
              <Link
                className="text-sm text-text-muted hover:text-foreground transition-colors"
                href="/tos"
              >
                Terms of Service
              </Link>
              <Link
                className="text-sm text-text-muted hover:text-foreground transition-colors"
                href="/privacy"
              >
                Privacy Policy
              </Link>
            </div>
            
            <div className="flex justify-center gap-4">
              <a
                className="flex items-center justify-center w-10 h-10 rounded-full bg-surface border border-border text-text-muted hover:text-foreground hover:border-border-hover transition-all"
                href="https://twitter.com/wagr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Wagr on X (Twitter)"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a
                className="flex items-center justify-center w-10 h-10 rounded-full bg-surface border border-border text-text-muted hover:text-foreground hover:border-border-hover transition-all"
                href="https://github.com/wagr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View Wagr on GitHub"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                </svg>
              </a>
            </div>
          </div>
          <p className="mt-8 text-center text-sm text-text-subtle">
            © 2026 Wagr. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}

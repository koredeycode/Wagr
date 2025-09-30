import Header from "@/components/Header";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Header showSignin />
      <main className="flex-1">
        <section className="relative">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC75hEWgRFAXcdGTd5yK5hh7knm--AeWqCvwqrwQrez-vy8KiUY51d2sQ-ertk7ZO6kmKOoovEMD8N2_EjhN58ormem4FhNfGwpeqibz8YbZoYElTzbD2zzRk6ghdeaiLSUdOkQDBkjZvfF8Mm0_X2DS17y7GgegoUabzoVB6TyvoB5etbeUIyvcxiOK9ki2LWO4ht_3zObIihS-KFhGELjADIDtW-7Jz0H5Jkx7tN2eiTMUuxR4Zx1-67lHZuNNgcq3KSS2-Mx1WxI')",
            }}
          ></div>
          <div className="absolute inset-0 bg-black/50 dark:bg-black/70"></div>
          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-32 sm:py-48 text-center text-white">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tighter !leading-tight">
              Bet on Anything, with Anyone.
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-300">
              Wagr is a decentralized betting platform built on the Base
              blockchain. Create or join wagers on any topic, from sports to
              current events, with secure and transparent payouts.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              <Link
                href="/explore"
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-6 bg-primary text-white text-base font-bold tracking-wide hover:opacity-90 transition-opacity transform hover:scale-105"
              >
                <span className="truncate">Explore wagers</span>
              </Link>
              <Link
                href="/wagers/create"
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-6 bg-white/10 backdrop-blur-sm text-white border border-white/20 text-base font-bold tracking-wide hover:bg-white/20 transition-all transform hover:scale-105"
              >
                <span className="truncate">Create a wager</span>
              </Link>
            </div>
          </div>
        </section>
        <section className="py-20 sm:py-32 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                How It Works
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-text">
                Wagr simplifies the betting process with a user-friendly
                interface and secure, blockchain-based transactions.
              </p>
            </div>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-background border border-border shadow-lg hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary">
                  <span className="material-symbols-outlined text-4xl">
                    security
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-bold">
                  Secure and Transparent
                </h3>
                <p className="mt-2 text-text">
                  All wagers are secured by smart contracts on the Base
                  blockchain, ensuring transparent and automated payouts.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-background border border-border shadow-lg hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary">
                  <span className="material-symbols-outlined text-4xl">
                    hub
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-bold">
                  Decentralized and Trustless
                </h3>
                <p className="mt-2 text-text">
                  Wagr operates on a decentralized network, eliminating the need
                  for intermediaries and ensuring fair play.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-background border border-border shadow-lg hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary">
                  <span className="material-symbols-outlined text-4xl">
                    groups
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-bold">Community-Driven</h3>
                <p className="mt-2 text-text">
                  Join a vibrant community of bettors, create your own wagers,
                  and participate in a wide range of betting opportunities.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="bg-border/50 py-20 sm:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Bet?
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-text">
              Sign up now and start creating or joining wagers on Wagr.
            </p>
            <div className="mt-8">
              <Link href="/sign-in">
                <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-8 bg-primary text-white text-base font-bold tracking-wide hover:opacity-90 transition-opacity transform hover:scale-105 mx-auto">
                  <span className="truncate">Get Started Now</span>
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-background border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-wrap items-center justify-center gap-6">
              <Link
                className="text-sm text-text hover:text-primary transition-colors"
                href="/how"
              >
                How It Works
              </Link>
              <Link
                className="text-sm text-text hover:text-primary transition-colors"
                href="/tos"
              >
                Terms of Service
              </Link>
              <Link
                className="text-sm text-text hover:text-primary transition-colors"
                href="/privacy"
              >
                Privacy Policy
              </Link>
            </div>
            <div className="flex justify-center gap-6">
              <a
                className="text-text hover:text-primary transition-colors"
                href="#"
              >
                <svg
                  aria-hidden="true"
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a
                className="text-text hover:text-primary transition-colors"
                href="#"
              >
                <svg
                  aria-hidden="true"
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    clip-rule="evenodd"
                    d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM8.86 17.15c-.56-.16-1.07-.4-1.52-.71.45-.31.85-.69 1.2-1.12.35-.43.63-.9.84-1.39.21-.49.33-1.02.37-1.55H8.3c-.04-.53-.16-1.03-.35-1.5-.19-.47-.46-.91-.78-1.3-.32-.39-.7-.73-1.12-1.01.45-.32.96-.56 1.51-.72.55-.16 1.13-.24 1.73-.24h3.83c.6 0 1.18.08 1.73.24.55.16 1.06.4 1.51.72-.42.28-.8.62-1.12 1.01-.32.39-.59.83-.78 1.3-.19.47-.31.97-.35 1.5h-2.45c.04.53.16 1.06.37 1.55.21.49.49.96.84 1.39.35.43.75.81 1.2 1.12-.45.31-.96.55-1.52.71-.56.16-1.15.24-1.76.24s-1.2-.08-1.76-.24z"
                    fill-rule="evenodd"
                  ></path>
                </svg>
              </a>
            </div>
          </div>
          <p className="mt-8 text-center text-sm text-text">
            © 2025 Wagr. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}

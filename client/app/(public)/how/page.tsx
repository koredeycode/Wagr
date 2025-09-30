const How = () => {
  return (
    <main className="flex-1">
      <section className="py-16 sm:py-24 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tighter">
              How Wagr Works
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-[var(--text-muted-color)]">
              A clear and concise overview of our wager application's features
              and processes, built on the secure and transparent Base
              blockchain.
            </p>
          </div>
        </div>
      </section>
      <section className="pb-16 sm:pb-24 lg:pb-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <div className="bg-white/80 p-8 rounded-lg border border-border">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400">
                  <span className="material-symbols-outlined text-2xl">
                    edit_square
                  </span>
                </div>
                <h3 className="text-xl font-bold">1. Create a Bet</h3>
              </div>
              <p className="mt-4 text-[var(--text-muted-color)]">
                Start by creating a bet on any event or topic you're interested
                in. Define the terms, set the stakes, and invite others to
                participate.
              </p>
            </div>
            <div className="bg-white/80 p-8 rounded-lg border border-border">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400">
                  <span className="material-symbols-outlined text-2xl">
                    group_add
                  </span>
                </div>
                <h3 className="text-xl font-bold">2. Invite Participants</h3>
              </div>
              <p className="mt-4 text-[var(--text-muted-color)]">
                Share your bet with friends, family, or the wider BetBase
                community. Participants can join by accepting the terms and
                staking their contribution.
              </p>
            </div>
            <div className="bg-white/80 p-8 rounded-lg border border-border">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400">
                  <span className="material-symbols-outlined text-2xl">
                    how_to_vote
                  </span>
                </div>
                <h3 className="text-xl font-bold">3. Resolve the Bet</h3>
              </div>
              <p className="mt-4 text-[var(--text-muted-color)]">
                Once the event concludes, participants vote on the outcome. The
                majority vote determines the winner(s), who receive the pooled
                stakes.
              </p>
            </div>
            <div className="bg-white/80 p-8 rounded-lg border border-border">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400">
                  <span className="material-symbols-outlined text-2xl">
                    verified_user
                  </span>
                </div>
                <h3 className="text-xl font-bold">4. Secure and Transparent</h3>
              </div>
              <p className="mt-4 text-[var(--text-muted-color)]">
                Wagr uses blockchain technology to ensure all bets are secure,
                transparent, and fairly resolved. Funds are held in escrow until
                the outcome is determined.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default How;

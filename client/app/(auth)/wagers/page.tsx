const Wagers = () => {
  return (
    <main className="px-4 md:px-10 lg:px-40 flex flex-1 justify-center py-8">
      <div className="layout-content-container flex flex-col w-full max-w-[960px]">
        <div className="flex flex-wrap justify-between items-center gap-4 p-4">
          <h1 className="text-[var(--light-on-surface)] dark:text-[var(--dark-on-surface)] tracking-tight text-3xl md:text-4xl font-bold">
            My Personal Wagers
          </h1>
        </div>
        <div className="border-b border-[var(--light-outline)] dark:border-[var(--dark-outline)]">
          <div className="flex px-4 gap-8">
            <a
              className="flex flex-col items-center justify-center border-b-2 border-[var(--light-primary)] dark:border-[var(--dark-primary)] text-primary pb-3 pt-4"
              href="#"
            >
              <p className="text-sm font-bold leading-normal">Active</p>
            </a>
            <a
              className="flex flex-col items-center justify-center border-b-2 border-transparent text-[var(--light-on-surface-variant)] dark:text-[var(--dark-on-surface-variant)] hover:text-[var(--light-on-surface)] dark:hover:text-[var(--dark-on-surface)] pb-3 pt-4 transition-colors"
              href="#"
            >
              <p className="text-sm font-bold leading-normal">Past</p>
            </a>
          </div>
        </div>
        <section className="py-6 px-4">
          <h2 className="text-[var(--light-on-surface)] dark:text-[var(--dark-on-surface)] text-xl font-bold mb-4">
            Active Wagers
          </h2>
          <div className="flex flex-col gap-4">
            <div className="bg-[var(--light-surface)] dark:bg-[var(--dark-surface)] rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 p-4 flex justify-between items-center">
              <div className="flex-1">
                <p className="text-[var(--light-on-surface)] dark:text-[var(--dark-on-surface)] font-semibold">
                  Will the price of ETH be above $3,000 on July 1st?
                </p>
                <p className="text-[var(--light-on-surface-variant)] dark:text-[var(--dark-on-surface-variant)] text-sm">
                  100 USDC
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--light-warning)] bg-opacity-20 text-[var(--light-warning)] dark:bg-opacity-20 dark:text-[var(--dark-warning)]">
                  Pending
                </span>
              </div>
            </div>
            <div className="bg-[var(--light-surface)] dark:bg-[var(--dark-surface)] rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 p-4 flex justify-between items-center">
              <div className="flex-1">
                <p className="text-[var(--light-on-surface)] dark:text-[var(--dark-on-surface)] font-semibold">
                  Will the Lakers win the NBA Championship?
                </p>
                <p className="text-[var(--light-on-surface-variant)] dark:text-[var(--dark-on-surface-variant)] text-sm">
                  50 USDC
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--light-info)] bg-opacity-20 text-[var(--light-info)] dark:bg-opacity-20 dark:text-[var(--dark-info)]">
                  Countered
                </span>
              </div>
            </div>
          </div>
        </section>
        <section className="py-6 px-4">
          <h2 className="text-[var(--light-on-surface)] dark:text-[var(--dark-on-surface)] text-xl font-bold mb-4">
            Past Wagers
          </h2>
          <div className="flex flex-col gap-4">
            <div className="bg-[var(--light-surface)] dark:bg-[var(--dark-surface)] rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 p-4 flex justify-between items-center opacity-80">
              <div className="flex-1">
                <p className="text-[var(--light-on-surface)] dark:text-[var(--dark-on-surface)] font-semibold">
                  Will the price of BTC be above $70,000 on June 1st?
                </p>

                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                  Win
                </span>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-green-500 dark:text-green-400 text-sm font-semibold">
                  +200 USDC
                </p>
              </div>
            </div>
            <div className="bg-[var(--light-surface)] dark:bg-[var(--dark-surface)] rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 p-4 flex justify-between items-center opacity-80">
              <div className="flex-1">
                <p className="text-[var(--light-on-surface)] dark:text-[var(--dark-on-surface)] font-semibold">
                  Will the Dodgers win the World Series?
                </p>

                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                  Lost
                </span>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-red-500 dark:text-red-400 text-sm font-semibold">
                  -75 USDC
                </p>
              </div>
            </div>
            <div className="bg-[var(--light-surface)] dark:bg-[var(--dark-surface)] rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 p-4 flex justify-between items-center opacity-80">
              <div className="flex-1">
                <p className="text-[var(--light-on-surface)] dark:text-[var(--dark-on-surface)] font-semibold">
                  Will GME stock price close above $25 on Friday?
                </p>

                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                  Draw
                </span>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-[var(--light-on-surface-variant)] dark:text-[var(--dark-on-surface-variant)] text-sm">
                  150 USDC
                </p>
              </div>
            </div>
            <div className="bg-[var(--light-surface)] dark:bg-[var(--dark-surface)] rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 p-4 flex justify-between items-center opacity-80">
              <div className="flex-1">
                <p className="text-[var(--light-on-surface)] dark:text-[var(--dark-on-surface)] font-semibold">
                  Will the next Base block hash end in a vowel?
                </p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                  Cancelled
                </span>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-[var(--light-on-surface-variant)] dark:text-[var(--dark-on-surface-variant)] text-sm">
                  25 USDC
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Wagers;

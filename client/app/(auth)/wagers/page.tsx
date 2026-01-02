const Wagers = () => {
  return (
    <main className="px-4 md:px-10 lg:px-40 flex flex-1 justify-center py-8">
      <div className="flex flex-col w-full max-w-[960px]">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-4 p-4">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            My Personal Wagers
          </h1>
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <div className="flex px-4 gap-8">
            <button className="nav-link active text-sm font-bold pb-3 pt-4">
              Active
            </button>
            <button className="nav-link text-sm font-bold pb-3 pt-4">
              Past
            </button>
          </div>
        </div>

        {/* Active Wagers */}
        <section className="py-6 px-4">
          <h2 className="text-xl font-bold text-foreground mb-4">
            Active Wagers
          </h2>
          <div className="flex flex-col gap-4">
            <div className="glass rounded-xl p-5 card-hover flex justify-between items-center">
              <div className="flex-1">
                <p className="text-foreground font-semibold">
                  Will the price of ETH be above $3,000 on July 1st?
                </p>
                <p className="text-text-muted text-sm mt-1">
                  100 USDC
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="status-pending inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold">
                  Pending
                </span>
              </div>
            </div>
            <div className="glass rounded-xl p-5 card-hover flex justify-between items-center">
              <div className="flex-1">
                <p className="text-foreground font-semibold">
                  Will the Lakers win the NBA Championship?
                </p>
                <p className="text-text-muted text-sm mt-1">
                  50 USDC
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="status-countered inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold">
                  Countered
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Past Wagers */}
        <section className="py-6 px-4">
          <h2 className="text-xl font-bold text-foreground mb-4">
            Past Wagers
          </h2>
          <div className="flex flex-col gap-4">
            <div className="glass rounded-xl p-5 flex justify-between items-center opacity-80 hover:opacity-100 transition-opacity">
              <div className="flex-1">
                <p className="text-foreground font-semibold">
                  Will the price of BTC be above $70,000 on June 1st?
                </p>
                <span className="status-won inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mt-2">
                  Win
                </span>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-success text-sm font-bold">
                  +200 USDC
                </p>
              </div>
            </div>
            <div className="glass rounded-xl p-5 flex justify-between items-center opacity-80 hover:opacity-100 transition-opacity">
              <div className="flex-1">
                <p className="text-foreground font-semibold">
                  Will the Dodgers win the World Series?
                </p>
                <span className="status-lost inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mt-2">
                  Lost
                </span>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-danger text-sm font-bold">
                  -75 USDC
                </p>
              </div>
            </div>
            <div className="glass rounded-xl p-5 flex justify-between items-center opacity-80 hover:opacity-100 transition-opacity">
              <div className="flex-1">
                <p className="text-foreground font-semibold">
                  Will GME stock price close above $25 on Friday?
                </p>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mt-2 bg-muted text-muted-foreground">
                  Draw
                </span>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-text-muted text-sm">
                  150 USDC
                </p>
              </div>
            </div>
            <div className="glass rounded-xl p-5 flex justify-between items-center opacity-80 hover:opacity-100 transition-opacity">
              <div className="flex-1">
                <p className="text-foreground font-semibold">
                  Will the next Base block hash end in a vowel?
                </p>
                <span className="status-pending inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mt-2">
                  Cancelled
                </span>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-text-muted text-sm">
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

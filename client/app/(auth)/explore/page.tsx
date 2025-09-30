import WagerCard from "@/components/WagerCard";

const Explore = () => {
  const rows = [
    {
      id: 1,
      description: "Lakers vs. Celtics? Lakers wins",
      creator: "0xdef...456",
      allowedCounter: "Anyone",
      stake: "1",
    },
    {
      id: 2,
      description: "BTC to hit $100k by EOY? Yes",
      creator: "0x789...ghi",
      allowedCounter: "0xghi...789",
      stake: "0.1",
    },
    {
      id: 3,
      description: "League of Legends Worlds: Team A vs Team B. Team A wins",
      creator: "0xdef...456",
      allowedCounter: "Anyone",
      stake: "0.2",
    },
    {
      id: 4,
      description: "Presidential Election Outcome? Trump wins",
      creator: "0xdef...456",
      allowedCounter: "0x234...jkl",
      stake: "2",
    },
    {
      id: 5,
      description: "ETH to flip BTC in market cap by 2026? No",
      creator: "0xaaa...111",
      allowedCounter: "Anyone",
      stake: "5",
    },
    {
      id: 6,
      description: "Messi to score in next match? Yes",
      creator: "0xbbb...222",
      allowedCounter: "0xccc...333",
      stake: "0.5",
    },
    {
      id: 7,
      description: "Nigeria to win AFCON 2025? Yes",
      creator: "0xddd...444",
      allowedCounter: "Anyone",
      stake: "3",
    },
    {
      id: 8,
      description: "Apple stock above $250 by year-end? Yes",
      creator: "0xeee...555",
      allowedCounter: "0xfff...666",
      stake: "10",
    },
    {
      id: 9,
      description: "Real Madrid to win Champions League? Yes",
      creator: "0x999...aaa",
      allowedCounter: "Anyone",
      stake: "1.5",
    },
    {
      id: 10,
      description: "Will AI pass the Turing test by 2030? Yes",
      creator: "0x123...456",
      allowedCounter: "Anyone",
      stake: "20",
    },
  ] as const;

  return (
    <main className="flex flex-1 justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-7xl">
        <div className="mb-8 px-4">
          <h2 className="text-4xl font-bold tracking-tight text-text">
            Explore Pending Wagers
          </h2>
          <p className="mt-2 text-lg text-text">
            Browse and filter through uncountered wagers on the Base blockchain.
          </p>
        </div>
        <div className="mb-8 flex flex-wrap items-center justify-end gap-4 px-4">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-text">Amount</label>
            <input
              className="form-input w-24 rounded-md border-gray-300  bg-gray-100 text-text focus:border-primary focus:ring-primary"
              placeholder="Min"
              type="number"
            />
            <span className="text-text">-</span>
            <input
              className="form-input w-24 rounded-md border-gray-300 bg-gray-100 text-text focus:border-primary focus:ring-primary"
              placeholder="Max"
              type="number"
            />
          </div>
          <div className="flex items-center">
            <input
              className="form-checkbox h-4 w-4 rounded text-primary focus:ring-primary bg-gray-100 border-border"
              id="counter-available"
              type="checkbox"
            />
            <label
              className="ml-2 text-sm font-medium text-text"
              htmlFor="counter-available"
            >
              Open to everyone
            </label>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((wager) => {
            return <WagerCard key={wager.id} {...wager} />;
          })}
        </div>
        <div className="mt-10 flex items-center justify-center space-x-2">
          <a
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-text transition-colors hover:bg-primary hover:text-white"
            href="#"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </a>
          <a
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white"
            href="#"
          >
            1
          </a>
          <a
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-text transition-colors hover:bg-primary hover:text-white"
            href="#"
          >
            2
          </a>
          <a
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-text transition-colors hover:bg-primary hover:text-white"
            href="#"
          >
            3
          </a>
          <a
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-text transition-colors hover:bg-primary hover:text-white"
            href="#"
          >
            4
          </a>
          <a
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-text transition-colors hover:bg-primary hover:text-white"
            href="#"
          >
            5
          </a>
          <a
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-text transition-colors hover:bg-primary hover:text-white"
            href="#"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </a>
        </div>
      </div>
    </main>
  );
};

export default Explore;

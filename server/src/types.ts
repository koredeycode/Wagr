// src/types.ts
export enum Outcome {
  None = 0,
  CreatorWon = 1,
  CounterWon = 2,
  Draw = 3,
}

export enum Status {
  Pending = 0,
  Countered = 1,
  Resolved = 2,
  Cancelled = 3,
}

export interface Wager {
  creator: `0x${string}`;
  counter: `0x${string}`;
  allowedCounter: `0x${string}`;
  creatorStake: bigint;
  counterStake: bigint;
  // deadline: Date;
  createdAt: bigint;
  description: string;
  status: number;
  outcome: number;
}

export enum ResolutionType {
  None = 0,
  Conceded = 1,
  OwnerResolved = 2,
}

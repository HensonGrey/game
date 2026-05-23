export enum TribulationPhase {
  // Lightning is actively striking on the strike-interval timer. Player must tap the avatar to release charge before HP drains out.
  ACTIVE = "active",

  // Final strike has fired; waiting for residual aura charge to clear before resolving the breakthrough as a success.
  COOLDOWN = "cooldown",

  // Trial survived — breakthrough has been applied to the store. Terminal state, immediately followed by navigation back to /home.
  SUCCEEDED = "succeeded",

  // HP hit 0 mid-trial. Terminal state, immediately followed by navigation to /dead. Disables all timers so no further damage ticks register.
  FAILED = "failed",
}

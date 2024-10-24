import { z } from "zod";

export const gameParams = z
  .object({
    level: z
      .number()
      .nonnegative()
      .int()
      .min(1)
      .max(3)
      .describe("game difficulty"),
  })
  .describe("to be confirmed for each game, should be provided by CIMU");
export type MathcraftGameParams = z.infer<typeof gameParams>;

export const message = z
  .discriminatedUnion("kind", [
    z.object({
      kind: z
        .literal("[game]:initialized")
        .describe(
          "Should be the first event in the sequence, tells Stream when to send initial params",
        ),
    }),
    z.object({
      kind: z
        .literal("[host]:initial-params")
        .describe("Setup game with game params, after initialised"),
      userId: z.string().uuid("unique userId"),
      sessionId: z.string().describe("unique for each game session"),
      gameDurationInSeconds: z
        .number()
        .nonnegative()
        .int()
        .describe("the duration of the game in seconds"),
      gameParams,
    }),
    z.object({
      kind: z
        .literal("[game]:is-ready")
        .describe(
          "Sent after the game has been fully setup include loading asset/logic/etc...In other words, ready to play",
        ),
    }),
    z.object({
      kind: z
        .literal("[host]:start-game")
        .describe(
          "Start the game immediately, there should be no delay time after this event is sent to let the players play the game",
        ),
      timeLeftInSeconds: z
        .number()
        .nonnegative()
        .int()
        .describe(
          "how many seconds left before the game will end, should be 0 <= timeLeft <= gameDurationInSeconds",
        ),
    }),
    z.object({
      kind: z
        .literal("[game]:ended")
        .describe(
          "Game time is up or the player finishes early, then this event is sent",
        ),
      scores: z.number().nonnegative().int(),
      correctAnswers: z
        .number()
        .nonnegative()
        .int()
        .describe("The number of questions answered correctly in the game."),
      mistakes: z.number().nonnegative().int(),
      elapsedTimeInSeconds: z
        .number()
        .nonnegative()
        .int()
        .describe(
          "Number of seconds elapsed since player stared the game until end or player finished it, should be 0 <= elapsed <= timeLeft",
        ),
    }),
  ])
  .and(
    z.object({
      version: z
        .literal(1)
        .describe(
          "this is to make sure our code knows how to handle if schema updated",
        ),
    }),
  );
export type MathcraftMessage = z.infer<typeof message>;

export const game = {
  id: "CIMU_MATHCRAFT",
  url: "https://stream-math.342games.com/",
  name: "Mathcraft",
  shortDescription: "TBU",
  message,

  // will be sanitized
  descriptionInHtml:
    "Users will select the right arithmetic blocks to eliminate in order to match the final answer. They will need to eliminate 1-3 blocks depending on the difficulty level. They need to correctly answer 2 rounds to earn rewards.",
  launchInstructionInHtml:
    "Select the duration of the StreamDrop and it’s difficulty level.",
  scoringRulesInHtml:
    "Fans are scored based on speed and equations solved correctly. They get 250 base gems for passing and 500 bonus gems for making into Top 100.",
} as const;

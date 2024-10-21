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
export type GameParams = z.infer<typeof gameParams>;

export const streamMathMessage = z
  .discriminatedUnion("kind", [
    z.object({
      kind: z.literal("[game]:is-ready"),
    }),
    z.object({
      kind: z.literal("[host]:initial-params"),
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
      kind: z.literal("[host]:start-game"),
      timeLeftInSeconds: z
        .number()
        .nonnegative()
        .int()
        .describe(
          "how many seconds left before the game will end, should be 0 <= timeLeft <= gameDurationInSeconds",
        ),
    }),
    z.object({
      kind: z.literal("[game]:ended"),
      scores: z.number().nonnegative().int(),
      correctAnswers: z
        .number()
        .nonnegative()
        .int()
        .describe("The number of questions answered correctly in the game."),
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
export type StreamMathMessage = z.infer<typeof streamMathMessage>;

export const experienceName = z.literal("STREAM_MATH");
export type ExperienceName = z.infer<typeof experienceName>;

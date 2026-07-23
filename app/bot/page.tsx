import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'InStock Monitor — About',
  description:
    'What the InStock-Monitor bot does, who runs it, and how to opt out.',
};

/**
 * Human-readable info page pointed to by the InStock-Monitor User-Agent
 * string. Cloudflare Web Bot Auth requires a public "about this bot" page so
 * that site operators can identify and contact bot operators.
 */
export default function BotPage() {
  return (
    <main
      style={{
        maxWidth: '640px',
        margin: '4rem auto',
        padding: '0 1rem',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        lineHeight: 1.6,
      }}
    >
      <h1>InStock Monitor</h1>

      <p>
        <strong>InStock-Monitor</strong> is a personal stock and price watcher
        run by James Minton (
        <a href="mailto:james7minton@gmail.com">james7minton@gmail.com</a>
        ). It polls a small set of UK trading-card shops for Pokémon TCG and
        One Piece Card Game pre-orders and restocks and pushes notifications
        to a private ntfy topic.
      </p>

      <h2>Behaviour</h2>
      <ul>
        <li>
          User-Agent:{' '}
          <code>InStock-Monitor/1.0 (+https://jamesminton.dev/bot)</code>
        </li>
        <li>Reads only — never submits forms, adds to cart, or checks out.</li>
        <li>Fetches at most one page per minute per shop under normal load.</li>
        <li>
          Respects <code>robots.txt</code>.
        </li>
        <li>
          Honours <code>HTTP 429</code> and <code>Retry-After</code> with
          exponential backoff.
        </li>
        <li>
          Auto-pauses on repeated block signals for at least 30 minutes before
          retrying.
        </li>
        <li>
          Signed with Cloudflare Web Bot Auth (Ed25519, RFC 9421). Public key
          directory:{' '}
          <a href="/.well-known/http-message-signatures-directory">
            /.well-known/http-message-signatures-directory
          </a>
          .
        </li>
      </ul>

      <h2>Opt out</h2>
      <p>
        If you operate a site InStock reads from and would rather it did not,
        email{' '}
        <a href="mailto:james7minton@gmail.com">james7minton@gmail.com</a> and
        the shop will be removed within 24 hours. You can also block the bot
        by User-Agent — it always sends the exact string above.
      </p>

      <h2>Source</h2>
      <p>Source code is kept in a private repository.</p>
    </main>
  );
}

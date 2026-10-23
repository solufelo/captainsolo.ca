import { useState } from 'react'

/**
 * The full video, watched on the page: its poster and a play button until pressed, then YouTube's privacy-enhanced
 * player. Nothing is fetched from YouTube or Google before the press. The player takes focus, since the button that
 * had it is gone.
 */
export function YouTube({ id, title, poster }: { id: string; title: string; poster: string }) {
  const [playing, setPlaying] = useState(false)
  return (
    <section className="case-yt" aria-labelledby="full-video-title">
      <h2 id="full-video-title" className="label">
        Full video
      </h2>
      <div className="yt">
        {playing ? (
          <iframe
            ref={(f) => f?.focus({ preventScroll: true })}
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
            title={`${title}, full video`}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        ) : (
          <button type="button" className="yt-facade" data-cursor="Play" onClick={() => setPlaying(true)}>
            <img src={poster} alt="" />
            <span className="yt-play" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
            <span className="yt-pill">Play the full video</span>
          </button>
        )}
      </div>
    </section>
  )
}

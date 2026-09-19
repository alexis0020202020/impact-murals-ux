export const studio = {
  eyebrow: "THE STUDIO",
  heading: "ART DIRECTION BUILT TO BECOME REAL.",
  lead: "Impact Murals is a Dubai-based art direction and production studio led by Alexis, a creative director and artist with more than a decade of hands-on experience. He defines the artistic approach with the client, then brings together the artists and specialists the project needs.",

  model: [
    {
      title: "THE RIGHT ARTIST, NOT THE SAME ARTIST.",
      body: "Each brief has its own artistic language. We work with artists whose skills fit the direction, while keeping the creative intent and production coordinated through the studio."
    }
  ],

  /** Founder background, kept factual and non-inflated. */
  grounding:
    "Hands-on production experience keeps creative decisions close to how the work will actually be made and installed.",

  /**
   * Studio/artist video, shared by the homepage "ARTIST-LED. PROJECT-DRIVEN."
   * teaser (StudioMoment.astro) and the standalone /studio page's own media
   * block — same clip, same source-of-truth, same pattern as the three
   * offer videos in offers.ts. Native 16:9 (1280x720); both call sites use
   * `aspect-video` rather than a cropped portrait/16:10 ratio so the media
   * block keeps the clip's real horizontal shape instead of cropping it.
   */
  media: {
    video: "/videos/impact-murals-studio.mp4",
    poster: "/videos/impact-murals-studio-poster.jpg"
  },

  /**
   * PLACEHOLDER. Add logos only where the asset and permission both exist.
   * Never imply that a featured brand was a direct client.
   */
  collaborators: {
    heading: "SELECTED BRANDS, DESTINATIONS AND COLLABORATORS FEATURED ACROSS OUR WORK.",
    disclosure:
      "Logos are shown to indicate the settings the studio has worked in. They do not imply endorsement.",
    logos: [] as Array<{ name: string; src: string; alt: string }>,
    placeholderNote: "Collaborator logos will appear here once assets and permissions are confirmed."
  }
} as const;

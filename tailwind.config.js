/** @type {import("tailwindcss").Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: "class",
  theme: {
    extend: {
  "colors": {
    "on-secondary": "#ffffff",
    "on-secondary-container": "#61665f",
    "on-error": "#ffffff",
    "tertiary-fixed-dim": "#c6c6c9",
    "secondary-fixed": "#dfe4db",
    "error": "#ba1a1a",
    "tertiary-fixed": "#e2e2e5",
    "on-primary-fixed": "#071f23",
    "surface-container-high": "#e1e9ed",
    "on-primary-container": "#f8fdff",
    "on-primary-fixed-variant": "#344a50",
    "surface-bright": "#f2fbff",
    "background": "#f2fbff",
    "primary-fixed-dim": "#b3cbd1",
    "secondary": "#5b6059",
    "surface-container": "#e7eff3",
    "inverse-surface": "#2a3235",
    "secondary-container": "#dfe4db",
    "on-tertiary": "#ffffff",
    "surface-variant": "#dbe4e8",
    "on-primary": "#ffffff",
    "on-surface-variant": "#424849",
    "tertiary": "#5b5c5f",
    "on-secondary-fixed": "#181d18",
    "surface-container-lowest": "#ffffff",
    "on-surface": "#151d20",
    "primary-container": "#62787e",
    "primary-fixed": "#cee7ed",
    "surface-container-highest": "#dbe4e8",
    "inverse-on-surface": "#eaf2f6",
    "outline-variant": "#c2c7c9",
    "inverse-primary": "#b3cbd1",
    "tertiary-container": "#747477",
    "on-secondary-fixed-variant": "#434842",
    "on-background": "#151d20",
    "surface": "#f2fbff",
    "surface-tint": "#4c6268",
    "on-tertiary-container": "#fdfcff",
    "secondary-fixed-dim": "#c3c8bf",
    "outline": "#72787a",
    "primary": "#496065",
    "on-tertiary-fixed-variant": "#45474a",
    "surface-dim": "#d3dbdf",
    "on-error-container": "#93000a",
    "on-tertiary-fixed": "#1a1c1e",
    "error-container": "#ffdad6",
    "surface-container-low": "#edf5f9"
  },
  "borderRadius": {
    "DEFAULT": "0.25rem",
    "lg": "0.5rem",
    "xl": "0.75rem",
    "full": "9999px"
  },
  "spacing": {
    "margin": "2rem",
    "gutter-mobile": "1rem",
    "space-xl": "2rem",
    "space-xs": "0.25rem",
    "margin-mobile": "1rem",
    "space-sm": "0.5rem",
    "gutter": "1.5rem",
    "space-md": "1rem",
    "space-lg": "1.5rem",
    "space-2xl": "3rem"
  },
  "fontFamily": {
    "display-lg-mobile": [
      "Inter"
    ],
    "label-md": [
      "Inter"
    ],
    "display-lg": [
      "Inter"
    ],
    "body-lg": [
      "Inter"
    ],
    "headline-lg-mobile": [
      "Inter"
    ],
    "label-code": [
      "Inter"
    ],
    "display-metric": [
      "Inter"
    ],
    "headline-lg": [
      "Inter"
    ],
    "label-lg": [
      "Inter"
    ],
    "headline-md": [
      "Inter"
    ],
    "body-md": [
      "Inter"
    ],
    "title-md": [
      "Inter"
    ]
  },
  "fontSize": {
    "display-lg-mobile": [
      "32px",
      {
        "lineHeight": "40px",
        "letterSpacing": "-0.01em",
        "fontWeight": "700"
      }
    ],
    "label-md": [
      "12px",
      {
        "lineHeight": "16px",
        "letterSpacing": "0.02em",
        "fontWeight": "500"
      }
    ],
    "display-lg": [
      "44px",
      {
        "lineHeight": "52px",
        "letterSpacing": "-0.02em",
        "fontWeight": "700"
      }
    ],
    "body-lg": [
      "16px",
      {
        "lineHeight": "24px",
        "letterSpacing": "0em",
        "fontWeight": "400"
      }
    ],
    "headline-lg-mobile": [
      "22px",
      {
        "lineHeight": "28px",
        "letterSpacing": "0em",
        "fontWeight": "600"
      }
    ],
    "label-code": [
      "13px",
      {
        "lineHeight": "18px",
        "letterSpacing": "0.04em",
        "fontWeight": "600"
      }
    ],
    "display-metric": [
      "36px",
      {
        "lineHeight": "44px",
        "letterSpacing": "-0.02em",
        "fontWeight": "600"
      }
    ],
    "headline-lg": [
      "28px",
      {
        "lineHeight": "36px",
        "letterSpacing": "-0.01em",
        "fontWeight": "600"
      }
    ],
    "label-lg": [
      "14px",
      {
        "lineHeight": "20px",
        "letterSpacing": "0.01em",
        "fontWeight": "500"
      }
    ],
    "headline-md": [
      "20px",
      {
        "lineHeight": "28px",
        "letterSpacing": "-0.005em",
        "fontWeight": "600"
      }
    ],
    "body-md": [
      "14px",
      {
        "lineHeight": "20px",
        "letterSpacing": "0em",
        "fontWeight": "400"
      }
    ],
    "title-md": [
      "16px",
      {
        "lineHeight": "24px",
        "letterSpacing": "0em",
        "fontWeight": "600"
      }
    ]
  }
}
  },
  plugins: [],
};

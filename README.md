# caseconvert

A small, fast text case converter: **https://bsquidwrd.github.io/caseconvert/**

Paste text, then convert it to:

| Button | `hello world` becomes |
| --- | --- |
| UPPERCASE | `HELLO WORLD` |
| lowercase | `hello world` |
| aLtErNaTe | `hElLo WoRlD` |
| AlTeRnAtE | `HeLlO wOrLd` |

Alternating case counts only letters that have case and continues across words, so spaces, punctuation, digits and emoji don't break the pattern. If you select part of the text, only the selection is converted. Ctrl/Cmd+Z undoes a conversion.

## Privacy

Everything runs in your browser. The page has no analytics, uses no CDNs or third-party fonts, and saves nothing (reloading the page clears the text). A Content-Security-Policy stops the page from making any network requests at all. Browser spellcheck or extensions that can access the page may still read what you type, and the page can't prevent that.

## Development

The site is plain HTML, CSS and JavaScript in [`site/`](site/), with no build step and no dependencies.

- Run tests (Node 22+): `node --test`
- Preview locally: `python3 -m http.server -d site 8000`, then open http://localhost:8000. A local server is needed because ES modules don't load from `file://`.

## Deployment

[`.github/workflows/pages.yml`](.github/workflows/pages.yml) runs the tests and publishes `site/` on every push to `main`.

One-time setup: in the repository go to **Settings → Pages**, and under **Build and deployment → Source** choose **GitHub Actions**.

## License

[MIT](LICENSE)
